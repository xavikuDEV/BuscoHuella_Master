/**
 * 🛠️ Utilidades de Incidentes — Extraídas para testabilidad.
 * Contiene: formatRelative, urgencyStyles, getTypeConfig.
 */

/** Formatea una fecha en relativo (ahora, hace Xm, hace Xh). */
export function formatRelative(date: Date): string {
  const diff = (new Date().getTime() - date.getTime()) / 1000;
  if (diff < 60) return "ahora mismo";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return date.toLocaleDateString();
}

/** Mapa de clases Tailwind según nivel de urgencia. */
export const urgencyStyles: Record<string, string> = {
  CRITICAL:
    "border-rose-500 bg-rose-500/10 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
  HIGH: "border-orange-500/50 bg-orange-500/5 text-orange-500",
  MEDIUM: "border-amber-500/40 bg-amber-500/5 text-amber-400",
  LOW: "border-slate-700 bg-slate-800/30 text-slate-400",
};

/** Retorna icono, label y color para un tipo de incidente. */
export function getTypeConfig(type: string) {
  switch (type) {
    case "LOST":
      return { icon: "🔍", label: "PÉRDIDA", color: "text-rose-400" };
    case "FOUND":
      return { icon: "🐾", label: "AVISTADO", color: "text-cyan-400" };
    case "DANGER":
      return { icon: "⚠️", label: "PELIGRO", color: "text-amber-500" };
    default:
      return { icon: "📋", label: "REPORTE", color: "text-slate-400" };
  }
}
