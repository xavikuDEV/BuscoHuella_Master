"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebarNav() {
  const pathname = usePathname();
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
    <>
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

      <Link
        href="/es/dashboard/admin/users"
        className={navItemClasses("/es/dashboard/admin/users")}
      >
        <span className="mr-3 text-lg">👥</span> Gestión de Usuarios
      </Link>
    </>
  );
}
