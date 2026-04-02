"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * 🛰️ ACCIÓN: Crear Incidente con Geofencing (Sabadell Alpha)
 */
export async function createIncidentAction(formData: FormData) {
  const supabase = await createClient();
  const lat = parseFloat(formData.get("lat") as string);
  const lng = parseFloat(formData.get("lng") as string);

  try {
    // 🛰️ Llamamos al Súper-Radar
    const { data: geoContext } = await supabase.rpc(
      "get_full_location_context",
      {
        p_lng: lng,
        p_lat: lat,
      },
    );

    // 🛡️ Lógica de etiquetado
    const sectorName = geoContext.sector || "FUERA_DE_SECTOR";
    const cityName = geoContext.municipality || "SABADELL_GLOBAL"; // Fallback para el test

    const { data, error } = await supabase
      .from("incidents")
      .insert([
        {
          message: formData.get("message"),
          type: formData.get("type"),
          urgency: formData.get("urgency"),
          lat,
          lng,
          sector: sectorName,
          status: "ACTIVE",
          // 🧬 Guardamos todo el ADN geográfico en la metadata
          metadata: {
            full_context: geoContext,
            detected_at: new Date().toISOString(),
          },
        },
      ])
      .select();

    if (error) throw error;
    revalidatePath("/[locale]/dashboard/admin", "layout");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * ✅ ACCIÓN: Resolver Incidente Individual
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

  if (error) throw error;

  await supabase.from("system_logs").insert({
    user_id: user.id,
    action: "INCIDENT_RESOLVED",
    details: `ID: ${incidentId}`,
    severity: "INFO",
  });

  revalidatePath("/[locale]/dashboard/admin", "layout");
}

/**
 * 🧨 ACCIÓN: Borrar Incidente Individual
 */
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
  if (error) throw error;

  await supabase.from("system_logs").insert({
    user_id: user.id,
    action: "INCIDENT_DELETED",
    details: `Eliminado: ${incidentId}`,
    severity: "WARNING",
  });

  revalidatePath("/[locale]/dashboard/admin", "layout");
}

/**
 * 🔗 ACCIÓN: Operaciones Masivas (Resolución/Purga)
 */
export async function bulkResolveIncidentsAction(ids: string[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("incidents")
    .update({ status: "RESOLVED" })
    .in("id", ids);
  if (error) throw error;

  revalidatePath("/[locale]/dashboard/admin/incidents", "page");
}

export async function bulkDeleteIncidentsAction(ids: string[]) {
  const supabase = await createClient();
  const { error } = await supabase.from("incidents").delete().in("id", ids);
  if (error) throw error;

  revalidatePath("/[locale]/dashboard/admin/incidents", "page");
}

/**
 * 🗺️ ACCIÓN: Gestión de Sectores (Malla Geotáctica)
 */
export async function saveSectorAction(name: string, geojson: any) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Si no hay usuario, usamos un ID genérico para el test o fallamos
  const userId = user?.id || null;

  try {
    const { data, error } = await supabase
      .from("sectors")
      .insert([
        {
          name: name,
          municipality_id: userId,
          boundary: geojson.geometry,
        },
      ])
      .select();

    if (error) {
      console.error("❌ Error DB Sectores:", error.message);
      return { success: false, error: error.message };
    }

    console.log("✅ Sector Guardado en DB:", data);
    revalidatePath("/[locale]/dashboard/municipality/zones", "page");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
