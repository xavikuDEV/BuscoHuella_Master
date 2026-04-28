"use server";

import { revalidatePath } from "next/cache";
import {
  PetRepository,
  PetSpecies,
  PetGender,
  PetStatus,
  Pet,
} from "@buscohuella/shared";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Protocolo de ruta para sincronización
const PETS_PATH = "/[locale]/dashboard/admin/pets";

interface RegisterPetFormData extends Partial<Pet> {
  name: string;
  species: PetSpecies;
  gender: PetGender;
  owner_id: string;
  is_mixed: boolean;
}

/**
 * ⚡ REGISTRO GÉNESIS (Crear Mascota)
 */
export async function registerPetAction(formData: RegisterPetFormData) {
  const supabase = await createClient();
  const petRepo = new PetRepository(supabase);

  try {
    // 🕵️ DEBUG: Verificamos qué ID llega del formulario
    console.log(
      "📡 Intentando registrar mascota para Owner ID:",
      formData.owner_id,
    );

    if (!formData.owner_id) {
      throw new Error("El ID del dueño es nulo o inválido.");
    }

    // 🛡️ Preparamos los datos para la inserción
    const petToCreate = {
      ...formData,
      status: PetStatus.ACTIVE,
      is_sterilized: formData.is_sterilized ?? false,
      is_vaccinated: formData.is_vaccinated ?? false,
      is_mixed: formData.is_mixed ?? false,
      created_at: new Date().toISOString(),
    };

    // Esto es lo que falla porque el ID de owner no coincide
    await petRepo.create(petToCreate as any);

    revalidatePath("/[locale]/dashboard/admin/pets", "page");
    return { success: true };
  } catch (error: any) {
    // 💡 Aquí capturamos el error exacto
    console.error("❌ ERROR CRÍTICO EN DUA:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * ✏️ ACTUALIZAR ACTIVO ANIMAL
 */
export async function updatePetAction(id: string, data: Partial<Pet>) {
  const supabase = await createClient();
  const petRepo = new PetRepository(supabase);

  try {
    const { data: updated, error } = await petRepo.update(id, data);
    if (error) throw error;

    revalidatePath(PETS_PATH, "page");
    return { success: true, data: updated };
  } catch (e: any) {
    console.error("❌ Error en actualización:", e.message);
    return { success: false, error: e.message };
  }
}

/**
 * 🗑️ DAR DE BAJA ACTIVO
 */
export async function deletePetAction(id: string) {
  const supabase = await createClient();
  const petRepo = new PetRepository(supabase);

  try {
    const { error } = await petRepo.delete(id);
    if (error) throw error;

    revalidatePath(PETS_PATH, "page");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * 🚪 TERMINAR TURNO (Logout)
 * Corregido para usar el locale y evitar errores de navegación
 */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // 🌐 Sincronización con el portal de idioma
  revalidatePath("/", "layout");
  redirect("/es/login");
}

/**
 * 💉 REGISTRAR EVENTO MÉDICO
 */
export async function addPetHealthRecordAction(petId: string, data: {
  event_type: string;
  title: string;
  description: string;
  performed_at: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("pet_health_logs")
    .insert([{ ...data, pet_id: petId }]);

  if (!error) {
    revalidatePath("/[locale]/dashboard/admin/pets/[id]", "page");
    return { success: true };
  }
  return { success: false, error: error.message };
}