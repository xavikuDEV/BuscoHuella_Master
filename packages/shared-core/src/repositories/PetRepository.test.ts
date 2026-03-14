import { describe, it, expect, vi, beforeEach } from "vitest";
import { PetRepository } from "./PetRepository";

describe("PetRepository (Protocolo de Blindaje)", () => {
  let repository: PetRepository;

  // 🎭 Mock avanzado: Soporta .from().select().order().eq().single()
  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new PetRepository(mockSupabase);
  });

  it("debería recuperar todas las mascotas correctamente (findAll)", async () => {
    const mockData = [{ name: "Kratos", species: "dog" }];

    // Configuramos el final de la cadena (.order) para que devuelva la promesa resuelta
    mockSupabase.order.mockResolvedValue({
      data: mockData,
      error: null,
    });

    const { data, error } = await repository.findAll();

    expect(error).toBeNull();
    expect(data).toEqual(mockData);
    expect(mockSupabase.from).toHaveBeenCalledWith("pets");
    expect(mockSupabase.select).toHaveBeenCalledWith("*");
    expect(mockSupabase.order).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
  });

  it("debería manejar errores de la base de datos en findAll", async () => {
    mockSupabase.order.mockResolvedValue({
      data: null,
      error: { message: "Error de Búnker" },
    });

    const { error } = await repository.findAll();

    expect(error).toBeDefined();
    expect(error?.message).toBe("Error de Búnker");
  });
});