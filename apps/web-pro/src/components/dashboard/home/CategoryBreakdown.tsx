"use client";

export default function CategoryBreakdown({ users }: { users: any[] }) {
  const roles = [
    { label: "Seguridad / Policía", key: "POLICE", color: "bg-blue-500" },
    { label: "Ayuntamientos", key: "CITY_COUNCIL", color: "bg-indigo-500" },
    { label: "Rescatistas / ONG", key: "NGO", color: "bg-emerald-500" },
    { label: "Ciudadanos", key: "USER", color: "bg-slate-500" },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 h-full shadow-2xl">
      <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 italic">
        Distribución de Fuerzas
      </h3>
      <div className="space-y-6">
        {roles.map((role) => {
          const count = users.filter((u) => u.role === role.key).length;
          const percentage = users.length ? (count / users.length) * 100 : 0;

          return (
            <div key={role.key} className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-slate-400">
                <span>{role.label}</span>
                <span className="text-white">{count}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full ${role.color} transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
