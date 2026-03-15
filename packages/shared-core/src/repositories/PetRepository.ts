import { SupabaseClient } from "@supabase/supabase-js";
import { Pet, PetSpecies, PetStatus } from "../models/pet.js";
import { DuaService } from "../services/DuaService.js";

export class PetRepository {
  constructor(private client: SupabaseClient) {}

  async create(
    // 🛡️ Mantenemos TODOS los campos excepto los automáticos.
    // "status" NO se omite aquí para que la Action pueda enviarlo.
    petData: Omit<
      Pet,
      "id" | "dua_id" | "dua_hash" | "created_at" | "updated_at"
    >,
  ): Promise<Pet> {
    const dua_id = DuaService.generateDuaId();

    // Generamos el Hash de Integridad incluyendo el Chip/Identidad
    const identityData = {
      name: petData.name,
      species: petData.species,
      microchip_id: petData.microchip_id || "unregistered",
      owner_id: petData.owner_id,
    };
    const dua_hash = DuaService.generateIntegrityHash(identityData);

    const { data, error } = await this.client
      .from("pets")
      .insert({
        ...petData, // 👈 Aquí entran: color, weight, size, blood_type, etc.
        dua_id,
        dua_hash,
        status: petData.status || PetStatus.ACTIVE,
      })
      .select()
      .single();

    if (error) throw new Error(`Fallo en persistencia DUA: ${error.message}`);
    return data as Pet;
  }

  async findAll(): Promise<{ data: Pet[]; error: any }> {
    const { data, error } = await this.client
      .from("pets")
      .select(
        `
        *,
        owner:profiles(username, display_name, email) 
      `,
      )
      .order("created_at", { ascending: false });
    return { data: (data as any[]) || [], error };
  }

  async update(id: string, data: Partial<Pet>) {
    // 🛡️ Protegemos la integridad del búnker limpiando IDs y hashes
    const { id: _, dua_id, dua_hash, created_at, ...updateData } = data as any;

    const { data: updated, error } = await this.client
      .from("pets")
      .update(updateData)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) return { data: null, error };
    if (!updated) return { data: null, error: { message: "No encontrado" } };

    return { data: updated, error: null };
  }

  async delete(id: string): Promise<{ error: any }> {
    return await this.client.from("pets").delete().eq("id", id);
  }

  async findByIdentity(identifier: string): Promise<Pet | null> {
    const { data } = await this.client
      .from("pets")
      .select("*, owner:profiles(full_name, email)")
      .or(`dua_id.eq.${identifier},microchip_id.eq.${identifier}`)
      .maybeSingle();
    return data as Pet;
  }
}
