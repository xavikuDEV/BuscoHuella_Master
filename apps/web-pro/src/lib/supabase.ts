import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Cliente de Supabase: El conducto oficial de datos para la Web Pro.
 * Utiliza variables de entorno para asegurar que las credenciales no se filtren.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
