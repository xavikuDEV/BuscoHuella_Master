"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ShieldAlert,
  PawPrint,
  Users,
  UserPlus,
  Map as MapIcon,
  Terminal,
  LogOut,
  Radio,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth.actions";
import { createClient } from "@/lib/supabase/client";

export default function AdminSidebarNav() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "es";

  const supabase = createClient();

  // 🧠 Estado de rol
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setRole(data?.role || null);
    };

    getRole();
  }, []);

  const isAdmin = role === "admin";

  // --- 🛰️ NODO OPERATIVO ---
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

  // 🔐 Logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error en el protocolo de salida:", error);
    }
  };

  // 📂 NAV GROUPS (dinámico por rol)
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

    // 🆕 SOLO ADMIN
    ...(isAdmin
      ? [
          {
            title: "Administración",
            items: [
              {
                name: "Reclutamiento",
                href: `/${locale}/dashboard/admin/users/new`,
                icon: UserPlus,
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-900/50 select-none shadow-2xl overflow-hidden relative">
      {/* 🚀 HEADER */}
      <div className="p-8 mb-2">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-cyan-500/20 rounded-lg blur-md animate-pulse" />
            <div className="relative bg-slate-900 p-2.5 rounded-xl border border-cyan-500/30">
              <Cpu size={20} className="text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="text-sm font-black text-white uppercase">
              BuscoHuella
            </span>
            <div className="flex items-center gap-1 mt-1">
              <div className="h-1 w-1 bg-cyan-500 rounded-full animate-ping" />
              <span className="text-[7px] text-cyan-500/60 uppercase">
                Bunker_OS_v3.5
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 📂 NAV */}
      <nav className="flex-1 px-5 space-y-8 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.title} className="space-y-3">
            <p className="text-[8px] font-black text-slate-700 uppercase ml-4">
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
                      "flex items-center gap-3 px-5 py-3 rounded-2xl text-[10px] font-bold uppercase transition-all",
                      isActive
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "text-slate-500 hover:text-white hover:bg-white/5",
                    )}
                  >
                    <item.icon size={16} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* 🚀 BOTÓN FLOTANTE ADMIN */}
      {isAdmin && (
        <Link
          href={`/${locale}/dashboard/admin/users/new`}
          className="absolute bottom-24 right-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-cyan-500 text-black text-[10px] font-black uppercase shadow-lg hover:scale-105 transition-all"
        >
          <UserPlus size={14} />
          Nuevo
        </Link>
      )}

      {/* 🛰️ FOOTER */}
      <div className="p-6 mt-auto">
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between">
            <span className="text-[10px] text-white font-mono">{nodeID}</span>
            <Radio size={12} className="text-emerald-500 animate-pulse" />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase text-rose-500 bg-rose-500/10"
          >
            <LogOut size={12} />
            Terminar_Turno
          </button>
        </div>
      </div>
    </div>
  );
}
