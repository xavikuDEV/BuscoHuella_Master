import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const NOTION_SECRET = process.env.NOTION_SECRET;
const ROADMAP_ID = process.env.NOTION_ROADMAP_ID?.trim();
const BITACORA_ID = process.env.NOTION_BITACORA_ID?.trim();

// Configuración de cabeceras estándar de Notion
const headers = {
  Authorization: `Bearer ${NOTION_SECRET}`,
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28",
};

async function sync(title, databaseId, properties = {}) {
  try {
    console.log(`📡 [HTTP DIRECTO] Buscando "${title}"...`);

    // 1. BUSCAR si existe
    const queryUrl = `https://api.notion.com/v1/databases/${databaseId}/query`;
    const queryRes = await fetch(queryUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        filter: { property: "Nombre", title: { equals: title } },
      }),
    });

    const queryData = await queryRes.json();
    if (!queryRes.ok) throw new Error(queryData.message || "Error en Query");

    if (queryData.results && queryData.results.length > 0) {
      // 2. ACTUALIZAR (PATCH)
      const pageId = queryData.results[0].id;
      const updateRes = await fetch(
        `https://api.notion.com/v1/pages/${pageId}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ properties }),
        },
      );
      if (!updateRes.ok) throw new Error("Error al actualizar página");
      console.log(`🔄 Notion: "${title}" actualizado con éxito.`);
    } else {
      // 3. CREAR (POST)
      const createRes = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers,
        body: JSON.stringify({
          parent: { database_id: databaseId },
          properties: {
            Nombre: { title: [{ text: { content: title } }] },
            ...properties,
          },
        }),
      });
      if (!createRes.ok) throw new Error("Error al crear página");
      console.log(`✅ Notion: "${title}" creado con éxito.`);
    }
  } catch (error) {
    console.error(`❌ Fallo Crítico API Notion: ${error.message}`);
  }
}

// Lógica de ejecución
const [, , taskTitle, dbType, status] = process.argv;

if (taskTitle) {
  if (dbType === "roadmap" && ROADMAP_ID) {
    sync(taskTitle, ROADMAP_ID, {
      Estado: { status: { name: status || "En progreso" } },
    });
  } else if (dbType === "bitacora" && BITACORA_ID) {
    sync(taskTitle, BITACORA_ID, {});
  } else {
    console.error("⚠️ Error: Faltan IDs o parámetros.");
  }
}
