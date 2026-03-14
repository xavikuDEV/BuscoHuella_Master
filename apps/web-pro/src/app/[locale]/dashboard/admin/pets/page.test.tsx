import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PetsAdminPage from "./page";

// 🎭 Mock de los componentes y repositorio
vi.mock("@buscohuella/shared", () => ({
  PetRepository: vi.fn().mockImplementation(() => ({
    findAll: vi.fn().mockResolvedValue({
      data: [
        {
          id: "1",
          name: "Kratos",
          species: "Perro",
          dua_id: "BH-001",
          breed: "Husky",
        },
      ],
      error: null,
    }),
  })),
  UserRole: { ADMIN: "ADMIN" },
}));

vi.mock("@/lib/supabase", () => ({ supabase: {} }));
vi.mock("@/components/layouts/AdminLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("PetsAdminPage (UI Verification)", () => {
  it("debería mostrar el título de gestión y el nombre de la mascota", async () => {
    // Nota: Como es un Server Component async, en Vitest lo tratamos como una promesa
    const Page = await PetsAdminPage();
    render(Page);

    expect(screen.getByText(/Gestión de Activos Animales/i)).toBeDefined();
    expect(screen.getByText("Kratos")).toBeDefined();
    expect(screen.getByText("BH-001")).toBeDefined();
  });
});
