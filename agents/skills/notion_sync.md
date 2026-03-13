# 📟 Protocolo: Bitácora & Notion Intelligence (Audit & Traceability)

**Estado:** Operativo | **Nivel de Registro:** Granularidad Alta | **Versión:** 2.1.0

## 📝 Misión de Trazabilidad

Garantizar que cada bit de cambio en BuscoHuella 2026 esté documentado, vinculado y auditado. Este protocolo asegura que la **Bitácora (Logs)** y el **Roadmap (Tareas)** funcionen como un sistema nervioso único, permitiendo reconstruir cualquier decisión técnica en segundos.

## ⚖️ El Estándar de las 11 Columnas (Data Dictionary)

Cada entrada en Notion debe cumplir rigurosamente con este esquema de metadatos:

1. **Nombre (Entry Title):** Título semántico corto (ej: `feat: schema-pet-dua`).
2. **Agente (Execution Role):** Identificador del agente que lideró la acción.
3. **Categoría (Domain):** `{ GÉNESIS | INFRA | DB | UI/UX | CORE | FIX | SECURITY }`.
4. **Fase (Lifecycle):** Fase actual del proyecto (ej: `Fase 2 - Modelado`).
5. **Hito (Milestone):** Objetivo mayor al que contribuye la tarea.
6. **Status (Execution Health):** `{ ÉXITO ✅ | AVISO ⚠️ | ERROR ❌ | REVERTIDO 🔄 }`.
7. **Ambiente (Environment):** `{ LOCAL | STAGING | PRODUCTION }`.
8. **Descripción (Technical Walkthrough):** Resumen de alto valor técnico. Qué se hizo, qué archivos se tocaron y qué impacto tiene en el DUA.
9. **Commit (VCS Link):** URL directa al commit en GitHub para auditoría de código.
10. **Tarea Roadmap (Relational ID):** Vínculo bidireccional obligatorio con la base de datos de tareas. No existe log sin tarea madre.
11. **Fecha (Timestamp):** Registro automático de ejecución (ISO 8601).

## 🔄 Flujo Operativo de Registro

- **Trigger de Registro:** El log se dispara inmediatamente después de un `git push` exitoso o un cambio crítico en la infraestructura.
- **Validación de Vínculo:** El script `log-task.mjs` debe verificar la existencia del `roadmapId`. Si el ID es nulo, el registro se marca como `Aviso ⚠️`.
- **Integridad del Walkthrough:** La descripción debe evitar vaguedades. Se priorizará el formato: *"Modificado [archivo] para implementar [lógica], alineado con [contexto]"*.

## 🛡️ Reglas de Oro de la Bitácora

1. **Inmutabilidad:** Una vez registrado un hito con éxito, no se altera. Los errores se corrigen con una nueva entrada de tipo `FIX`.
2. **Sincronización:** El estado en Notion debe ser el "espejo" de la realidad en el Monorepo.
3. **Cero Silencio:** Incluso los fallos catastróficos se registran. Un `ERROR ❌` bien documentado es más valioso que un silencio técnico.

> "En el búnker BuscoHuella, confiamos en Dios; para todo lo demás, exigimos el Log de Notion."
