"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Polygon,
  Tooltip,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { createClient } from "@/lib/supabase/client";

if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

interface SectorCanvasProps {
  onSaveSector: any;
  selectedCityId?: string | null;
}

export default function SectorCanvas({
  onSaveSector,
  selectedCityId,
}: SectorCanvasProps) {
  const [existingSectors, setExistingSectors] = useState<any[]>([]);
  const supabase = createClient();

  // Cargar el Grid de la ciudad seleccionada
  useEffect(() => {
    async function loadSectors() {
      if (!selectedCityId) {
        setExistingSectors([]);
        return;
      }

      const { data, error } = await supabase
        .from("sectors")
        .select("id, name, boundary")
        .eq("municipality_id", selectedCityId);

      if (data) setExistingSectors(data);
    }
    loadSectors();
  }, [selectedCityId, supabase]);

  const _onCreated = async (e: any) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const geojson = layer.toGeoJSON();
      const sectorName = window.prompt("🏷️ NOMBRE DEL SECTOR TÁCTICO:");
      if (sectorName) {
        await onSaveSector(sectorName, geojson);
        alert("✅ Sector Guardado Correctamente");
      } else {
        layer.remove();
      }
    }
  };

  return (
    <div className="h-full w-full rounded-4xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      <MapContainer
        center={[41.387, 2.1701]} // Centrado en Barcelona por defecto
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {/* Renderizado del Grid Táctico (Los 868 sectores) */}
        {existingSectors.map((sector) => (
          <Polygon
            key={sector.id}
            positions={sector.boundary.coordinates[0].map((coord: any) => [
              coord[1],
              coord[0],
            ])}
            pathOptions={{
              color: "#06b6d4", // Cyan 500
              weight: 1,
              fillColor: "#06b6d4",
              fillOpacity: 0.05,
            }}
          >
            <Tooltip
              sticky
              className="bg-slate-900 border-cyan-500 text-cyan-400 font-mono text-[10px]"
            >
              {sector.name}
            </Tooltip>
          </Polygon>
        ))}

        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={_onCreated}
            draw={{
              rectangle: false,
              circle: false,
              polyline: false,
              marker: false,
              circlemarker: false,
              polygon: {
                allowIntersection: false,
                shapeOptions: { color: "#10b981" },
              },
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
}
