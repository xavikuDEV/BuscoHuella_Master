// --- 🧬 ADN DEL SISTEMA ---
export const SYSTEM_NAME = "BuscoHuella";
export const DUA_VERSION = "1.0.0";

// --- 📦 MODELOS Y ENUMS ---
// Nota: UserRole ahora vive dentro de models/user.js
export * from "./models/pet.js";
export * from "./models/user.js";

// --- 📂 REPOSITORIOS ---
export * from "./repositories/PetRepository.js";
export * from "./repositories/UserRepository.js";

// --- ⚙️ SERVICIOS ---
export * from "./services/DuaService.js";
