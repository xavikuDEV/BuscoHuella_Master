import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const NOTION_SECRET = process.env.NOTION_SECRET;
const ROADMAP_ID = process.env.NOTION_ROADMAP_ID?.trim();
const BITACORA_ID = process.env.NOTION_BITACORA_ID?.trim();
const REPO_URL = "https://github.com/xavikuDEV/BuscoHuella_Master";

const headers = {
  Authorization: `Bearer ${NOTION_SECRET}`,
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28",
};

async function sync(title, databaseId, dbType, properties = {}) {
  try {
    // 1. BUSCAR con coincidencia parcial para evitar duplicados
    const queryRes = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          filter: {
            property: "Nombre",
            title: { contains: title.split("—")[0].trim() },
          },
        }),
      },
    );

    const queryData = await queryRes.json();
    const existingPage = queryData.results?.[0];

    if (existingPage) {
      // 2. ACTUALIZAR
      await fetch(`https://api.notion.com/v1/pages/${existingPage.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ properties }),
      });
      console.log(`🔄 Notion [${dbType}]: "${title}" actualizado.`);
    } else {
      // 3. CREAR
      await fetch("https://api.notion.com/v1/pages", {
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
      console.log(`✅ Notion [${dbType}]: "${title}" creado.`);
    }
  } catch (error) {
    console.error(`❌ Error en Notion [${dbType}]: ${error.message}`);
  }
}

// Extraer argumentos: [taskTitle, dbType, status, hash]
const [, , title, type, status, hash] = process.argv;

if (title) {
  if (type === "roadmap" && ROADMAP_ID) {
    // Campos para el Roadmap
    sync(title, ROADMAP_ID, "Roadmap", {
      Estado: { status: { name: status || "En progreso" } },
      Agente: { select: { name: "Especialista / Antigravity" } },
      Fase: { select: { name: "Fase 2: El Despertar del DUA 🧬🛡️" } },
    });
  } else if (type === "bitacora" && BITACORA_ID) {
    // Campos Ultra-Completos para la Bitácora
    const commitUrl = hash ? `${REPO_URL}/commit/${hash}` : null;

    sync(title, BITACORA_ID, "Bitácora", {
      Agente: { select: { name: "Orquestador" } },
      Categoría: { select: { name: "Infra" } },
      Fase: { select: { name: "Q1" } },
      Status: { select: { name: "Éxito ✅" } },
      Ambiente: { select: { name: "Local" } },
      Commit: commitUrl ? { url: commitUrl } : undefined,
      Fecha: { date: { start: new Date().toISOString().split("T")[0] } },
    });
  }
}
