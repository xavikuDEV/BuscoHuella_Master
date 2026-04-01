import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import AdminLayout from "@/components/dashboard/layouts/AdminLayout";

// Next.js 15: params debe ser una Promesa
export default async function IncidentDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();

  // 🛰️ Consulta táctica: traemos el incidente y el nombre del sector si existe
  const { data: incident, error } = await supabase
    .from("incidents")
    .select("*")
    .eq("id", id)
    .single();

  // Si no existe en la DB o hay error crítico, disparamos el 404 de Next.js
  if (!incident || error) {
    console.error("❌ Error al recuperar incidente:", error);
    notFound();
  }

  return (
    <AdminLayout>
      <div className="p-10 space-y-8 animate-in fade-in duration-500">
        <header className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
              DETALLE DE <span className="text-rose-500">INCIDENCIA</span>
            </h1>
            <p className="text-slate-500 font-mono text-[10px] mt-4 uppercase tracking-widest">
              ID_PROTOCOLO: {id}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
            <span
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                incident.status === "ACTIVE"
                  ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                  : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
              }`}
            >
              ESTADO: {incident.status}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 backdrop-blur-md shadow-2xl">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8 italic">
              Informe del Suceso
            </h3>
            <p className="text-2xl text-white leading-tight italic font-medium">
              "{incident.message}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 border-t border-slate-800 pt-10">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                  Categoría
                </p>
                <p className="text-md font-bold text-white uppercase tracking-tight">
                  {incident.type}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                  Urgencia
                </p>
                <p className="text-md font-bold text-rose-400 uppercase tracking-tight">
                  {incident.urgency}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                  Sector Detectado
                </p>
                <p className="text-sm font-bold text-emerald-400 uppercase tracking-tight">
                  {incident.sectors?.name || "FUERA_DE_RANGO"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-4 h-[450px] overflow-hidden shadow-2xl">
            <div className="w-full h-full bg-slate-900 rounded-4xl flex items-center justify-center border border-slate-800 relative">
              <div className="text-center space-y-3">
                <div className="text-emerald-500 text-3xl animate-pulse">
                  📍
                </div>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  RADAR_LOCK_COORD:
                  <br />
                  <span className="text-white">
                    {incident.lat}, {incident.lng}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
