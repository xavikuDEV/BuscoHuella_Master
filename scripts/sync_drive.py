import os
import pickle
import sys
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from dotenv import load_dotenv

# 1. Configuración de inicio
print("🔍 Iniciando sistema de sincronización Drive (Upload Mode)...")
load_dotenv(dotenv_path='.env.local')
FOLDER_ID = os.getenv("GOOGLE_DRIVE_FOLDER_ID")
SCOPES = ['https://www.googleapis.com/auth/drive.file']

def get_drive_service():
    creds = None
    if os.path.exists('token.json'):
        print("📂 Token de sesión encontrado. Cargando...")
        with open('token.json', 'rb') as token:
            creds = pickle.load(token)
            
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("🔄 Refrescando acceso caducado...")
            creds.refresh(Request())
        else:
            print("🔑 No hay acceso. Abriendo navegador para autorización...")
            if not os.path.exists('credentials.json'):
                print("❌ ERROR: No encuentro el archivo 'credentials.json' en la raíz.")
                sys.exit(1)
            
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            # Mantenemos el puerto 8080 que funciona en tu Brave
            creds = flow.run_local_server(port=8080, prompt='consent', access_type='offline')
            
        with open('token.json', 'wb') as token:
            pickle.dump(creds, token)
            print("💾 Nuevo token de acceso guardado.")

    return build('drive', 'v3', credentials=creds)

def upload_or_update_file(service, file_path, folder_id):
    if not os.path.exists(file_path):
        return

    file_name = os.path.basename(file_path)
    file_metadata = {'name': file_name}
    source_mimetype = None
    
    # Si es markdown, convertir a Google Doc nativo
    if file_name.endswith('.md'):
        file_metadata['mimeType'] = 'application/vnd.google-apps.document'
        source_mimetype = 'text/markdown'

    media = MediaFileUpload(file_path, mimetype=source_mimetype, resumable=True)

    if files:
        # Actualizar archivo existente
        file_id = files[0]['id']
        service.files().update(fileId=file_id, body=file_metadata, media_body=media).execute()
        print(f" ✅ Actualizado en Drive (Docs): {file_name}")
    else:
        # Crear nuevo archivo
        file_metadata['parents'] = [folder_id]
        service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        print(f" ⬆️ Subido nuevo a Drive (Docs): {file_name}")

def sync_to_drive():
    try:
        service = get_drive_service()
        print(f"📡 Conectado al Búnker Drive ID: {FOLDER_ID}")
        
        # Archivos que queremos proteger en la nube
        files_to_sync = [
            '.ai_context.md',
            'ARCHITECT_CONTEXT.md',
            'Structure.md'
        ]
        
        for file in files_to_sync:
            upload_or_update_file(service, file, FOLDER_ID)
                
        print("✨ RITUAL DE DRIVE COMPLETADO CON ÉXITO ✨")
    except Exception as e:
        print(f"❌ ERROR CRÍTICO: {str(e)}")

if __name__ == "__main__":
    sync_to_drive()