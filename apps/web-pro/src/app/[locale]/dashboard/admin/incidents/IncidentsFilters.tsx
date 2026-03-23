"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Download, Calendar } from "lucide-react";

export default function IncidentsFilters({
  params,
  updateParams,
  handleExport,
}: any) {
  const [searchValue, setSearchValue] = useState(params.q || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== params.q)
        updateParams({ q: searchValue || null, page: "1" });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchValue, params.q, updateParams]);

  return (
    <div className="flex flex-col gap-4 bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-800 backdrop-blur-md shadow-2xl">
      <div className="flex flex-col xl:flex-row gap-4 items-center">
        {/* Buscador */}
        <div className="relative flex-1 group w-full">
          <Search
            className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchValue ? "text-cyan-400" : "text-slate-500"}`}
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Filtrar por incidencia o sector..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-14 pr-10 text-xs font-mono text-white placeholder:text-slate-600 focus:border-cyan-500/40 outline-none"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Estados */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 gap-1 shrink-0">
          {["ALL", "ACTIVE", "RESOLVED"].map((v) => (
            <button
              key={v}
              onClick={() => updateParams({ status: v, page: "1" })}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${params.status === v ? "bg-cyan-500 text-black" : "text-slate-500 hover:text-slate-300"}`}
            >
              {v === "ALL" ? "Todos" : v === "ACTIVE" ? "Activos" : "Resueltos"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-t border-slate-800/50 pt-4">
        {/* Rango de Fechas */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Calendar size={14} className="text-slate-500 shrink-0" />
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
            <input
              type="date"
              value={params.start}
              onChange={(e) =>
                updateParams({ start: e.target.value, page: "1" })
              }
              className="bg-transparent text-[10px] font-mono text-slate-300 outline-none scheme-dark"
            />
            <span className="text-slate-700 text-xs">/</span>
            <input
              type="date"
              value={params.end}
              onChange={(e) => updateParams({ end: e.target.value, page: "1" })}
              className="bg-transparent text-[10px] font-mono text-slate-300 outline-none scheme-dark"
            />
          </div>
          {(params.start || params.end) && (
            <button
              onClick={() => updateParams({ start: null, end: null })}
              className="text-[9px] font-black text-rose-500 uppercase hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>

        <button
          onClick={handleExport}
          className="w-full md:w-auto px-6 py-3 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800 transition-all text-[9px] font-black uppercase flex items-center justify-center gap-2"
        >
          <Download size={14} /> Exportar CSV
        </button>
      </div>
    </div>
  );
}
