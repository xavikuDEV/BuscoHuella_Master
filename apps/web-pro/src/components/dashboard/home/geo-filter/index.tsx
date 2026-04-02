"use client";
import { useState } from "react";
import { Loader2, Globe, Search } from "lucide-react";
import { useGeoHierarchy } from "./useGeoHierarchy";
import GeoSelect from "./GeoSelect";
import SearchInput from "./SearchInput";

export default function GeoHierarchyFilter({ onCityChange }: any) {
  const { data, sel, setSel, loading } = useGeoHierarchy(onCityChange);
  const [query, setQuery] = useState("");

  const handleGlobalTrack = () => {
    // Si hay una ciudad, provincia o región, disparamos el cambio manual
    const currentId = sel.city || sel.province || sel.region || sel.country;
    if (currentId) {
      onCityChange(currentId, "MANUAL_SCAN");
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-slate-900/80 p-5 rounded-[2.5rem] border border-slate-800 backdrop-blur-xl shadow-2xl w-full max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-800/50 pb-3 px-2">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
            {loading ? (
              <Loader2 size={14} className="animate-spin text-cyan-500" />
            ) : (
              <Globe size={14} className="text-cyan-500" />
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
              Radar_Hierarchy_Scanner
            </h2>
            <span className="text-[7px] font-bold text-slate-500 uppercase mt-1">
              Multi-Region_Support_Active
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <GeoSelect
          label="PAÍS"
          value={sel.country}
          options={data.countries}
          onChange={(v: any) =>
            setSel({ ...sel, country: v, region: "", province: "", city: "" })
          }
        />
        <GeoSelect
          label="COMUNIDAD"
          value={sel.region}
          options={data.regions}
          onChange={(v: any) =>
            setSel({ ...sel, region: v, province: "", city: "" })
          }
          disabled={!sel.country}
        />
        <GeoSelect
          label="PROVINCIA"
          value={sel.province}
          options={data.provinces}
          onChange={(v: any) => setSel({ ...sel, province: v, city: "" })}
          disabled={!sel.region}
        />
        <GeoSelect
          label="POBLACIÓN"
          value={sel.city}
          options={data.cities}
          onChange={(v: any) => setSel({ ...sel, city: v })}
          disabled={!sel.province}
        />
      </div>

      <SearchInput
        value={query}
        onChange={setQuery}
        onSearch={handleGlobalTrack}
      />
    </div>
  );
}
