export const dynamic = "force-dynamic";

import React from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { UserRepository, UserProfile, UserRole } from "@buscohuella/shared";
import { createClient } from "@/lib/supabase/server";
// 🛡️ REVISA ESTA IMPORTACIÓN: Que sea ManageUsersClient y NO ManageLogsClient
import ManageUsersClient from "@/components/dashboard/ManageUsersClient";
import { logSystemEvent } from "../logs/actions";

export default async function UsersAdminPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  const userRepo = new UserRepository(supabase);

  // 🛰️ Extracción de datos
  const { data, error } = await userRepo.findAll();

  // 🛡️ Blindaje total: Si data es null, usamos un array vacío
  const users = (data as UserProfile[]) || [];

  if (error) {
    await logSystemEvent({
      level: "ERROR",
      module: "USERS_ADMIN",
      message: `Fallo de sincronización de nodos: ${error.message}`,
      context: error,
    });
  }

  // 📊 Estadísticas Pro blindadas (usando la variable 'users' ya validada)
  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === UserRole.ARCHON).length,
    vets: users.filter((u) => u.role === UserRole.VET).length,
    police: users.filter((u) => u.role === UserRole.POLICE).length,
    civils: users.filter((u) => u.role === UserRole.USER).length,
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* CABECERA */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800/50 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
                Censo <span className="text-indigo-400">Humano</span>
              </h2>
            </div>
            <p className="text-slate-500 font-medium">
              Protocolo de control de identidades y privilegios del sistema
              BuscoHuella.
            </p>
          </div>

          <div className="flex gap-3">
            <StatCard label="Total Nodos" value={stats.total} color="slate" />
            <StatCard
              label="Especialistas"
              value={stats.vets + stats.police}
              color="indigo"
            />
          </div>
        </header>

        {/* TABLA DE GESTIÓN */}
        <div className="relative group">
          <div className="absolute -top-6 right-4 text-[9px] font-black text-slate-700 tracking-[0.2em] uppercase">
            Data Stream: Human_Identity_Secure
          </div>
          {/* 🛡️ Inyectamos los datos y el ID actual */}
          <ManageUsersClient users={users} currentUserId={authUser?.id || ""} />
        </div>

        {/* FOOTER STATS */}
        <footer className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800/50">
          <FooterStat
            label="Archons"
            value={stats.admins}
            sub="Control Total"
          />
          <FooterStat label="Vets" value={stats.vets} sub="Certificadores" />
          <FooterStat label="Police" value={stats.police} sub="Autoridad" />
          <FooterStat label="Civils" value={stats.civils} sub="Ciudadanía" />
        </footer>
      </div>
    </AdminLayout>
  );
}

// --- AUXILIARES (Sin cambios, solo por completitud) ---
function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "slate" | "indigo";
}) {
  const styles = {
    slate: "bg-slate-900/50 border-slate-800",
    indigo: "bg-indigo-500/10 border-indigo-500/20",
  };
  return (
    <div
      className={`${styles[color]} border px-5 py-3 rounded-2xl shadow-xl backdrop-blur-sm`}
    >
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-2xl font-black text-white leading-none">{value}</p>
    </div>
  );
}

function FooterStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <div className="bg-slate-900/20 p-4 rounded-2xl border border-transparent hover:border-slate-800 transition-all text-center">
      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
        {label}
      </p>
      <p className="text-xl font-black text-white my-1">{value}</p>
      <p className="text-[8px] text-slate-500 font-medium uppercase tracking-tighter">
        {sub}
      </p>
    </div>
  );
}
