"use client";

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapClickHandler from "./MapClickHandler";
import TacticalGridLayer from "./TacticalGridLayer";

// 🔧 FIX: Iconos de Leaflet
const iconRetinaUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const shadowUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

/** 🛰️ CONTROLADOR DE CÁMARA */
function MapController({ center, zoom, gridId }: any) {
  const map = useMap();
  useEffect(() => {
    if (!map || !center || center[0] === undefined) return;
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
    map.flyTo(center, zoom, { animate: true, duration: 1.5 });
  }, [center, zoom, gridId, map]);
  return null;
}

export default function MapInner({
  pets = [],
  incidents = [],
  gridJurisdictionId = null,
  onMapClick,
  forceCenter,
  forceZoom,
}: any) {
  const BCN_CENTER: [number, number] = [41.3874, 2.1686];
  const SABADELL_CENTER: [number, number] = [41.5463, 2.1086];

  // 🛡️ Validación de Centro para evitar el error de Runtime
  const finalCenter =
    forceCenter && forceCenter[0] !== undefined
      ? forceCenter
      : gridJurisdictionId
        ? BCN_CENTER
        : SABADELL_CENTER;

  const finalZoom = forceZoom || (gridJurisdictionId ? 14 : 14);

  return (
    <MapContainer
      center={finalCenter}
      zoom={finalZoom}
      zoomControl={false}
      style={{ height: "100%", width: "100%", background: "#020617" }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      <MapController
        center={finalCenter}
        zoom={finalZoom}
        gridId={gridJurisdictionId}
      />

      <TacticalGridLayer jurisdictionId={gridJurisdictionId} />
      {onMapClick && <MapClickHandler onMapClick={onMapClick} />}

      {/* 🐾 MASCOTAS (Solo con GPS válido) */}
      {pets
        .filter((p: any) => p.lat != null && p.lng != null)
        .map((pet: any) => (
          <CircleMarker
            key={`pet-${pet.id}`}
            center={[pet.lat, pet.lng]}
            radius={6}
            pathOptions={{
              color: "#22d3ee",
              fillColor: "#22d3ee",
              fillOpacity: 0.7,
            }}
          >
            <Popup>
              <div className="text-[10px] font-mono font-black uppercase text-cyan-600">
                {pet.name}
              </div>
            </Popup>
          </CircleMarker>
        ))}

      {/* 🚨 INCIDENCIAS (Solo con GPS válido) */}
      {incidents
        .filter((inc: any) => inc.lat != null && inc.lng != null)
        .map((inc: any) => (
          <CircleMarker
            key={`inc-${inc.id}`}
            center={[inc.lat, inc.lng]}
            radius={14}
            pathOptions={{
              color: inc.urgency === "CRITICAL" ? "#f43f5e" : "#f59e0b",
              fillColor: inc.urgency === "CRITICAL" ? "#f43f5e" : "#f59e0b",
              fillOpacity: 0.3,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-[10px] font-mono italic">{inc.message}</div>
            </Popup>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}
