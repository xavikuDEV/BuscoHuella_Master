"use server";
import { revalidatePath } from "next/cache";

export async function deleteLogAction(id: string) {
  console.log("📡 Purgando log unitario:", id);
  revalidatePath("/", "layout");
}

export async function clearAllLogsAction() {
  console.log("🚨 Purgando feed completo de telemetría");
  revalidatePath("/", "layout");
}
