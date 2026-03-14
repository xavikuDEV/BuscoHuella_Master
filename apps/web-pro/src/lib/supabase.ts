import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 🛡️ Validación en tiempo de ejecución para el Archon
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ ERROR CRÍTICO: No se han encontrado las variables de entorno de Supabase.\n" +
      "Asegúrate de que apps/web-pro/.env.local contenga:\n" +
      "NEXT_PUBLIC_SUPABASE_URL=...\n" +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY=...",
  );
}

/**
 * Cliente de Supabase: El conducto oficial de datos para la Web Pro.
 * Se inicializa con placeholders si las variables faltan para evitar el crash inmediato,
 * pero lanzará errores en las peticiones hasta que se configuren las variables.
 */
export const supabase = createClient(
  supabaseUrl || "https://missing-url.supabase.co",
  supabaseAnonKey || "missing-key",
);
