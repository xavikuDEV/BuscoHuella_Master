import { login } from "@/app/auth/actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md space-y-8 bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        {/* Decoración Cyberpunk */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

        <header className="text-center">
          <h1 className="text-3xl font-black text-white tracking-tighter italic">
            BUSCO<span className="text-cyan-400 font-black">HUELLA</span>
          </h1>
          <p className="text-slate-500 text-[9px] uppercase tracking-[0.4em] mt-2 font-bold">
            Autenticación de Nodo v2.0
          </p>
        </header>

        {searchParams.error && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-500 text-xs text-center font-bold">
            ⚠️ ERROR: {searchParams.error}
          </div>
        )}

        <form action={login} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">
              Email Operador
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-slate-700"
              placeholder="nombre@ejemplo.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">
              Clave Cifrada
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-slate-700"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-cyan-900/20 active:scale-95 flex items-center justify-center">
            <span>Iniciar Secuencia de Acceso</span>
          </button>
        </form>

        <footer className="text-center pt-4">
          <p className="text-slate-600 text-[10px] uppercase font-bold tracking-tighter">
            Protección de Activos DUA — 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
