import { z } from "zod";
import { supabaseAdmin } from "../lib/supabase.js";
import { fetchCityGeometry } from "../lib/osm.js";

export const ImportCitySchema = z.object({
  cityName: z.string().describe("Nombre de la ciudad o región a importar"),
  type: z.enum(["country", "state", "municipality"]).default("municipality"),
});

export async function handleImportCity(args: any) {
  try {
    const geojson = await fetchCityGeometry(args.cityName);

    // Invocamos tu función RPC de Supabase
    const { data, error } = await supabaseAdmin.rpc(
      "insert_jurisdiction_with_geometry",
      {
        p_name: args.cityName,
        p_type: args.type,
        p_geojson: geojson,
      },
    );

    if (error) throw error;

    return {
      content: [
        {
          type: "text",
          text: `✅ ¡Búnker actualizado! ${args.cityName} importado con éxito. ID: ${data}`,
        },
      ],
    };
  } catch (e: any) {
    return {
      content: [
        { type: "text", text: `❌ Error en la operación: ${e.message}` },
      ],
      isError: true,
    };
  }
}
