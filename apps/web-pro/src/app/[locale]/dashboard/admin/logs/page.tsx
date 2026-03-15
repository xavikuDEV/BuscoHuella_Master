export const dynamic = "force-dynamic";

import React from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { createClient } from "@/lib/supabase/server";

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
    ) // 👈 Agregamos !user_id para romper la ambigüedad
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <AdminLayout>
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

        {/* 📊 TABLA DE TELEMETRÍA */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950/50 border-b border-slate-800">
              <tr className="text-[9px] font-black uppercase text-slate-500 tracking-widest">
                <th className="p-6">Timestamp</th>
                <th className="p-6">Nivel</th>
                <th className="p-6">Módulo</th>
                <th className="p-6">Operador</th>
                <th className="p-6">Mensaje del Sistema</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {logs && logs.length > 0 ? (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="text-xs font-mono hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="p-6 text-slate-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${
                          log.level === "CRITICAL" || log.level === "ERROR"
                            ? "bg-rose-500/20 text-rose-500"
                            : log.level === "WARN"
                              ? "bg-amber-500/20 text-amber-500"
                              : "bg-cyan-500/20 text-cyan-500"
                        }`}
                      >
                        {log.level}
                      </span>
                    </td>
                    <td className="p-6 text-slate-400 font-bold">
                      {log.module}
                    </td>
                    <td className="p-6">
                      <span className="text-slate-500 italic">
                        {log.profiles?.display_name ||
                          log.profiles?.username ||
                          "Sistema"}
                      </span>
                    </td>
                    <td className="p-6 text-slate-200 group-hover:text-white transition-colors">
                      {log.message}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-20 text-center text-slate-600 font-medium italic"
                  >
                    No se han detectado anomalías en el flujo de datos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📝 PIE DE PÁGINA */}
        <footer className="flex justify-between items-center text-[9px] font-black text-slate-700 uppercase tracking-widest">
          <p>BuscoHuella Búnker OS v3.0</p>
          <p>Auto-Purge: Off</p>
        </footer>
      </div>
    </AdminLayout>
  );
}
