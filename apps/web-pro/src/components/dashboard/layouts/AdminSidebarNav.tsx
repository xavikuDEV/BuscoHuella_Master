"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  PawPrint,
  Users,
  Database,
  Map as MapIcon,
  Activity,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSidebarNav() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "es";

  // Agrupamos la navegación para que sea más organizada y compacta
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
          href: `/${locale}/dashboard/municipality/zones`,
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
    <nav className="flex-1 px-4 py-4 space-y-6">
      {groups.map((group) => (
        <div key={group.title} className="space-y-1">
          <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mb-3 ml-4 opacity-50">
            {group.title}
          </p>
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
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-tight transition-all group",
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                    : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/30",
                )}
              >
                <item.icon
                  size={16}
                  className={cn(
                    "transition-transform group-hover:scale-110",
                    isActive ? "text-cyan-400" : "text-slate-600",
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
