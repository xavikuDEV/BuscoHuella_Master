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

// Definimos una interfaz para el formulario que incluya explícitamente los campos nuevos
interface RegisterPetFormData extends Partial<Pet> {
  name: string;
  species: PetSpecies;
  gender: PetGender;
  owner_id: string;
  is_mixed: boolean; // Lo forzamos aquí para que no de error
}

export async function registerPetAction(formData: RegisterPetFormData) {
  const supabase = await createClient();
  const petRepo = new PetRepository(supabase);

  try {
    // 🛡️ Limpiamos y preparamos los datos
    // No repetimos campos, simplemente extendemos con los valores por defecto
    const petToCreate = {
      ...formData,
      status: PetStatus.ACTIVE,
      is_sterilized: formData.is_sterilized ?? false,
      is_vaccinated: formData.is_vaccinated ?? false,
      is_mixed: formData.is_mixed ?? false,
    };

    await petRepo.create(petToCreate as any);

    revalidatePath("/[locale]/dashboard/admin/pets", "page");
    return { success: true };
  } catch (error: any) {
    console.error("Error en registro:", error);
    return { success: false, error: error.message };
  }
}

export async function updatePetAction(id: string, data: Partial<Pet>) {
  const supabase = await createClient();
  const petRepo = new PetRepository(supabase);

  try {
    const { data: updated, error } = await petRepo.update(id, data);
    if (error) return { success: false, error: error.message };

    revalidatePath("/[locale]/dashboard/admin/pets", "page");
    revalidatePath("/[locale]/dashboard/admin", "layout");
    return { success: true, data: updated };
  } catch (e: any) {
    return { success: false, error: "Error en la secuencia de actualización" };
  }
}

export async function deletePetAction(id: string) {
  const supabase = await createClient();
  const petRepo = new PetRepository(supabase);
  const { error } = await petRepo.delete(id);

  if (!error) {
    revalidatePath("/[locale]/dashboard/admin/pets", "page");
    return { success: true };
  }
  return { success: false, error: error.message };
}

export async function updatePetStatusAction(id: string, status: PetStatus) {
  const supabase = await createClient();
  const petRepo = new PetRepository(supabase);

  const { error } = await petRepo.update(id, { status });
  if (!error) {
    revalidatePath("/", "layout");
    revalidatePath("/[locale]/dashboard/admin/pets", "page");
  }
  return { success: !error, error: error?.message };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // Forzamos la redirección al login
  redirect("/login");
}
