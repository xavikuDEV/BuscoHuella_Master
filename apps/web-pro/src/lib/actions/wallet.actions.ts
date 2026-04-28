"use server";

import { createClient as createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * 💰 Server Action para recompensar con $HUE a un usuario.
 * Registra la auditoría y actualiza el saldo.
 */
export async function awardHueAction(
  userId: string,
  amount: number,
  reason: string,
  validatorId: string
) {
  console.log(`📡 Recompensas: Otorgando ${amount} $HUE al usuario ${userId}`);
  const supabase = await createServerClient();

  try {
    // 1️⃣ Verificar rango del validador
    const { data: validator, error: valError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", validatorId)
      .single();

    if (valError || !validator) {
      return { success: false, error: "No se pudo identificar al validador en el censo." };
    }

    const superiorRoles = ["police", "vet", "admin", "gov_municipality", "gov_regional", "gov_national"];
    if (!superiorRoles.includes(validator.role)) {
      return {
        success: false,
        error: "El validador no cuenta con rango superior o profesional (Police/Vet/Admin/Gov).",
      };
    }

    // 2️⃣ Registrar transacción en el motor de auditoría
    const { error: txError } = await supabase
      .from("hue_transactions")
      .insert([
        {
          user_id: userId,
          amount,
          reason,
          validator_id: validatorId,
        },
      ]);

    if (txError) throw txError;

    // 3️⃣ Incrementar saldo del usuario en profiles
    const { data: profile, error: profError } = await supabase
      .from("profiles")
      .select("balance_hue")
      .eq("id", userId)
      .single();

    if (profError) throw profError;

    const currentBalance = Number(profile?.balance_hue || 0);
    const newBalance = currentBalance + amount;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ balance_hue: newBalance })
      .eq("id", userId);

    if (updateError) throw updateError;

    // 🔄 Revalidar Layouts y Vistas
    revalidatePath("/", "layout");

    return {
      success: true,
      message: `Operación completada. ${amount} $HUE abonados a la DUA del ciudadano.`,
    };
  } catch (error: any) {
    console.error("❌ Fallo crítico en awardHueAction:", error.message);
    return { success: false, error: error.message };
  }
}
