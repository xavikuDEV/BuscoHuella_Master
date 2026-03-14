import { Client } from "@notionhq/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const notion = new Client({ auth: process.env.NOTION_SECRET });

async function sync(title, databaseId, properties = {}) {
  // 1. Buscar si ya existe la página
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: { property: "Nombre", title: { equals: title } },
  });

  if (response.results.length > 0) {
    // 2. ACTUALIZAR
    const pageId = response.results[0].id;
    await notion.pages.update({ page_id: pageId, properties });
    console.log(`🔄 Notion: "${title}" actualizado.`);
  } else {
    // 3. CREAR
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Nombre: { title: [{ text: { content: title } }] },
        ...properties,
      },
    });
    console.log(`✅ Notion: "${title}" creado.`);
  }
}

// Ejemplo de uso: node scripts/notion-update.mjs "Fase 2" ROADMAP_ID "{...}"
const [, , taskTitle, dbType, status] = process.argv;
const dbId =
  dbType === "roadmap"
    ? process.env.NOTION_ROADMAP_ID
    : process.env.NOTION_BITACORA_ID;

if (taskTitle && dbId) {
  const props = status ? { Estado: { status: { name: status } } } : {};
  sync(taskTitle, dbId, props).catch(console.error);
}
