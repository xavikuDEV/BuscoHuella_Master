/**
 * 🧪 Component Tests: IncidentReport
 * Verifica que renderiza los mensajes reales y aplica las clases de urgencia.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// ── Mock de Next.js modules ──────────────────────────────────────
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => React.createElement("a", { href }, children),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/es/dashboard/admin",
}));

// ── Mock del modal (aislamos IncidentReport) ─────────────────────
vi.mock(
  "@/components/dashboard/home/NewIncidentModal",
  () => ({
    default: () =>
      React.createElement("div", { "data-testid": "mock-modal" }),
  }),
);

// ── Import del componente bajo test ──────────────────────────────
import IncidentReport from "@/components/dashboard/home/IncidentReport";

// ── Fixtures ─────────────────────────────────────────────────────
const mockIncidents = [
  {
    id: "abc123def456",
    message: "Kratos Alpha avistado sin supervisión en Parque Central",
    urgency: "CRITICAL",
    type: "LOST",
    sector: "SBD-08",
    created_at: new Date().toISOString(),
  },
  {
    id: "def789ghi012",
    message: "Gato siamés encontrado en buen estado",
    urgency: "HIGH",
    type: "FOUND",
    sector: "SBD-01",
    created_at: new Date().toISOString(),
  },
  {
    id: "ghi345jkl678",
    message: "Zona de riesgo detectada en vertedero",
    urgency: "MEDIUM",
    type: "DANGER",
    sector: "SBD-05",
    created_at: new Date().toISOString(),
  },
];

describe("IncidentReport", () => {
  it("renderiza los mensajes reales de cada incidente", () => {
    render(
      <IncidentReport sector="SBD-08" initialIncidents={mockIncidents} />,
    );

    expect(
      screen.getByText(
        "Kratos Alpha avistado sin supervisión en Parque Central",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Gato siamés encontrado en buen estado"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Zona de riesgo detectada en vertedero"),
    ).toBeInTheDocument();
  });

  it("aplica border-rose-500 para urgencia CRITICAL", () => {
    const { container } = render(
      <IncidentReport
        sector="SBD-08"
        initialIncidents={[mockIncidents[0]]}
      />,
    );
    const incidentRow = container.querySelector(".border-rose-500");
    expect(incidentRow).toBeInTheDocument();
  });

  it("aplica border-orange-500\\/50 para urgencia HIGH", () => {
    const { container } = render(
      <IncidentReport
        sector="SBD-01"
        initialIncidents={[mockIncidents[1]]}
      />,
    );
    const incidentRow = container.querySelector('[class*="border-orange-500"]');
    expect(incidentRow).toBeInTheDocument();
  });

  it('muestra estado vacío "Sin_Alertas_Detectadas" cuando no hay incidentes', () => {
    render(<IncidentReport sector="ALL" initialIncidents={[]} />);
    expect(
      screen.getByText(/Sin_Alertas_Detectadas/),
    ).toBeInTheDocument();
  });

  it('renderiza el botón "Emitir Alerta"', () => {
    render(<IncidentReport sector="ALL" initialIncidents={[]} />);
    expect(screen.getByText("Emitir Alerta")).toBeInTheDocument();
  });

  it("muestra el sector en la etiqueta de frecuencia", () => {
    render(
      <IncidentReport sector="SBD-08" initialIncidents={[]} />,
    );
    expect(screen.getByText("SBD-08")).toBeInTheDocument();
  });
});
