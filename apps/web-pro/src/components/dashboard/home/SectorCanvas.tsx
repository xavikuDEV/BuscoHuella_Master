"use client";

import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

// Fix para los iconos de Leaflet
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

export default function SectorCanvas({ onSaveSector }: { onSaveSector: any }) {
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
    <div className="h-full w-full rounded-4xl overflow-hidden border border-slate-800 shadow-2xl">
      <MapContainer
        center={[41.5463, 2.1086]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
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
