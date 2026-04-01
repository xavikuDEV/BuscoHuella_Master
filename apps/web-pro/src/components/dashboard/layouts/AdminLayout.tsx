"use client";

import React from "react";
import AdminSidebarNav from "./AdminSidebarNav";
import { ShieldCheck, Zap } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden">
      {/* SIDEBAR TÁCTICO (Más estrecho y compacto) */}
      <aside className="w-64 border-r border-slate-800/50 bg-slate-900/40 backdrop-blur-md flex flex-col h-full">
        <div className="p-6 border-b border-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500 p-1.5 rounded-lg">
              <ShieldCheck className="text-slate-950" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tighter uppercase italic leading-none">
                Busco<span className="text-cyan-400">Huella</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AdminSidebarNav />
        </div>

        <div className="p-4 border-t border-slate-800/30">
          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800/50 flex items-center gap-3">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">
              SBD_NODE_01
            </span>
          </div>
        </div>
      </aside>

      {/* ÁREA DE OPERACIONES (Padding reducido para que no se vea "grande") */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-slate-900/20 via-slate-950 to-slate-950">
        <div className="p-6 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
