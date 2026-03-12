import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

const notion = new Client({ auth: process.env.NOTION_SECRET });
const roadmapId = process.env.NOTION_ROADMAP_ID;

async function createTask() {
  const args = process.argv.slice(2);
  const taskName = args[0];

  if (!taskName) {
    console.log("❌ Error: Falta el nombre de la tarea.");
    process.exit(1);
  }

  try {
    const response = await notion.pages.create({
      parent: { database_id: roadmapId },
      properties: {
        Nombre: {
          title: [{ text: { content: taskName } }],
        },
        // Hemos quitado Estado y Prioridad para evitar errores de validación de nombres
      },
    });
    console.log(`✅ Tarea de Roadmap creada: ${taskName}`);
    console.log(`🔗 ID: ${response.id}`);
  } catch (error) {
    console.error("❌ Error en Notion:", error.message);
  }
}

createTask();
