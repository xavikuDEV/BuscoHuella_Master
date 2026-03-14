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
    ambienteName,
  ] = process.argv;

  // Debug para el Archon
  console.log(`🔍 Intentando sincronizar Fase: "${phaseName}"...`);

  try {
    // 1. BUSCAR en Roadmap (Usamos 'contains' para evitar fallos por emojis o espacios)
    const roadmapQuery = await fetch(
      `https://api.notion.com/v1/databases/${ROADMAP_ID}/query`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          filter: {
            property: "Nombre",
            title: { contains: phaseName.split(":")[0] },
          },
        }),
      },
    );
    const roadmapData = await roadmapQuery.json();
    const roadmapPageId = roadmapData.results?.[0]?.id;

    if (roadmapPageId) {
      console.log(`✅ Fase encontrada en Roadmap (ID: ${roadmapPageId})`);
    } else {
      console.warn(
        `⚠️ No se encontró la fase "${phaseName}" exacta. El hito no se enlazará.`,
      );
    }

    if (type === "roadmap") {
      const body = {
        properties: {
          Nombre: { title: [{ text: { content: title } }] },
          Estado: { status: { name: status || "En progreso" } },
          Agente: { select: { name: agentName || "Orquestador" } },
          Fase: { select: { name: phaseName } },
        },
      };
      const url = roadmapPageId
        ? `https://api.notion.com/v1/pages/${roadmapPageId}`
        : `https://api.notion.com/v1/pages`;
      if (!roadmapPageId) body.parent = { database_id: ROADMAP_ID };
      await fetch(url, {
        method: roadmapPageId ? "PATCH" : "POST",
        headers,
        body: JSON.stringify(body),
      });
      console.log(`🔄 Roadmap actualizado.`);
    } else if (type === "bitacora") {
      const commitUrl =
        hash && hash !== "undefined" ? `${REPO_URL}/commit/${hash}` : null;

      const body = {
        parent: { database_id: BITACORA_ID },
        properties: {
          Nombre: { title: [{ text: { content: title } }] },
          Agente: { select: { name: agentName || "Orquestador" } },
          Categoría: { select: { name: categoryName || "Infra" } },
          Hito: { select: { name: hitoName || "Hito Técnico" } },
          Status: { select: { name: status || "Éxito ✅" } },
          Ambiente: { select: { name: ambienteName || "Local" } },
          Commit: commitUrl ? { url: commitUrl } : undefined,
          Fecha: { date: { start: new Date().toISOString().split("T")[0] } },
        },
        children: [
          {
            object: "block",
            type: "heading_2",
            heading_2: {
              rich_text: [{ text: { content: "📋 Informe de Ingeniería" } }],
            },
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  text: { content: "Registro automático del Búnker. " },
                  annotations: { italic: true, color: "gray" },
                },
                {
                  text: {
                    content:
                      description.replace(/\\n/g, "\n") || "Sin detalles.",
                  },
                },
              ],
            },
          },
          {
            object: "block",
            type: "callout",
            callout: {
              icon: { emoji: "🛡️" },
              color: "blue_background",
              rich_text: [
                {
                  text: {
                    content: `Misión: ${hitoName} | Hash: ${hash || "N/A"}`,
                  },
                },
              ],
            },
          },
        ],
      };

      if (roadmapPageId) {
        body.properties["Tarea Roadmap"] = {
          relation: [{ id: roadmapPageId }],
        };
      }

      const response = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const resData = await response.json();

      if (!response.ok) {
        console.error("❌ Error API Notion:", resData);
        throw new Error(`Notion API Error: ${response.status}`);
      }
      console.log(`✅ Bitácora registrada con cuerpo documental.`);
    }
  } catch (error) {
    console.error(`❌ Error Crítico Sync: ${error.message}`);
  }
}

sync();
