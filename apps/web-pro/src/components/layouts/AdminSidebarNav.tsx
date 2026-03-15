"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

export default function AdminSidebarNav() {
  const pathname = usePathname();
  const { locale } = useParams(); // 🌐 Capturamos 'es', 'en', etc.

  const navItems = [
    {
      name: "Panel de Control",
      href: `/${locale}/dashboard/admin`,
      icon: "📊",
    },
    {
      name: "Gestión de Mascotas",
      href: `/${locale}/dashboard/admin/pets`,
      icon: "🐾",
    },
    {
      name: "Gestión de Usuarios",
      href: `/${locale}/dashboard/admin/users`,
      icon: "👥",
    },
    {
      name: "Caja Negra (Logs)",
      href: `/${locale}/dashboard/admin/logs`,
      icon: "📓",
    },
  ];

  return (
    <div className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              isActive
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent"
            }`}
          >
            <span className="text-sm">{item.icon}</span>
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}
