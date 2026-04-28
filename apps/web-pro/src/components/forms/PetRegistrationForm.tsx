"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  DuaService,
  PetSpecies,
  PetGender,
  PetStatus,
  UserProfile,
  Pet,
} from "@buscohuella/shared";
import {
  registerPetAction,
  updatePetAction,
} from "@/lib/actions/pets.actions";

// 🛡️ Esquema con validación de obligatorios
const petSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  species: z.nativeEnum(PetSpecies),
  gender: z.nativeEnum(PetGender),
  owner_id: z.string().uuid("Debes asignar un dueño"),
  // Campos opcionales (Ficha Pro)
  breed: z.string().optional(),
  chip_number: z.string().optional(),
  birth_date: z.string().optional(),
  pathologies: z.string().optional(),
});

type PetFormValues = z.infer<typeof petSchema>;

export default function PetRegistrationForm({
  owners,
  petToEdit,
  onCancel,
}: {
  owners: UserProfile[];
  petToEdit?: Pet | null;
  onCancel: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProFields, setShowProFields] = useState(false);
  const [ownerSearch, setOwnerSearch] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: { species: PetSpecies.DOG, gender: PetGender.MALE },
  });

  useEffect(() => {
    if (petToEdit) {
      // 🛡️ Casteamos temporalmente a 'any' para evitar que TS bloquee
      // si el paquete compartido aún no se ha refrescado
      const p = petToEdit as any;

      reset({
        name: p.name,
        species: p.species as PetSpecies,
        gender: p.gender as PetGender,
        owner_id: p.owner_id,
        breed: p.breed || "",
        chip_number: p.chip_number || "", // 👈 Ya no dará error
        pathologies: p.pathologies || "", // 👈 Ya no dará error
      });

      const owner = owners.find((o) => o.id === p.owner_id);
      setOwnerSearch(owner?.display_name || owner?.email || "");
      setShowProFields(true);
    }
  }, [petToEdit, reset, owners]);

  const filteredOwners = useMemo(() => {
    return owners.filter(
      (o) =>
        (o.display_name || "").toLowerCase().includes(ownerSearch.toLowerCase()) ||
        o.email.toLowerCase().includes(ownerSearch.toLowerCase()),
    );
  }, [owners, ownerSearch]);

  const onSubmit = async (values: PetFormValues) => {
    setIsSubmitting(true);
    const result = petToEdit
      ? await updatePetAction(petToEdit.id, values)
      : await registerPetAction(values as any);
    if (result.success) {
      onCancel();
      alert("✅ Datos sincronizados con el búnker");
    } else {
      alert("❌ Error: " + result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* 🟢 SECCIÓN 1: DATOS ESENCIALES */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
          <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
            Protocolo Esencial
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <input
              {...register("name")}
              placeholder="Nombre del animal"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 outline-none"
            />
            {errors.name && (
              <p className="text-[10px] text-rose-500 ml-2">
                {errors.name.message}
              </p>
            )}
          </div>

          <select
            {...register("species")}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none"
          >
            {Object.values(PetSpecies).map((s) => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="relative space-y-2">
          <input
            type="text"
            placeholder="Buscar Dueño..."
            value={ownerSearch}
            onChange={(e) => setOwnerSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
          />
          {ownerSearch && filteredOwners.length > 0 && !petToEdit && (
            <div className="absolute z-30 w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl max-h-40 overflow-y-auto">
              {filteredOwners.map((o) => (
                <div
                  key={o.id}
                  onClick={() => {
                    setValue("owner_id", o.id);
                    setOwnerSearch(o.display_name || o.email);
                  }}
                  className="p-3 hover:bg-slate-800 cursor-pointer text-xs border-b border-slate-800 last:border-0"
                >
                  <p className="font-bold text-white">
                    {o.display_name || "Sin nombre"}
                  </p>
                  <p className="text-slate-500 text-[9px]">{o.email}</p>
                </div>
              ))}
            </div>
          )}
          {errors.owner_id && (
            <p className="text-[10px] text-rose-500 ml-2">
              {errors.owner_id.message}
            </p>
          )}
        </div>
      </div>

      {/* 🟠 SECCIÓN 2: FICHA PRO (Opcional) */}
      <div className="pt-4 border-t border-slate-800/50">
        <button
          type="button"
          onClick={() => setShowProFields(!showProFields)}
          className="text-[10px] font-black uppercase text-slate-400 hover:text-cyan-400 flex items-center gap-2 mb-4"
        >
          {showProFields
            ? "🔽 Ocultar Ficha Pro"
            : "▶️ Añadir más detalles (Chip, Salud, Linaje...)"}
        </button>

        {showProFields && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
            <input
              {...register("chip_number")}
              placeholder="Número de Microchip"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
            <input
              {...register("breed")}
              placeholder="Raza específica"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
            <textarea
              {...register("pathologies")}
              placeholder="Notas médicas o patologías..."
              className="col-span-2 w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500 min-h-[100px]"
            />
          </div>
        )}
      </div>

      {/* 🔘 ACCIONES */}
      <div className="flex gap-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 bg-slate-800 text-slate-400 font-black uppercase text-[10px] rounded-2xl hover:bg-slate-700 transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-2 py-4 font-black uppercase text-[10px] rounded-2xl transition-all shadow-lg ${petToEdit ? "bg-amber-600 hover:bg-amber-500" : "bg-cyan-600 hover:bg-cyan-500"} text-white`}
        >
          {isSubmitting
            ? "Sincronizando..."
            : petToEdit
              ? "Guardar Cambios"
              : "Completar Registro"}
        </button>
      </div>
    </form>
  );
}
