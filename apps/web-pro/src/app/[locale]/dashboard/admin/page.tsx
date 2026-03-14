import { redirect } from "next/navigation";
import { UserRole, PetRepository } from "@buscohuella/shared";
import AdminLayout from "@/components/layouts/AdminLayout";
import { supabase } from "@/lib/supabase";

export default async function AdminDashboardPage() {
  // 1. Blindaje de Rol (Simulado por ahora)
  const user = { role: UserRole.ADMIN };

  if (user.role !== UserRole.ADMIN) {
    redirect("/login");
  }

  // 2. Datos Reales (DUA Metrics)
  const petRepo = new PetRepository(supabase);
  const { data: allPets } = await petRepo.findAll();
  const totalPets = allPets?.length || 0;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-slate-400 mt-2">
            Monitoreo de la integridad del DUA y ecosistema global.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <span className="text-2xl">🐾</span>
            <p className="text-slate-500 text-sm font-medium mt-4">
              Total Mascotas DUA
            </p>
            <h3 className="text-4xl font-bold text-white mt-1">{totalPets}</h3>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <span className="text-2xl">🛡️</span>
            <p className="text-slate-500 text-sm font-medium mt-4">
              Estado del Búnker
            </p>
            <h3 className="text-4xl font-bold text-emerald-400 mt-1">Óptimo</h3>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <span className="text-2xl">🚀</span>
            <p className="text-slate-500 text-sm font-medium mt-4">
              Nodos Activos
            </p>
            <h3 className="text-4xl font-bold text-cyan-400 mt-1">5</h3>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
