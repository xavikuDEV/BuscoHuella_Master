import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv"; // 👈 Cambiado a importación de namespace

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY",
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
