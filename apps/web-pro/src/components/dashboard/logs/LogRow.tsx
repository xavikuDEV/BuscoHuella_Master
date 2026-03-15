"use client";

import { deleteLogAction } from "@/app/[locale]/dashboard/admin/logs/actions";

interface LogRowProps {
  log: any;
  onSelect: (log: any) => void;
}

export default function LogRow({ log, onSelect }: LogRowProps) {
  const levelStyles: Record<string, string> = {
    INFO: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    WARN: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    ERROR: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    CRITICAL: "text-white bg-rose-600 border-rose-400 animate-pulse",
  };

  return (
    <tr className="group hover:bg-slate-800/40 transition-colors border-b border-slate-800/30">
      <td className="p-6 text-[10px] font-mono text-slate-500 whitespace-nowrap">
        {new Date(log.created_at).toLocaleString()}
      </td>
      <td className="p-6">
        <span
          className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${levelStyles[log.level] || ""}`}
        >
          {log.level}
        </span>
      </td>
      <td className="p-6">
        <span className="text-indigo-400 font-bold text-xs uppercase tracking-tighter mr-2">
          [{log.module}]
        </span>
        <span className="text-slate-300 text-xs truncate max-w-md inline-block align-middle">
          {log.message}
        </span>
      </td>
      <td className="p-6 text-right space-x-4">
        <button
          onClick={() => onSelect(log)}
          className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all"
        >
          Detalles [+]
        </button>
        <button
          onClick={() =>
            confirm("¿Borrar evidencia?") && deleteLogAction(log.id)
          }
          className="text-[10px] text-rose-500/50 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
        >
          🗑️
        </button>
      </td>
    </tr>
  );
}
