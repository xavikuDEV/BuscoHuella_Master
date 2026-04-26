import { describe, it, expect, vi, beforeEach } from "vitest";
import { IncidentRepository } from "./IncidentRepository";

describe("IncidentRepository (Mapa de Alertas)", () => {
  let repository: IncidentRepository;

  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new IncidentRepository(mockSupabase);
  });

  it("debería registrar una incidencia correctamente", async () => {
    const mockIncident = {
      type: "poison",
      description: "Peligro en el parque",
    };
    mockSupabase.single.mockResolvedValue({
      data: { id: "123", ...mockIncident },
      error: null,
    });

    const { data, error } = await repository.create(mockIncident);

    expect(error).toBeNull();
    expect(data.id).toBe("123");
    expect(mockSupabase.from).toHaveBeenCalledWith("incidences");
  });

  it("debería recuperar solo incidencias abiertas para el mapa", async () => {
    mockSupabase.order.mockResolvedValue({ data: [], error: null });

    await repository.fetchActive();

    expect(mockSupabase.eq).toHaveBeenCalledWith("status", "open");
    expect(mockSupabase.from).toHaveBeenCalledWith("incidences");
  });
});
