export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// 🏛️ Componentes Tácticos del Búnker
import AdminLayout from "@/components/layouts/AdminLayout";
import PetDetailHeader from "@/components/dashboard/pets/PetDetailHeader";
import PetQRCard from "@/components/dashboard/pets/PetQRCard";
import PetHealthHistory from "@/components/dashboard/pets/PetHealthHistory";

/**
 * 🗂️ EXPEDIENTE MAESTRO DE ACTIVO ANIMAL (V2.0)
 * Integración total: Identidad DUA + Biometría + Historial Médico + Trazabilidad Ciudadana.
 */
export default async function PetDetailPage(props: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await props.params;
  const supabase = await createClient();

  // 🛰️ EXTRACTOR DE DATOS DE ALTA FIDELIDAD
  // Resolvemos la mascota, su dueño y todo su historial médico en una sola petición
  const { data: pet, error } = await supabase
    .from("pets")
    .select(
      `
      *,
      owner:profiles!owner_id (
        id,
        display_name,
        email,
        location_city,
        role
      ),
      health_logs:pet_health_logs (
        *
      )
    `,
    )
    .eq("id", id)
    .order("performed_at", {
      foreignTable: "pet_health_logs",
      ascending: false,
    })
    .single();

  // 🛡️ PROTOCOLO DE FALLO: Si el activo no existe o el enlace está roto
  if (error || !pet) {
    console.error("🚨 Error de enlace en expediente:", error?.message);
    notFound();
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* 🔙 NAVEGACIÓN Y STATUS DE RED */}
        <nav className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Link
            href={`/${locale}/dashboard/admin/pets`}
            className="group flex items-center gap-3 text-[10px] font-black text-slate-500 hover:text-cyan-400 transition-all uppercase tracking-[0.3em]"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-800 group-hover:border-cyan-500/50 transition-all">
              ←
            </span>
            Censo de Activos
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
              Expediente:{" "}
              <span className="text-white">#{pet.id.slice(0, 8)}</span>
            </div>
            <div className="text-[9px] font-mono text-slate-700 uppercase tracking-widest bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
              Signal: <span className="text-emerald-500">Encrypted</span>
            </div>
          </div>
        </nav>

        {/* 🎴 CABECERA: Identidad Visual del Activo */}
        <PetDetailHeader pet={pet} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 🧩 COLUMNA DE DATOS (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 🧬 CARD: BIOMETRÍA Y ESTADO */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-[3.5rem] p-8 md:p-10 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-32 -mt-32" />

              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3 relative z-10">
                <span className="text-cyan-500 text-2xl">🧬</span> Biometría de
                Campo
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
                <div className="p-5 bg-slate-950/50 rounded-3xl border border-slate-800 group-hover:border-slate-700 transition-all">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-widest">
                    Género
                  </p>
                  <p className="text-sm font-bold text-white uppercase italic">
                    {pet.gender || "N/A"}
                  </p>
                </div>

                <div className="p-5 bg-slate-950/50 rounded-3xl border border-slate-800 group-hover:border-slate-700 transition-all">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-widest">
                    Linaje
                  </p>
                  <p className="text-sm font-bold text-white uppercase italic">
                    {pet.is_mixed ? "Mezcla" : "Pura Raza"}
                  </p>
                </div>

                <div className="p-5 bg-slate-950/50 rounded-3xl border border-slate-800 group-hover:border-slate-700 transition-all">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-widest">
                    Esterilizado
                  </p>
                  <p
                    className={`text-sm font-bold uppercase italic ${pet.is_sterilized ? "text-emerald-400" : "text-slate-500"}`}
                  >
                    {pet.is_sterilized ? "SÍ" : "NO"}
                  </p>
                </div>

                <div className="p-5 bg-slate-950/50 rounded-3xl border border-slate-800 group-hover:border-slate-700 transition-all">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-widest">
                    Vacunación
                  </p>
                  <p
                    className={`text-sm font-bold uppercase italic ${pet.is_vaccinated ? "text-emerald-400" : "text-rose-400 animate-pulse"}`}
                  >
                    {pet.is_vaccinated ? "AL DÍA" : "PENDIENTE"}
                  </p>
                </div>
              </div>
            </section>

            {/* 🏥 FASE B: HISTORIAL MÉDICO (TIMELINE) */}
            <PetHealthHistory logs={pet.health_logs || []} />
          </div>

          {/* 🛡️ COLUMNA DE CONTROL (1/3) */}
          <aside className="space-y-8">
            {/* ⚡ FASE A: IDENTIDAD FÍSICA (QR) */}
            <PetQRCard pet={pet} />

            {/* 👤 CARD: RESPONSABLE CIUDADANO */}
            <div className="bg-indigo-600 rounded-[3.5rem] p-10 text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl group-hover:scale-150 transition-transform duration-1000" />

              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full" />
                Responsable Legal
              </p>

              <h4 className="text-3xl font-black leading-none mb-3 tracking-tighter uppercase italic">
                {pet.owner.display_name}
              </h4>
              <p className="text-xs opacity-80 font-mono mb-8">
                {pet.owner.email}
              </p>

              <div className="pt-8 border-t border-white/10">
                <Link
                  href={`/${locale}/dashboard/admin/users/${pet.owner.id}`}
                  className="flex items-center justify-between group/link"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Acceder al Perfil
                  </span>
                  <span className="transform group-hover/link:translate-x-2 transition-transform">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* 📍 GEOLOCALIZACIÓN REGISTRADA */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 group">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">
                Última Ubicación Conocida
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-950 flex items-center justify-center text-xl border border-slate-800 group-hover:border-emerald-500/30 transition-all">
                  📍
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-tight leading-none">
                    {pet.owner.location_city || "Sector Desconocido"}
                  </p>
                  <p className="text-[9px] text-slate-500 font-black uppercase mt-1">
                    Región Cataluña
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AdminLayout>
  );
}
