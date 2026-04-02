"use client";
import { Send, Terminal } from "lucide-react";

interface IncidentChatProps {
  incidentId: string;
}

export default function IncidentChat({ incidentId }: IncidentChatProps) {
  // En el futuro, aquí usaremos incidentId para filtrar los mensajes de Supabase Realtime
  const messages = [
    {
      user: "SYSTEM",
      text: `CANAL DE COMUNICACIONES ABIERTO PARA CASO ${incidentId.slice(0, 8)}.`,
      time: "12:00",
    },
    {
      user: "UNIT_01",
      text: "Patrulla en camino al sector detectado.",
      time: "12:05",
    },
  ];

  return (
    <div className="bg-slate-900/30 border border-slate-800 rounded-[2.5rem] flex flex-col h-[350px] overflow-hidden backdrop-blur-md">
      <div className="p-4 border-b border-slate-800 flex items-center gap-2 bg-slate-950/50">
        <Terminal size={14} className="text-cyan-500" />
        <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">
          Tactical_Comms_Link
        </span>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto font-mono text-[10px]">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col ${m.user === "SYSTEM" ? "opacity-50" : ""}`}
          >
            <div className="flex justify-between text-[8px] mb-1">
              <span className="font-black text-cyan-500 tracking-tighter">
                @{m.user}
              </span>
              <span className="text-slate-600">{m.time}</span>
            </div>
            <p className="text-slate-300 bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
              {m.text}
            </p>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-slate-800 bg-slate-950/50">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="ENVIAR COMUNICADO..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-4 text-[9px] font-mono text-cyan-400 outline-none focus:border-cyan-500/50 placeholder:text-slate-700"
          />
          <Send size={14} className="absolute right-3 text-slate-600" />
        </div>
      </div>
    </div>
  );
}
