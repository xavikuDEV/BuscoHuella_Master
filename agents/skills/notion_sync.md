# 📟 Protocolo: Bitácora BuscoHuella

## 📝 Formato Obligatorio de Log
Cada vez que un agente termine una tarea, debe usar el MCP de Notion para rellenar:

1. **Nombre:** Título descriptivo.
2. **Fecha:** Automática (con hora activa).
3. **Agente:** Rol que ejecuta.
4. **Categoría:** {Genesis, DB, UI, Infra, Fix}.
5. **Descripción:** Walkthrough técnico de 4 líneas (archivos tocados y por qué).
6. **Estado:** {Éxito ✅, Aviso ⚠️, Error ❌}.
7. **Hito:** El hito actual del Roadmap.
8. **Ambiente:** {Local, Staging, Prod}.
9. **Fase:** {Q1, Q2, Q3, Q4}.
10. **Commit:** Link al push de GitHub.
11. **Tarea Roadmap:** Relación bidireccional con la DB de tareas.