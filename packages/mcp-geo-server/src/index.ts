import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { handleImportCity } from "./tools/import-city.js";

const server = new Server(
  {
    name: "mcp-geo-server",
    version: "1.0.0",
  },
  {
    capabilities: { tools: {} },
  },
);

// Registro de herramientas
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "import_jurisdiction",
      description:
        "Busca en OpenStreetMap e inserta la geometría en la DB del Búnker",
      inputSchema: {
        type: "object",
        properties: {
          cityName: { type: "string" },
          type: { type: "string", enum: ["country", "state", "municipality"] },
        },
        required: ["cityName"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "import_jurisdiction") {
    return await handleImportCity(request.params.arguments);
  }
  throw new Error("Tool not found");
});

// 🔥 Función de inicio para evitar el error de Top-level await
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 Geo-Server MCP ejecutándose en STDIO");
}

runServer().catch((error) => {
  console.error("💥 Error fatal al iniciar el servidor:", error);
  process.exit(1);
});
