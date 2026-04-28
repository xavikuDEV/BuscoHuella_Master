// apps/web-pro/src/app/[locale]/(dashboard)/dashboard/me/pets/page.tsx
// Panel del Ciudadano — Mis Mascotas

export default async function MyPetsPage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-slate-800/50 pb-6">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
          Mis <span className="text-violet-500">Mascotas</span>
        </h2>
        <p className="text-slate-400 text-sm font-mono mt-2 uppercase tracking-widest">
          Zona Personal — Ciudadano
        </p>
      </header>
      <p className="text-slate-500 font-mono text-sm">
        🚧 Panel en construcción — Registro y seguimiento de tus animales
      </p>
    </div>
  );
}
