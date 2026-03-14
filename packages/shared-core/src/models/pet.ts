export type PetSpecies = "dog" | "cat" | "bird" | "other";
export type PetStatus = "active" | "lost" | "found" | "deceased";
export type PetGender = "male" | "female";

export interface Pet {
  id: string; // UUID
  name: string;
  species: PetSpecies;
  breed?: string;
  gender: PetGender;
  birth_date?: string; // ISO String
  dua_id: string; // Identificador único BuscoHuella
  dua_hash: string; // Firma para integridad de datos
  owner_id: string; // FK a auth.users
  status: PetStatus;

  // Características físicas
  color?: string;
  size?: "small" | "medium" | "large" | "extra_large";
  weight?: number; // en kg
  microchip_id?: string;

  // Salud y Estado
  is_sterilized: boolean;
  is_vaccinated: boolean;
  blood_type?: string;
  medical_notes?: string;

  // Metadatos
  created_at: string;
  updated_at: string;
  avatar_url?: string;
}
