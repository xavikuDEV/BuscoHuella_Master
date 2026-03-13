import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// 1. Configuración de rutas y variables de entorno
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

// 2. Inicialización del cliente de Notion
const notion = new Client({ auth: process.env.NOTION_SECRET });
const databaseId = process.env.NOTION_BITACORA_ID;

/**
 * Script Maestro de Registro en Bitácora - BuscoHuella 2026
 * Soporta entrada vía Variable de Entorno (PowerShell Safe) o Argumentos.
 */
async function logTask() {
  let data;

  // Prioridad 1: Variable de entorno (Para el Menú de PowerShell)
  const envData = process.env.NOTION_LOG_DATA;
  // Prioridad 2: Argumento por línea de comandos
  const argData = process.argv[2];

  try {
    if (envData) {
      data = JSON.parse(envData);
    } else if (argData) {
      data = JSON.parse(argData);
    } else {
      console.error(
        "❌ Error: No se proporcionaron datos. Usa argumentos o la variable NOTION_LOG_DATA.",
      );
      process.exit(1);
    }
  } catch (e) {
    console.error("❌ Error: Los datos proporcionados no son un JSON válido.");
    console.error("Input recibido:", envData || argData);
    process.exit(1);
  }

  console.log(`⏳ Registrando evento: "${data.nombre}"...`);

  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      // SECCIÓN A: Propiedades (Las 11 columnas de tu tabla)
      properties: {
        Nombre: {
          title: [{ text: { content: data.nombre } }],
        },
        Agente: {
          select: { name: data.agente || "Architect" },
        },
        Categoría: {
          select: { name: data.categoria || "Infra" },
        },
        Fase: {
          select: { name: data.fase || "Q1" },
        },
        Hito: {
          select: { name: data.hito || "Infra-Génesis" },
        },
        Status: {
          select: { name: data.status || "Éxito ✅" },
        },
        Ambiente: {
          select: { name: data.ambiente || "Local" },
        },
        Descripción: {
          rich_text: [
            { text: { content: data.descripcion || "Sin descripción corta." } },
          ],
        },
        Commit: {
          url: data.commit || null,
        },
        // Relación bidireccional con el Roadmap (Si existe ID)
        ...(data.roadmapId && {
          "Tarea Roadmap": {
            relation: [{ id: data.roadmapId }],
          },
        }),
      },
      // SECCIÓN B: Contenido de la página (Cuerpo del log)
      children: [
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ text: { content: "🚀 Technical Walkthrough" } }],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                text: {
                  content:
                    data.walkthrough ||
                    "Se ha completado la tarea técnica siguiendo los protocolos del búnker.",
                },
              },
            ],
          },
        },
        {
          object: "block",
          type: "callout",
          callout: {
            rich_text: [
              {
                text: {
                  content:
                    "⚠️ Este registro fue generado automáticamente por el sistema de gestión del búnker BuscoHuella.",
                },
              },
            ],
            icon: { emoji: "🤖" },
            color: "gray_background",
          },
        },
      ],
    });

    console.log(`✅ Entrada registrada con éxito.`);
    console.log(`🔗 Ver en Notion: ${response.url}`);
  } catch (error) {
    console.error("❌ Error al registrar en Notion:", error.message);
    if (error.body) {
      const errorDetail = JSON.parse(error.body);
      console.error("Detalle de la API:", errorDetail.message);
    }
  }
}

logTask();
