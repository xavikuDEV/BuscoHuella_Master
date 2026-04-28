"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  PawPrint,
  Users,
  Map as MapIcon,
  Terminal,
  LogOut,
  Activity,
  Radio,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth.actions";

export default function AdminSidebarNav() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "es";

  // --- 🛰️ LÓGICA DE NODO OPERATIVO DINÁMICO ---
  const isIncidentDetail =
    pathname.includes("/incidents/") && pathname.split("/").length > 5;
  const isTerritorial = pathname.includes("/municipality/zones");
  const isCommandCenter = pathname.endsWith("/dashboard/admin");
  const isAdminLogs = pathname.includes("/logs");

  let nodeID = "GLOBAL_HUB";
  let nodeStatus = "bg-emerald-500";
  let nodeLabel = "System_Standby";

  if (isTerritorial) {
    nodeID = "GEO_INTEL_ALPHA";
    nodeStatus = "bg-cyan-500";
    nodeLabel = "Scanning_Zones";
  } else if (isIncidentDetail) {
    const shortId = pathname.split("/").pop()?.slice(-4).toUpperCase() || "X";
    nodeID = `UNIT_CELL_${shortId}`;
    nodeStatus = "bg-rose-500";
    nodeLabel = "Tactical_Response";
  } else if (isAdminLogs) {
    nodeID = "LOG_MONITOR_01";
    nodeStatus = "bg-amber-500";
    nodeLabel = "Telemetry_Audit";
  } else if (isCommandCenter) {
    nodeID = "ADMIN_CORE_BCN";
    nodeStatus = "bg-cyan-500";
    nodeLabel = "Live_Telemetry";
  }

  // --- 🔐 PROTOCOLO DE CIERRE DE SESIÓN ---
  const handleLogout = async () => {
    try {
      // Ejecutamos la Server Action para limpiar cookies y sesión en el servidor
      await logout();
      // El redirect ya lo hace la Server Action, pero por seguridad
      // y para limpiar el estado del cliente, Next.js se encarga del resto.
    } catch (error) {
      console.error("Error en el protocolo de salida:", error);
    }
  };

  const groups = [
    {
      title: "Operaciones",
      items: [
        {
          name: "Command Center",
          href: `/${locale}/dashboard/admin`,
          icon: LayoutDashboard,
        },
        {
          name: "Radar Incidencias",
          href: `/${locale}/dashboard/admin/incidents`,
          icon: ShieldAlert,
        },
      ],
    },
    {
      title: "Registros",
      items: [
        {
          name: "Censo Mascotas",
          href: `/${locale}/dashboard/admin/pets`,
          icon: PawPrint,
        },
        {
          name: "Base Usuarios",
          href: `/${locale}/dashboard/admin/users`,
          icon: Users,
        },
      ],
    },
    {
      title: "Inteligencia",
      items: [
        {
          name: "Gestión Territorial",
          href: `/${locale}/dashboard/admin/municipality/zones`,
          icon: MapIcon,
        },
        {
          name: "Logs Sistema",
          href: `/${locale}/dashboard/admin/logs`,
          icon: Terminal,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-900/50 select-none shadow-2xl overflow-hidden">
      {/* 🚀 CABECERA: BRANDING TÁCTICO */}
      <div className="p-8 mb-2">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-cyan-500/20 rounded-lg blur-md animate-pulse" />
            <div className="relative bg-slate-900 p-2.5 rounded-xl border border-cyan-500/30">
              <Cpu size={20} className="text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-white tracking-tight leading-none uppercase">
              BuscoHuella
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="h-1 w-1 bg-cyan-500 rounded-full animate-ping" />
              <span className="text-[7px] font-bold text-cyan-500/60 uppercase tracking-[0.3em]">
                Bunker_OS_v3.5
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 📂 NAVEGACIÓN PRINCIPAL */}
      <nav
        className="flex-1 px-5 space-y-8 overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`nav::-webkit-scrollbar { display: none; }`}</style>
        {groups.map((group) => (
          <div key={group.title} className="space-y-3">
            <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] ml-4">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== `/${locale}/dashboard/admin` &&
                    pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-5 py-3 rounded-2xl text-[10px] font-bold uppercase transition-all group relative",
                      isActive
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "text-slate-500 hover:text-slate-200 hover:bg-white/5",
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    )}
                    <item.icon
                      size={16}
                      className={cn(
                        isActive ? "text-cyan-400" : "text-slate-600",
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* 🛰️ MONITOR DE ESTADO Y CIERRE (FOOTER) */}
      <div className="p-6 mt-auto">
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-5 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">
                {nodeLabel}
              </span>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "h-1.5 w-1.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.2)]",
                    nodeStatus,
                  )}
                />
                <span className="text-[10px] font-black text-white font-mono tracking-tighter">
                  {nodeID}
                </span>
              </div>
            </div>
            <Radio
              size={12}
              className={cn(
                "animate-pulse",
                isIncidentDetail ? "text-rose-500" : "text-emerald-500",
              )}
            />
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 transition-all active:scale-95"
          >
            <LogOut size={12} /> Terminar_Turno
          </button>
        </div>
      </div>
    </div>
  );
}
