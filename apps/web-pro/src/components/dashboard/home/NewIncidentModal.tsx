"use client";

import { useState } from "react";
import { createIncidentAction } from "@/app/[locale]/dashboard/admin/incidents/actions";

export default function NewIncidentModal({
  isOpen,
  onClose,
  currentSector,
}: any) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createIncidentAction(formData);

    if (result.success) {
      onClose(); // Cerramos el modal si todo ok
    } else {
      alert("Error en la transmisión: " + result.error);
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
        <h3 className="text-xl font-black text-white uppercase italic mb-6 tracking-tighter">
          Emitir <span className="text-rose-500">Alerta Táctica</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mapeamos sector_id a sector */}
          <input
            type="hidden"
            name="sector"
            value={currentSector === "ALL" ? "SBD-GENERAL" : currentSector}
          />

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
              Mensaje del suceso
            </label>
            <textarea
              name="message" // Cambiado de 'title' a 'message'
              required
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-rose-500 outline-none transition-all resize-none"
              placeholder="Ej: Kratos Alpha avistado en Sector 08 sin supervisión..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                Tipo
              </label>
              <select
                name="type"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none"
              >
                <option value="LOST">Pérdida</option>
                <option value="FOUND">Encontrado</option>
                <option value="DANGER">Peligro</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                Urgencia
              </label>
              <select
                name="urgency"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none"
              >
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
                <option value="CRITICAL">Crítica</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-800 transition-all"
            >
              Abortar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-rose-600 hover:bg-rose-500 px-6 py-3 rounded-2xl text-[10px] font-black uppercase text-white shadow-lg shadow-rose-500/20 transition-all disabled:opacity-50"
            >
              {loading ? "Sincronizando..." : "Confirmar Alerta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
