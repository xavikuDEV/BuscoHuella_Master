export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  VET = "vet",
}

export interface UserProfile {
  id: string; // UUID
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}
