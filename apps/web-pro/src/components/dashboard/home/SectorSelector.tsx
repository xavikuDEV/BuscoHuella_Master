"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SectorSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSector = searchParams.get("sector") || "ALL";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    // Forzamos que 'ALL' sea un valor explícito o eliminamos el parámetro
    if (val === "ALL") {
      params.delete("sector");
    } else {
      params.set("sector", val);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 hover:border-cyan-500/30 transition-all shadow-inner">
      <div
        className={`w-2 h-2 rounded-full animate-pulse ${currentSector === "ALL" ? "bg-amber-500" : "bg-cyan-500"}`}
      />
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-nowrap">
        Sector:
      </span>
      <select
        value={currentSector}
        onChange={handleChange}
        className="bg-transparent text-[10px] font-black text-white uppercase outline-none border-none focus:ring-0 cursor-pointer p-0 pr-6"
      >
        <option value="ALL" className="bg-slate-900 text-amber-500">
          Sabadell Global (Vista Total)
        </option>
        <option value="SBD-08" className="bg-slate-900">
          SBD-08 (Centro)
        </option>
        <option value="SBD-01" className="bg-slate-900">
          SBD-01 (Can Rull)
        </option>
        <option value="SBD-05" className="bg-slate-900">
          SBD-05 (Gràcia)
        </option>
      </select>
    </div>
  );
}
