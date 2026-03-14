import { describe, it, expect } from 'vitest';
import { PetRepository } from '@buscohuella/shared/repositories/PetRepository';
import { supabase } from '../lib/supabase.js';

/**
 * Smoke Test: Conectividad Global.
 * Validamos que apps/web-pro puede importar y usar componentes del shared-core
 * y que el cliente de Supabase está inicializado.
 */
describe('Smoke Test: Conectividad Global', () => {
  it('debe poder instanciar el PetRepository con el cliente de la web', () => {
    try {
      const repository = new PetRepository(supabase);
      expect(repository).toBeDefined();
      console.log('✅ Cableado sólido: PetRepository instanciado con éxito en Web Pro.');
    } catch (error) {
      console.error('❌ Error de cableado:', error);
      throw error;
    }
  });

  it('debe tener las credenciales de Supabase configuradas (o al menos los placeholders)', () => {
    // En entorno de test, pueden ser strings vacíos si no hay .env,
    // pero el cliente debe haberse creado sin explotar.
    expect(supabase).toBeDefined();
    expect(supabase.from).toBeDefined();
  });
});
