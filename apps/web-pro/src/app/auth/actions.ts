"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * 🔑 ACCESO AL BÚNKER (Login)
 */
export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Redirigimos al login con el error para que el cliente lo muestre
    return redirect("/es/login?error=" + encodeURIComponent(error.message));
  }

  // 🔄 Limpiamos la caché global para que el nuevo perfil se cargue sin rastro del anterior
  revalidatePath("/", "layout");

  // Redirección al centro de mando
  redirect("/es/dashboard/admin");
}

/**
 * 🚪 TERMINAR TURNO (Logout)
 * Corregido para evitar errores de Root Layout y asegurar redirección al locale.
 */
export async function logout() {
  const supabase = await createClient();

  // 1. Cerramos sesión en el servidor de Supabase
  await supabase.auth.signOut();

  // 2. Invalidamos todas las rutas para que no queden datos en el cliente
  revalidatePath("/", "layout");

  // 3. Redirección forzada al login con locale para evitar el error de tags <html>/<body>
  redirect("/es/login");
}

/**
 * 🧬 REGISTRO DE NUEVOS NODOS (Signup)
 */
export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;

  // El registro inicial siempre se crea con el rango más bajo: "user"
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: fullName,
        full_name: fullName, // Mantenemos ambos por compatibilidad temporal
        role: "user",
      },
    },
  });

  if (error) {
    return redirect("/es/login?error=" + encodeURIComponent(error.message));
  }

  // Redirigimos avisando que debe verificar su email
  redirect("/es/login?message=check-email");
}

/**
 * 🛰️ ACCIÓN: Resolver Incidente + Registro de Log
 */
export async function resolveIncidentAction(incidentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesión expirada");

  const { error } = await supabase
    .from("incidents")
    .update({ status: "RESOLVED" })
    .eq("id", incidentId);

  if (error) throw new Error(error.message);

  // 📓 Registro en Bitácora
  await supabase.from("system_logs").insert({
    user_id: user.id,
    action: "INCIDENT_RESOLVED",
    details: `ID: ${incidentId}`,
    severity: "INFO",
  });

  // 🔄 REVALIDACIÓN FORZADA
  revalidatePath("/es/dashboard/admin", "page");
  revalidatePath("/[locale]/dashboard/admin", "layout");
}

export async function deleteIncidentAction(incidentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Acceso denegado");

  const { error } = await supabase
    .from("incidents")
    .delete()
    .eq("id", incidentId);

  if (error) throw new Error(error.message);

  await supabase.from("system_logs").insert({
    user_id: user.id,
    action: "INCIDENT_DELETED",
    details: `Eliminado: ${incidentId}`,
    severity: "WARNING",
  });

  revalidatePath("/es/dashboard/admin", "page");
  revalidatePath("/[locale]/dashboard/admin", "layout");
}

/**
 * 🛰️ ACCIÓN: Resolución Masiva
 */
export async function bulkResolveIncidentsAction(ids: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const { error } = await supabase
    .from('incidents')
    .update({ status: 'RESOLVED' })
    .in('id', ids);

  if (error) throw error;

  await supabase.from('system_logs').insert({
    user_id: user.id,
    action: 'BULK_RESOLVE',
    details: `Se resolvieron ${ids.length} incidentes en bloque.`,
    severity: 'INFO'
  });

  revalidatePath('/[locale]/dashboard/admin/incidents', 'page');
}

/**
 * 🧨 ACCIÓN: Purga Masiva
 */
export async function bulkDeleteIncidentsAction(ids: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const { error } = await supabase
    .from('incidents')
    .delete()
    .in('id', ids);

  if (error) throw error;

  revalidatePath('/[locale]/dashboard/admin/incidents', 'page');
}
