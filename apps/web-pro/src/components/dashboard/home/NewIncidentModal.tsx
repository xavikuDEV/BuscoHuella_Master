"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { createIncidentAction } from "@/lib/actions/incidents.actions";

// Cargamos el mapa de forma dinámica para evitar errores de SSR
const MapSelector = dynamic(() => import("./MapSelectorInner"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-900 animate-pulse flex items-center justify-center text-[10px] text-slate-500 font-mono">
      INICIALIZANDO_RADAR...
    </div>
  ),
});

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Coords pre-cargadas desde click en el mapa */
  initialCoords?: { lat: number; lng: number } | null;
}

export default function NewIncidentModal({
  isOpen,
  onClose,
  initialCoords,
}: NewIncidentModalProps) {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(
    initialCoords ?? { lat: 41.54329, lng: 2.10698 },
  );

  // Sync location when initialCoords changes (nuevo click en el mapa)
  useEffect(() => {
    if (initialCoords) setLocation(initialCoords);
  }, [initialCoords?.lat, initialCoords?.lng]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("lat", location.lat.toString());
    formData.append("lng", location.lng.toString());

    const result = await createIncidentAction(formData);
    if (result.success) {
      onClose();
    } else {
      alert("ERROR_DE_TRANSMISIÓN: " + result.error);
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[2000]flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl h-[600px] rounded-[3rem] shadow-2xl flex overflow-hidden animate-in zoom-in duration-300">
        {/* PANEL IZQUIERDO: MAPA TÁCTICO */}
        <div className="flex-[1.5] relative bg-slate-950 border-r border-slate-800">
          <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-full">
            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-ping" />
              Seleccionar Punto de Impacto
            </span>
          </div>

          {/* Coordenadas en tiempo real */}
          <div className="absolute bottom-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-full">
            <span className="text-[8px] font-mono text-slate-400 flex gap-3">
              <span className="text-cyan-400">LAT</span>{" "}
              {location.lat.toFixed(5)}
              <span className="text-cyan-400 ml-2">LNG</span>{" "}
              {location.lng.toFixed(5)}
            </span>
          </div>

          <MapSelector
            initialPos={[location.lat, location.lng]}
            onLocationChange={setLocation}
          />
        </div>

        {/* PANEL DERECHO: DATOS */}
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-black text-white uppercase italic mb-6 tracking-tighter leading-none">
              Emitir <span className="text-rose-500">Alerta Táctica</span>
            </h3>

            <form
              id="incident-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                  Mensaje del suceso
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-rose-500 outline-none transition-all resize-none italic"
                  placeholder="Ej: Kratos Alpha avistado en Sector 08 sin supervisión..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                    Categoría
                  </label>
                  <select
                    name="type"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="LOST">🔍 PÉRDIDA</option>
                    <option value="FOUND">🐾 ENCONTRADO</option>
                    <option value="DANGER">⚠️ PELIGRO</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                    Urgencia
                  </label>
                  <select
                    name="urgency"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="LOW">BAJA</option>
                    <option value="MEDIUM">MEDIA</option>
                    <option value="HIGH">ALTA</option>
                    <option value="CRITICAL">CRÍTICA</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          <div className="flex gap-4 pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-800 transition-all"
            >
              Abortar
            </button>
            <button
              form="incident-form"
              type="submit"
              disabled={loading}
              className="flex-2 bg-rose-600 hover:bg-rose-500 px-4 py-3 rounded-2xl text-[10px] font-black uppercase text-white shadow-lg shadow-rose-500/20 transition-all disabled:opacity-50"
            >
              {loading ? "Sincronizando..." : "Confirmar Alerta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
