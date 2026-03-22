/**
 * 🧪 Unit Tests: Sector Filtering Logic
 * Prueba la lógica de filtrado por sector del Dashboard (page.tsx).
 *
 * La lógica real está en la server page. Aquí replicamos la lógica
 * y verificamos que el filtrado condicional funciona correctamente.
 */
import { describe, it, expect, vi } from "vitest";

/**
 * Simula la lógica de filtrado de sector del dashboard.
 * Extraída de apps/web-pro/src/app/[locale]/dashboard/admin/page.tsx
 */
function buildSectorFilter(sectorParam?: string) {
  const activeSector = sectorParam || "ALL";
  const isGlobal = activeSector === "ALL";

  // Simulate which Supabase .eq() calls would be made
  const filters: { table: string; column: string; value: string }[] = [];

  if (!isGlobal) {
    filters.push({ table: "pets", column: "sector", value: activeSector });
    filters.push({
      table: "profiles",
      column: "location_sector",
      value: activeSector,
    });
    filters.push({
      table: "incidents",
      column: "sector",
      value: activeSector,
    });
  }

  return { activeSector, isGlobal, filters };
}

describe("Dashboard Sector Filtering", () => {
  describe("Detección de modo global", () => {
    it('sector undefined -> activeSector = "ALL", isGlobal = true', () => {
      const result = buildSectorFilter(undefined);
      expect(result.activeSector).toBe("ALL");
      expect(result.isGlobal).toBe(true);
    });

    it('sector "ALL" -> isGlobal = true', () => {
      const result = buildSectorFilter("ALL");
      expect(result.isGlobal).toBe(true);
    });

    it('sector "SBD-08" -> isGlobal = false', () => {
      const result = buildSectorFilter("SBD-08");
      expect(result.isGlobal).toBe(false);
    });

    it('sector "SBD-01" -> isGlobal = false', () => {
      const result = buildSectorFilter("SBD-01");
      expect(result.isGlobal).toBe(false);
    });
  });

  describe("Filtros aplicados", () => {
    it("modo global no aplica filtros .eq()", () => {
      const result = buildSectorFilter("ALL");
      expect(result.filters).toHaveLength(0);
    });

    it("sector específico aplica 3 filtros (pets, profiles, incidents)", () => {
      const result = buildSectorFilter("SBD-08");
      expect(result.filters).toHaveLength(3);
    });

    it("filtro de pets usa columna 'sector'", () => {
      const result = buildSectorFilter("SBD-08");
      const petFilter = result.filters.find((f) => f.table === "pets");
      expect(petFilter).toBeDefined();
      expect(petFilter!.column).toBe("sector");
      expect(petFilter!.value).toBe("SBD-08");
    });

    it("filtro de profiles usa columna 'location_sector'", () => {
      const result = buildSectorFilter("SBD-05");
      const profileFilter = result.filters.find(
        (f) => f.table === "profiles",
      );
      expect(profileFilter).toBeDefined();
      expect(profileFilter!.column).toBe("location_sector");
      expect(profileFilter!.value).toBe("SBD-05");
    });

    it("filtro de incidents usa columna 'sector'", () => {
      const result = buildSectorFilter("SBD-01");
      const incidentFilter = result.filters.find(
        (f) => f.table === "incidents",
      );
      expect(incidentFilter).toBeDefined();
      expect(incidentFilter!.column).toBe("sector");
      expect(incidentFilter!.value).toBe("SBD-01");
    });
  });
});
