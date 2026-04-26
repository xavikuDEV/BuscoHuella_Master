import { createClient } from "@supabase/supabase-js";

// Intentamos obtener las variables de cualquier entorno posible (Next, Expo o Node puro)
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // En desarrollo mostramos aviso, en producción esto sería un error crítico
  console.warn(
    "⚠️ [BuscoHuella Shared] Credenciales de Supabase no detectadas en el entorno actual.",
  );
}

/**
 * Cliente Universal de BuscoHuella.
 * Este cliente respeta las políticas de Row Level Security (RLS).
 */
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
);
