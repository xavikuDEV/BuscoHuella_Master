"use client";

import { useState, useEffect } from "react";
import GeoHierarchyFilter from "./geo-filter";
import SectorMapClient from "@/app/[locale]/dashboard/municipality/zones/SectorMapClient";
import SectorsList from "@/app/[locale]/dashboard/municipality/zones/SectorsList";
import { createClient } from "@/lib/supabase/client";

export default function ZonesClientWrapper({ onSave }: { onSave: any }) {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedCityName, setSelectedCityName] = useState<string | null>(null);
  const [allSectors, setAllSectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadSectors() {
      // 🛡️ Si no hay ciudad seleccionada, vaciamos la lista y salimos
      if (!selectedCityId) {
        setAllSectors([]);
        return;
      }

      setLoading(true);
      const { data } = await supabase
        .from("sectors")
        .select("*")
        .eq("municipality_id", selectedCityId) // 🎯 Filtro estricto por ciudad
        .order("name", { ascending: true });

      setAllSectors(data || []);
      setLoading(false);
    }
    loadSectors();
  }, [selectedCityId, supabase]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. RADAR FILTER */}
      <div className="flex justify-start">
        <GeoHierarchyFilter
          onCityChange={(id: string | null, name: string | null) => {
            // 👈 Tipado explícito
            setSelectedCityId(id);
            setSelectedCityName(name);
          }}
        />
      </div>

      {/* 2. MAPA TÁCTICO */}
      <div className="h-[500px] bg-slate-950 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <SectorMapClient onSave={onSave} selectedCityId={selectedCityId} />
      </div>

      {/* 3. TABLA DE INTELIGENCIA */}
      <SectorsList
        sectors={allSectors}
        cityName={selectedCityName}
        isLoading={loading}
      />
    </div>
  );
}
