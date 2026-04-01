"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapSelectorInner({
  onLocationChange,
  initialPos,
}: any) {
  function LocationMarker() {
    useMapEvents({
      click(e) {
        onLocationChange({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return <Marker position={initialPos} icon={icon} />;
  }
  return (
    <MapContainer
      center={initialPos}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      <LocationMarker />
    </MapContainer>
  );
}
