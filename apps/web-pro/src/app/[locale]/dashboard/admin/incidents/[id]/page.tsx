import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import AdminLayout from "@/components/dashboard/layouts/AdminLayout";
import { Target, ShieldAlert, Zap } from "lucide-react";

// Componentes Tácticos Modulares
import IncidentHeader from "@/components/dashboard/incidents/detail/IncidentHeader";
import IncidentTacticalMap from "@/components/dashboard/incidents/detail/IncidentTacticalMap";
import IncidentIssuerInfo from "@/components/dashboard/incidents/detail/IncidentIssuerInfo";
import IncidentActions from "@/components/dashboard/incidents/detail/IncidentActions";
import IncidentChat from "@/components/dashboard/incidents/detail/IncidentChat";
import IncidentTimeline from "@/components/dashboard/incidents/detail/IncidentTimeline";
import IncidentMediaVault from "@/components/dashboard/incidents/detail/IncidentMediaVault";

interface IncidentDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function IncidentDetailPage({
  params,
}: IncidentDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 🛰️ EXTRACCIÓN DE DATOS FORENSES
  // Disambiguamos la relación con 'profiles' usando el nombre de la FK específica del reportero
  const { data: incident, error } = await supabase
    .from("incidents")
    .select(
      `
      *,
      sectors(name),
      reporter:profiles!incidents_reporter_id_fkey(*)
    `,
    )
    .eq("id", id)
    .single();

  // Gestión de Errores de Conectividad o Datos
  if (error) {
    console.error("❌ ERROR_CRÍTICO_BÚNKER:", {
      msg: error.message,
      hint: error.hint,
      code: error.code,
    });
    notFound();
  }

  if (!incident) notFound();

  return (
    <AdminLayout>
      <main className="p-6 md:p-12 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-1000 max-w-[1700px] mx-auto">
        {/* 1. CABECERA OPERATIVA */}
        <IncidentHeader incident={incident} />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
          {/* SECTOR IZQUIERDO: VISUALIZACIÓN Y NARRATIVA (3/4) */}
          <div className="xl:col-span-3 space-y-10">
            {/* MAPA DE PRECISIÓN MILITAR */}
            <IncidentTacticalMap incident={incident} />

            {/* INFORME DETALLADO DEL SUCESO */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10 backdrop-blur-xl relative overflow-hidden group shadow-2xl transition-all hover:border-slate-700">
              {/* Marca de agua táctica */}
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity pointer-events-none">
                <Target size={250} />
              </div>

              <div className="flex items-center gap-4 mb-10">
                <div className="h-px w-12 bg-cyan-500/40" />
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic">
                  Incident_Narrative_Report
                </h3>
              </div>

              <p className="text-3xl md:text-4xl text-white leading-[1.15] italic font-medium relative z-10 max-w-5xl tracking-tight selection:bg-cyan-500/30">
                "{incident.message}"
              </p>

              {/* GRID DE METADATOS TÉCNICOS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 pt-12 border-t border-slate-800/50">
                <DataField
                  label="Sector_Detectado"
                  value={incident.sectors?.name}
                  color="text-emerald-400"
                  sub="Malla_Geotáctica_Alpha"
                  icon={Zap}
                />
                <DataField
                  label="Coordenadas_GPS"
                  value={`${incident.lat?.toFixed(6) || "0.0"}, ${incident.lng?.toFixed(6) || "0.0"}`}
                  color="text-white font-mono"
                  sub="WGS84_Satellite_Fix"
                />
                <DataField
                  label="ID_PROTOCOLO"
                  value={`BH-${incident.id.slice(0, 8).toUpperCase()}`}
                  color="text-slate-500"
                  sub="Registry_Checksum_Validated"
                />
              </div>
            </div>

            {/* BÓVEDA DE ARCHIVOS MULTIMEDIA */}
            <IncidentMediaVault photos={incident.photos || []} />
          </div>

          {/* SECTOR DERECHO: CONTROL Y COMUNICACIONES (1/4) */}
          <aside className="space-y-8 flex flex-col">
            {/* PANEL DE ACCIONES INMEDIATAS */}
            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-4 flex items-center gap-2">
                <span className="h-1 w-1 bg-rose-500 rounded-full animate-pulse" />
                Operaciones_de_Mando
              </p>
              <IncidentActions
                status={incident.status}
                incidentId={incident.id}
              />
            </div>

            {/* INFORMACIÓN DEL ORIGEN (REPORTERO) */}
            <IncidentIssuerInfo reporter={incident.reporter} />

            {/* CANAL DE COMUNICACIÓN ENcriptado */}
            <IncidentChat incidentId={incident.id} />

            {/* HISTORIAL CRONOLÓGICO */}
            <div className="bg-slate-950/40 border border-slate-900 rounded-[2.5rem] p-8 shadow-inner mt-auto">
              <IncidentTimeline incident={incident} />
            </div>
          </aside>
        </div>
      </main>
    </AdminLayout>
  );
}

/** * 🧩 DataField: Sub-componente interno para estandarizar la visualización de datos
 */
function DataField({
  label,
  value,
  color,
  sub,
  icon: Icon,
}: {
  label: string;
  value?: string;
  color: string;
  sub: string;
  icon?: any;
}) {
  return (
    <div className="space-y-4 group cursor-default">
      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none flex items-center gap-2">
        <span className="h-1.5 w-1.5 bg-slate-800 rounded-full group-hover:bg-cyan-500/50 transition-colors" />
        {label}
      </p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} className={color} />}
          <p
            className={`text-xl font-black uppercase tracking-tighter ${color}`}
          >
            {value || "DATOS_NO_DISPONIBLES"}
          </p>
        </div>
        <p className="text-[7px] font-mono text-slate-700 uppercase tracking-[0.2em]">
          {sub}
        </p>
      </div>
    </div>
  );
}
