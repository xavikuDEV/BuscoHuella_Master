"use client";

export default function ThreatMonitor() {
  const threats = [
    {
      id: 1,
      type: "SECURITY",
      msg: "Intento de acceso no autorizado bloqueado (IP: 192.x.x.x)",
      status: "Blocked",
    },
    {
      id: 2,
      type: "ITERATION",
      msg: "Despliegue de nodo SBD_MASTER_V5 completado con éxito",
      status: "Success",
    },
    {
      id: 3,
      type: "ERROR",
      msg: "Fallo de sincronización en pet_dua_repo (reintentando...)",
      status: "Warning",
    },
  ];

  return (
    <div className="bg-slate-950 border border-rose-500/20 rounded-3xl p-6 font-mono text-[10px]">
      <div className="flex items-center gap-2 mb-4 text-rose-500 font-black">
        <span className="animate-pulse">●</span> LIVE THREAT & SYSTEM FEED
      </div>
      <div className="space-y-2">
        {threats.map((t) => (
          <div key={t.id} className="flex gap-3 text-slate-400">
            <span className="text-slate-600">[{t.type}]</span>
            <span className="flex-1 truncate">- {t.msg}</span>
            <span
              className={
                t.status === "Blocked" ? "text-rose-500" : "text-emerald-500"
              }
            >
              [{t.status}]
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
