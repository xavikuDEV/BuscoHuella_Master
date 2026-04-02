import React from "react";
import { login, signup } from "@/lib/actions/auth.actions";

// 🛡️ Next.js 15: Definimos los tipos como Promesas
interface LoginPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; message?: string }>;
}

export default async function LoginPage({
  params,
  searchParams,
}: LoginPageProps) {
  // 🛰️ PROTOCOLO DE DESEMPAQUETADO (Obligatorio en Next.js 15)
  const { locale } = await params;
  const { error, message } = await searchParams;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* 🧬 EFECTO DE FONDO: RADAR ACTIVO */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* 📟 CABECERA DE LA TERMINAL */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl rotate-12 shadow-2xl mb-4 group hover:rotate-0 transition-transform duration-500">
            <span className="text-3xl font-black text-indigo-500 -rotate-12 group-hover:rotate-0 transition-transform">
              B
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
            Acceso al <span className="text-indigo-400">Búnker</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
            Protocolo BuscoHuella v3.0
          </p>
        </header>

        {/* ⚠️ ALERTA DE SISTEMA (Dinámica) */}
        {(error || message) && (
          <div
            className={`p-4 rounded-2xl border text-xs font-mono animate-in fade-in slide-in-from-top-2 ${
              error
                ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}
          >
            <p className="flex items-center gap-2 uppercase font-black tracking-tight">
              <span>{error ? "🚨 ERROR" : "📡 MENSAJE"}</span>
            </p>
            <p className="mt-1 opacity-80">{error || message}</p>
          </div>
        )}

        {/* 🔐 FORMULARIO DE AUTENTICACIÓN */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                Identificador (Email)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="operador@buscohuella.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                Clave de Seguridad
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                formAction={login}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
              >
                Entrar 🔓
              </button>
              <button
                formAction={signup}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all"
              >
                Registro
              </button>
            </div>
          </form>
        </div>

        {/* 📟 STATUS FOOTER */}
        <footer className="text-center pt-8">
          <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">
            Auth_Connection: {locale.toUpperCase()}_Stable
          </p>
        </footer>
      </div>
    </div>
  );
}
