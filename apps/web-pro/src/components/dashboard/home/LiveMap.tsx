"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Radar, ShieldCheck, Activity } from "lucide-react";
import "leaflet/dist/leaflet.css";

// 📡 Cargamos el motor del mapa sin SSR
const MapEngine = dynamic(
  () => import("./MapInner"), // Vamos a crear este archivo a continuación
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center rounded-[3rem] border border-slate-800">
        <Radar className="w-12 h-12 text-cyan-500 animate-spin" />
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mt-4">
          Sincronizando Radar...
        </p>
      </div>
    ),
  },
);

export default function LiveMap({
  pets = [],
  incidents = [],
  sector = "ALL",
}: any) {
  return (
    <div className="h-full w-full relative rounded-[3.5rem] overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 group">
      {/* 🛰️ INTERFAZ TÁCTICA SUPERPUESTA */}
      <div className="absolute top-8 left-8 z-1000 pointer-events-none space-y-3">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            <span className="text-xs font-black text-white uppercase tracking-tighter">
              Sabadell_Grid_Radar
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[8px] font-mono text-slate-500 uppercase">
                Frecuencia
              </p>
              <p className="text-[10px] font-bold text-cyan-400">{sector}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[8px] font-mono text-slate-500 uppercase">
                Activos_Red
              </p>
              <p className="text-[10px] font-bold text-white">
                {pets.length + incidents.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🗺️ EL MOTOR DEL MAPA */}
      <MapEngine pets={pets} incidents={incidents} />

      {/* 🟢 ESCÁNER VISUAL (GLITCH) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.3)] z-1001 animate-scanline pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.8)] z-999" />
    </div>
  );
}
