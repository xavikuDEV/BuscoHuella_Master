/**
 * 🧪 Component Tests: LiveMap
 * Verifica que el componente carga correctamente a pesar del dynamic import.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// ── Mock de next/dynamic ─────────────────────────────────────────
// Simulamos que el dynamic import muestra el loading fallback,
// ya que jsdom no soporta Leaflet/Canvas/WebGL.
vi.mock("next/dynamic", () => ({
  default: (
    _importFn: () => Promise<any>,
    options?: { loading?: () => React.ReactNode },
  ) => {
    // Return a component that renders the loading fallback
    const DynamicMock = (props: any) => {
      if (options?.loading) {
        return options.loading();
      }
      return React.createElement("div", { "data-testid": "map-inner-mock" });
    };
    DynamicMock.displayName = "DynamicMock";
    return DynamicMock;
  },
}));

// ── Mock de leaflet CSS import ───────────────────────────────────
vi.mock("leaflet/dist/leaflet.css", () => ({}));

// ── Import del componente ────────────────────────────────────────
import LiveMap from "@/components/dashboard/home/LiveMap";

describe("LiveMap", () => {
  it('muestra el estado de carga "Sincronizando Radar..." inicialmente', () => {
    render(<LiveMap pets={[]} incidents={[]} sector="SBD-08" />);

    expect(screen.getByText("Sincronizando Radar...")).toBeInTheDocument();
  });

  it("renderiza la información táctica del sector", () => {
    render(<LiveMap pets={[]} incidents={[]} sector="SBD-08" />);

    expect(screen.getByText("Sabadell_Grid_Radar")).toBeInTheDocument();
    expect(screen.getByText("SBD-08")).toBeInTheDocument();
  });

  it("muestra el conteo correcto de activos en la red", () => {
    const pets = [
      { id: "1", name: "Rex", lat: 41.55, lng: 2.11 },
      { id: "2", name: "Luna", lat: 41.54, lng: 2.10 },
    ];
    const incidents = [
      { id: "i1", message: "Test", urgency: "HIGH", lat: 41.55, lng: 2.10 },
    ];

    render(<LiveMap pets={pets} incidents={incidents} sector="ALL" />);

    // pets.length + incidents.length = 3
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("muestra 0 cuando no hay activos ni incidentes", () => {
    render(<LiveMap pets={[]} incidents={[]} sector="ALL" />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
