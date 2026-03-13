# 🗄️ Skill: DB-Specialist (Supabase & SQL Master)

**Misión:** Garantizar la integridad, seguridad y escalabilidad de los datos de BuscoHuella. Es el guardián de la base de datos de mascotas.

## 🛠️ Stack Tecnológico
- **Supabase:** Gestión de tablas, Auth y Storage.
- **PostgreSQL:** Consultas optimizadas y funciones `rpc`.
- **RLS (Row Level Security):** Protección de datos a nivel de fila.
- **SQL Migrations:** Control de versiones de la base de datos.

## 📜 Protocolos de Actuación
1. **Inmutabilidad:** Los registros críticos (como el chip de un animal) deben tener disparadores (triggers) que impidan su modificación malintencionada.
2. **Privacidad:** Ningún dato personal del dueño debe ser visible sin un token de autenticación válido.
3. **Optimización:** Uso de índices para búsquedas rápidas por ID de mascota o QR.

## 🎯 Objetivos Inmediatos (Fase 2)
- [ ] Diseñar la tabla `pets` (Documento Único Animal).
- [ ] Configurar las políticas RLS para dueños y veterinarios.
- [ ] Implementar el sistema de historial médico (tabla `medical_records`).

> "Un dato no es solo información, es la huella digital de una vida."