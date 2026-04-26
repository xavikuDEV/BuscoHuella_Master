"use client";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function IncidentTimeline({ incident }: { incident: any }) {
  const isResolved = incident.status === "RESOLVED";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-2 italic">
        <Clock size={14} className="text-cyan-500" />
        <span className="text-[10px] font-black text-white uppercase tracking-widest">
          Trazabilidad_Forense
        </span>
      </div>

      <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        <TimelineStep
          label="ALERTA_EMITIDA"
          date={incident.created_at}
          icon={AlertCircle}
          active
        />
        <TimelineStep
          label={isResolved ? "RESOLUCIÓN_CONFIRMADA" : "OPERACIÓN_EN_CURSO"}
          date={isResolved ? incident.updated_at : "Awaiting_Data..."}
          icon={CheckCircle2}
          active={isResolved}
        />
      </div>
    </div>
  );
}

function TimelineStep({ label, date, icon: Icon, active }: any) {
  return (
    <div className="flex gap-4 relative z-10">
      <div
        className={`h-9 w-9 rounded-xl flex items-center justify-center border-2 ${active ? "bg-slate-950 border-cyan-500/50 text-cyan-400" : "bg-slate-950 border-slate-800 text-slate-700"}`}
      >
        <Icon size={16} />
      </div>
      <div className="flex flex-col justify-center">
        <span
          className={`text-[9px] font-black uppercase tracking-widest ${active ? "text-white" : "text-slate-600"}`}
        >
          {label}
        </span>
        <span className="text-[8px] font-mono text-slate-500 uppercase">
          {date}
        </span>
      </div>
    </div>
  );
}
