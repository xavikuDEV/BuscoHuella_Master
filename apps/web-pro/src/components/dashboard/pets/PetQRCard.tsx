"use client";

import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";

export default function PetQRCard({ pet }: { pet: any }) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = qrRef.current;
    const windowUrl = window.open("", "", "width=600,height=600");
    windowUrl?.document.write(`
      <html>
        <head>
          <title>DUA Tag - ${pet.name}</title>
          <style>
            body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; }
            .tag { border: 2px solid #000; padding: 20px; border-radius: 20px; text-align: center; }
            h1 { margin: 10px 0; text-transform: uppercase; font-size: 24px; }
            p { font-family: monospace; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="tag">
            <h1>${pet.name}</h1>
            ${printContent?.innerHTML}
            <p>${pet.dua_id}</p>
          </div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    windowUrl?.document.close();
  };

  // La URL que codificará el QR (Apunta al expediente público o de admin)
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/es/pets/${pet.id}`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 space-y-6 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">
          Digital_Twin_Link
        </span>
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Contenedor del QR con estética de laboratorio */}
        <div
          ref={qrRef}
          className="p-4 bg-white rounded-3xl border-4 border-slate-800 shadow-inner"
        >
          <QRCodeSVG
            value={shareUrl}
            size={160}
            level="H"
            includeMargin={false}
            imageSettings={{
              src: "/favicon.png", // Si tienes un logo, aparecerá en el centro
              x: undefined,
              y: undefined,
              height: 24,
              width: 24,
              excavate: true,
            }}
          />
        </div>

        <div className="text-center">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">
            Protocolo de Enlace
          </p>
          <code className="text-cyan-500 font-black text-xs bg-cyan-500/5 px-3 py-1 rounded-lg border border-cyan-500/20">
            {pet.dua_id}
          </code>
        </div>

        <button
          onClick={handlePrint}
          className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 border border-slate-700"
        >
          <span>🖨️</span> Generar Placa Física
        </button>
      </div>
    </div>
  );
}
