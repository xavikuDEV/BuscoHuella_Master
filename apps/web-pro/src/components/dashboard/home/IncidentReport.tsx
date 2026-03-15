"use client";

import React, { useState } from "react";
import Link from "next/link";
import NewIncidentModal from "./NewIncidentModal";

interface IncidentReportProps {
  sector: string;
  initialIncidents: any[];
}

export default function IncidentReport({
  sector = "SBD-08",
  initialIncidents = [],
}: IncidentReportProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estilos de urgencia táctica (Mapeados a la columna 'priority' de la DB)
  const urgencyStyles: Record<string, string> = {
    CRITICAL: "bg-rose-600 text-white border-rose-400 animate-pulse",
    HIGH: "bg-rose-500/20 text-rose-500 border-rose-500/30",
    MEDIUM: "bg-amber-500/20 text-amber-500 border-amber-500/30",
    LOW: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
  };

  // Iconos por tipo (Mapeados a la columna 'type' de la DB)
  const typeIcons: Record<string, string> = {
    LOSS: "🔍",
    SIGHTING: "👀",
    THEFT: "🚨",
    ABUSE: "⚠️",
    HEALTH: "🩺",
    ROUTINE_CONTROL: "📋",
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[3.5rem] p-10 h-full shadow-2xl relative overflow-hidden group flex flex-col">
      {/* 🛰️ Header de Monitorización */}
      <header className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">
            Live <span className="text-rose-500">Incident</span> Feed
          </h3>
          <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em] mt-2 italic font-bold">
            Frecuencia: {sector} // Grid_Monitor
          </p>
        </div>

        {/* 🕹️ Botón Táctico */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-600/10 border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all px-6 py-2 rounded-2xl text-[10px] font-black text-rose-500 uppercase tracking-widest shadow-lg shadow-rose-900/20"
        >
          [+] Nueva Alerta
        </button>
      </header>

      {/* 📜 Lista de Incidencias (Scrollable) */}
      <div className="flex-1 space-y-4 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
        {initialIncidents.length > 0 ? (
          initialIncidents.map((inc) => (
            <div
              key={inc.id}
              className="flex items-center gap-6 p-5 bg-slate-950/40 border border-slate-800/50 rounded-4xl hover:bg-slate-800/20 hover:border-slate-700 transition-all cursor-crosshair group/item"
            >
              {/* Badge de Prioridad */}
              <div
                className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${urgencyStyles[inc.priority] || urgencyStyles.LOW}`}
              >
                {inc.priority}
              </div>

              {/* Contenido del Reporte */}
              <div className="flex-1">
                <p className="text-xs font-bold text-white uppercase tracking-tight leading-tight">
                  <span className="mr-2 opacity-80">
                    {typeIcons[inc.type] || "📋"}
                  </span>
                  {inc.pets?.name ? `${inc.pets.name.toUpperCase()}: ` : ""}
                  {inc.title}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <p className="text-[8px] text-slate-600 font-mono uppercase">
                    {new Date(inc.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <span className="w-1 h-1 bg-slate-800 rounded-full" />
                  <p className="text-[8px] text-cyan-500/50 font-black uppercase tracking-widest">
                    ID_{inc.id.slice(0, 6)}
                  </p>
                </div>
              </div>

              {/* Botón de Acción a Ficha */}
              <Link
                href={`/es/dashboard/admin/incidents/${inc.id}`}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-600 hover:text-rose-400 hover:border-rose-500/30 transition-all"
              >
                →
              </Link>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border border-dashed border-slate-800 rounded-4xl">
            <p className="text-slate-600 font-black uppercase text-[10px] tracking-[0.4em] italic">
              Sector_Silencioso // Sin Alertas
            </p>
          </div>
        )}
      </div>

      {/* 🛠️ Footer de Terminal */}
      <footer className="mt-8 pt-6 border-t border-slate-800/50 flex justify-between items-center">
        <span className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">
          {sector}_Grid_Status: Secure
        </span>
        <button className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-all">
          Historial Completo [+]
        </button>
      </footer>

      {/* 🛡️ MODAL DE REGISTRO */}
      <NewIncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentSector={sector}
      />
    </div>
  );
}
