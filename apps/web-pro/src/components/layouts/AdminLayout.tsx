import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SystemStatus from "../dashboard/SystemStatus";
import AdminSidebarNav from "./AdminSidebarNav";
import { logout } from "@/app/auth/actions";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * 🏛️ ADMIN LAYOUT SUPREMO (V5.0)
 * Arquitectura de búnker con control de acceso por servidor y
 * telemetría integrada.
 */
export default async function AdminLayout({ children }: AdminLayoutProps) {
  // 🛡️ PROTOCOLO DE SEGURIDAD: Verificación de sesión en el Kernel
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🚨 ACCESO DENEGADO: Redirección táctica si no hay credenciales activas
  if (!user) {
    redirect("/es/login");
  }

  // 🛰️ EXTRACCIÓN DE IDENTIDAD OPERATIVA
  const metadata = user.user_metadata;
  const displayName =
    metadata?.display_name || metadata?.full_name || "Archon_Unknown";
  const role = metadata?.role || "Administrator";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* 📟 SIDEBAR: TORRE DE CONTROL (Glassmorphism & Blur) */}
      <aside className="w-80 bg-slate-900/40 border-r border-slate-800/50 flex flex-col backdrop-blur-3xl z-30">
        {/* BRANDING: Identidad Visual del Proyecto */}
        <div className="p-8 pb-12">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <div className="absolute -inset-2 bg-cyan-500/20 rounded-xl blur-lg group-hover:bg-cyan-500/40 transition-all duration-500" />
              <div className="w-10 h-10 bg-linear-to-br from-cyan-500 to-indigo-600 rounded-xl rotate-45 flex items-center justify-center relative z-10 shadow-2xl">
                <span className="text-white font-black -rotate-45 text-xl tracking-tighter">
                  B
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
                Busco<span className="text-cyan-400 font-black">Huella</span>
              </h1>
              <span className="text-[7px] text-slate-500 font-black uppercase tracking-[0.5em] mt-1.5 ml-0.5">
                Bunker_OS_v5.0
              </span>
            </div>
          </div>
        </div>

        {/* 🛰️ NAVEGACIÓN PRINCIPAL: Flujo de Operaciones */}
        <nav className="flex-1 px-6 space-y-8 overflow-y-auto custom-scrollbar">
          <div>
            <p className="px-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">
              Sistemas_Base
            </p>
            <div className="space-y-1">
              <AdminSidebarNav />
            </div>
          </div>

          {/* Espacio para futuros módulos como "Reportes" o "Configuración" */}
          <div>
            <p className="px-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">
              Inteligencia
            </p>
            <div className="px-4 py-3 bg-slate-900/30 border border-slate-800/50 rounded-2xl">
              <p className="text-[10px] text-slate-500 italic">
                Módulos de IA en espera...
              </p>
            </div>
          </div>
        </nav>

        {/* 👤 PERFIL DEL OPERADOR Y CIERRE DE SEGURIDAD */}
        <div className="p-6 bg-slate-900/40 border-t border-slate-800/50 backdrop-blur-md">
          <div className="relative group p-4 rounded-4xl bg-slate-950/40 border border-slate-800/50 hover:border-cyan-500/30 transition-all duration-500 mb-4 overflow-hidden">
            {/* Efecto de luz interna en hover */}
            <div className="absolute inset-0 bg-linear-to-tr from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-cyan-500/10">
                {userInitial}
              </div>
              <div className="ml-4 min-w-0">
                <p className="text-[11px] font-black text-white truncate uppercase tracking-tight">
                  {displayName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  <p className="text-[8px] text-emerald-500/80 uppercase font-black tracking-widest">
                    {role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ACCIÓN DE CIERRE: Cierre de Sesión Seguro */}
          <form action={logout}>
            <button
              type="submit"
              className="w-full group flex items-center justify-between px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 hover:text-rose-400 bg-slate-950/20 hover:bg-rose-500/5 rounded-2xl transition-all border border-transparent hover:border-rose-500/20"
            >
              <span>Terminar Turno</span>
              <span className="grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100 transition-all text-sm">
                🔒
              </span>
            </button>
          </form>
        </div>
      </aside>

      {/* 🚀 ÁREA DE OPERACIONES: Canvas de Contenido Principal */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Fondo decorativo de malla para el área principal */}
        <div className="absolute inset-0 bg-[url('/globe.svg')] opacity-[0.02] pointer-events-none" />

        <main className="flex-1 overflow-y-auto bg-slate-950 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto p-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>

        {/* 📊 TELEMETRÍA INFERIOR: Barra de Estado en Tiempo Real */}
        <footer className="h-12 border-t border-slate-800/40 bg-slate-900/20 backdrop-blur-xl flex items-center px-12 z-30">
          <div className="flex-1 flex items-center">
            <SystemStatus />
          </div>
          <div className="hidden md:flex items-center gap-6 border-l border-slate-800/50 pl-8">
            <div className="flex flex-col">
              <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">
                Criptografía
              </span>
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-tighter">
                AES-256_ACTIVE
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs">
              📡
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
