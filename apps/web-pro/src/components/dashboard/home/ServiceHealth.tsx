"use client";

export default function ServiceHealth() {
  const services = [
    { name: "Supabase DB", status: "online", latency: "24ms" },
    { name: "GitHub Repo", status: "online", latency: "110ms" },
    { name: "Vercel Edge", status: "online", latency: "5ms" },
    { name: "Tests CI/CD", status: "passing", latency: "100%" },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 h-full shadow-2xl">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">
        Service_Infrastructure
      </p>
      <div className="grid grid-cols-1 gap-3">
        {services.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800 group hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${s.status === "online" ? "bg-emerald-500 animate-pulse" : "bg-emerald-500"}`}
              />
              <p className="text-[10px] font-black text-white uppercase">
                {s.name}
              </p>
            </div>
            <p className="text-[10px] font-mono text-slate-600 group-hover:text-cyan-400 transition-colors">
              {s.latency}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
