# 🏗️ System Architecture: BuscoHuella Master
> Versión: 1.0.0 | Última Revisión: 15/03/2026

## 🛡️ Visión Técnica
BuscoHuella está diseñado bajo un modelo de **Monorepo Distribuido** que prioriza la integridad del dato animal (DUA) y la reactividad en tiempo real. La arquitectura separa la lógica de negocio de la interfaz, permitiendo una escalabilidad multi-plataforma (Web y Mobile) sin duplicidad de código.

---

## 🛰️ Topología del Sistema

El ecosistema se divide en tres capas principales:

### 1. Núcleo de Datos (Backend-as-a-Service)
- **Motor:** Supabase (PostgreSQL).
- **Seguridad:** Row Level Security (RLS) para segregación de datos por organización/usuario.
- **Tiempo Real:** Canales de Supabase Realtime para telemetría de red e incidencias.
- **Storage:** Almacenamiento cifrado para evidencias fotográficas y documentos legales.

### 2. Capa de Lógica Compartida (Shared Core)
Ubicada en `packages/shared-core`. Es el cerebro del búnker.
- **DUA Engine:** Algoritmos de validación y generación de Hash de integridad.
- **Type System:** Definiciones TypeScript universales que sincronizan la base de datos con las interfaces.
- **Validaciones:** Esquemas (Zod) que aseguran que ningún dato corrupto entre al sistema.

### 3. Capa de Aplicación (Interfaces)
- **Web-Pro (Next.js 15):** Dashboard administrativo táctico. Utiliza Server Components para velocidad y Client Components para telemetría viva.
- **Mobile-App (Expo/React Native):** Terminal de campo para geolocalización y escaneo QR (En desarrollo).

---

## 🔄 Flujo de Datos (The Life Cycle)

1. **Captura:** Un usuario o autoridad registra un activo o incidencia.
2. **Validación:** El `shared-core` verifica la integridad de los datos en el cliente.
3. **Persistencia:** Los datos viajan a Supabase mediante Server Actions o el Cliente de Supabase.
4. **Sincronización:** Una vez guardado, el motor Realtime notifica a todos los Dashboards activos en el sector correspondiente.
5. **Telemetría:** El `LiveHeader` y el `SystemStatus` miden constantemente la latencia del enlace para asegurar la operatividad del búnker.

---

## 🗺️ Malla Geotáctica (Sector Modeling)
El sistema no utiliza ciudades estáticas, sino **Sectores Dinámicos**.
- **Filtrado por URL:** La aplicación utiliza `SearchParams` (`?sector=SBD-08`) para forzar la carga de datos específicos en el servidor.
- **Jerarquía:** Global (ALL) ➔ Sector (SBD-XX) ➔ Coordenada (GPS).

---

## 🛡️ Protocolos de Seguridad
- **Auth:** Autenticación por JWT gestionada por Supabase Auth.
- **RBAC (Role Based Access Control):** - `Archon`: Acceso total via RLS `service_role`.
  - `Official/Vet/NGO`: Acceso filtrado por ID de organización.
  - `User`: Acceso restringido a sus activos propios.
- **Cifrado:** Datos sensibles (propietarios) cifrados en reposo.

---

## 🚀 Mantenimiento y Escalabilidad
- **Commits:** Deben ser atómicos y referenciar el módulo afectado (`feat(web):`, `fix(shared):`).
- **Despliegue:** Vercel (Web) y EAS (Mobile).
- **Testing:** Pruebas unitarias en el `shared-core` para garantizar que el cálculo del Hash DUA sea inmutable.

---
> "Infraestructura robusta para vidas que importan."