"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createIncidentAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autorizado");

  const incidentData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    type: formData.get("type") as any,
    priority: formData.get("priority") as string,
    sector_id: formData.get("sector_id") as string,
    reporter_id: user.id,
    status: "OPEN",
  };

  const { error } = await supabase.from("incidents").insert(incidentData);

  if (error) {
    console.error("Error al crear incidencia:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/[locale]/dashboard/admin", "page");
  return { success: true };
}
