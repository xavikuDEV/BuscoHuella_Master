export enum UserRole {
  // --- NIVEL 0: ADMINISTRACIÓN TOTAL ---
  ARCHON = "admin", // Tú: Control absoluto del búnker.

  // --- NIVEL 1: AUTORIDADES INSTITUCIONALES ---
  POLICE = "police", // Cuerpos de seguridad.
  GOVERNMENT = "gov", // Ayuntamientos/Entidades públicas.
  JUDICIAL = "judicial", // Inspectores legales.

  // --- NIVEL 2: PROFESIONALES CERTIFICADOS ---
  VET = "vet", // Veterinarios.
  TRAINER = "trainer", // Educadores y Etólogos.
  GROOMER = "groomer", // Estilistas/Peluquería.

  // --- NIVEL 3: ENTIDADES Y COMERCIO ---
  NGO = "ngo", // Protectoras y Refugios.
  STORE = "store", // Tiendas y comercios.
  BREEDER = "breeder", // Criadores legales.
  BOARDING = "boarding", // Residencias y guarderías.

  // --- NIVEL 4: CIUDADANÍA Y COLABORACIÓN ---
  USER = "user", // Dueño estándar.
  VOLUNTEER = "volunteer", // Personal de apoyo.
  SERVICE_PRO = "service", // Paseadores/Cuidadores independientes.
}

export type VerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected";

export interface UserPrivacySettings {
  show_phone_on_scan: boolean; // Visibilidad en escaneo público
  show_address_on_scan: boolean; // Visibilidad para civiles
  allow_community_messages: boolean; // Canal de comunicación abierto
  share_data_with_vets: boolean; // Compartir historial con clínicas
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface BusinessData {
  brand_name: string;
  tax_id: string; // CIF/NIF
  license_number?: string;
  verified_at?: string;
}

export interface UserProfile {
  // 🛰️ IDENTIDAD DE SISTEMA
  id: string;
  email: string;
  role: UserRole;
  linked_org_id?: string; // Para saber a qué clínica/comisaría pertenece

  // 🎭 IDENTIDAD PÚBLICA
  username: string; // @alias
  discriminator: string; // #0000
  display_name: string;
  avatar_url?: string;
  bio?: string;
  location_city?: string;

  // ⚖️ IDENTIDAD LEGAL (Cifrada / Acceso restringido)
  legal_identity: {
    first_name: string;
    last_name_1: string;
    last_name_2?: string;
    dni_number?: string;
    birth_date?: string;
    phone_number?: string;
    phone_verified: boolean;
    full_address?: string;
    zip_code?: string;
    country: string; // "ES"
  };

  // 🎓 CREDENCIALES PROFESIONALES
  professional_profile?: {
    college_number?: string;
    specialty?: string;
    is_verified: boolean;
    signature_url?: string; // Firma digital para actas
  };

  // 🛡️ SEGURIDAD Y VERIFICACIÓN
  verification: {
    status: VerificationStatus;
    identity_doc_url?: string; // Foto DNI (Privado)
    verified_by?: string; // ID del Admin que verificó
    notes?: string;
  };

  privacy: UserPrivacySettings;
  emergency: EmergencyContact;

  // 🏆 ESTADO Y GAMIFICACIÓN
  account_tier: "free" | "premium" | "premium_plus";
  stats: {
    points: number; // HuePoints
    reputation: number; // 0-100
    report_count: number;
  };

  // 💾 METADATOS
  metadata: {
    last_login: string;
    last_ip: string;
    device_info?: string;
    created_at: string;
    updated_at: string;
  };
}
