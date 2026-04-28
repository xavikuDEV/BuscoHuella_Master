import { Navigation } from "lucide-react";
import { saveSectorAction } from "@/lib/actions/incidents.actions";
import ZonesClientWrapper from "@/components/dashboard/home/ZonesClientWrapper";

export default async function MunicipalityZonesPage() {
  // 🛰️ Protocolo de Guardado (Server Action)
  async function handleSave(name: string, geojson: any) {
    "use server";
    return await saveSectorAction(name, geojson);
  }

  return (
    <div className="space-y-8 p-4">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-3 mb-1">
          <Navigation size={14} className="text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
            Geo_Intelligence_Unit
          </span>
        </div>
        <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
          Mapa de <span className="text-emerald-500">Sectores</span>
        </h1>
      </header>

      {/* 🗺️ Este componente maneja el radar, el mapa y la lista */}
      <ZonesClientWrapper onSave={handleSave} />
    </div>
  ); 
}
