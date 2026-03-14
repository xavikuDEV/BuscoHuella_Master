"use client";

import React from "react";
import { deletePetAction } from "@/app/[locale]/dashboard/admin/pets/actions";

interface Props {
  petId: string;
  petName: string; // 👈 Este es el campo que TS decía que faltaba
}

export default function PetTableActions({ petId, petName }: Props) {
  const handleDelete = async () => {
    // 🛡️ Usamos el nombre en la confirmación
    const confirmed = confirm(`🚨 ¿Confirmas la eliminación de "${petName}"?`);

    if (confirmed) {
      const result = await deletePetAction(petId);
      if (!result.success) alert(result.error);
    }
  };

  return (
    <div className="flex justify-end gap-3">
      <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-cyan-400 transition-colors">
        ✏️
      </button>
      <button
        onClick={handleDelete}
        className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-500 transition-colors"
      >
        🗑️
      </button>
    </div>
  );
}
