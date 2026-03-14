import React from "react";
import Link from "next/link";
import SystemStatus from "../dashboard/SystemStatus";

// 🛡️ Definición ultra-explícita para evitar conflictos de IntrinsicAttributes
interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800/40 border-r border-slate-700/50 flex flex-col backdrop-blur-xl">
        <div className="p-8">
          <h1 className="text-xl font-black bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tighter">
            BuscoHuella Admin
          </h1>
          <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-[0.3em] font-bold">
            Torre de Control 🧬
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link
            href="/es/dashboard/admin"
            className="flex items-center px-4 py-3 text-sm font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-900/20 transition-all hover:scale-[1.02]"
          >
            <span className="mr-3 text-lg">📊</span> Panel de Control
          </Link>
          <Link
            href="/es/dashboard/admin/pets"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-slate-400 hover:bg-slate-700/30 hover:text-white transition-all"
          >
            <span className="mr-3 text-lg">🐾</span> Gestión de Mascotas
          </Link>
        </nav>

        <div className="p-6 border-t border-slate-700/50">
          <div className="flex items-center p-3 rounded-2xl bg-slate-950/50 border border-slate-800/50">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black">
              A
            </div>
            <div className="ml-3">
              <p className="text-xs font-bold truncate">Archon Root</p>
              <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">
                System Admin
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-slate-950 p-10">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>

        <SystemStatus />
      </div>
    </div>
  );
}
