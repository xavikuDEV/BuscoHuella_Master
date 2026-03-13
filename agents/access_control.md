# 🔐 Matriz de Control de Acceso (RBAC - Role Based Access Control)

**Estado:** Activo | **Nivel de Seguridad:** Zero-Trust | **Versión:** 2.1.0

## 📝 Misión de Gobernanza

Establecer los límites operativos de cada entidad (IA o Humana) dentro del monorepo. El principio rector es el **Privilegio Mínimo**: cada agente tiene acceso solo a lo estrictamente necesario para cumplir su misión técnica, protegiendo la integridad de los secretos y la estabilidad del búnker.

## 📊 Matriz de Permisos Operativos

| Recurso          |  Orquestador  |   Architect    | Specialist (Aider)  |  Security / DevOps  |
| :--------------- | :-----------: | :------------: | :-----------------: | :-----------------: |
| **GitHub**       | Write + Merge | Write + Review |   Write (Commits)   |     Audit Only      |
| **Notion**       |   Full Edit   | Read + Comment |  **Append (Logs)**  |     Audit Only      |
| **Supabase**     | Admin (Dash)  | Schema Design  | **Migrations Only** |   RLS & Policies    |
| **Google Drive** |  Full Access  |   Read Only    |     ❌ No Access     |  **Sync & Backup**  |
| **Snyk**         |  ❌ No Access  |  Read Reports  |     ❌ No Access     | **Full Scan / Fix** |

## 🏗️ Niveles de Gobernanza (The Vault Layers)

### 🔴 Nivel Rojo: El Alto Mando (Xavi & Antigravity)

- **Propiedad:** Dueños de los secretos críticos (`.env.local`, `credentials.json`, `token.json`).
- **Función:** Aprobación final de arquitectura y gestión de llaves de API. Los agentes nunca procesan estas llaves en texto plano.

### 🔵 Nivel Azul: Oficialía (Orquestador & Architect)

- **Propiedad:** Control de la lógica y la estructura del Monorepo.
- **Función:** Traducción de estrategia en tareas. Tienen permiso para decidir qué archivos se sincronizan con la nube y cómo se estructuran las bases de datos.

### ⚪ Nivel Gris: Fuerza de Ejecución (Specialist / Aider)

- **Propiedad:** Ejecución técnica y picado de código.
- **Función:** Implementación de UI, lógica de negocio y corrección de bugs. Solo tienen acceso a los archivos de código y a las APIs de reporte (Notion Logs).

## 🛡️ Reglas de Oro de Seguridad

1. **Aislamiento de Secretos:** El Specialist jamás debe solicitar acceso a archivos `.env`. Si lo hace, el Orquestador debe bloquear la petición.
2. **Trazabilidad de Cambios:** Todo cambio en la DB debe pasar por una migración `.sql` auditada por el Security-Officer.
3. **Soberanía Cloud:** Los backups en Google Drive son gestionados exclusivamente por el protocolo de Cloud-DevOps para evitar fugas de datos.

> "La seguridad no limita la velocidad; la seguridad permite que el búnker vuele sin desintegrarse."
