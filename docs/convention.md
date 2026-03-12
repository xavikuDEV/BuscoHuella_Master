# 📜 Protocolo Maestro: BuscoHuella 2026

## 🔄 El Ciclo de Vida de una Tarea (Master Flow)

Para cada tarea, se debe seguir este orden estricto para evitar deuda técnica:

1.  **📍 PLANIFICACIÓN:** El Orquestador (Gemini) analiza la tarea en el Roadmap.
2.  **🛠️ EJECUCIÓN:** El Specialist (Aider/Groq) pica el código.
3.  **🧪 QA:** Se verifican tipos y linting.
4.  **📝 REGISTRO (Notion):** - Se crea la entrada en la Bitácora.
    - **OBLIGATORIO:** Escribir en el cuerpo de la página un resumen técnico (Walkthrough).
    - Se vincula la entrada con la `Tarea Roadmap` correspondiente.
5.  **🐙 SYNC (Git):** - `git add .`
    - `git commit -m "tipo: descripción [ID-Notion]"`
    - `git push origin main`
6.  **☁️ MEMORIA (Drive):** Sincronización periódica con Google Drive para NotebookLM.

## 🤖 Regla de Oro del Orquestador
El Orquestador NO da por cerrada una tarea si no existe el link al commit en la Bitácora y la tarea en el Roadmap no está en estado "Listo".