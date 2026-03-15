# 🛡️ SECURITY_MODEL: BuscoHuella Bunker Protocol
> Versión: 1.0.0 | Nivel de Seguridad: Alpha | Última Revisión: 15/03/2026

## 📜 Filosofía de Seguridad
El protocolo de seguridad de BuscoHuella se basa en el principio de **Privilegio Mínimo** y **Defensa en Capas**. Ningún dato del sistema es accesible sin una identidad verificada y un permiso explícito validado por el Kernel (Supabase + Shared Core).

---

## 🔐 1. Capa de Identidad (Authentication)
Gestionada a través de **Supabase Auth** con los siguientes mecanismos de refuerzo:
- **Tokens JWT:** Sesiones efímeras firmadas criptográficamente.
- **MFA (Multi-Factor Authentication):** Requerido para rangos `Archon`, `Authority` y `Vet`.
- **Session Control:** Monitorización de inicios de sesión sospechosos y bloqueos automáticos por IP en el `Security Monitor`.

---

## 🚧 2. Capa de Autorización (RBAC & RLS)
El acceso a los datos no depende del código del frontend, sino de la base de datos (**Row Level Security - RLS**).

| Rol           | Permisos Críticos                   | Restricciones RLS                                      |
| :------------ | :---------------------------------- | :----------------------------------------------------- |
| **Archon**    | Bypass total, Gestión de Nodos.     | `service_role` (Acceso total).                         |
| **Authority** | Lectura de datos privados, Alertas. | Solo sectores asignados y perfiles bajo investigación. |
| **Vet / NGO** | Escritura de salud y trazabilidad.  | Solo registros vinculados a su organización.           |
| **User**      | Gestión de activos propios.         | `auth.uid() = user_id` (Solo sus datos).               |

---

## 💎 3. Integridad DUA (Digital Unique Animal)
El núcleo de confianza de BuscoHuella reside en la inmutabilidad del DUA:
- **DUA Hash:** Cada ficha genera un hash SHA-256 basado en (Microchip + Especie + Linaje + UUID Propietario).
- **Validación de Firma:** Cualquier intento de modificar datos críticos sin regenerar el hash marcará el activo como `CORRUPTED_INTEGRITY`.
- **Blockchain Ready:** Estructura preparada para ser anclada en una red distribuida para auditoría pública.

---

## 🛰️ 4. Protección de Datos (Encryption)
- **En Tránsito:** Todo el tráfico viaja bajo **TLS 1.3** (SSL forzado).
- **En Reposo:** Los discos de Supabase utilizan cifrado **AES-256**.
- **PII (Personally Identifiable Information):** Los datos sensibles de ciudadanos (DNI, Teléfono, Dirección) están segregados en la tabla `profiles` con políticas RLS ultra-estrictas.

---

## 📟 5. La Caja Negra (Audit Trail)
Cada acción táctica deja una huella digital imborrable en la tabla `system_logs`:
- **Trace ID:** Vinculación de cada acción con un `user_id` y una `timestamp`.
- **Immutable Logs:** Los logs de nivel `SECURITY` o `ERROR` no pueden ser borrados ni editados (Inyectados via Database Triggers).
- **Telemetría:** Monitorización de latencia para detectar ataques de denegación de servicio (DoS) de forma temprana.

---

## 🇪🇺 6. Cumplimiento Legal (GDPR & Local)
- **Derecho al Olvido:** Protocolo de borrado seguro que anonimiza al propietario pero mantiene la historia clínica del animal para salud pública.
- **Data Residency:** Los datos se alojan en servidores de la UE para cumplir con la normativa de protección de datos.
- **Sello DUA:** Certificación de que el proceso de registro sigue los estándares locales de bienestar animal y control de censos.

---
> "La seguridad no es un producto, es un proceso constante de vigilancia."