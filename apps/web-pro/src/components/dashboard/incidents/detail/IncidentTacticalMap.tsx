"use client";
import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("@/components/dashboard/home/LiveMap"), {
  ssr: false,
});

export default function IncidentTacticalMap({ incident }: { incident: any }) {
  if (!incident?.lat || !incident?.lng) return null;

  return (
    <div className="h-[450px] rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl relative">
      <LiveMap
        incidents={[incident]}
        sector={incident.sectors?.name}
        // Forzamos el enfoque directo en el objetivo
        //@ts-ignore
        forceCenter={[incident.lat, incident.lng]}
        forceZoom={18}
      />
    </div>
  );
}
