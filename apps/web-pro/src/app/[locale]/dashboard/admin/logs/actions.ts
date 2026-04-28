"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * 🛰️ PROTOCOLO DE RUTA
 * Definimos el punto de sincronización para la caché de Next.js
 */
const LOGS_PATH = "/[locale]/dashboard/admin/logs";

/**
 * 🛡️ ESCRITURA SEGURA EN CAJA NEGRA (system_logs)
 * Registra eventos de telemetría con contexto opcional.
 * @param shouldRevalidate - Evita errores de renderizado si se llama desde un Server Component.
 */
export async function logSystemEvent(
  data: {
    level: "INFO" | "WARN" | "ERROR" | "CRITICAL";
    module: string;
    message: string;
    context?: any;
    status?: string;
  },
  shouldRevalidate = false,
) {
  const supabase = await createClient();

  // Obtenemos el usuario de la sesión actual para trazabilidad
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    const { error } = await supabase.from("system_logs").insert({
      level: data.level,
      module: data.module,
      message: data.message,
      status: data.status || "open",
      context: data.context ? JSON.stringify(data.context) : null,
      user_id: user?.id,
    });

    if (error) throw error;

    // Sincronizamos la vista de logs solo si es una acción de usuario (no en render)
    if (shouldRevalidate) {
      revalidatePath(LOGS_PATH, "page");
    }

    return { success: true };
  } catch (err) {
    console.error("🚨 Fallo crítico al escribir en Caja Negra:", err);
    return { success: false };
  }
}

/**
 * 🗑️ ELIMINAR EVENTO ÚNICO
 * Permite purgar una entrada específica de la telemetría.
 */
export async function deleteLogAction(logId: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("system_logs")
      .delete()
      .eq("id", logId);

    if (error) throw error;

    revalidatePath(LOGS_PATH, "page");
    return { success: true };
  } catch (err: any) {
    console.error("❌ Fallo al eliminar log:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 🧹 PURGA TOTAL (Mantenimiento)
 * Elimina todos los registros excepto los de nivel CRITICAL para auditoría legal.
 */
export async function clearAllLogsAction() {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("system_logs")
      .delete()
      .neq("level", "CRITICAL"); // 🛡️ Seguridad forense: no borramos lo crítico

    if (error) throw error;

    revalidatePath(LOGS_PATH, "page");
    return { success: true };
  } catch (err: any) {
    console.error("❌ Fallo en purga masiva:", err.message);
    return { success: false, error: err.message };
  }
}
