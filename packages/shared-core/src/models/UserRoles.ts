/**
 * UserRoles: Definición expandida de la gobernanza de BuscoHuella.
 * Basado en el ecosistema 5-en-1 (B2C, B2B, B2G, ONG, IA).
 */
export enum UserRole {
  // --- NIVEL 0: GOBERNANZA CENTRAL ---
  ADMIN = "ADMIN", // Archon: Control total del búnker y métricas.

  // --- NIVEL 1: AUTORIDADES E INSTITUCIONES (B2G) ---
  POLICE = "POLICE", // SEPRONA/Policía: Acceso a alertas de robo y maltrato.
  CITY_HALL = "CITY_HALL", // Ayuntamientos: Gestión de censos y Smart City Data.

  // --- NIVEL 2: PROFESIONALES Y NEGOCIOS (B2B) ---
  VET = "VET", // Veterinarios: EHR (historial clínico) y validación DUA.
  SHELTER = "SHELTER", // Protectoras/ONG: Gestión de adopciones y rescates.
  TRAINER = "TRAINER", // Adiestradores: Profesionales de comportamiento.
  GROOMER = "GROOMER", // Peluquerías caninas y estética.
  SHOP = "SHOP", // Tiendas de animales y alimentación.
  WALKER = "WALKER", // Paseadores y cuidadores certificados.
  HOTEL = "HOTEL", // Alojamientos Pet-friendly y guarderías.
  INSURANCE = "INSURANCE", // Aseguradoras: Clave para la Ley de Bienestar Animal.
  FARMER = "FARMER", // Ganadería / Smart Farming: Gestión de animales de trabajo.

  // --- NIVEL 3: COMUNIDAD Y SOCIAL (B2C / ONG / ESG) ---
  OWNER = "OWNER", // Dueño: Usuario con mascotas vinculadas.
  VOLUNTEER = "VOLUNTEER", // Colaborador / Rescatista: Ayuda sin mascota propia.
  FOUNDATION = "FOUNDATION", // Fundación Huella: Gestión de proyectos sociales y ESG.
}
