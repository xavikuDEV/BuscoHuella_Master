import React from "react";
import {
  SYSTEM_NAME,
  PetRepository,
  UserRepository,
  IncidentRepository,
  supabase,
} from "@buscohuella/shared";

// Componentes Tácticos de la Interfaz
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

export const dynamic = "force-dynamic";

export default async function AdminPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sector?: string; sort?: string; filter?: string }>;
}) {
  const { sector } = await props.searchParams;
  const activeSector = sector || "ALL";
  const isGlobal = activeSector === "ALL";

  const petRepo = new PetRepository(supabase);
  const userRepo = new UserRepository(supabase);
  const incidentRepo = new IncidentRepository(supabase);

  // 📡 Carga de Datos Paralela
  const [petsRes, usersRes, incidentsRes, logsRes] = await Promise.all([
    petRepo.findAll(),
    userRepo.findAll(),
    incidentRepo.fetchActive(),
    supabase
      .from("system_logs")
      .select(`*, profiles:user_id(display_name)`)
      .limit(10)
      .order("created_at", { ascending: false }),
  ]);

  const stats = {
    pets: petsRes.data || [],
    users: usersRes.data || [],
    incidents: incidentsRes.data || [],
    logs: logsRes.data || [],
  };

  return (
    <>
      {" "}
      {/* 👈 Fragmento para agrupar sin duplicar Layout */}
      <RealtimeRefresher />
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-10">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 border-b border-slate-800/50 pb-8">
          <div className="space-y-4">
            <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
              Command <span className="text-emerald-500">Center</span>
            </h2>
            <div className="flex items-center gap-4">
              <SectorSelector />
              <span className="w-1 h-1 bg-slate-800 rounded-full" />
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
                Sabadell Focus:{" "}
                <span
                  className={isGlobal ? "text-amber-500" : "text-emerald-400"}
                >
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
          incidents={stats.incidents}
          sector={activeSector}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <LiveMap />
          </div>
          <div className="xl:col-span-1">
            <CommandCenterClient
              pets={stats.pets}
              incidents={stats.incidents}
              sector={activeSector}
            />
          </div>
        </div>

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
      <footer className="mt-8 text-[10px] font-mono text-slate-600 uppercase tracking-widest text-center">
        {SYSTEM_NAME} PRO Infrastructure | Sabadell Ops | Cimientos Sellados ✅
      </footer>
    </>
  );
}
