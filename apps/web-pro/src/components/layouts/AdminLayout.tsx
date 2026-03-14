"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SystemStatus from "../dashboard/SystemStatus";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  // 🛡️ Lógica de resaltado: El búnker sabe dónde estás
  const isActive = (path: string) => pathname === path;

  const navItemClasses = (path: string) => `
    flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 hover:scale-[1.02]
    ${
      isActive(path)
        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
        : "text-slate-400 hover:bg-slate-700/30 hover:text-white border border-transparent"
    }
  `;

  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans overflow-hidden">
      {/* Sidebar: El Panel de Mandos */}
      <aside className="w-64 bg-slate-800/40 border-r border-slate-700/50 flex flex-col backdrop-blur-xl">
        <div className="p-8">
          <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tighter">
            BuscoHuella Admin
          </h1>
          <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-[0.3em] font-black">
            Torre de Control 🧬
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link
            href="/es/dashboard/admin"
            className={navItemClasses("/es/dashboard/admin")}
          >
            <span className="mr-3 text-lg">📊</span> Panel de Control
          </Link>

          <Link
            href="/es/dashboard/admin/pets"
            className={navItemClasses("/es/dashboard/admin/pets")}
          >
            <span className="mr-3 text-lg">🐾</span> Gestión de Mascotas
          </Link>

          {/* 👥 Nueva Sección de Humanos */}
          <Link
            href="/es/dashboard/admin/users"
            className={navItemClasses("/es/dashboard/admin/users")}
          >
            <span className="mr-3 text-lg">👥</span> Gestión de Usuarios
          </Link>
        </nav>

        {/* Perfil del Archon Root */}
        <div className="p-6 border-t border-slate-700/50">
          <div className="flex items-center p-3 rounded-2xl bg-slate-950/50 border border-slate-800/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg">
              A
            </div>
            <div className="ml-3">
              <p className="text-xs font-bold truncate">Archon Root</p>
              <p className="text-[8px] text-emerald-500 uppercase font-black tracking-widest animate-pulse">
                Online
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-slate-950 p-10">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
        <SystemStatus />
      </div>
    </div>
  );
}
