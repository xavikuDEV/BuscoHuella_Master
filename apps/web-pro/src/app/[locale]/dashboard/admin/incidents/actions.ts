"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createIncidentAction(formData: FormData) {
  const supabase = await createClient();

  // 📥 Mapeo de campos: del Formulario -> a la Base de Datos
  const rawData = {
    message: formData.get("message") as string,
    urgency: formData.get("urgency") as string, // LOW, MEDIUM, HIGH, CRITICAL
    type: formData.get("type") as string, // LOST, FOUND, etc.
    sector: formData.get("sector") as string,
    status: "OPEN", // Valor por defecto
  };

  const { data, error } = await supabase
    .from("incidents")
    .insert([rawData])
    .select();

  if (error) {
    console.error("❌ Error en el búnker:", error.message);
    return { success: false, error: error.message };
  }

  // 🔄 Forzamos la actualización de la caché del servidor
  revalidatePath("/[locale]/dashboard/admin", "page");

  return { success: true, data };
}
