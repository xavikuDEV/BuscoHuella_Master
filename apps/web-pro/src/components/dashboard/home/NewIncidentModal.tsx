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
      onClose();
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
        <h3 className="text-xl font-black text-white uppercase italic mb-6 tracking-tighter">
          Registrar <span className="text-rose-500">Incidencia Táctica</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="sector_id" value={currentSector} />

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
              Título del suceso
            </label>
            <input
              name="title"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-rose-500 outline-none transition-all"
              placeholder="Ej: Perro avistado sin dueño..."
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
                <option value="LOSS">Pérdida</option>
                <option value="SIGHTING">Avistamiento</option>
                <option value="THEFT">Robo</option>
                <option value="ABUSE">Maltrato</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                Prioridad
              </label>
              <select
                name="priority"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none"
              >
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
                <option value="CRITICAL">Crítica</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
              Descripción detallada
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-rose-500 resize-none"
              placeholder="Describe lo ocurrido..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-800 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-rose-600 hover:bg-rose-500 px-6 py-3 rounded-2xl text-[10px] font-black uppercase text-white shadow-lg shadow-rose-500/20 transition-all disabled:opacity-50"
            >
              {loading ? "Sincronizando..." : "Emitir Alerta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
