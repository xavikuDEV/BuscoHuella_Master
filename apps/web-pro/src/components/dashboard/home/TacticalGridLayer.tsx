"use client";

import { useEffect, useState } from "react";
import { Polygon, Tooltip, useMap } from "react-leaflet";
import { createClient } from "@/lib/supabase/client";

interface TacticalGridLayerProps {
  jurisdictionId: string | null;
}

// Estilo Grid Táctico — Cian
const GRID_STYLE = {
  color: "#06b6d4",       // cyan-500
  weight: 0.8,
  opacity: 0.75,
  fillColor: "#06b6d4",
  fillOpacity: 0.04,
};

const GRID_STYLE_HOVER = {
  ...GRID_STYLE,
  weight: 1.5,
  opacity: 1,
  fillOpacity: 0.18,
};

interface SectorPolygon {
  id: string;
  name: string;
  coords: [number, number][][];
}

function parseGeoJSONGeometry(geom: any): [number, number][][] {
  if (!geom) return [];
  // GeoJSON Polygon: coordinates[0] = outer ring [[lng, lat], ...]
  // Leaflet Polygon expects [[lat, lng], ...]
  if (geom.type === "Polygon") {
    return geom.coordinates.map((ring: number[][]) =>
      ring.map(([lng, lat]) => [lat, lng] as [number, number])
    );
  }
  if (geom.type === "MultiPolygon") {
    // Flatten: return first polygon ring for simplicity
    return geom.coordinates[0].map((ring: number[][]) =>
      ring.map(([lng, lat]) => [lat, lng] as [number, number])
    );
  }
  return [];
}

export default function TacticalGridLayer({ jurisdictionId }: TacticalGridLayerProps) {
  const map = useMap();
  const supabase = createClient();
  const [sectors, setSectors] = useState<SectorPolygon[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!jurisdictionId) {
      setSectors([]);
      return;
    }

    async function loadSectors() {
      setLoading(true);
      const { data, error } = await supabase
        .from("sectors")
        .select("id, name, boundary")
        .eq("municipality_id", jurisdictionId)
        .limit(1000);

      if (error || !data) {
        setLoading(false);
        return;
      }

      const parsed: SectorPolygon[] = data
        .map((s: any) => ({
          id: s.id,
          name: s.name,
          coords: parseGeoJSONGeometry(s.boundary),
        }))
        .filter((s) => s.coords.length > 0);

      setSectors(parsed);

      // Fit map to grid bounds if we have data
      if (parsed.length > 0 && parsed[0].coords[0]?.length > 0) {
        const allCoords = parsed.flatMap((s) => s.coords.flat());
        if (allCoords.length > 0) {
          // @ts-ignore
          const bounds = window.L?.latLngBounds
            ? window.L.latLngBounds(allCoords)
            : null;
          if (bounds) map.fitBounds(bounds, { padding: [20, 20] });
        }
      }

      setLoading(false);
    }

    loadSectors();
  }, [jurisdictionId]);

  if (!jurisdictionId || sectors.length === 0) return null;

  return (
    <>
      {sectors.map((sector) => (
        <Polygon
          key={sector.id}
          // @ts-ignore — react-leaflet v4 positions typing
          positions={sector.coords}
          pathOptions={GRID_STYLE}
          eventHandlers={{
            mouseover(e) {
              e.target.setStyle(GRID_STYLE_HOVER);
              e.target.bringToFront();
            },
            mouseout(e) {
              e.target.setStyle(GRID_STYLE);
            },
          }}
        >
          <Tooltip
            sticky
            className="tactical-tooltip"
            opacity={1}
          >
            <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-widest">
              {sector.name}
            </span>
          </Tooltip>
        </Polygon>
      ))}
    </>
  );
}
