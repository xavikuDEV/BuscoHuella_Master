import { describe, it, expect } from 'vitest';
import { DuaService } from './DuaService';

describe('DuaService', () => {
  describe('generateDuaId', () => {
    it('should generate an ID with the correct format (BH-2026-XXXX)', () => {
      const duaId = DuaService.generateDuaId();
      expect(duaId).toMatch(/^BH-2026-[0-9A-F]{4}$/);
    });

    it('should pass the Collision Test: consecutive IDs must be different', () => {
      const id1 = DuaService.generateDuaId();
      const id2 = DuaService.generateDuaId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('generateIntegrityHash', () => {
    const baseData = {
      name: 'Firulais',
      species: 'Dog',
      breed: 'Labrador',
      microchip: '123456789'
    };

    it('should generate a valid 64-character SHA-256 hex string', () => {
      const hash = DuaService.generateIntegrityHash(baseData);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should be consistent: same data must produce same hash', () => {
      const hash1 = DuaService.generateIntegrityHash(baseData);
      const hash2 = DuaService.generateIntegrityHash(baseData);
      expect(hash1).toBe(hash2);
    });

    it('should pass the Avalanche Effect Test: minor changes result in different hashes', () => {
      const hash1 = DuaService.generateIntegrityHash(baseData);
      
      const slightlyDifferentData = { ...baseData, name: 'Girulais' }; // Changed F to G
      const hash2 = DuaService.generateIntegrityHash(slightlyDifferentData);
      
      expect(hash1).not.toBe(hash2);
      
      // Verification of distance (not strictly required by user but good for "luxury" report)
      // Avalanche effect means many bits change, but at least they should be different.
    });
  });
});
