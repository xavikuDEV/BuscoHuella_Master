"use client";

import { useMapEvents } from "react-leaflet";
import { useRef } from "react";

interface MapClickHandlerProps {
  onMapClick: (coords: { lat: number; lng: number }) => void;
  /** milliseconds to hold for long-press — default 700 */
  longPressMs?: number;
}

export default function MapClickHandler({
  onMapClick,
  longPressMs = 700,
}: MapClickHandlerProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMapEvents({
    // ── Desktop: click derecho ──────────────────────────────────────
    contextmenu(e) {
      e.originalEvent.preventDefault();
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },

    // ── Mobile: long-press via mousedown/touchstart ─────────────────
    mousedown(e) {
      timerRef.current = setTimeout(() => {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }, longPressMs);
    },
    mouseup() {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    mousemove() {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
  });

  return null;
}
