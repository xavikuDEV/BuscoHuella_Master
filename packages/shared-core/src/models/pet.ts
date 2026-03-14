export enum PetSpecies {
  DOG = "dog",
  CAT = "cat",
  BIRD = "bird",
  HAMSTER = "hamster",
  REPTILE = "reptile",
  OTHER = "other",
}

export enum PetStatus {
  ACTIVE = "active",
  LOST = "lost",
  FOUND = "found",
  DECEASED = "deceased",
  EMERGENCY = "emergency",
}

export enum PetGender {
  MALE = "male",
  FEMALE = "female",
}

export interface Pet {
  id: string; // UUID
  name: string;
  species: PetSpecies;
  breed?: string;
  gender: PetGender;
  birth_date?: string; // ISO String
  dua_id: string; // Identificador único BuscoHuella
  dua_hash: string; // Firma para integridad de datos
  owner_id: string; // FK a auth.users (Dueño Principal)
  status: PetStatus;

  // Características físicas y Biometría
  color?: string;
  size?: "small" | "medium" | "large" | "extra_large";
  weight?: number; // en kg
  microchip_id?: string;
  is_mixed: boolean;
  facial_data?: any; // Datos para IA
  avatar_url?: string;
  gallery?: string[];

  // Salud y Estado
  is_sterilized: boolean;
  is_vaccinated: boolean;
  blood_type?: string;
  pathologies?: string; // Lo añadimos para el historial
  medical_notes?: string;

  // Localización y Linaje
  city?: string;
  father_id?: string; // UUID a otra Pet
  mother_id?: string; // UUID a otra Pet
  co_owner_ids?: string[]; // Array de co-propietarios

  // Metadatos
  created_at: string;
  updated_at: string;
}
