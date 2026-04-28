"use server";
import { revalidatePath } from "next/cache";

export async function deleteLogAction(id: string) {
  console.log("📡 Purgando log unitario:", id);
  revalidatePath("/", "layout");
}

export async function purgeLogsAction() {
  console.log("🚨 Purgando feed completo de telemetría");
  revalidatePath("/", "layout");
}

export async function logSystemEvent(
  {
    level,
    module,
    message,
    details,
  }: {
    level: string;
    module: string;
    message: string;
    details?: any;
  },
  revalidate: boolean = true
) {
  console.log(`[${level}] [${module}]: ${message}`, details ? details : "");
  if (revalidate) {
    revalidatePath("/", "layout");
  }
}
