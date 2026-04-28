export const dynamic = "force-dynamic";

import React from "react";
import { createClient } from "@/lib/supabase/server";
import ManageLogsClient from "@/components/dashboard/ManageLogsClient";

export default async function LogsPage() {
  const supabase = await createClient();

  // 🛰️ Consultamos los logs e intentamos traer el nombre del usuario vinculado
  const { data: logs, error } = await supabase
    .from("system_logs")
    .select(
      `
    *,
    profiles!user_id(display_name, username) 
  `,
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 📟 CABECERA TÉCNICA */}
      <header className="flex justify-between items-end border-b border-slate-800/50 pb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
            <span className="text-rose-500 animate-pulse">●</span>
            Caja Negra <span className="text-rose-500">Historial</span>
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Registro inmutable de eventos críticos y telemetría del sistema.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">
            Status: Monitoring_Active
          </p>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-mono">
          ⚠️ ERROR DE ENLACE CON LA CAJA NEGRA: {error.message}
        </div>
      )}

      <ManageLogsClient logs={logs || []} />

      {/* 📝 PIE DE PÁGINA */}
      <footer className="flex justify-between items-center text-[9px] font-black text-slate-700 uppercase tracking-widest">
        <p>BuscoHuella Búnker OS v3.0</p>
        <p>Auto-Purge: Off</p>
      </footer>
    </div>
  );
}
