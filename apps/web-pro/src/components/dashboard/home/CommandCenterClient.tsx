"use client";

import { useState, useMemo } from "react";
import LiveMap from "@/components/dashboard/home/LiveMap";
import NewIncidentModal from "@/components/dashboard/home/NewIncidentModal";
import GeoHierarchyFilter from "./geo-filter";

interface CommandCenterClientProps {
  pets: any[];
  incidents: any[];
  sector: string;
}

export default function CommandCenterClient({
  pets,
  incidents,
  sector,
}: CommandCenterClientProps) {
  const [gridCityId, setGridCityId] = useState<string | null>(null);
  const [selectedCityName, setSelectedCityName] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [clickCoords, setClickCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // 🎯 FILTRADO INTELIGENTE: Si hay una ciudad/provincia elegida, filtramos.
  // Si no hay nada seleccionado (o es Nivel País), mostramos todo.
  const filteredIncidents = useMemo(() => {
    if (!gridCityId) return incidents;

    // Filtramos incidencias que pertenezcan a la jurisdicción seleccionada
    // (o que estén "dentro" de la jerarquía si guardamos el path)
    return incidents.filter(
      (inc) =>
        inc.municipality_id === gridCityId ||
        inc.province_id === gridCityId ||
        inc.region_id === gridCityId,
    );
  }, [incidents, gridCityId]);

  const filteredPets = useMemo(() => {
    if (!gridCityId) return pets;
    return pets.filter((pet) => pet.last_municipality_id === gridCityId);
  }, [pets, gridCityId]);

  function handleCityChange(id: string | null, name: string | null) {
    setGridCityId(id);
    setSelectedCityName(name);
  }

  function handleMapClick(coords: { lat: number; lng: number }) {
    setClickCoords(coords);
    setModalOpen(true);
  }

  return (
    <>
      {/* 📡 RADAR DE CONTROL DE JURISDICCIÓN */}
      <div className="mb-6">
        <GeoHierarchyFilter onCityChange={handleCityChange} />
      </div>

      {/* 🗺️ MAPA TÁCTICO CON FILTRADO DINÁMICO */}
      <div className="xl:col-span-4 h-[600px] w-full rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl relative">
        <div className="absolute top-6 left-6 z-1000 pointer-events-none">
          <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 px-4 py-2 rounded-2xl">
            <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">
              Vista_Operativa //{" "}
              <span className="text-white">
                {selectedCityName || "GLOBAL_ALPHA"}
              </span>
            </p>
          </div>
        </div>

        <LiveMap
          pets={filteredPets}
          incidents={filteredIncidents}
          sector={sector}
          gridJurisdictionId={gridCityId}
          onMapClick={handleMapClick}
        />
      </div>

      {/* 🚨 MODAL DE DESPLIEGUE DE INCIDENCIAS */}
      <NewIncidentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setClickCoords(null);
        }}
        initialCoords={clickCoords}
      />
    </>
  );
}
