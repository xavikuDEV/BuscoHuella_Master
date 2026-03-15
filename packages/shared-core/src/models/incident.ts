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
  sector: string;
  pet_id?: string;
  reporter_id: string;
  lat?: number;
  lng?: number;
}
