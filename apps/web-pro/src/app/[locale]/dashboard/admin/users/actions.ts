"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { UserRole } from "@buscohuella/shared";

// Protocolo de ruta para sincronización de caché
const USERS_PATH = "/[locale]/dashboard/admin/users";

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
}) {
  const supabase = await createClient();

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
  const supabase = await createClient();

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
  const supabase = await createClient();

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
  }
) {
  const supabase = await createClient();

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