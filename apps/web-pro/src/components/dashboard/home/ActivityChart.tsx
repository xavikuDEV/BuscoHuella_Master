"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const STREAMS = [
  {
    id: "pets",
    label: "Activos DUA",
    color: "#06b6d4",
    icon: "🐾",
    desc: "Registros_Animales_Live",
  },
  {
    id: "users",
    label: "Ciudadanos",
    color: "#8b5cf6",
    icon: "👤",
    desc: "Censo_Poblacional_SBD",
  },
  {
    id: "incidents",
    label: "Incidencias",
    color: "#f43f5e",
    icon: "🚨",
    desc: "Alertas_Sectoriales_Emergencia",
  },
  {
    id: "logs",
    label: "Errores Sistema",
    color: "#f59e0b",
    icon: "⚠️",
    desc: "Telemetría_Kernel_Logs",
  },
];

export default function ActivityChart({
  pets = [],
  users = [],
  incidents = [],
  logs = [],
}: any) {
  const [range, setRange] = useState<7 | 30>(7);
  const [streamIndex, setStreamIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentStream = STREAMS[streamIndex];

  const data = useMemo(() => {
    const days = [...Array(range)]
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split("T")[0];
      })
      .reverse();

    const dataSource =
      currentStream.id === "pets"
        ? pets
        : currentStream.id === "users"
          ? users
          : currentStream.id === "incidents"
            ? incidents
            : logs;

    return days.map((date) => ({
      date: date.slice(5),
      count: (dataSource || []).filter((item: any) =>
        (item.created_at || item.timestamp || item.date)?.startsWith(date),
      ).length,
    }));
  }, [range, streamIndex, pets, users, incidents, logs]);

  const triggerGlitch = (newIndex: number) => {
    setIsGlitching(true);
    setTimeout(() => {
      setStreamIndex(newIndex);
      setIsGlitching(false);
    }, 150);
  };

  const nextStream = () => triggerGlitch((streamIndex + 1) % STREAMS.length);
  const prevStream = () =>
    triggerGlitch((streamIndex - 1 + STREAMS.length) % STREAMS.length);

  if (!mounted)
    return (
      <div className="h-[450px] bg-slate-900/50 animate-pulse rounded-[3.5rem] border border-slate-800" />
    );

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-[3.5rem] p-8 h-full shadow-2xl relative overflow-hidden group min-h-[450px] transition-all duration-300 ${isGlitching ? "brightness-150 contrast-125" : ""}`}
    >
      <AnimatePresence>
        {isGlitching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white pointer-events-none mix-blend-overlay"
          />
        )}
      </AnimatePresence>

      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none select-none">
        <span className="text-8xl italic font-black text-white uppercase tracking-tighter">
          {currentStream.id}_{range}D
        </span>
      </div>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <button
              onClick={prevStream}
              className="w-10 h-10 flex items-center justify-center bg-slate-950 border border-slate-800 rounded-xl hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-slate-500"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextStream}
              className="w-10 h-10 flex items-center justify-center bg-slate-950 border border-slate-800 rounded-xl hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-slate-500"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentStream.icon}</span>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
                Flujo de{" "}
                <span
                  style={{ color: currentStream.color }}
                  className="transition-colors duration-500"
                >
                  {currentStream.label}
                </span>
              </h3>
            </div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">
              {currentStream.desc} // CH_{streamIndex + 1}
            </p>
          </div>
        </div>

        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          {[7, 30].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r as 7 | 30)}
              className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${range === r ? "bg-slate-800 text-white shadow-lg" : "text-slate-600 hover:text-slate-400"}`}
            >
              {r}D
            </button>
          ))}
        </div>
      </header>

      <div className="h-72 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorStream" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={currentStream.color}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={currentStream.color}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#1e293b"
              vertical={false}
              opacity={0.2}
            />
            <XAxis
              dataKey="date"
              stroke="#475569"
              fontSize={10}
              axisLine={false}
              tickLine={false}
              tickMargin={15}
            />
            <YAxis
              stroke="#475569"
              fontSize={10}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tickMargin={15}
            />
            <Tooltip
              cursor={{
                stroke: currentStream.color,
                strokeWidth: 1,
                strokeDasharray: "5 5",
              }}
              contentStyle={{
                backgroundColor: "#020617",
                border: `1px solid ${currentStream.color}33`,
                borderRadius: "20px",
              }}
              itemStyle={{
                color: currentStream.color,
                fontSize: "12px",
                fontWeight: "900",
                textTransform: "uppercase",
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke={currentStream.color}
              strokeWidth={4}
              fill="url(#colorStream)"
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <footer className="mt-8 pt-6 border-t border-slate-800/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-3 rounded-full transition-all duration-500 ${i === streamIndex ? "animate-bounce" : "opacity-20"}`}
                style={{ backgroundColor: currentStream.color }}
              />
            ))}
          </div>
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
            Bunker_Interface_Active // Protocol_V5
          </span>
        </div>
        <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] bg-slate-950 px-4 py-2 rounded-full border border-slate-800">
          Secure_Encryption: <span className="text-emerald-500">Enabled</span>
        </div>
      </footer>
    </div>
  );
}
