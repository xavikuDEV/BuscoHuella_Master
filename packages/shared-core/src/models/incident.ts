export enum IncidentType {
  LOST = "LOST",
  FOUND = "FOUND",
  POLICE = "POLICE",
  NGO = "NGO",
  DANGER = "DANGER",
  MEDICAL = "MEDICAL",
}

export enum IncidentUrgency {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface Incident {
  id: string;
  created_at: string;
  type: IncidentType;
  urgency: IncidentUrgency;
  status: string;
  message: string;
  sector_id?: string; // Usamos ID para relaciones
  pet_id?: string;
  reporter_id: string;
  lat: number;
  lng: number;
  // --- NUEVOS CAMPOS TÁCTICOS ---
  photos?: string[];
  documents?: { name: string; url: string }[];
  resolved_at?: string;
  resolved_by?: string;
  derivation_target?: string; // NGO o Entidad
  reporter_details?: {
    full_name: string;
    role: string;
    avatar_url?: string;
  };
}
