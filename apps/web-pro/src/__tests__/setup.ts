import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Limpieza tras cada test
afterEach(() => {
  cleanup();
});

// Mock de Next.js (Vital para evitar el error de Hooks en navegación)
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

// Mock de Leaflet (Para que el mapa no rompa el entorno JSDOM)
vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: any) => children,
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
}));
