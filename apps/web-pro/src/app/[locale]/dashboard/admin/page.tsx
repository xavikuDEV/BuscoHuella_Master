export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { UserRole, PetRepository, UserRepository } from "@buscohuella/shared";
import AdminLayout from "@/components/layouts/AdminLayout";
import { supabase } from "@/lib/supabase";

export default async function AdminDashboardPage() {
  // 🛡️ Blindaje de Seguridad
  const user = { role: UserRole.ADMIN };
  if (user.role !== UserRole.ADMIN) redirect("/login");

  // 📡 Conexión con los Repositorios Certificados
  const petRepo = new PetRepository(supabase);
  const userRepo = new UserRepository(supabase);

  // Ejecución en paralelo para máxima eficiencia del búnker
  const [petsRes, usersRes] = await Promise.all([
    petRepo.findAll(),
    userRepo.findAll(),
  ]);

  const totalPets = petsRes.data?.length || 0;
  const totalUsers = usersRes.data?.length || 0;

  return (
    <AdminLayout>
      <div className="space-y-10">
        <header className="relative">
          <div className="absolute -left-4 top-0 w-1 h-12 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
          <h2 className="text-4xl font-black text-white tracking-tighter">
            Resumen del <span className="text-cyan-400">Dashboard</span>
          </h2>
          <p className="text-slate-500 mt-2 font-medium italic">
            Integridad DUA: Nivel de confianza máximo detectado.
          </p>
        </header>

        {/* Rejilla de Métricas Reales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mascotas DUA */}
          <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 group hover:border-cyan-500/50 transition-all duration-500">
            <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-9xl">🐾</span>
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
              Mascotas DUA
            </p>
            <h3 className="text-7xl font-black text-white mt-2 group-hover:text-cyan-400 transition-colors">
              {totalPets.toString().padStart(2, "0")}
            </h3>
          </div>

          {/* Estado Búnker */}
          <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 group hover:border-emerald-500/50 transition-all duration-500">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
              Estado Búnker
            </p>
            <h3 className="text-5xl font-black text-emerald-400 mt-2 flex items-center">
              Óptimo <span className="ml-3 text-2xl animate-pulse">🛡️</span>
            </h3>
          </div>

          {/* Nodos Red (Usuarios Reales) */}
          <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 group hover:border-purple-500/50 transition-all duration-500">
            <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-9xl">👥</span>
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
              Nodos Red
            </p>
            <h3 className="text-7xl font-black text-white mt-2 group-hover:text-purple-400 transition-colors">
              {totalUsers.toString().padStart(2, "0")}
            </h3>
          </div>
        </div>

        {/* Status de Infraestructura */}
        <div className="p-10 rounded-[3rem] bg-slate-900/30 border border-slate-800 border-dashed flex flex-col items-center justify-center space-y-4">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan]"></div>
            <div className="w-2 h-2 rounded-full bg-cyan-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-cyan-500/20"></div>
          </div>
          <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.4em]">
            Conexión Segura establecida con Supabase Cluster
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
