"use server";

import { createClient } from "@supabase/supabase-js"; // 👈 Usamos el cliente base
import { revalidatePath } from "next/cache";

/**
 * 🔐 Cliente administrativo con privilegios totales (SERVICE_ROLE).
 * Al usar el cliente base de supabase-js, evitamos el lío de las cookies de SSR
 * y tenemos acceso total a la API de administración.
 */
async function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "CRITICAL: Configuración de Supabase incompleta (URL o Service Role Key).",
    );
  }

  // Este cliente ignora el RLS y tiene "llave maestra"
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * 🚀 Server Action para crear usuarios desde el panel de Admin.
 */
export async function createAdminUserAction(userData: {
  email: string;
  fullName: string;
  role: string;
  municipality_slug?: string;
}) {
  console.log(`📡 Admin Protocol: Iniciando creación de ${userData.email}`);

  try {
    const adminClient = await createAdminClient();

    // 1️⃣ Crear el usuario en Auth (Service Role permite confirmar email automáticamente)
    const { data: authData, error: authError } =
      await adminClient.auth.admin.createUser({
        email: userData.email,
        password: Math.random().toString(36).slice(-12), // Password temporal
        email_confirm: true,
        user_metadata: {
          display_name: userData.fullName,
          role: userData.role,
        },
      });

    if (authError) {
      console.error("❌ Error en Auth Admin:", authError.message);
      return { success: false, error: authError.message };
    }

    const newUserId = authData.user.id;

    // 2️⃣ Sincronizar en la tabla 'profiles'
    const { error: profileError } = await adminClient.from("profiles").upsert({
      id: newUserId,
      display_name: userData.fullName,
      role: userData.role,
      municipality_slug: userData.municipality_slug || "global",
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      // Si falla el perfil, el usuario en Auth ya existe, pero sin perfil
      console.error("❌ Error sincronizando perfil:", profileError.message);
      return {
        success: false,
        error: "Usuario creado pero falló la sincronización de perfil.",
      };
    }

    revalidatePath("/", "layout");

    return {
      success: true,
      userId: newUserId,
      message: `Protocolo completado. Usuario ${userData.role} operativo.`,
    };
  } catch (err) {
    console.error("💥 Fallo crítico en la acción:", err);
    return { success: false, error: "Error de conexión con el búnker." };
  }
}
