"use server";

import { revalidatePath } from "next/cache";
import { PetRepository, PetSpecies, PetGender, Pet } from "@buscohuella/shared";
import { supabase } from "@/lib/supabase";

export async function registerPetAction(formData: {
  name: string;
  species: PetSpecies;
  breed: string;
  gender: PetGender;
  owner_id: string;
}) {
  const petRepo = new PetRepository(supabase);

  try {
    await petRepo.create({
      ...formData,
      is_sterilized: false,
      is_vaccinated: false,
    });

    revalidatePath("/[locale]/dashboard/admin/pets", "page");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePetAction(id: string) {
  const petRepo = new PetRepository(supabase);
  const { error } = await petRepo.delete(id);

  if (!error) {
    revalidatePath("/[locale]/dashboard/admin/pets", "page");
    return { success: true };
  }
  return { success: false, error: error.message };
}

export async function updatePetAction(id: string, data: Partial<Pet>) {
  const petRepo = new PetRepository(supabase);
  const { error } = await petRepo.update(id, data);

  if (!error) {
    revalidatePath("/[locale]/dashboard/admin/pets", "page");
    return { success: true };
  }
  return { success: false, error: error.message };
}
