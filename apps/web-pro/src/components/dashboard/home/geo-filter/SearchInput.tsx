"use client";
import { Search, Zap } from "lucide-react";

export default function SearchInput({ value, onChange, onSearch }: any) {
  return (
    <div className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
          size={12}
        />
        <input
          type="text"
          placeholder="BUSCAR SECTOR O CIUDAD POR NOMBRE..."
          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-[10px] font-mono text-cyan-400 outline-none focus:border-cyan-500/50 placeholder:text-slate-700"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <button
        onClick={onSearch}
        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[9px] px-6 rounded-xl transition-all flex items-center gap-2 active:scale-95"
      >
        EJECUTAR RASTREO <Zap size={12} />
      </button>
    </div>
  );
}
