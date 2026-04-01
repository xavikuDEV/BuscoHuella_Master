import { Navigation } from "lucide-react";
import SectorCanvas from "@/components/dashboard/home/SectorCanvas";
import { saveSectorAction } from "@/app/[locale]/dashboard/actions/incidents";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/dashboard/layouts/AdminLayout"; // 👈 Importamos el Layout

export default async function MunicipalityZonesPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/login`);

  async function handleSave(name: string, geojson: any) {
    "use server";
    return await saveSectorAction(name, geojson, user!.id);
  }

  return (
    <AdminLayout>
      {" "}
      {/* 👈 Envolvemos con el Layout */}
      <div className="h-[calc(100vh-80px)] flex flex-col gap-6 animate-in fade-in duration-500">
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

        {/* Contenedor del Canvas de dibujo */}
        <div className="flex-1 min-h-0 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          <SectorCanvas onSaveSector={handleSave} />
        </div>
      </div>
    </AdminLayout>
  );
}
