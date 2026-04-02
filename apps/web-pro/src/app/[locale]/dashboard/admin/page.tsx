export const dynamic = "force-dynamic";

import React from "react";
import AdminLayout from "@/components/dashboard/layouts/AdminLayout";
import { createClient } from "@/lib/supabase/server";

// Componentes del Búnker
import DashboardStats from "@/components/dashboard/home/DashboardStats";
import ActivityChart from "@/components/dashboard/home/ActivityChart";
import SystemTelemetry from "@/components/dashboard/home/SystemTelemetry";
import ServiceHealth from "@/components/dashboard/home/ServiceHealth";
import IncidentReport from "@/components/dashboard/home/IncidentReport";
import CategoryBreakdown from "@/components/dashboard/home/CategoryBreakdown";
import SectorSelector from "@/components/dashboard/home/SectorSelector";
import ResourceMonitor from "@/components/dashboard/home/ResourceMonitor";
import LiveHeader from "@/components/dashboard/home/LiveHeader";
import RealtimeRefresher from "@/components/dashboard/home/RealtimeRefresher";
import LiveMap from "@/components/dashboard/home/LiveMap";
import CommandCenterClient from "@/components/dashboard/home/CommandCenterClient";

export default async function AdminDashboardPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sector?: string; sort?: string; filter?: string }>;
}) {
  const { sector } = await props.searchParams;
  const supabase = await createClient();

  const activeSector = sector || "ALL";
  const isGlobal = activeSector === "ALL";

  // 📥 1. CONSULTA PARA LA TABLA (Más reciente/crítico)
  let incidentsTableQuery = supabase
    .from("incidents")
    .select("*, pets(name)")
    .eq("status", "ACTIVE")
    .order("urgency", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(20);

  // 📥 2. CONSULTA PARA EL RADAR (Visión amplia)
  let incidentsMapQuery = supabase
    .from("incidents")
    .select("*, pets(name)")
    .eq("status", "ACTIVE")
    .limit(100);

  // Filtrado táctico por sector
  if (!isGlobal) {
    incidentsTableQuery = incidentsTableQuery.eq("sector", activeSector);
    incidentsMapQuery = incidentsMapQuery.eq("sector", activeSector);
  }

  // 📡 Ejecución en paralelo masiva (Carga de datos del Búnker)
  const [petsRes, usersRes, logsRes, tableRes, mapRes] = await Promise.all([
    supabase.from("pets").select("*"),
    supabase.from("profiles").select("*"),
    supabase
      .from("system_logs")
      .select(`*, profiles:user_id(display_name)`)
      .order("created_at", { ascending: false })
      .limit(20),
    incidentsTableQuery,
    incidentsMapQuery,
  ]);

  const stats = {
    pets: petsRes.data || [],
    users: usersRes.data || [],
    logs: logsRes.data || [],
    incidentsTable: tableRes.data || [],
    incidentsMap: mapRes.data || [],
  };

  return (
    <AdminLayout>
      <RealtimeRefresher />

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-10">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 border-b border-slate-800/50 pb-8">
          <div className="space-y-4">
            <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
              Command <span className="text-cyan-400">Center</span>
            </h2>
            <div className="flex items-center gap-4">
              <SectorSelector />
              <span className="w-1 h-1 bg-slate-800 rounded-full" />
              <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
                Focus:{" "}
                <span className={isGlobal ? "text-amber-500" : "text-cyan-400"}>
                  {activeSector}
                </span>
              </div>
            </div>
          </div>
          <LiveHeader />
        </header>

        {/* 📊 STATS: Aquí pasamos el ARRAY completo para evitar el error de tipos */}
        <DashboardStats
          pets={stats.pets}
          users={stats.users}
          incidents={stats.incidentsMap}
          sector={activeSector}
        />

        {/* 🗺️ COMMAND CENTER: Grid Táctico + Click-to-Alert + Filtros */}
        <CommandCenterClient
          pets={stats.pets}
          incidents={stats.incidentsMap}
          sector={activeSector}
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3">
            <ActivityChart
              pets={stats.pets}
              users={stats.users}
              incidents={stats.incidentsMap}
              logs={stats.logs}
            />
          </div>
          <div className="xl:col-span-1">
            <ResourceMonitor sector={activeSector} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">
          <div className="lg:col-span-1">
            <CategoryBreakdown users={stats.users} />
          </div>
          <div className="lg:col-span-2">
            <IncidentReport
              sector={activeSector}
              initialIncidents={stats.incidentsTable}
            />
          </div>
          <div className="lg:col-span-1">
            <SystemTelemetry logs={stats.logs} />
          </div>
        </div>

        <ServiceHealth />
      </div>
    </AdminLayout>
  );
}
