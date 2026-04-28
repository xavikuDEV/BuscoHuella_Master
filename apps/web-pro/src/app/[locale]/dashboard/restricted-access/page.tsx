"use client";

import { ShieldAlert, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AccessDeniedContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "Desconocido";
  const deniedMessage = searchParams.get("deniedMessage") || "No tienes los permisos necesarios para acceder a esta sección táctica.";

  return (
    <div className="max-w-md w-full bg-slate-900/60 border border-rose-500/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative text-center">
      <div className="absolute -top-12 left-1/2 -translate-x-1/2">
        <div className="bg-slate-950 border border-rose-500/30 p-4 rounded-2xl shadow-xl relative">
          <ShieldAlert className="text-rose-500 animate-ping absolute inset-4" size={32} />
          <ShieldAlert className="text-rose-500 relative" size={32} />
        </div>
      </div>

      <h1 className="text-2xl font-black text-white uppercase tracking-widest mt-6 mb-2 flex items-center justify-center gap-2">
        <Lock size={24} className="text-rose-500" />
        Acceso Restringido
      </h1>
      <div className="text-[8px] font-mono text-rose-500/60 uppercase tracking-widest mb-6">
        ERROR_CODE_AUTH_VIOLATION
      </div>

      <div className="bg-slate-950/80 border border-slate-800/60 rounded-2xl p-5 mb-8 text-left space-y-4">
        <div>
          <span className="text-[9px] text-slate-500 uppercase font-mono">Rango_Actual:</span>
          <div className="text-xs font-black text-cyan-400 font-mono uppercase mt-1">{role}</div>
        </div>
        <div>
          <span className="text-[9px] text-slate-500 uppercase font-mono">Protocolo:</span>
          <p className="text-slate-300 text-xs leading-relaxed mt-1 font-medium">{deniedMessage}</p>
        </div>
      </div>

      <Link
        href="/es/dashboard"
        className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-rose-500/10 text-rose-500 font-black text-[10px] uppercase tracking-wider border border-rose-500/20 hover:bg-rose-500/20 hover:scale-[102%] transition-all"
      >
        <ArrowLeft size={14} />
        Retorno al Hub Central
      </Link>
    </div>
  );
}

export default function RestrictedAccessPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative grid/glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000,transparent)] opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[80px] -z-10 animate-pulse" />

      <Suspense fallback={<div className="text-cyan-400 font-mono text-xs">Verificando Credenciales...</div>}>
        <AccessDeniedContent />
      </Suspense>
    </div>
  );
}
