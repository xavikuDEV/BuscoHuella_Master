import React from "react";
import Link from "next/link";
import { UserRole } from "@buscohuella/shared";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans">
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            BuscoHuella Admin
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
            Control Tower 🧬
          </p>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          <Link
            href="/dashboard/admin"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg bg-slate-700 text-cyan-400 border border-slate-600"
          >
            <span className="mr-3">📊</span> Dashboard
          </Link>
          <Link
            href="/dashboard/admin/pets"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-700/50 transition-all"
          >
            <span className="mr-3">🐾</span> Pets Management
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center p-3 rounded-xl bg-slate-900/50 border border-slate-700/50">
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold">
              A
            </div>
            <div className="ml-3">
              <p className="text-xs font-bold truncate">Archon Root</p>
              <p className="text-[10px] text-slate-500 uppercase">
                System Admin
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-950 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
