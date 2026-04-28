// apps/web-pro/src/app/[locale]/(dashboard)/dashboard/gov/[slug]/admin/page.tsx
// Panel de Ayuntamiento filtrado por ciudad (slug)

export default async function GovAdminPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-800/50 pb-6">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
          Panel <span className="text-amber-500">Ayuntamiento</span>
        </h2>
        <p className="text-slate-400 text-sm font-mono mt-2 uppercase tracking-widest">
          Municipio: <span className="text-amber-400">{slug}</span>
        </p>
      </header>
      <p className="text-slate-500 font-mono text-sm">
        🚧 Panel en construcción — Gestión municipal para {slug}
      </p>
    </div>
  );
}
