import { createClient } from "@/lib/supabase/server";
import PatrolDashboard from "@/components/dashboard/home/PatrolDashboard";
import LiveMap from "@/components/dashboard/home/LiveMap";

export default async function PoliceCityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, role, assigned_sector_id")
    .eq("id", user.id)
    .single();

  let sectorName = "Sin sector asignado";
  if (profile?.assigned_sector_id) {
    const { data: sectorData } = await supabase
      .from("sectors")
      .select("name")
      .eq("id", profile.assigned_sector_id)
      .single();
    if (sectorData) sectorName = sectorData.name;
  }

  const safeUser = {
    id: profile?.id || user.id,
    display_name: profile?.display_name || user.email || "Oficial",
    role: profile?.role || "police",
    assigned_sector_id: profile?.assigned_sector_id || null,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
          Unidad Táctica:{" "}
          <span className="text-cyan-500">{slug.toUpperCase()}</span>
        </h1>
        <p className="text-slate-500 text-xs tracking-widest uppercase mt-1">
          Fuerzas de Seguridad - Panel de Guardia
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <PatrolDashboard user={safeUser} sectorName={sectorName} />
        </div>
        <div className="lg:col-span-2 h-[600px]">
          <LiveMap sector={sectorName} />
        </div>
      </div>
    </div>
  );
}
