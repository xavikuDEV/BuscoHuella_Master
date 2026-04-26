"use client"; // 👈 Muy importante: para manejar estados y eventos de clic

import { useState } from "react";
import { supabase, SYSTEM_NAME } from "@buscohuella/shared";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Añadimos los tipos string a los parámetros
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(`Error de acceso: ${error.message}`);
    } else {
      console.log("Acceso concedido:", data);
      // Aquí vendrá la lógica de redirección por roles que explico abajo
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-10 backdrop-blur-xl">
        <h2 className="text-center text-3xl font-extrabold text-white">
          Entrada al{" "}
          <span className="text-emerald-500 italic">{SYSTEM_NAME}</span>
        </h2>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <input
            type="email"
            placeholder="Email institucional / personal"
            className="w-full rounded-lg bg-zinc-800 p-3 text-white border border-zinc-700"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full rounded-lg bg-zinc-800 p-3 text-white border border-zinc-700"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full rounded-lg bg-emerald-600 p-3 font-bold text-white hover:bg-emerald-500 transition-colors">
            Iniciar Operaciones
          </button>
        </form>
      </div>
    </div>
  );
}
