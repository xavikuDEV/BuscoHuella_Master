import { Client } from "@notionhq/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// Inicialización ultra-segura
const notion = new Client({ auth: process.env.NOTION_SECRET });

async function sync(title, databaseId, properties = {}) {
  try {
    // 1. Buscar si ya existe la página por título
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Nombre",
        title: {
          equals: title,
        },
      },
    });

    if (response.results && response.results.length > 0) {
      // 2. ACTUALIZAR (Si existe)
      const pageId = response.results[0].id;
      await notion.pages.update({
        page_id: pageId,
        properties: properties,
      });
      console.log(
        `🔄 Notion: "${title}" actualizado en ${databaseId.substring(0, 5)}...`,
      );
    } else {
      // 3. CREAR (Si no existe)
      const newPage = {
        parent: { database_id: databaseId },
        properties: {
          Nombre: {
            title: [{ text: { content: title } }],
          },
          ...properties,
        },
      };
      await notion.pages.create(newPage);
      console.log(
        `✅ Notion: "${title}" creado en ${databaseId.substring(0, 5)}...`,
      );
    }
  } catch (error) {
    console.error(`❌ Error en sincronización Notion: ${error.message}`);
  }
}

// Lógica de ejecución por línea de comandos
const [, , taskTitle, dbType, status] = process.argv;

const roadmapId = process.env.NOTION_ROADMAP_ID;
const bitacoraId = process.env.NOTION_BITACORA_ID;

if (taskTitle) {
  if (dbType === "roadmap" && roadmapId) {
    sync(taskTitle, roadmapId, {
      Estado: { status: { name: status || "En progreso" } },
    });
  } else if (dbType === "bitacora" && bitacoraId) {
    sync(taskTitle, bitacoraId, {});
  }
}
