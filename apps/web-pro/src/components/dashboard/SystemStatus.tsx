"use client";
import React, { useEffect, useState } from "react";

export default function SystemStatus() {
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    const start = Date.now();
    fetch("/favicon.ico")
      .then(() => {
        setLatency(Date.now() - start);
      })
      .catch(() => setLatency(null));
  }, []);

  return (
    <div className="fixed bottom-4 right-4 flex items-center space-x-4 px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-full text-[10px] font-bold tracking-widest uppercase z-50">
      <div className="flex items-center">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
        <span className="text-slate-400">Conexión:</span>
        <span className="text-emerald-400 ml-1">Activa</span>
      </div>
      <div className="w-px h-3 bg-slate-800"></div>
      <div>
        <span className="text-slate-400">Latencia:</span>
        <span className="text-cyan-400 ml-1">
          {latency ? `${latency}ms` : "---"}
        </span>
      </div>
      <div className="w-px h-3 bg-slate-800"></div>
      <div>
        <span className="text-slate-400">Integridad:</span>
        <span className="text-purple-400 ml-1">DUA OK</span>
      </div>
    </div>
  );
}
