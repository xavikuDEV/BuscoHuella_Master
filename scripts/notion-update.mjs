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

async function sync() {
  // Capturamos todos los argumentos posibles
  const [
    ,
    ,
    title,
    type,
    status,
    hash,
    description,
    hitoName,
    agentName,
    categoryName,
    phaseName,
  ] = process.argv;

  try {
    // 1. BUSCAR tarea en Roadmap (usando la Fase dinámica)
    const roadmapQuery = await fetch(
      `https://api.notion.com/v1/databases/${ROADMAP_ID}/query`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          filter: {
            property: "Nombre",
            title: { contains: phaseName || "Fase 2" },
          },
        }),
      },
    );
    const roadmapData = await roadmapQuery.json();
    const roadmapPageId = roadmapData.results?.[0]?.id;

    if (type === "roadmap") {
      const body = {
        properties: {
          Nombre: { title: [{ text: { content: title } }] },
          Estado: { status: { name: status || "En progreso" } },
          Agente: { select: { name: agentName || "Orquestador" } },
          Fase: {
            select: { name: phaseName || "Fase 2: El Despertar del DUA 🧬🛡️" },
          },
        },
      };

      const method = roadmapPageId ? "PATCH" : "POST";
      const url = roadmapPageId
        ? `https://api.notion.com/v1/pages/${roadmapPageId}`
        : `https://api.notion.com/v1/pages`;
      if (!roadmapPageId) body.parent = { database_id: ROADMAP_ID };

      await fetch(url, { method, headers, body: JSON.stringify(body) });
      console.log(`🔄 Roadmap: "${title}" sincronizado.`);
    } else if (type === "bitacora") {
      const commitUrl = hash ? `${REPO_URL}/commit/${hash}` : null;

      const body = {
        parent: { database_id: BITACORA_ID },
        properties: {
          Nombre: { title: [{ text: { content: title } }] },
          Agente: { select: { name: agentName || "Orquestador" } },
          Categoría: { select: { name: categoryName || "Infra" } },
          Descripción: {
            rich_text: [
              { text: { content: description || "Sin descripción." } },
            ],
          },
          Hito: { select: { name: hitoName || "Hito Técnico" } },
          Status: { select: { name: "Éxito ✅" } },
          Commit: commitUrl ? { url: commitUrl } : undefined,
          Fecha: { date: { start: new Date().toISOString().split("T")[0] } },
        },
      };

      if (roadmapPageId) {
        body.properties["Tarea Roadmap"] = {
          relation: [{ id: roadmapPageId }],
        };
      }

      await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      console.log(
        `✅ Bitácora: "${title}" registrada como ${categoryName} por ${agentName}.`,
      );
    }
  } catch (error) {
    console.error(`❌ Error Notion: ${error.message}`);
  }
}

sync();
