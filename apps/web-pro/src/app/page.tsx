import { SYSTEM_NAME, DUA_VERSION } from "@buscohuella/shared";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-blue-50">
      <div className="bg-white p-12 rounded-3xl shadow-xl border-4 border-blue-500 text-center">
        <h1 className="text-5xl font-black text-blue-600 mb-4">
          🐾 {SYSTEM_NAME}
        </h1>
        <p className="text-xl text-slate-600 font-medium">
          Portal de Misión Crítica — Versión:{" "}
          <span className="text-blue-500">{DUA_VERSION}</span>
        </p>
        <div className="mt-8 px-6 py-3 bg-green-500 text-white font-bold rounded-full inline-block animate-bounce">
          BÚNKER OPERATIVO ✅
        </div>
      </div>
    </main>
  );
}
