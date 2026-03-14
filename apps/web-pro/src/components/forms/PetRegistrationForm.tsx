"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  DuaService,
  PetSpecies,
  PetGender,
  UserProfile,
} from "@buscohuella/shared";
import { registerPetAction } from "@/app/[locale]/dashboard/admin/pets/actions";

const petSchema = z.object({
  name: z.string().min(2, "Nombre demasiado corto"),
  species: z.nativeEnum(PetSpecies),
  breed: z.string().min(2, "La raza es obligatoria"),
  gender: z.nativeEnum(PetGender),
  owner_id: z.string().uuid("Seleccione un dueño válido"),
});

type PetFormValues = z.infer<typeof petSchema>;

export default function PetRegistrationForm({
  owners,
}: {
  owners: UserProfile[];
}) {
  const [liveHash, setLiveHash] = useState("Esperando datos...");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ownerSearch, setOwnerSearch] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: { species: PetSpecies.DOG, gender: PetGender.MALE },
  });

  // 🔍 Filtrado inteligente de dueños
  const filteredOwners = useMemo(() => {
    return owners.filter(
      (o) =>
        o.full_name.toLowerCase().includes(ownerSearch.toLowerCase()) ||
        o.email.toLowerCase().includes(ownerSearch.toLowerCase()),
    );
  }, [owners, ownerSearch]);

  const watchedFields = watch();

  useEffect(() => {
    if (watchedFields.name && watchedFields.owner_id) {
      const hash = DuaService.generateIntegrityHash({
        name: watchedFields.name,
        species: watchedFields.species,
        microchip_id: "preview",
        owner_id: watchedFields.owner_id,
      });
      setLiveHash(hash);
    }
  }, [watchedFields]);

  const onSubmit = async (values: PetFormValues) => {
    setIsSubmitting(true);
    const result = await registerPetAction(values);
    if (result.success) {
      reset();
      setOwnerSearch("");
      alert("✅ Activo registrado con éxito");
    } else {
      alert("❌ Error RLS/Búnker: " + result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-slate-900/50 p-8 rounded-3xl border border-slate-800"
    >
      <div className="space-y-4">
        {/* Nombre y Raza */}
        <div className="grid grid-cols-2 gap-4">
          <input
            {...register("name")}
            placeholder="Nombre"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 outline-none"
          />
          <input
            {...register("breed")}
            placeholder="Raza"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 outline-none"
          />
        </div>

        {/* Especie Extendida */}
        <select
          {...register("species")}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none"
        >
          <option value={PetSpecies.DOG}>🐶 Perro</option>
          <option value={PetSpecies.CAT}>🐱 Gato</option>
          <option value={PetSpecies.BIRD}>🦜 Pájaro</option>
          <option value={PetSpecies.HAMSTER}>🐹 Hamster</option>
          <option value={PetSpecies.REPTILE}>🦎 Reptil</option>
          <option value={PetSpecies.OTHER}>✨ Otro</option>
        </select>

        {/* 🔍 Buscador de Dueños (Combobox Manual) */}
        <div className="relative space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-500">
            Buscar Dueño (Nodo Humano)
          </label>
          <input
            type="text"
            placeholder="Escriba nombre o email..."
            value={ownerSearch}
            onChange={(e) => setOwnerSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
          />
          {ownerSearch.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl max-h-40 overflow-y-auto shadow-2xl">
              {filteredOwners.map((o) => (
                <div
                  key={o.id}
                  onClick={() => {
                    setValue("owner_id", o.id);
                    setOwnerSearch(o.full_name);
                  }}
                  className="p-3 hover:bg-slate-800 cursor-pointer text-xs border-b border-slate-800 last:border-0"
                >
                  <p className="font-bold text-white">{o.full_name}</p>
                  <p className="text-slate-500 text-[9px]">{o.email}</p>
                </div>
              ))}
            </div>
          )}
          {errors.owner_id && (
            <p className="text-rose-500 text-[10px]">
              {errors.owner_id.message}
            </p>
          )}
        </div>
      </div>

      <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl">
        <p className="text-[9px] font-black text-cyan-500 uppercase mb-2">
          Hash de Integridad DUA
        </p>
        <p className="font-mono text-[9px] break-all text-slate-500">
          {liveHash}
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase text-xs rounded-2xl transition-all shadow-lg active:scale-95"
      >
        {isSubmitting ? "Cifrando..." : "Registrar en Búnker"}
      </button>
    </form>
  );
}
