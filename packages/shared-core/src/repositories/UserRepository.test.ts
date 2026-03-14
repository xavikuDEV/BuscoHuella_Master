import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserRepository } from "./UserRepository";
import { UserRole } from "../models/user.js";

describe("UserRepository (Protocolo de Identidad)", () => {
  let repository: UserRepository;

  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn(),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new UserRepository(mockSupabase);
  });

  it("debería listar todos los perfiles de usuario", async () => {
    const mockUsers = [
      { id: "1", full_name: "Archon Root", role: UserRole.ADMIN },
    ];

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockUsers, error: null }),
    });

    const { data, error } = await repository.findAll();

    expect(error).toBeNull();
    expect(data[0].full_name).toBe("Archon Root");
    expect(data).toHaveLength(1);
  });

  it("debería capturar errores de acceso a la tabla de perfiles", async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi
        .fn()
        .mockResolvedValue({
          data: null,
          error: { message: "Acceso denegado" },
        }),
    });

    const { error } = await repository.findAll();
    expect(error?.message).toBe("Acceso denegado");
  });
});
