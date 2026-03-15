"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SystemStatus() {
  const [latency, setLatency] = useState<number | null>(null);
  const [status, setStatus] = useState("Measuring...");
  const supabase = createClient();

  useEffect(() => {
    const checkPulse = async () => {
      const start = Date.now();
      const { error } = await supabase
        .from("system_logs")
        .select("id")
        .limit(1);

      if (!error) {
        setLatency(Date.now() - start);
        setStatus("Activa");
      } else {
        setStatus("Interferencia");
      }
    };

    checkPulse();
    const interval = setInterval(checkPulse, 5000); // 👈 Actualiza cada 5 seg
    return () => clearInterval(interval);
  }, [supabase]);

  return (
    <div className="flex items-center gap-8 w-full">
      <div className="flex items-center gap-2">
        <div
          className={`w-1.5 h-1.5 rounded-full ${status === "Activa" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
        />
        <div className="flex flex-col">
          <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">
            Conexión
          </span>
          <span className="text-[9px] font-bold text-slate-300 uppercase">
            {status}
          </span>
        </div>
      </div>

      <div className="flex flex-col border-l border-slate-800 pl-8">
        <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">
          Latencia
        </span>
        <span
          className={`text-[9px] font-mono font-bold ${latency && latency > 200 ? "text-amber-500" : "text-cyan-500"}`}
        >
          {latency ? `${latency}ms` : "---"}
        </span>
      </div>

      <div className="flex flex-col border-l border-slate-800 pl-8">
        <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">
          Integridad
        </span>
        <span className="text-[9px] font-bold text-emerald-500 uppercase">
          DUA OK
        </span>
      </div>
    </div>
  );
}
