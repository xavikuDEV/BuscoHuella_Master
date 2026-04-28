import { SupabaseClient } from "@supabase/supabase-js";

export class IncidentRepository {
  constructor(private client: SupabaseClient) {}

  /**
   * 🛰️ Crear incidencia (asignando municipio automáticamente)
   */
  async create(incidentData: any, municipality_slug: string) {
    if (!municipality_slug) {
      throw new Error("Municipality slug requerido para crear incidencia");
    }

    const { data, error } = await this.client
      .from("incidences")
      .insert([
        {
          ...incidentData,
          municipality_slug, // 🔐 Forzamos segregación
        },
      ])
      .select()
      .single();

    return { data, error };
  }

  /**
   * 📡 Incidencias activas (filtradas por municipio)
   */
  async fetchActive(municipality_slug?: string) {
    let assigned_sector_id = null;

    try {
      const { data: { user } } = await this.client.auth.getUser();
      if (user) {
        const { data: profile } = await this.client
          .from("profiles")
          .select("assigned_sector_id")
          .eq("id", user.id)
          .single();
        assigned_sector_id = profile?.assigned_sector_id;
      }
    } catch (error) {
      console.error("Error fetching user assigned_sector_id:", error);
    }

    let query = this.client
      .from("incidences")
      .select(
        `
        *,
        reporter:profiles(full_name)
      `,
      )
      .eq("status", "open");

    if (municipality_slug) {
      query = query.eq("municipality_slug", municipality_slug);
    }

    if (assigned_sector_id) {
      query = query.eq("sector_id", assigned_sector_id);
    }

    return await query.order("created_at", { ascending: false });
  }


  /**
   * 🛡️ Actualizar estado (solo dentro del mismo municipio)
   */
  async updateStatus(
    id: string,
    status: "investigating" | "resolved" | "closed",
    municipality_slug: string,
  ) {
    if (!municipality_slug) {
      throw new Error("Municipality slug requerido");
    }

    return await this.client
      .from("incidences")
      .update({ status })
      .eq("id", id)
      .eq("municipality_slug", municipality_slug) // 🔐 PROTECCIÓN CRÍTICA
      .select()
      .single();
  }

  /**
   * 🔎 Obtener incidencia por ID (segura por municipio)
   */
  async getById(id: string, municipality_slug: string) {
    return await this.client
      .from("incidences")
      .select(
        `
        *,
        reporter:profiles(full_name)
      `,
      )
      .eq("id", id)
      .eq("municipality_slug", municipality_slug) // 🔐 AISLAMIENTO
      .single();
  }
}
