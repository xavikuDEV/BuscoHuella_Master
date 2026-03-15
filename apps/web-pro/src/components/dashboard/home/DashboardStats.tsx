"use client";

import React from "react";

interface DashboardStatsProps {
  pets: any[];
  users: any[];
  sector?: string; // 👈 Opcional para mostrar en el UI
}

export default function DashboardStats({
  pets,
  users,
  sector = "SBD-08",
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Activos DUA",
      value: pets.length,
      icon: "🐾",
      color: "text-cyan-500",
    },
    {
      label: "Ciudadanos",
      value: users.length,
      icon: "👤",
      color: "text-indigo-500",
    },
    {
      label: "Sector_Focus",
      value: sector,
      icon: "📍",
      color: "text-emerald-500",
    },
    { label: "Alertas_Red", value: 0, icon: "⚠️", color: "text-rose-500" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-md shadow-xl group hover:border-slate-700 transition-all relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <span className="text-4xl italic font-black text-white uppercase">
              {i + 1}
            </span>
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-3xl">{stat.icon}</span>
            <span className="text-[8px] font-mono text-slate-700 uppercase tracking-widest font-black">
              Telemetry_V4
            </span>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 relative z-10">
            {stat.label}
          </p>
          <p
            className={`text-4xl font-black ${stat.color} tracking-tighter relative z-10 break-all`}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
