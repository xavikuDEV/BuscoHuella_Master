"use client";

import React from "react";

const EVENT_ICONS: Record<string, string> = {
  VACCINE: "💉",
  CHECKUP: "🩺",
  SURGERY: "🩹",
  DEWORMING: "💊",
  OTHER: "📋",
};

export default function PetHealthHistory({ logs }: { logs: any[] }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-[3.5rem] p-10 backdrop-blur-xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-10 relative z-10">
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
          <span className="text-emerald-500 text-2xl">🏥</span> Historial Médico
        </h3>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-[10px] font-black text-slate-300 rounded-xl transition-all border border-slate-700 uppercase tracking-widest">
          + Añadir Registro
        </button>
      </div>

      <div className="relative z-10 space-y-8">
        {/* Línea vertical de la cronología */}
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-800" />

        {logs.length === 0 ? (
          <p className="text-slate-600 italic text-sm pl-12 py-4">
            Sin registros médicos previos.
          </p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="relative pl-12 group">
              {/* Punto de la línea de tiempo */}
              <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-sm z-20 group-hover:border-emerald-500/50 transition-all">
                {EVENT_ICONS[log.event_type] || "📋"}
              </div>

              <div className="bg-slate-950/40 border border-slate-800/50 p-5 rounded-3xl group-hover:bg-slate-800/20 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">
                    {log.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(log.performed_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {log.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
