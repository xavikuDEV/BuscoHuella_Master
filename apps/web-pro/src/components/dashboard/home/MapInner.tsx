"use client";

import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🔧 FIX: Iconos de Leaflet para Next.js
const iconRetinaUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const shadowUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

// @ts-ignore - Evitamos errores de tipos en la configuración interna de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

export default function MapInner({ pets = [], incidents = [] }: any) {
  const SABADELL_CENTER: [number, number] = [41.5463, 2.1086];

  return (
    <MapContainer
      // @ts-ignore - Forzamos el centro porque TS a veces no reconoce la prop en imports dinámicos
      center={SABADELL_CENTER}
      zoom={14}
      zoomControl={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

      {/* 🐾 ACTIVOS (MASCOTAS) - PUNTOS CIAN */}
      {pets.map((pet: any) => (
        <CircleMarker
          key={`pet-${pet.id}`}
          // @ts-ignore
          center={[
            pet.lat || 41.5463 + (Math.random() - 0.5) * 0.01,
            pet.lng || 2.1086 + (Math.random() - 0.5) * 0.01,
          ]}
          // @ts-ignore
          radius={6}
          pathOptions={{
            color: "#22d3ee",
            fillColor: "#22d3ee",
            fillOpacity: 0.7,
            weight: 2,
          }}
        >
          <Popup>
            <div className="text-[10px] font-mono p-1">
              <strong className="text-cyan-600 uppercase font-black">
                {pet.name}
              </strong>
              <p className="text-slate-500 m-0 border-t border-slate-100 mt-1 pt-1">
                DUA: {pet.dua_id || "PROVISIONAL"}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* 🚨 ALERTAS (INCIDENCIAS) - PULSOS ROJOS/AMBAR */}
      {incidents.map((inc: any) => (
        <CircleMarker
          key={`inc-${inc.id}`}
          // @ts-ignore
          center={[
            inc.lat || 41.5463 + (Math.random() - 0.5) * 0.01,
            inc.lng || 2.1086 + (Math.random() - 0.5) * 0.01,
          ]}
          // @ts-ignore
          radius={12}
          pathOptions={{
            color: inc.urgency === "CRITICAL" ? "#f43f5e" : "#f59e0b",
            fillColor: inc.urgency === "CRITICAL" ? "#f43f5e" : "#f59e0b",
            fillOpacity: 0.3,
            weight: 2,
            dashArray: inc.urgency === "CRITICAL" ? "5, 5" : undefined,
          }}
        >
          <Popup>
            <div className="text-[10px] font-mono p-1">
              <strong
                className={`uppercase font-black ${inc.urgency === "CRITICAL" ? "text-rose-600" : "text-amber-600"}`}
              >
                ALERTA: {inc.urgency}
              </strong>
              <p className="text-slate-700 m-0 mt-1 italic">{inc.message}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
