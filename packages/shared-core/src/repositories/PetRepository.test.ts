import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PetRepository } from './PetRepository.js';
import { PetSpecies, PetGender } from '../models/pet.js';

/**
 * Tests de Integración para PetRepository.
 * Validamos que la capa de persistencia respete el blindaje criptográfico (DUA).
 */
describe('PetRepository', () => {
  let mockSupabase: any;
  let repository: PetRepository;

  beforeEach(() => {
    // Mock del cliente de Supabase para evitar llamadas reales a red
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn(),
      eq: vi.fn().mockReturnThis(),
    };
    repository = new PetRepository(mockSupabase as any);
  });

  it('debe generar dua_id y dua_hash automáticamente antes de insertar', async () => {
    const petData = {
      name: 'Ragnar',
      species: 'dog' as PetSpecies,
      gender: 'male' as PetGender,
      owner_id: 'auth-user-id-001',
      microchip_id: '985112345678901',
      is_sterilized: true,
      is_vaccinated: true,
    };

    // Respuesta simulada de Supabase tras éxito
    const mockCreatedPet = {
      id: 'generated-uuid-001',
      ...petData,
      dua_id: 'BH-2026-F9CD',
      dua_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // Ejemplo de hash
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockSupabase.single.mockResolvedValue({ data: mockCreatedPet, error: null });

    const result = await repository.create(petData);

    // 1. Verificar que se usó la tabla correcta
    expect(mockSupabase.from).toHaveBeenCalledWith('pets');

    // 2. Verificar que el objeto insertado contiene los campos DUA
    const lastCall = mockSupabase.insert.mock.calls[0][0];
    expect(lastCall.dua_id).toMatch(/^BH-2026-[0-9A-F]{4}$/);
    expect(lastCall.dua_hash).toHaveLength(64); // Largo de SHA-256
    expect(lastCall.status).toBe('active');

    // 3. El resultado debe ser el objeto devuelto por Supabase
    expect(result.id).toBe('generated-uuid-001');
    expect(result.dua_id).toBe('BH-2026-F9CD');
  });

  it('debe propagar errores si la base de datos falla', async () => {
    mockSupabase.single.mockResolvedValue({ 
      data: null, 
      error: { message: 'Database error: unique_violation' } 
    });

    await expect(repository.create({ name: 'ErrorPet' } as any))
      .rejects.toThrow('Fallo en persistencia DUA: Database error: unique_violation');
  });

  it('debe recuperar mascotas filtrando por owner_id', async () => {
    const mockPets = [
      { id: '1', name: 'Pet 1', owner_id: 'owner-1' },
      { id: '2', name: 'Pet 2', owner_id: 'owner-1' }
    ];
    mockSupabase.select.mockResolvedValue({ data: mockPets, error: null });

    const results = await repository.getByOwner('owner-1');

    expect(mockSupabase.from).toHaveBeenCalledWith('pets');
    expect(mockSupabase.eq).toHaveBeenCalledWith('owner_id', 'owner-1');
    expect(results).toHaveLength(2);
    expect(results[0].name).toBe('Pet 1');
  });
});
