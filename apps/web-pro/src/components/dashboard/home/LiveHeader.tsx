"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LiveHeader() {
  // 🛡️ Inicializamos en null para evitar que el servidor y el cliente intenten adivinar la hora
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true); // Marcamos que el componente ya está en el cliente
    setTime(new Date());

    const timer = setInterval(() => setTime(new Date()), 1000);
    const measureLatency = async () => {
      const start = Date.now();
      await supabase.from("system_logs").select("id").limit(1);
      setLatency(Date.now() - start);
    };

    measureLatency();
    const latencyTimer = setInterval(measureLatency, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(latencyTimer);
    };
  }, [supabase]);

  // Si no está montado, renderizamos un placeholder invisible con la misma estructura
  // Esto evita que React vea diferencias entre el HTML del servidor y el del cliente.
  if (!mounted || !time) {
    return (
      <div className="flex gap-8 font-mono opacity-0">
        <div className="w-48 h-10" />
      </div>
    );
  }

  return (
    <div className="flex gap-8 font-mono animate-in fade-in duration-500">
      <div className="text-right">
        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">
          Network_Pulse
        </p>
        <p
          className={`text-xs font-black ${latency && latency > 150 ? "text-rose-500" : "text-cyan-400"}`}
        >
          {latency ? `${latency}ms` : "---"}
        </p>
      </div>
      <div className="text-right border-l border-slate-800 pl-8">
        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">
          Local_Time
        </p>
        <p className="text-slate-400 text-xs font-black uppercase italic tracking-tighter">
          {time.toLocaleTimeString()}{" "}
          <span className="text-slate-700 ml-1">SBD</span>
        </p>
      </div>
    </div>
  );
}
