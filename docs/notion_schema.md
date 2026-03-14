# 📊 NOTION DATABASE SCHEMA: BuscoHuella 2026
> Este documento es la referencia técnica para la sincronización entre el Búnker y Notion.

---

## 🗺️ 1. Base de Datos: Roadmap Maestro
**ID:** `321f5da50aae8092a345efef1fbead46`

| Propiedad       | Tipo     | Descripción / Valores Esperados                    |
| :-------------- | :------- | :------------------------------------------------- |
| **Nombre**      | Título   | Nombre de la Fase (ej: Fase 1: Cimientos)          |
| **Estado**      | Select   | `Sin empezar`, `En progreso`, `Listo`, `Bloqueado` |
| **Fase**        | Select   | `Fase 1`, `Fase 2`, `Fase 3`, `Fase 4`, `Fase 5`   |
| **Agente**      | Select   | `Archon`, `Antigravity`, `Specialist / Aider`      |
| **Descripción** | Texto    | Objetivos estratégicos (Sabadell MAU, REIAC, etc.) |
| **Asignar**     | People   | Usuario responsable en Notion                      |
| **Bitacora**    | Relation | Enlace a la base de datos de Bitácora              |

---

## 📝 2. Base de Datos: Bitácora de Hitos
**ID:** `321f5da50aae8030bc2cfc020275f3e2`

| Propiedad         | Tipo     | Descripción / Valores Esperados                        |
| :---------------- | :------- | :----------------------------------------------------- |
| **Nombre**        | Título   | Nombre del Hito / Maniobra                             |
| **Ambiente**      | Select   | `Desarrollo / Búnker`, `Producción`, `Staging`         |
| **Categoría**     | Select   | `Infraestructura / DB`, `UI / UX`, `Seguridad`, `Auth` |
| **Status**        | Select   | `Finalizado`, `En curso`, `Pausa`                      |
| **Hito**          | Texto    | Resumen corto del logro                                |
| **Commit**        | Texto    | Hash corto del commit de Git (ej: `a1b2c3d`)           |
| **Tarea Roadmap** | Relation | Enlace a la entrada correspondiente en el Roadmap      |