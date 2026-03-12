import os
import pickle
import sys
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from dotenv import load_dotenv

# 1. Forzar salida de texto para ver qué pasa
print("🔍 Iniciando sistema de sincronización Drive...")

# 2. Cargar variables
load_dotenv(dotenv_path='.env.local')
folder_id = os.getenv("GOOGLE_DRIVE_FOLDER_ID")

SCOPES = ['https://www.googleapis.com/auth/drive.file']

def get_drive_service():
    creds = None
    # Buscamos el token guardado
    if os.path.exists('token.json'):
        print("📂 Token de sesión encontrado. Cargando...")
        with open('token.json', 'rb') as token:
            creds = pickle.load(token)
            
    # Si no hay token o no es válido, pedimos permiso
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
            creds = flow.run_local_server(port=8080, prompt='consent', access_type='offline')
            
        with open('token.json', 'wb') as token:
            pickle.dump(creds, token)
            print("💾 Nuevo token de acceso guardado.")

    return build('drive', 'v3', credentials=creds)

def sync_to_drive():
    try:
        service = get_drive_service()
        print(f"📡 Conectado al Búnker Drive ID: {folder_id}")
        
        # Prueba de lectura
        print("📁 Listando archivos en el búnker para validar...")
        results = service.files().list(pageSize=5, fields="files(name)").execute()
        items = results.get('files', [])
        
        if not items:
            print('⚠️ El búnker está vacío o no tengo permisos en esa carpeta.')
        else:
            for item in items:
                print(f" ✅ Archivo detectado: {item['name']}")
                
        print("✨ RITUAL DE DRIVE COMPLETADO CON ÉXITO ✨")
    except Exception as e:
        print(f"❌ ERROR CRÍTICO: {str(e)}")

if __name__ == "__main__":
    sync_to_drive()