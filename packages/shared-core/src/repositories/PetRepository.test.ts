import { describe, it, expect, vi, beforeEach } from "vitest";
import { PetRepository } from "./PetRepository";

describe("PetRepository (Protocolo de Blindaje)", () => {
  let repository: PetRepository;

  // 🎭 Mock ajustado a la implementación REAL de findAll
  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn(),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new PetRepository(mockSupabase);
  });

  it("debería recuperar todas las mascotas correctamente (findAll)", async () => {
    const mockData = [{ name: "Kratos", species: "Perro" }];

    // 🛡️ En tu código, la cadena termina en .select()
    // Así que .select() es el que debe devolver la Promesa
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: mockData,
        error: null,
      }),
    });

    const { data, error } = await repository.findAll();

    expect(error).toBeNull();
    expect(data).toEqual(mockData);
    expect(data).toHaveLength(1);
  });

  it("debería manejar errores de la base de datos", async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Error de Búnker" },
      }),
    });

    const { error } = await repository.findAll();

    expect(error).toBeDefined();
    expect(error?.message).toBe("Error de Búnker");
  });
});
