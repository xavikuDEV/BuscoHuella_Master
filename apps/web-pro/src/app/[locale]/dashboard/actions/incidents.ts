"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createIncidentAction(formData: FormData) {
  const supabase = await createClient();
  const lat = parseFloat(formData.get("lat") as string);
  const lng = parseFloat(formData.get("lng") as string);

  try {
    const { data: sectorData } = await supabase.rpc("find_sector_by_coords", {
      p_lng: lng,
      p_lat: lat,
    });
    const { error } = await supabase.from("incidents").insert([
      {
        message: formData.get("message"),
        type: formData.get("type"),
        urgency: formData.get("urgency"),
        location: `POINT(${lng} ${lat})`,
        lat,
        lng,
        sector_id: sectorData?.[0]?.id || null,
        status: "ACTIVE",
      },
    ]);
    if (error) throw error;
    revalidatePath("/[locale]/dashboard/admin", "layout");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Error de transmisión" };
  }
}

export async function saveSectorAction(
  name: string,
  geojson: any,
  municipalityId: string,
) {
  const supabase = await createClient();
  try {
    const { error } = await supabase.from("sectors").insert([
      {
        name,
        municipality_id: municipalityId,
        boundary: geojson.geometry,
      },
    ]);
    if (error) throw error;
    revalidatePath("/[locale]/dashboard/municipality/zones", "page");
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
