"use client";

import React from "react";

/**
 * 🛰️ RESOURCE MONITOR
 * Supervisión de unidades tácticas desplegadas en el sector.
 */
interface ResourceMonitorProps {
  sector?: string; // 👈 Añadimos la interfaz de props
}

export default function ResourceMonitor({
  sector = "SBD-08",
}: ResourceMonitorProps) {
  const units = [
    { name: "Patrulla Urbana", status: "Active", count: 4 },
    { name: "Rescatistas ONG", status: "On-Call", count: 12 },
    { name: "Unidades Vet", status: "Standby", count: 2 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[3.5rem] p-8 h-full shadow-2xl flex flex-col">
      <header className="mb-8">
        <h3 className="text-sm font-black text-white uppercase tracking-widest italic">
          Unidades de Campo
        </h3>
        <p className="text-[8px] font-mono text-slate-600 uppercase tracking-[0.2em] mt-1">
          Operativo: {sector}
        </p>
      </header>

      <div className="space-y-6 flex-1">
        {units.map((unit, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-4 bg-slate-950/40 rounded-2xl border border-slate-800/50 hover:border-cyan-500/20 transition-all"
          >
            <div>
              <p className="text-[10px] font-black text-white uppercase">
                {unit.name}
              </p>
              <p className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest">
                {unit.status}
              </p>
            </div>
            <span className="text-xl font-black text-white">{unit.count}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800/50">
        <div className="h-1.5 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
          <div className="h-full bg-cyan-500 w-2/3 shadow-[0_0_10px_#06b6d4]" />
        </div>
        <p className="text-[8px] text-slate-600 uppercase mt-3 font-black tracking-widest text-center">
          Capacidad de Respuesta: 65%
        </p>
      </div>
    </div>
  );
}
