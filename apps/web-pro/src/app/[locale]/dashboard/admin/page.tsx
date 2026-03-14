export const dynamic = "force-dynamic"; // 🛡️ Evita el caché para ver datos en tiempo real

import { redirect } from "next/navigation";
import { UserRole, PetRepository } from "@buscohuella/shared";
import AdminLayout from "@/components/layouts/AdminLayout";
import { supabase } from "@/lib/supabase";

export default async function AdminDashboardPage() {
  // 1. Blindaje de Rol (Simulado)
  const user = { role: UserRole.ADMIN };

  if (user.role !== UserRole.ADMIN) {
    redirect("/login");
  }

  // 2. Extracción de Datos del Búnker (DUA Metrics)
  const petRepo = new PetRepository(supabase);

  // Capturamos el error para diagnosticar el RLS
  const { data: allPets, error } = await petRepo.findAll();

  if (error) {
    console.error("❌ [Bunker Error]:", error.message);
  }

  const totalPets = allPets?.length || 0;

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Cabecera */}
        <header className="relative">
          <div className="absolute -left-4 top-0 w-1 h-12 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
          <h2 className="text-4xl font-black text-white tracking-tighter">
            Resumen del <span className="text-cyan-400">Dashboard</span>
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Monitorización en tiempo real de la integridad del DUA.
          </p>
        </header>

        {/* Diagnóstico de RLS (Solo visible si hay 0 mascotas) */}
        {totalPets === 0 && !error && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <p className="text-amber-500 text-xs font-bold uppercase tracking-widest">
              ⚠️ Nota del Sistema: Se detectan 0 mascotas. Verifica las
              políticas RLS en Supabase.
            </p>
          </div>
        )}

        {/* Rejilla de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 group hover:border-cyan-500/50 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="text-7xl">🐾</span>
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
              Mascotas DUA
            </p>
            <h3 className="text-6xl font-black text-white mt-2 group-hover:text-cyan-400 transition-colors">
              {totalPets}
            </h3>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 group hover:border-emerald-500/50 transition-all">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
              Estado Búnker
            </p>
            <h3 className="text-5xl font-black text-emerald-400 mt-2">
              Óptimo
            </h3>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 group hover:border-purple-500/50 transition-all">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
              Nodos Red
            </p>
            <h3 className="text-6xl font-black text-white mt-2 group-hover:text-purple-400 transition-colors">
              05
            </h3>
          </div>
        </div>

        {/* Footer Informativo */}
        <div className="p-10 rounded-[3rem] bg-slate-900/50 border border-slate-800 border-dashed text-center">
          <p className="text-slate-500 text-sm">
            Conectado a Supabase:{" "}
            <span className="text-slate-300 font-mono">
              {process.env.NEXT_PUBLIC_SUPABASE_URL}
            </span>
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
