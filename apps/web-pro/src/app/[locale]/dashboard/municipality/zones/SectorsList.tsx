"use client";

import { Trash2, Globe, Loader2, Database } from "lucide-react";

interface SectorsListProps {
  sectors: any[];
  cityName?: string | null;
  isLoading?: boolean;
}

export default function SectorsList({
  sectors,
  cityName,
  isLoading,
}: SectorsListProps) {
  // Generamos el sufijo táctico basado en la ciudad
  const tacticalSuffix = cityName
    ? `${cityName.toUpperCase()}_ALPHA`
    : "GLOBAL_STANDBY";

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-4xl overflow-hidden backdrop-blur-md shadow-2xl transition-all">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
        <div className="flex items-center gap-3">
          <Globe
            size={16}
            className={
              sectors.length > 0
                ? "text-cyan-400 animate-pulse"
                : "text-slate-600"
            }
          />
          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">
            Sectores Detectados //{" "}
            <span className="text-cyan-500">{tacticalSuffix}</span>
          </h3>
        </div>
        <div className="flex items-center gap-4">
          {isLoading && (
            <Loader2 size={12} className="animate-spin text-cyan-500" />
          )}
          <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
            {sectors.length} REGISTROS_ACTIVOS
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800/50 bg-slate-900/30">
              <th className="px-6 py-4">ID_INTERNO</th>
              <th className="px-6 py-4">NOMBRE_TÁCTICO</th>
              <th className="px-6 py-4">ESTADO</th>
              <th className="px-6 py-4 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {sectors.map((s) => (
              <tr
                key={s.id}
                className="group hover:bg-cyan-500/5 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-[10px] text-slate-500">
                  #{s.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-tight group-hover:text-cyan-300">
                    {s.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    ACTIVO
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-600 hover:text-rose-500 transition-all hover:scale-110">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}

            {!isLoading && sectors.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-20">
                    <Database size={32} />
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em]">
                      {cityName
                        ? "No se han definido sectores en esta zona"
                        : "Esperando selección de jurisdicción..."}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
