"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { UserRole } from "@buscohuella/shared";
import { randomUUID } from "node:crypto";

// Protocolo de ruta para sincronización de caché
const USERS_PATH = "/[locale]/dashboard/admin/users";

/**
 * 🔐 Cliente administrativo con privilegios totales (SERVICE_ROLE).
 */
async function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "CRITICAL: Configuración de Supabase incompleta (URL o Service Role Key).",
    );
  }

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
  password?: string;
  municipality_slug?: string;
}) {
  console.log(`📡 Admin Protocol: Iniciando creación de ${userData.email}`);

  try {
    const adminClient = await createAdminClient();

    // 1️⃣ Crear usuario en Auth
    const { data: authData, error: authError } =
      await adminClient.auth.admin.createUser({
        email: userData.email,
        password: userData.password || "BuscoHuella2026!",
        email_confirm: true,
        user_metadata: {
          display_name: userData.fullName,
          full_name: userData.fullName, // 👈 Compatibilidad con triggers
          role: userData.role,
          municipality_slug: userData.municipality_slug || "global", // 👈 CLAVE para triggers
        },
      });

    if (authError) {
      console.error("❌ Error en Auth Admin:", authError.message);
      return { success: false, error: authError.message };
    }

    const newUserId = authData.user.id;

    // 2️⃣ Sincronizar perfil
    const { error: profileError } = await adminClient.from("profiles").upsert({
      id: newUserId,
      display_name: userData.fullName,
      role: userData.role,
      municipality_slug: userData.municipality_slug || "global",
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("❌ Error sincronizando perfil:", profileError.message);
      return {
        success: false,
        error: "Usuario creado pero falló la sincronización de perfil.",
      };
    }

    // 🔄 Revalidar caché global (puedes afinar esto luego)
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

/**
 * 🆕 REGISTRAR PERSONA / ENTIDAD (Manual)
 * Inserta un nuevo perfil en el censo. Gracias al ajuste de esquema,
 * ya no requiere que el usuario exista previamente en Auth.
 */
export async function createUserAction(userData: {
  email: string;
  display_name: string;
  role: UserRole;
  location_city?: string;
  assigned_sector_id?: string | null;
}) {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          id: randomUUID(), // Identificador único generado por el búnker
          ...userData,
          username: userData.display_name.toLowerCase().replace(/\s/g, "_"),
          discriminator: Math.floor(1000 + Math.random() * 9000).toString(),
          verification_status: "verified",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    console.log(`✅ Registro exitoso en el censo: ${userData.email}`);
    revalidatePath(USERS_PATH, "page");

    return { success: true, data };
  } catch (error: any) {
    console.error("❌ Fallo en creación de nodo:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 🛡️ ACTUALIZAR RANGO / ROL
 * Modifica los privilegios de acceso de un perfil identificado.
 */
export async function updateUserRoleAction(
  userId: string,
  newRole: UserRole | string,
) {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select();

    if (error) throw error;

    console.log(`✅ Rango actualizado: ${userId} -> ${newRole}`);
    revalidatePath(USERS_PATH, "page");

    return { success: true, data };
  } catch (error: any) {
    console.error("❌ Fallo en actualización de protocolo:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 🚨 DAR DE BAJA REGISTRO (Delete)
 * Elimina permanentemente el perfil del censo humano.
 * Incluye protección para evitar que el Administrador actual se elimine a sí mismo.
 */
export async function deleteUserAction(userId: string) {
  const supabase = await createServerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.id === userId) {
      throw new Error(
        "Protocolo de Seguridad: No puedes dar de baja tu propio nodo Administrador.",
      );
    }

    const { error } = await supabase.from("profiles").delete().eq("id", userId);

    if (error) throw error;

    console.log(`🗑️ Registro eliminado del censo: ${userId}`);
    revalidatePath(USERS_PATH, "page");

    return { success: true };
  } catch (error: any) {
    console.error("❌ Fallo en protocolo de baja:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 📝 ACTUALIZAR REGISTRO COMPLETO
 * Permite modificar los datos de identidad y ubicación de un nodo.
 */
export async function updateUserAction(
  userId: string,
  userData: {
    display_name: string;
    email: string;
    role: UserRole;
    location_city?: string;
    assigned_sector_id?: string | null;
  }
) {

  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...userData,
        username: userData.display_name.toLowerCase().replace(/\s/g, "_"),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select();

    if (error) throw error;

    console.log(`✅ Nodo actualizado: ${userId}`);
    revalidatePath(USERS_PATH, "page");

    return { success: true, data };
  } catch (error: any) {
    console.error("❌ Fallo en actualización de nodo:", error.message);
    return { success: false, error: error.message };
  }
}
