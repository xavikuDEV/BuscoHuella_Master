export default async function PoliceCityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="space-y-6">
      <header className="border-b border-rose-500/20 pb-4">
        <h1 className="text-4xl font-black text-white uppercase italic">
          Unidad Táctica:{" "}
          <span className="text-rose-500">{slug.toUpperCase()}</span>
        </h1>
        <p className="text-slate-500 text-xs tracking-widest uppercase">
          Fuerzas de Seguridad - BuscoHuella
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <p className="text-slate-500 text-[10px] uppercase font-bold">
            Estado del Sector
          </p>
          <p className="text-2xl font-mono text-emerald-400">PATRULLANDO</p>
        </div>
        {/* Aquí irán más micro-stats de policía */}
      </div>

      <div className="h-[400px] bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl flex items-center justify-center">
        <p className="text-slate-600 font-mono text-sm tracking-tighter">
          {" "}
          Radar de Incidencias en {slug} ... [PRÓXIMAMENTE]
        </p>
      </div>
    </div>
  );
}
