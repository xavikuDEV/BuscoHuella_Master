"use client";

import React, { useState } from "react";
import { Pet, UserProfile, PetSpecies } from "@buscohuella/shared";
import PetRegistrationForm from "../forms/PetRegistrationForm";
import PetTableActions from "./PetTableActions";

// 🛡️ Definimos el mapa de iconos fuera para que sea limpio y tipado
const SPECIES_ICONS: Record<string, string> = {
  [PetSpecies.DOG]: "🐶",
  [PetSpecies.CAT]: "🐱",
  [PetSpecies.BIRD]: "🦜",
  [PetSpecies.HAMSTER]: "🐹",
  [PetSpecies.REPTILE]: "🦎",
  [PetSpecies.OTHER]: "✨",
};

export default function ManagePetsClient({
  initialPets,
  owners,
}: {
  initialPets: Pet[];
  owners: UserProfile[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPet(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-4xl border border-slate-800">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
            Panel de Control
          </p>
          <h3 className="text-white font-bold">Gestión de Activos</h3>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black uppercase rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
        >
          <span>➕</span> Registrar Mascota
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-800">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Mascota
              </th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {initialPets.map((pet) => (
              <tr
                key={pet.id}
                className="hover:bg-slate-800/30 transition-colors group"
              >
                <td className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl border border-slate-700">
                      {/* 🛡️ Uso del mapa tipado */}
                      {SPECIES_ICONS[pet.species] || "🐾"}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-bold text-white">{pet.name}</p>
                      <p className="text-[10px] text-cyan-500 font-mono uppercase tracking-tighter">
                        {pet.dua_id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-right">
                  <PetTableActions
                    petId={pet.id}
                    petName={pet.name}
                    onEdit={() => handleEdit(pet)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  <span className="text-3xl">{editingPet ? "✏️" : "⚡"}</span>
                  {editingPet ? "Editar Activo" : "Registro Génesis"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-slate-500 hover:text-white transition-colors text-2xl"
                >
                  ✕
                </button>
              </div>
              <PetRegistrationForm
                owners={owners}
                petToEdit={editingPet}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
