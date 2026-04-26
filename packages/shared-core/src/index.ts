// packages/shared-core/src/index.ts

// --- 🧬 ADN DEL SISTEMA ---
export const SYSTEM_NAME = "BuscoHuella";
export const DUA_VERSION = "1.0.0";

// --- 🛰️ CONEXIÓN (Añade esto) ---
export * from "./supabase.js";

// --- 📦 MODELOS Y ENUMS ---
export * from "./models/pet.js";
export * from "./models/user.js";

// --- 📂 REPOSITORIOS ---
export * from "./repositories/PetRepository.js";
export * from "./repositories/UserRepository.js";
export * from "./repositories/IncidentRepository.js";

// --- ⚙️ SERVICIOS ---
export * from "./services/DuaService.js";
