"use client";

import { PetSpecies } from "@buscohuella/shared";

const SPECIES_ICONS: Record<string, string> = {
  [PetSpecies.DOG]: "🐶",
  [PetSpecies.CAT]: "🐱",
  [PetSpecies.BIRD]: "🦜",
  [PetSpecies.HAMSTER]: "🐹",
  [PetSpecies.REPTILE]: "🦎",
  [PetSpecies.OTHER]: "✨",
};

export default function PetDetailHeader({ pet }: { pet: any }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-indigo-500 rounded-[3.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>

      <div className="relative bg-slate-900 border border-slate-800 rounded-[3.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
        {/* Avatar Pro */}
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-[3rem] bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-6xl md:text-8xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-tr from-cyan-500/5 to-transparent" />
          {SPECIES_ICONS[pet.species as keyof typeof SPECIES_ICONS] || "🐾"}
        </div>

        {/* Info Primaria */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-[10px] font-black uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
            Activo Verificado DUA
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
            {pet.name}
          </h1>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">
                {pet.breed || "Raza común"}
              </span>
              <span className="w-1 h-1 bg-slate-700 rounded-full" />
              <span className="uppercase text-[10px] font-black tracking-widest">
                {pet.species}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-slate-700 rounded-full" />
              <span className="font-mono text-cyan-600 text-xs font-bold">
                {pet.dua_id}
              </span>
            </div>
          </div>
        </div>

        {/* Estado en Red */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="px-6 py-4 bg-slate-950 border border-slate-800 rounded-3xl text-right">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
              Estado de Salud
            </p>
            <p className="text-xl font-black text-emerald-500 uppercase italic">
              Protegido
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
