"use client";
import { User, ShieldCheck, BadgeCheck, Activity } from "lucide-react";
import Link from "next/link";

export default function IncidentIssuerInfo({ reporter }: { reporter: any }) {
  // Lógica de rango visual
  const isAuthority =
    reporter?.role === "authority" || reporter?.role === "police";
  const isVet = reporter?.role === "vet";

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-6 space-y-6 backdrop-blur-md relative overflow-hidden group">
      {/* Indicador de pulso activo si el usuario es autoridad */}
      {isAuthority && (
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/20 animate-pulse" />
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">
          Origen_del_Reporte
        </h3>
        {isAuthority ? (
          <ShieldCheck size={14} className="text-cyan-400" />
        ) : (
          <BadgeCheck size={14} className="text-slate-600" />
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Avatar Táctico */}
        <div
          className={`h-14 w-14 rounded-2xl flex items-center justify-center border-2 shadow-2xl transition-transform group-hover:scale-105 ${
            isAuthority
              ? "bg-cyan-500/10 border-cyan-500/30"
              : "bg-slate-800 border-slate-700"
          }`}
        >
          {reporter?.avatar_url ? (
            <img
              src={reporter.avatar_url}
              alt="Avatar"
              className="h-full w-full object-cover rounded-xl"
            />
          ) : (
            <User
              className={isAuthority ? "text-cyan-400" : "text-slate-500"}
              size={28}
            />
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-[13px] font-black text-white uppercase tracking-tight leading-none mb-1">
            {reporter?.full_name || "NODO_DESCONOCIDO"}
          </span>
          <div className="flex items-center gap-2">
            <Activity
              size={10}
              className={isAuthority ? "text-cyan-500" : "text-emerald-500"}
            />
            <span
              className={`text-[8px] font-black uppercase tracking-tighter ${
                isAuthority
                  ? "text-cyan-400"
                  : isVet
                    ? "text-purple-400"
                    : "text-slate-400"
              }`}
            >
              Rango: {reporter?.role || "Citizen_Node"}
            </span>
          </div>
        </div>
      </div>

      {/* Botón de enlace a su ficha completa */}
      <Link
        href={`/dashboard/admin/users/${reporter?.id}`}
        className="block w-full py-3 bg-slate-950 border border-slate-800 rounded-xl text-[9px] font-black text-slate-500 uppercase hover:text-cyan-400 hover:border-cyan-500/40 transition-all tracking-[0.2em] text-center active:scale-95 shadow-inner"
      >
        Analizar_Expediente
      </Link>

      <div className="pt-2">
        <p className="text-[7px] font-mono text-slate-700 uppercase text-center tracking-widest">
          Protocol_DUA_Verification_Status:{" "}
          <span className="text-emerald-500">SIGNED</span>
        </p>
      </div>
    </div>
  );
}
