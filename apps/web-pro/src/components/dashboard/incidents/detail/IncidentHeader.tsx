"use client";
import { Clock, ShieldAlert, Target } from "lucide-react";

export default function IncidentHeader({ incident }: { incident: any }) {
  const isCritical =
    incident.urgency === "CRITICAL" || incident.urgency === "HIGH";

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-800 pb-10 gap-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Badge Táctico Personalizado */}
          <div
            className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
              isCritical
                ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
            }`}
          >
            PROTOCOLO_{incident.type}
          </div>

          <div className="flex items-center gap-2 text-slate-500 bg-slate-900/50 px-3 py-1 rounded-md border border-slate-800">
            <Clock size={12} className="text-cyan-500" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">
              Iniciado: {new Date(incident.created_at).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-cyan-500/50 uppercase tracking-[0.4em] ml-1">
            Incident_Report_File
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-none uppercase">
            INCIDENCIA{" "}
            <span className={isCritical ? "text-rose-500" : "text-cyan-500"}>
              #{incident.id.slice(0, 8)}
            </span>
          </h1>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 bg-slate-900/30 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
        <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">
          Estado_Operativo
        </span>
        <div className="flex items-center gap-3">
          <div
            className={`h-2 w-2 rounded-full animate-pulse ${incident.status === "ACTIVE" ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"}`}
          />
          <span
            className={`text-xl font-black uppercase tracking-tighter ${incident.status === "ACTIVE" ? "text-rose-500" : "text-emerald-500"}`}
          >
            {incident.status}
          </span>
        </div>
      </div>
    </div>
  );
}
