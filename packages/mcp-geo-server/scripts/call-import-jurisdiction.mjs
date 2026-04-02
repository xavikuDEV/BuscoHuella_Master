/**
 * 🐾 BuscoHuella · MCP Bridge Client
 * Invoca la herramienta import_jurisdiction via STDIO.
 */
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

// 🔐 Cargar variables de entorno (necesario para las Keys de Supabase)
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 🎯 Ruta al build compilado del mcp-geo-server (ejecutado desde packages/mcp-geo-server/scripts/)
const serverEntry = path.join(__dirname, "..", "dist", "index.js");

const TARGET_CITY = "Catalonia, Spain";
const TARGET_TYPE = "state";

const CALL_TOOL_REQUEST = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: {
    name: "import_jurisdiction",
    arguments: {
      cityName: TARGET_CITY,
      type: TARGET_TYPE,
    },
  },
};

console.log("═══════════════════════════════════════════════════════════");
console.log("  🐾 BuscoHuella · MCP Client → import_jurisdiction");
console.log("═══════════════════════════════════════════════════════════");
console.log(`  🔧 Herramienta: import_jurisdiction`);
console.log(`  📍 Ciudad: ${TARGET_CITY} | Tipo: ${TARGET_TYPE}`);
console.log(`  🖥️  Servidor: ${serverEntry}`);
console.log("═══════════════════════════════════════════════════════════\n");

// 🛰️ Mensaje de inicialización (Requerido por protocolo MCP)
const INITIALIZE_REQUEST = {
  jsonrpc: "2.0",
  id: 0,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "buscohuella-cli", version: "1.0.0" },
  },
};

// 🚀 Iniciar el servidor MCP como un proceso hijo
const server = spawn("node", [serverEntry], {
  stdio: ["pipe", "pipe", "pipe"],
  env: process.env, // Pasamos las keys de Supabase
});

let buffer = "";

// Logs de depuración del servidor
server.stderr.on("data", (data) => {
  const log = data.toString().trim();
  if (log) console.log(`[MCP Server Log] ${log}`);
});

server.stdout.on("data", (data) => {
  buffer += data.toString();
  const lines = buffer.split("\n");
  buffer = lines.pop(); // Mantener línea incompleta en el buffer

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);

      if (msg.id === 0) {
        console.log(`✅ Handshake completo. Solicitando importación...`);
        server.stdin.write(JSON.stringify(CALL_TOOL_REQUEST) + "\n");
      } else if (msg.id === 1) {
        console.log(
          "\n═══════════════════════════════════════════════════════════",
        );
        if (msg.error) {
          console.error(
            `  ❌ ERROR PROTOCOLO: ${JSON.stringify(msg.error, null, 2)}`,
          );
        } else if (msg.result?.isError) {
          console.error(`  ❌ ERROR TOOL: ${msg.result.content?.[0]?.text}`);
        } else {
          console.log(`  ✅ RESPUESTA EXITOSA:`);
          const text =
            msg.result?.content?.[0]?.text ?? "Importación finalizada.";
          console.log(`  ${text}`);
        }
        console.log(
          "═══════════════════════════════════════════════════════════",
        );

        // Cierre limpio
        server.stdin.end();
        server.kill();
        process.exit(0);
      }
    } catch (e) {
      // Ignorar líneas que no sean JSON (posibles logs mezclados)
    }
  }
});

server.on("error", (err) => {
  console.error(`❌ Fallo crítico al spawnear: ${err.message}`);
  process.exit(1);
});

// Enviar el primer mensaje para despertar al servidor
server.stdin.write(JSON.stringify(INITIALIZE_REQUEST) + "\n");

// ⏲️ Timeout de seguridad (Nominatim/OSM puede tardar)
setTimeout(() => {
  console.error(
    "\n❌ Error: El servidor tardó demasiado en responder (Timeout 60s).",
  );
  server.kill();
  process.exit(1);
}, 60000);
