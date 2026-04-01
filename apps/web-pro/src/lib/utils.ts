import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 🛠️ UTILIDAD DE CLASES (CN)
 * Combina clases de Tailwind de forma inteligente, evitando duplicados
 * y conflictos de prioridad. Vital para el Sidebar dinámico.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
