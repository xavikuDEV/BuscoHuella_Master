"use client";

import { useState } from "react";
import { createAdminUserAction } from "@/lib/actions/users.actions";
import { UserPlus, Shield, Building2, Mail, User } from "lucide-react";

export default function NewUserPage() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    role: "police",
    municipality_slug: "sabadell",
    password: "", // 👈 NUEVO
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🛡️ Validación básica
    if (formData.password.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setLoading(true);

    const res = await createAdminUserAction(formData);

    if (res.success) {
      alert("✅ UNIDAD ACTIVADA: Las credenciales han sido generadas.");
    } else {
      alert("❌ ERROR DE PROTOCOLO: " + res.error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER */}
      <header className="flex items-center gap-4 border-b border-slate-800 pb-6">
        <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
          <UserPlus className="text-emerald-500" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            Reclutamiento <span className="text-emerald-500">Operativo</span>
          </h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">
            Alta de Personal Institucional
          </p>
        </div>
      </header>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-xl space-y-6"
      >
        {/* IDENTIDAD + EMAIL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
              Nombre Completo
            </label>
            <div className="relative">
              <User
                className="absolute left-4 top-4 text-slate-600"
                size={16}
              />
              <input
                required
                className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all text-sm"
                placeholder="Ej: Agente García"
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
              Email Institucional
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-4 text-slate-600"
                size={16}
              />
              <input
                required
                type="email"
                className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all text-sm"
                placeholder="policia@ayto.es"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
            Contraseña Temporal
          </label>
          <div className="relative">
            <Shield
              className="absolute left-4 top-4 text-slate-600"
              size={16}
            />
            <input
              required
              type="password"
              className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all text-sm"
              placeholder="••••••••"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
        </div>

        {/* ROL + MUNICIPIO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rol */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
              Asignación de Rol
            </label>
            <select
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all text-sm"
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="police">👮 Policía Local</option>
              <option value="vet">🩺 Veterinaria Colegiada</option>
              <option value="municipality_admin">
                🏛️ Gestión Ayuntamiento
              </option>
              <option value="admin">⚡ Super Admin</option>
            </select>
          </div>

          {/* Municipio */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
              Jurisdicción (Slug)
            </label>
            <div className="relative">
              <Building2
                className="absolute left-4 top-4 text-slate-600"
                size={16}
              />
              <input
                required
                className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all text-sm"
                placeholder="ej: sabadell"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    municipality_slug: e.target.value.toLowerCase(),
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 p-5 rounded-2xl font-black text-white uppercase tracking-widest text-xs transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
        >
          {loading
            ? "Sincronizando con el Búnker..."
            : "Activar Credenciales Operativas"}
        </button>
      </form>
    </div>
  );
}
