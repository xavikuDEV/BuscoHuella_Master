/**
 * 🧪 Unit Tests: incidentUtils
 * Prueba las funciones de utilidad extraídas de IncidentReport.tsx.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import {
  formatRelative,
  urgencyStyles,
  getTypeConfig,
} from "../../lib/incidentUtils";

// ============================================================
// 🕐 formatRelative
// ============================================================
describe("formatRelative", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('retorna "ahora mismo" para diferencias menores a 60 segundos', () => {
    vi.useFakeTimers();
    const now = new Date("2026-03-22T20:00:00Z");
    vi.setSystemTime(now);

    const thirtySecondsAgo = new Date("2026-03-22T19:59:30Z");
    expect(formatRelative(thirtySecondsAgo)).toBe("ahora mismo");
  });

  it('retorna "hace Xm" para diferencias entre 1 y 59 minutos', () => {
    vi.useFakeTimers();
    const now = new Date("2026-03-22T20:00:00Z");
    vi.setSystemTime(now);

    const fiveMinutesAgo = new Date("2026-03-22T19:55:00Z");
    expect(formatRelative(fiveMinutesAgo)).toBe("hace 5m");
  });

  it('retorna "hace Xh" para diferencias entre 1 y 23 horas', () => {
    vi.useFakeTimers();
    const now = new Date("2026-03-22T20:00:00Z");
    vi.setSystemTime(now);

    const threeHoursAgo = new Date("2026-03-22T17:00:00Z");
    expect(formatRelative(threeHoursAgo)).toBe("hace 3h");
  });

  it("retorna fecha localizada para diferencias mayores a 24 horas", () => {
    vi.useFakeTimers();
    const now = new Date("2026-03-22T20:00:00Z");
    vi.setSystemTime(now);

    const twoDaysAgo = new Date("2026-03-20T12:00:00Z");
    const result = formatRelative(twoDaysAgo);
    // El resultado depende del locale del sistema, pero debe ser una fecha
    expect(result).not.toBe("ahora mismo");
    expect(result).not.toContain("hace");
  });
});

// ============================================================
// 🎨 urgencyStyles
// ============================================================
describe("urgencyStyles", () => {
  it("CRITICAL contiene border-rose-500", () => {
    expect(urgencyStyles.CRITICAL).toContain("border-rose-500");
  });

  it("CRITICAL contiene bg-rose-500/10", () => {
    expect(urgencyStyles.CRITICAL).toContain("bg-rose-500/10");
  });

  it("HIGH contiene border-orange-500/50", () => {
    expect(urgencyStyles.HIGH).toContain("border-orange-500/50");
  });

  it("MEDIUM contiene border-amber-500/40", () => {
    expect(urgencyStyles.MEDIUM).toContain("border-amber-500/40");
  });

  it("LOW contiene border-slate-700", () => {
    expect(urgencyStyles.LOW).toContain("border-slate-700");
  });

  it("retorna undefined para urgencias desconocidas", () => {
    expect(urgencyStyles["UNKNOWN"]).toBeUndefined();
  });
});

// ============================================================
// 🏷️ getTypeConfig
// ============================================================
describe("getTypeConfig", () => {
  it('LOST retorna {icon: "🔍", label: "PÉRDIDA", color: "text-rose-400"}', () => {
    const config = getTypeConfig("LOST");
    expect(config.icon).toBe("🔍");
    expect(config.label).toBe("PÉRDIDA");
    expect(config.color).toBe("text-rose-400");
  });

  it('FOUND retorna {icon: "🐾", label: "AVISTADO", color: "text-cyan-400"}', () => {
    const config = getTypeConfig("FOUND");
    expect(config.icon).toBe("🐾");
    expect(config.label).toBe("AVISTADO");
    expect(config.color).toBe("text-cyan-400");
  });

  it('DANGER retorna {icon: "⚠️", label: "PELIGRO", color: "text-amber-500"}', () => {
    const config = getTypeConfig("DANGER");
    expect(config.icon).toBe("⚠️");
    expect(config.label).toBe("PELIGRO");
    expect(config.color).toBe("text-amber-500");
  });

  it('tipos desconocidos retornan el default {icon: "📋", label: "REPORTE"}', () => {
    const config = getTypeConfig("SOMETHING_ELSE");
    expect(config.icon).toBe("📋");
    expect(config.label).toBe("REPORTE");
    expect(config.color).toBe("text-slate-400");
  });
});
