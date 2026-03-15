export const dynamic = "force-dynamic";

import React from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { createClient } from "@/lib/supabase/server";

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

export default async function AdminDashboardPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sector?: string }>;
}) {
  const { sector } = await props.searchParams;
  const supabase = await createClient();

  const activeSector = sector || "ALL";
  const isGlobal = activeSector === "ALL";

  // 📥 CONSULTAS DINÁMICAS MULTI-STREAM
  let petsQuery = supabase.from("pets").select("*");
  let usersQuery = supabase.from("profiles").select("*");
  let incidentsQuery = supabase.from("incidents").select("*, pets(name)");
  let logsQuery = supabase
    .from("system_logs")
    .select(`*, profiles:user_id ( display_name )`);

  if (!isGlobal) {
    petsQuery = petsQuery.eq("sector", activeSector);
    usersQuery = usersQuery.eq("location_sector", activeSector);
    incidentsQuery = incidentsQuery.eq("sector", activeSector);
    // Los logs suelen ser globales del sistema, pero podemos filtrarlos por usuario si fuera necesario
  }

  const [petsRes, usersRes, logsRes, incidentsRes] = await Promise.all([
    petsQuery,
    usersQuery,
    logsQuery.order("created_at", { ascending: false }).limit(20),
    incidentsQuery.order("created_at", { ascending: false }).limit(10),
  ]);

  const stats = {
    pets: petsRes.data || [],
    users: usersRes.data || [],
    logs: logsRes.data || [],
    incidents: incidentsRes.data || [],
  };

  return (
    <AdminLayout>
      <RealtimeRefresher />
      <div className="space-y-8 animate-in fade-in duration-700 pb-10">
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

        <DashboardStats
          pets={stats.pets}
          users={stats.users}
          sector={activeSector}
        />

        {/* 📊 GRÁFICO MULTI-STREAM CON TODOS LOS DATOS */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3">
            <ActivityChart
              pets={stats.pets}
              users={stats.users}
              incidents={stats.incidents}
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
              initialIncidents={stats.incidents}
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
