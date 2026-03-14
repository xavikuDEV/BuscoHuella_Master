import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SystemStatus from "../dashboard/SystemStatus";
import AdminSidebarNav from "./AdminSidebarNav";
import { logout } from "@/app/auth/actions";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // 🛡️ Conexión segura al búnker en el servidor
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si no hay sesión, el intruso es expulsado
  if (!user) {
    redirect("/es/login");
  }

  const fullName = user.user_metadata?.full_name || "Operador";
  const role = user.user_metadata?.role || "user";
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans overflow-hidden">
      {/* Sidebar: El Panel de Mandos */}
      <aside className="w-64 bg-slate-800/40 border-r border-slate-700/50 flex flex-col backdrop-blur-xl">
        <div className="p-8">
          <h1 className="text-xl font-black bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tighter">
            BuscoHuella Admin
          </h1>
          <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-[0.3em] font-black">
            Torre de Control 🧬
          </p>
        </div>

        {/* 🛰️ Navegación (Componente de Cliente para usar usePathname) */}
        <nav className="flex-1 px-4 space-y-2">
          <AdminSidebarNav />
        </nav>

        {/* Perfil Dinámico y Logout */}
        <div className="p-4 border-t border-slate-700/50 space-y-3">
          <div className="flex items-center p-3 rounded-2xl bg-slate-950/50 border border-slate-800/50">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg">
              {initial}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-xs font-bold truncate">{fullName}</p>
              <p className="text-[8px] text-emerald-500 uppercase font-black tracking-widest animate-pulse">
                {role} • Online
              </p>
            </div>
          </div>

          {/* 🚪 Botón de Salida Segura */}
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
            >
              <span>Terminar Sesión</span>
              <span className="text-xs">🔒</span>
            </button>
          </form>
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
