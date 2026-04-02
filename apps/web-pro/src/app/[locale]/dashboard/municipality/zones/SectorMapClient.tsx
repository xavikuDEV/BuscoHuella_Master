"use client";

import dynamic from "next/dynamic";

// Cargamos SectorCanvas dinámicamente para evitar errores de Leaflet en el servidor
const SectorCanvas = dynamic(
  () => import("@/components/dashboard/home/SectorCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-slate-900/50">
        <span className="text-cyan-500 animate-pulse font-mono text-xs">
          LOAD_MAP_CORE...
        </span>
      </div>
    ),
  },
);

interface SectorMapClientProps {
  onSave: any;
  selectedCityId?: string | null; // 👈 Aquí añadimos la propiedad que faltaba
}

export default function SectorMapClient({
  onSave,
  selectedCityId,
}: SectorMapClientProps) {
  return (
    <div className="h-full w-full">
      <SectorCanvas
        onSaveSector={onSave}
        selectedCityId={selectedCityId} // 👈 Se la pasamos al motor del mapa
      />
    </div>
  );
}
