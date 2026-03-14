import { SupabaseClient } from '@supabase/supabase-js';
import { Pet } from '../models/pet.js';
import { DuaService } from '../services/DuaService.js';

/**
 * PetRepository: Implementación del patrón Repositorio para la entidad Mascota.
 * Este componente actúa como el guardián de la integridad del DUA, asegurando
 * que cada inserción cumpla con los protocolos criptográficos del búnker.
 */
export class PetRepository {
  constructor(private client: SupabaseClient) {}

  /**
   * Crea una nueva mascota en Supabase, generando previamente su DUA ID y Hash.
   * "Hash-Before-Insert" Pattern.
   */
  async create(petData: Omit<Pet, 'id' | 'dua_id' | 'dua_hash' | 'created_at' | 'updated_at' | 'status'>): Promise<Pet> {
    // 1. Generar DUA ID inmutable (BH-2026-XXXX)
    const dua_id = DuaService.generateDuaId();

    // 2. Definir datos críticos para la identidad (ADN)
    const identityData = {
      name: petData.name,
      species: petData.species,
      microchip_id: petData.microchip_id || 'unregistered',
      owner_id: petData.owner_id
    };

    // 3. Generar Hash de Integridad (SHA-256)
    // El ADN digital que garantiza que los datos no han sido manipulados.
    const dua_hash = DuaService.generateIntegrityHash(identityData);

    // 4. Persistencia en Supabase
    const { data, error } = await this.client
      .from('pets')
      .insert({
        ...petData,
        dua_id,
        dua_hash,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('[PetRepository] Error de inserción:', error);
      throw new Error(`Fallo en persistencia DUA: ${error.message}`);
    }

    return data as Pet;
  }

  /**
   * Recupera una mascota por su ID.
   */
  async getById(id: string): Promise<Pet | null> {
    const { data, error } = await this.client
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as Pet;
  }

  /**
   * Recupera todas las mascotas de un dueño específico.
   * Las políticas RLS de Supabase aseguran que un usuario solo vea lo que le pertenece.
   */
  async getByOwner(ownerId: string): Promise<Pet[]> {
    const { data, error } = await this.client
      .from('pets')
      .select('*')
      .eq('owner_id', ownerId);

    if (error) {
      throw new Error(`Error al recuperar mascotas del búnker: ${error.message}`);
    }

    return (data as Pet[]) || [];
  }
}
