"use client";

import React, { useState, useEffect } from "react"; // 👈 Añadimos useEffect
import Link from "next/link";
import {
  AlertTriangle,
  Plus,
  Clock3,
  ShieldAlert,
  ChevronRight,
  Activity,
} from "lucide-react";
import NewIncidentModal from "./NewIncidentModal";
import {
  formatRelative,
  urgencyStyles,
  getTypeConfig,
} from "@/lib/incidentUtils";

export default function IncidentReport({
  sector = "ALL",
  initialIncidents = [],
}: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🛰️ ESTABILIZADOR DE HYDRATION
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-slate-900/80 border border-slate-800/50 backdrop-blur-xl rounded-[3rem] p-8 h-full shadow-2xl flex flex-col group/container">
      <header className="flex justify-between items-start mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
              Live <span className="text-rose-500">Incident</span> Feed
            </h3>
          </div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 inline-block">
            Freq: <span className="text-cyan-400">{sector}</span> //
            Grid_Status: <span className="text-emerald-500">Online</span>
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-2 bg-white hover:bg-rose-600 text-black hover:text-white transition-all px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Emitir Alerta
        </button>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar min-h-[400px]">
        {initialIncidents.length > 0 ? (
          initialIncidents.map((inc: any) => {
            const config = getTypeConfig(inc.type);
            return (
              <div
                key={inc.id}
                className={`group/item relative flex items-center gap-5 p-5 border rounded-4xl transition-all hover:bg-slate-800/20 ${urgencyStyles[inc.urgency] || urgencyStyles.LOW}`}
              >
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shadow-inner">
                  {config.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[8px] font-black px-2 py-0.5 rounded border border-current opacity-70 uppercase tracking-tighter ${config.color}`}
                    >
                      {config.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ID_{inc.id.slice(0, 6)}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-white leading-tight mb-2">
                    {inc.message}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                      <Clock3 className="w-3 h-3" />
                      {/* 🛡️ Solo calculamos el tiempo si estamos en el cliente */}
                      {mounted
                        ? formatRelative(new Date(inc.created_at))
                        : "Calculando..."}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-500/60 uppercase">
                      <Activity className="w-3 h-3" />
                      Sector {inc.sector || "SBD-GEN"}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/es/dashboard/admin/incidents/${inc.id}`}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-950 border border-slate-800 text-slate-500 hover:text-white hover:border-cyan-500/50 transition-all shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-20 border-2 border-dashed border-slate-800 rounded-[3rem] space-y-4">
            <div className="p-4 bg-slate-800/30 rounded-full">
              <ShieldAlert className="w-8 h-8 text-slate-700" />
            </div>
            <p className="text-slate-600 font-black uppercase text-[10px] tracking-[0.4em] text-center px-10">
              Perímetro_Seguro // Sin_Alertas_Detectadas
            </p>
          </div>
        )}
      </div>

      <footer className="mt-8 pt-6 border-t border-slate-800/50 flex justify-between items-center text-[9px] font-mono uppercase tracking-[0.2em] text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Grid: {sector} status_stable
        </div>
        <button className="hover:text-cyan-400 transition-colors">
          Ver_Historial_Completo [+]
        </button>
      </footer>

      <NewIncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentSector={sector}
      />
    </div>
  );
}
