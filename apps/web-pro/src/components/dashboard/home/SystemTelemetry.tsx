"use client";

import {
  deleteLogAction,
  clearAllLogsAction,
} from "@/lib/actions/logs.actions";

export default function SystemTelemetry({ logs }: { logs: any[] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[3.5rem] p-8 h-full shadow-2xl flex flex-col min-h-[450px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">
          Telemetría
        </h3>
        <button
          onClick={() => confirm("¿Purgar feed?") && clearAllLogsAction()}
          className="text-[8px] font-black text-rose-500/50 hover:text-rose-500 uppercase tracking-widest transition-all"
        >
          Limpiar Todo
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {logs.map((log) => (
          <div
            key={log.id}
            className="group relative p-4 bg-slate-950/50 border border-slate-800/50 rounded-2xl hover:border-indigo-500/30 transition-all"
          >
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black text-indigo-400 uppercase">
                {log.profiles?.display_name || "SYSTEM"}
              </span>
              <button
                onClick={() => deleteLogAction(log.id)}
                className="opacity-0 group-hover:opacity-100 text-[10px] text-slate-600 hover:text-rose-500 transition-all"
              >
                ✕
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
              {log.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
