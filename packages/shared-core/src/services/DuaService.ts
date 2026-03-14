import { createHash, randomBytes } from 'node:crypto';

export class DuaService {
  /**
   * Generates a unique DUA ID with format BH-2026-XXXX
   * XXXX is a 4-character random hexadecimal string.
   */
  static generateDuaId(): string {
    const randomPart = randomBytes(2).toString('hex').toUpperCase();
    return `BH-2026-${randomPart}`;
  }

  /**
   * Generates a SHA-256 integrity hash for a pet's data.
   * Ensures the digital identity is immutable and verifiable.
   */
  static generateIntegrityHash(data: any): string {
    const normalizedData = JSON.stringify(data, Object.keys(data).sort());
    return createHash('sha256').update(normalizedData).digest('hex');
  }
}
