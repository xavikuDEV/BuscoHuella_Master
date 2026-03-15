"use client";

import React, { useState, useMemo } from "react";
import { Pet, UserProfile, PetSpecies } from "@buscohuella/shared";
import PetRegistrationForm from "../forms/PetRegistrationForm";
import PetTableActions from "./PetTableActions";

// 🛡️ Diccionarios Visuales
const SPECIES_ICONS: Record<string, string> = {
  [PetSpecies.DOG]: "🐶",
  [PetSpecies.CAT]: "🐱",
  [PetSpecies.BIRD]: "🦜",
  [PetSpecies.HAMSTER]: "🐹",
  [PetSpecies.REPTILE]: "🦎",
  [PetSpecies.OTHER]: "✨",
};

const SPECIES_LABELS: Record<string, string> = {
  [PetSpecies.DOG]: "Canino",
  [PetSpecies.CAT]: "Felino",
  [PetSpecies.BIRD]: "Ave",
  [PetSpecies.HAMSTER]: "Roedor",
  [PetSpecies.REPTILE]: "Reptil",
  [PetSpecies.OTHER]: "Especial",
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

  // 🔍 ESTADOS DE FILTRO AVANZADO
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState<string>("all");
  const [breedFilter, setBreedFilter] = useState<string>("all");

  // 🛠️ FUNCIONES DE CONTROL (Corrección del error)
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPet(null);
  };

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setIsModalOpen(true);
  };

  // 🧬 EXTRACCIÓN DINÁMICA DE RAZAS SEGÚN ESPECIE
  const availableBreeds = useMemo(() => {
    if (speciesFilter === "all") return [];
    const breeds = initialPets
      .filter((p) => p.species === speciesFilter && p.breed)
      .map((p) => p.breed as string);
    return Array.from(new Set(breeds)).sort();
  }, [initialPets, speciesFilter]);

  // 🛰️ RASTREO MULTICAPA (Filtrado)
  const filteredPets = useMemo(() => {
    return initialPets.filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(search.toLowerCase()) ||
        pet.dua_id.toLowerCase().includes(search.toLowerCase());

      const matchesSpecies =
        speciesFilter === "all" || pet.species === speciesFilter;
      const matchesBreed = breedFilter === "all" || pet.breed === breedFilter;

      return matchesSearch && matchesSpecies && matchesBreed;
    });
  }, [initialPets, search, speciesFilter, breedFilter]);

  // 📊 ESTADÍSTICAS RÁPIDAS
  const stats = useMemo(() => {
    return {
      total: initialPets.length,
      dogs: initialPets.filter((p) => p.species === PetSpecies.DOG).length,
      cats: initialPets.filter((p) => p.species === PetSpecies.CAT).length,
    };
  }, [initialPets]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* 📊 DASHBOARD DE ACTIVOS RÁPIDO */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-md shadow-lg">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Activos Totales
          </p>
          <p className="text-2xl font-black text-white">{stats.total}</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-md shadow-lg">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Censo Canino
          </p>
          <p className="text-2xl font-black text-cyan-500">{stats.dogs}</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-md shadow-lg">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Censo Felino
          </p>
          <p className="text-2xl font-black text-rose-500">{stats.cats}</p>
        </div>
      </div>

      {/* 🔍 PANEL DE RASTREO (FILTROS) */}
      <div className="bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1 space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">
              Identificador DUA / Nombre
            </label>
            <input
              type="text"
              placeholder="Ej: Kratos o BH-2026..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-xs text-white focus:border-cyan-500/50 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">
              Especie
            </label>
            <select
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-xs text-slate-300 outline-none appearance-none"
              value={speciesFilter}
              onChange={(e) => {
                setSpeciesFilter(e.target.value);
                setBreedFilter("all");
              }}
            >
              <option value="all">Ver todas</option>
              {Object.values(PetSpecies).map((sp) => (
                <option key={sp} value={sp}>
                  {SPECIES_ICONS[sp]} {SPECIES_LABELS[sp]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest ml-2 italic text-cyan-500/50">
              Raza Detectada
            </label>
            <select
              disabled={speciesFilter === "all" || availableBreeds.length === 0}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-xs text-slate-300 outline-none disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              value={breedFilter}
              onChange={(e) => setBreedFilter(e.target.value)}
            >
              <option value="all">
                {speciesFilter === "all"
                  ? "Seleccione especie..."
                  : "Todas las razas"}
              </option>
              {availableBreeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setEditingPet(null);
              setIsModalOpen(true);
            }}
            className="px-6 py-4 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span> Registrar Mascota
          </button>
        </div>
      </div>

      {/* 📑 TABLA DE ACTIVOS */}
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-950/50 border-b border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <tr>
              <th className="p-8">Activo DUA</th>
              <th className="p-8">Detalle Técnico</th>
              <th className="p-8 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredPets.map((pet) => (
              <tr
                key={pet.id}
                className="hover:bg-slate-800/30 transition-all group"
              >
                <td className="p-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-3xl bg-slate-950 flex items-center justify-center text-4xl border border-slate-800 shadow-inner group-hover:border-cyan-500/40 transition-all">
                      {SPECIES_ICONS[pet.species] || "🐾"}
                    </div>
                    <div>
                      <p className="text-base font-black text-white uppercase tracking-tighter leading-none">
                        {pet.name}
                      </p>
                      <p className="text-[10px] text-cyan-500 font-mono mt-2 font-black tracking-tighter bg-cyan-500/10 px-2 py-0.5 rounded w-fit">
                        ID: {pet.dua_id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-200 font-bold flex items-center gap-2">
                      {SPECIES_LABELS[pet.species]}
                      <span className="text-slate-600">/</span>
                      {pet.breed || "Común"}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium italic">
                      {(pet as any).profiles?.display_name ||
                        "Dueño no vinculado"}
                    </span>
                  </div>
                </td>
                <td className="p-8 text-right space-x-3">
                  <button
                    onClick={() =>
                      alert(`Analizando expediente de ${pet.name}...`)
                    }
                    className="p-3 bg-slate-950/50 hover:bg-cyan-500/10 rounded-2xl text-slate-500 hover:text-cyan-400 transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-cyan-500/20"
                    title="Ver Expediente"
                  >
                    🔍
                  </button>
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
        {filteredPets.length === 0 && (
          <div className="p-20 text-center text-slate-600 italic font-medium">
            Ningún activo animal detectado bajo estos parámetros.
          </div>
        )}
      </div>

      {/* 🛡️ MODAL DE REGISTRO / EDICIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] shadow-2xl relative">
            <div className="p-10 relative z-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                    {editingPet
                      ? "📝 Modificar Registro"
                      : "⚡ Registro Génesis"}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    {editingPet
                      ? `Expediente: ${editingPet.dua_id}`
                      : "Nueva entrada en el búnker"}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all shadow-inner"
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
