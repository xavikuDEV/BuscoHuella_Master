export default function VetDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-cyan-500/20 pb-4">
        <h1 className="text-4xl font-black text-white uppercase italic">
          Consola <span className="text-cyan-500">Clínica</span>
        </h1>
        <p className="text-slate-500 text-xs tracking-widest uppercase">
          Servicios Profesionales Verificados
        </p>
      </header>
      <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 text-center">
        <p className="text-slate-400 font-mono">
          Gestión de Clientes y Vacunas [MÓDULO EN DESARROLLO]
        </p>
      </div>
    </div>
  );
}
