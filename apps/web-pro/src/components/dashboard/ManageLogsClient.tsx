"use client";

import React, { useState, useMemo } from "react";
import LogExportButtons from "./logs/LogExportButtons";
import LogRow from "./logs/LogRow";
import { purgeLogsAction } from "@/lib/actions/logs.actions";
import { usePathname } from "next/navigation";

export default function ManageLogsClient({ logs = [] }: { logs: any[] }) {
  const [filterLevel, setFilterLevel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLog, setSelectedLog] = useState<any>(null);

  // Paginación Simple
  const [visibleCount, setVisibleCount] = useState(50);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesLevel = filterLevel === "all" || log.level === filterLevel;
      const matchesSearch =
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.module.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [logs, filterLevel, searchTerm]);

  const paginatedLogs = filteredLogs.slice(0, visibleCount);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 🛠️ BARRA DE CONTROL TÁCTICO */}
      <div className="flex flex-wrap gap-4 bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-800 shadow-xl items-center justify-between">
        <div className="flex flex-1 gap-4 min-w-[300px]">
          <input
            type="text"
            placeholder="Filtrar telemetría..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-xs text-white outline-none focus:border-indigo-500/50 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2 text-xs text-slate-400 outline-none"
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="all">TODOS LOS NIVELES</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>

        <div className="flex items-center gap-6">
          <LogExportButtons logs={filteredLogs} />
          <button
            onClick={() =>
              confirm("¿Ejecutar purga completa del sistema?") &&
              purgeLogsAction()
            }
            className="px-6 py-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white text-[10px] font-black uppercase rounded-2xl border border-rose-500/20 transition-all shadow-lg shadow-rose-500/10"
          >
            Purga Total
          </button>
        </div>
      </div>

      {/* 📑 TABLA DE CAJA NEGRA */}
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-950/50 text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-800">
            <tr>
              <th className="p-8">Timestamp</th>
              <th className="p-8">Nivel</th>
              <th className="p-8">Módulo / Evento</th>
              <th className="p-8 text-right">Gestión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {paginatedLogs.map((log) => (
              <LogRow key={log.id} log={log} onSelect={setSelectedLog} />
            ))}
          </tbody>
        </table>

        {/* 🔄 LOAD MORE / PAGINACIÓN */}
        {filteredLogs.length > visibleCount && (
          <div className="p-8 text-center border-t border-slate-800 bg-slate-950/20">
            <button
              onClick={() => setVisibleCount((prev) => prev + 50)}
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all"
            >
              Cargar más eventos [+]
            </button>
          </div>
        )}

        {filteredLogs.length === 0 && (
          <div className="p-20 text-center text-slate-600 italic font-medium">
            La Caja Negra no ha registrado eventos bajo estos parámetros.
          </div>
        )}
      </div>

      {/* 🛡️ MODAL DE DETALLES */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3.5rem] max-w-3xl w-full shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16" />

            <header className="flex justify-between items-center relative z-10">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                Análisis Forense{" "}
                <span className="text-indigo-500">
                  #{selectedLog.id.slice(0, 8)}
                </span>
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </header>

            <div className="bg-slate-950 p-8 rounded-4xl border border-slate-800 font-mono text-[11px] text-indigo-300 overflow-auto max-h-[500px] shadow-inner custom-scrollbar">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(selectedLog, null, 2)}
              </pre>
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="w-full py-5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl"
            >
              Cerrar Terminal de Análisis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
