import { SupabaseClient } from "@supabase/supabase-js";

export class IncidentRepository {
  constructor(private client: SupabaseClient) {}

  /**
   * Registra una nueva incidencia (Veneno, Alerta SOS, etc.)
   */
  async create(incidentData: any) {
    const { data, error } = await this.client
      .from("incidences")
      .insert([incidentData])
      .select()
      .single();

    return { data, error };
  }

  /**
   * Recupera incidencias activas para el mapa de Sabadell
   */
  async fetchActive() {
    return await this.client
      .from("incidences")
      .select(
        `
        *,
        reporter:profiles(full_name)
      `,
      )
      .eq("status", "open")
      .order("created_at", { ascending: false });
  }

  /**
   * Actualiza el estado de una incidencia (Solo Autoridades)
   */
  async updateStatus(
    id: string,
    status: "investigating" | "resolved" | "closed",
  ) {
    return await this.client
      .from("incidences")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
  }
}
