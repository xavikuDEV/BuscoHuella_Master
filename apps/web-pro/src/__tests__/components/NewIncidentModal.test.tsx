/**
 * 🧪 Component Tests: NewIncidentModal
 * Simula la apertura del modal, escritura y llamada a la acción de Supabase.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

// ── Mock del server action ───────────────────────────────────────
const mockCreateIncidentAction = vi.fn();
vi.mock(
  "@/app/[locale]/dashboard/admin/incidents/actions",
  () => ({
    createIncidentAction: (...args: unknown[]) =>
      mockCreateIncidentAction(...args),
  }),
);

// ── Import del componente ────────────────────────────────────────
import NewIncidentModal from "@/components/dashboard/home/NewIncidentModal";

describe("NewIncidentModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("no renderiza nada cuando isOpen=false", () => {
    const { container } = render(
      <NewIncidentModal
        isOpen={false}
        onClose={mockOnClose}
        currentSector="SBD-08"
      />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renderiza el formulario cuando isOpen=true", () => {
    render(
      <NewIncidentModal
        isOpen={true}
        onClose={mockOnClose}
        currentSector="SBD-08"
      />,
    );
    expect(screen.getByText("Alerta Táctica")).toBeInTheDocument();
    expect(screen.getByText("Confirmar Alerta")).toBeInTheDocument();
  });

  it("el usuario puede escribir en el textarea", () => {
    render(
      <NewIncidentModal
        isOpen={true}
        onClose={mockOnClose}
        currentSector="SBD-08"
      />,
    );
    const textarea = screen.getByPlaceholderText(
      /Kratos Alpha avistado/,
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, {
      target: { value: "Perro perdido en zona norte" },
    });
    expect(textarea.value).toBe("Perro perdido en zona norte");
  });

  it("llama a createIncidentAction al enviar y cierra el modal en éxito", async () => {
    mockCreateIncidentAction.mockResolvedValueOnce({ success: true });

    render(
      <NewIncidentModal
        isOpen={true}
        onClose={mockOnClose}
        currentSector="SBD-08"
      />,
    );

    const textarea = screen.getByPlaceholderText(/Kratos Alpha/);
    fireEvent.change(textarea, { target: { value: "Test incident report" } });

    const submitBtn = screen.getByText("Confirmar Alerta");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockCreateIncidentAction).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('muestra "Sincronizando..." mientras se envía', async () => {
    // Delay the resolution to keep loading state visible
    mockCreateIncidentAction.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 500),
        ),
    );

    render(
      <NewIncidentModal
        isOpen={true}
        onClose={mockOnClose}
        currentSector="SBD-08"
      />,
    );

    const textarea = screen.getByPlaceholderText(/Kratos Alpha/);
    fireEvent.change(textarea, { target: { value: "Test message" } });

    const submitBtn = screen.getByText("Confirmar Alerta");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Sincronizando...")).toBeInTheDocument();
    });
  });

  it("muestra alerta en caso de error", async () => {
    mockCreateIncidentAction.mockResolvedValueOnce({
      success: false,
      error: "Conexión perdida",
    });

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <NewIncidentModal
        isOpen={true}
        onClose={mockOnClose}
        currentSector="SBD-08"
      />,
    );

    const textarea = screen.getByPlaceholderText(/Kratos Alpha/);
    fireEvent.change(textarea, { target: { value: "Test message" } });

    const submitBtn = screen.getByText("Confirmar Alerta");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Error en la transmisión: Conexión perdida",
      );
    });

    alertSpy.mockRestore();
  });

  it("el botón Abortar ejecuta onClose", () => {
    render(
      <NewIncidentModal
        isOpen={true}
        onClose={mockOnClose}
        currentSector="SBD-08"
      />,
    );

    const abortBtn = screen.getByText("Abortar");
    fireEvent.click(abortBtn);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
