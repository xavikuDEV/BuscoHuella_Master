# 🛡️ BuscoHuella: Protocolo DUA (Documento Unificado Animal)
**Visión:** Crear la infraestructura de identidad animal más segura, inteligente y colaborativa del mundo.

---

## 🚀 Fase Actual: Cimientos (MVP Operativo)
- [x] Arquitectura Monorepo (Next.js 15 + Supabase + Shared Core).
- [x] Login con rangos (Admin/User).
- [x] CRUD de Activos Animales con soporte para Modal.
- [x] Generación de Hash de Integridad DUA y UUIDs únicos.

---

## 🏗️ Arquitectura de Sistema: Torre de Control (Multitenant)
Para escalar a nivel nacional, el sistema se basa en una estructura de **Organizaciones**.



### 👥 Rangos y Accesos (Jerarquía del Búnker)
1.  **Archon (Admin):** Control total del ecosistema y de las organizaciones.
2.  **Police / Autoridad:** Lectura de datos protegidos, gestión de alertas de robo y escaneos oficiales.
3.  **Vet (Veterinario):** Capacidad de certificar vacunas, salud, esterilización y microchips.
4.  **NGO / Protectora:** Gestión de activos en adopción y trazabilidad de rescates.
5.  **User (Dueño):** Gestión de sus activos personales y perfil de ciudadano.

---

## 🛠️ Ideas Futuras (Backlog de Inteligencia)

### 📊 Módulos del Panel de Administración
- **Censo Humano:** Gestión y auditoría de ciudadanos/propietarios.
- **Censo Animal:** Torre de control de todos los DUA registrados.
- **Gestión de Entidades:** Panel para dar de alta y validar ONGs y Protectoras.
- **Gestión de Autoridades:** Control de accesos para Ayuntamientos y cuerpos de Policía.
- **Red Profesional:** Directorio y validación de clínicas veterinarias.

### 🛡️ Funcionalidades Pro
- **Registro de Incidencias (Log de Vida):** Historial inmutable de escaneos, vacunas y cambios de estado.
- **Bóveda de Documentos (Vault):** Almacenamiento cifrado de PDFs (seguros, pasaportes, contratos).
- **Biometría de Movimiento e IA:** Identificación por patrones biomecánicos y reconocimiento facial.
- **🔗 QR Dinámico Inteligente:** Chapas físicas que envían ubicación GPS al dueño al ser escaneadas.
- **🗺️ Radar de Abandono:** Mapa de calor con analítica de datos geolocalizados por ciudad.

---

## 📜 Historial de Implementación
- **15/03/2026:** Implementación de Ficha Técnica Pro (Chip, Linaje, Salud) en la base de datos.
- **15/03/2026:** Migración del Registro de Mascotas a Sistema de Modal para mejora de UX.
- **Próximamente:** CRUD de Gestión de Usuarios y Roles.