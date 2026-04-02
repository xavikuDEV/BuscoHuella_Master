"use client";
import { ImageIcon, FileDown, Lock } from "lucide-react";

export default function IncidentMediaVault({
  photos = [],
}: {
  photos?: string[];
}) {
  return (
    <div className="bg-slate-900/30 border border-slate-800 rounded-[2.5rem] overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
        <div className="flex items-center gap-3">
          <Lock size={14} className="text-slate-500" />
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic">
            Bóveda_de_Evidencias
          </h3>
        </div>
        <span className="text-[9px] font-mono text-slate-600">
          {photos.length} ARCHIVOS_DETECTADOS
        </span>
      </div>

      <div className="p-8">
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((url, i) => (
              <div
                key={i}
                className="aspect-square bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden group relative cursor-pointer"
              >
                <img
                  src={url}
                  alt="Evidencia"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <FileDown size={20} className="text-white" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-4xl opacity-30">
            <ImageIcon size={40} className="mb-4 text-slate-700" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">
              Sin_Evidencias_Visuales_Aportadas
              <br />
              <span className="font-mono font-normal">
                Waiting for satellite sync...
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
