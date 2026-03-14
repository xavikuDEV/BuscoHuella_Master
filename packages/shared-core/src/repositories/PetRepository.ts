import { SupabaseClient } from "@supabase/supabase-js";
import { Pet } from "../models/pet.js";
import { DuaService } from "../services/DuaService.js";

export class PetRepository {
  constructor(private client: SupabaseClient) {}

  /**
   * Crea una nueva mascota con integridad DUA.
   */
  async create(
    petData: Omit<
      Pet,
      "id" | "dua_id" | "dua_hash" | "created_at" | "updated_at" | "status"
    >,
  ): Promise<Pet> {
    const dua_id = DuaService.generateDuaId();
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
        ...petData,
        dua_id,
        dua_hash,
        status: "active",
      })
      .select()
      .single();

    if (error) throw new Error(`Fallo en persistencia DUA: ${error.message}`);
    return data as Pet;
  }

  /**
   * Recupera todas las mascotas del búnker (Uso Administrativo).
   */
  async findAll(): Promise<{ data: Pet[]; error: any }> {
    const { data, error } = await this.client.from("pets").select("*");

    return { data: (data as Pet[]) || [], error };
  }

  async getById(id: string): Promise<Pet | null> {
    const { data, error } = await this.client
      .from("pets")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data as Pet;
  }

  async getByOwner(ownerId: string): Promise<Pet[]> {
    const { data, error } = await this.client
      .from("pets")
      .select("*")
      .eq("owner_id", ownerId);
    if (error) throw new Error(`Error: ${error.message}`);
    return (data as Pet[]) || [];
  }
}
