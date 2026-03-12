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
 * Registra propiedades (columnas) y contenido (walkthrough) en un solo paso.
 */
async function logTask() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("❌ Error: Se requiere un objeto JSON como argumento.");
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(args[0]);
  } catch (e) {
    console.error("❌ Error: El argumento no es un JSON válido.");
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
        // Relación bidireccional con el Roadmap
        ...(data.roadmapId && {
          "Tarea Roadmap": {
            relation: [{ id: data.roadmapId }],
          },
        }),
      },
      // SECCIÓN B: Contenido de la página (El cuerpo que antes salía vacío)
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
                    "⚠️ Este registro fue generado automáticamente por el sistema de agentes BuscoHuella.",
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
      console.error("Detalle de la API:", JSON.parse(error.body).message);
    }
  }
}

logTask();
