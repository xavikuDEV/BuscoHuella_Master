"use client";

import React, { useState, useMemo } from "react";
import { UserProfile, UserRole } from "@buscohuella/shared";
import {
  updateUserRoleAction,
  deleteUserAction,
  createUserAction,
  updateUserAction,
} from "@/app/[locale]/dashboard/admin/users/actions";

export default function ManageUsersClient({
  users = [],
  currentUserId,
}: {
  users: UserProfile[];
  currentUserId: string;
}) {
  const [isPending, setIsPending] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // 🔍 ESTADOS DE FILTRO
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState("");

  // 📝 ESTADO ÚNICO DE FORMULARIO (Alta y Edición)
  const [formData, setFormData] = useState({
    email: "",
    display_name: "",
    role: UserRole.USER,
    location_city: "",
  });

  // 🛰️ LÓGICA DE FILTRADO DINÁMICO
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        (u.display_name || u.username || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesCity =
        !cityFilter ||
        u.location_city?.toLowerCase().includes(cityFilter.toLowerCase());

      return matchesSearch && matchesRole && matchesCity;
    });
  }, [users, search, roleFilter, cityFilter]);

  // 📑 MANEJADORES DE ACCIÓN
  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      email: "",
      display_name: "",
      role: UserRole.USER,
      location_city: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      display_name: user.display_name || "",
      role: (user.role as UserRole) || UserRole.USER,
      location_city: user.location_city || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const actionType = editingUser ? "Actualizando" : "Registrando";
    console.log(`🚀 ${actionType} nodo...`, formData);
    setIsPending("processing");

    try {
      const result = editingUser
        ? await updateUserAction(editingUser.id, formData)
        : await createUserAction(formData);

      console.log("📡 Respuesta del servidor:", result);

      if (result.success) {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({
          email: "",
          display_name: "",
          role: UserRole.USER,
          location_city: "",
        });
      } else {
        alert(`Error en el protocolo: ${result.error}`);
      }
    } catch (err) {
      console.error("💥 Error en la transmisión:", err);
    } finally {
      setIsPending(null);
    }
  };

  // 🎨 MAPEO DE ETIQUETAS HUMANAS
  const roleLabels: Record<string, string> = {
    admin: "Administrador",
    archon: "Administrador",
    user: "Ciudadano",
    vet: "Veterinario",
    police: "Autoridad / Policía",
    ngo: "Protectora / ONG",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* 🔍 BARRA DE FILTROS Y ACCIÓN GLOBAL */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-800/60 backdrop-blur-xl shadow-2xl">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
            Identidad
          </label>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-indigo-500/50 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
            Rango / Rol
          </label>
          <select
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 outline-none"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Todos los rangos</option>
            {Object.values(UserRole).map((role) => (
              <option key={role} value={role}>
                {roleLabels[role] || role.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
            Ubicación
          </label>
          <input
            type="text"
            placeholder="Filtrar ciudad..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-indigo-500/50 outline-none transition-all"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={openCreateModal}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span> Registrar Persona / Entidad
          </button>
        </div>
      </div>

      {/* 📑 TABLA DE CENSO */}
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-950/50 border-b border-slate-800 text-[10px] font-black uppercase text-slate-500 tracking-widest">
            <tr>
              <th className="p-8">Persona / Entidad</th>
              <th className="p-8">Ubicación</th>
              <th className="p-8 text-right">Gestión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-800/30 transition-colors group"
              >
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border ${user.id === currentUserId ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]" : "bg-slate-800 text-slate-400 border-slate-700"}`}
                    >
                      {(user.display_name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white leading-none flex items-center gap-2">
                        {user.display_name}
                        {user.id === currentUserId && (
                          <span className="text-[8px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                            TÚ
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-8 text-xs text-slate-400 font-medium">
                  {user.location_city || "---"}
                  <div className="text-[9px] text-indigo-400 uppercase font-black tracking-widest mt-1">
                    {roleLabels[user.role] || user.role}
                  </div>
                </td>
                <td className="p-8 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="p-3 bg-slate-950/50 hover:bg-indigo-500/10 rounded-2xl text-slate-500 hover:text-indigo-400 transition-all opacity-0 group-hover:opacity-100"
                  >
                    📝
                  </button>
                  <button
                    onClick={() =>
                      confirm(`¿Eliminar perfil de ${user.email}?`) &&
                      deleteUserAction(user.id)
                    }
                    className="p-3 bg-slate-950/50 hover:bg-rose-500/10 rounded-2xl text-slate-600 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🛡️ MODAL MAESTRO (REGISTRO / EDICIÓN) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3.5rem] max-w-md w-full shadow-2xl space-y-8 relative overflow-hidden">
            <header className="flex justify-between items-center relative z-10">
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                  {editingUser ? "Modificar Nodo" : "Alta de Registro"}
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                  {editingUser
                    ? "Actualizando Credenciales"
                    : "Nuevo Nodo Ciudadano"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-4">
                  Nombre / Razón Social
                </label>
                <input
                  required
                  value={formData.display_name}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-xs text-white focus:border-indigo-500 outline-none transition-all"
                  onChange={(e) =>
                    setFormData({ ...formData, display_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-4">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-xs text-white focus:border-indigo-500 outline-none transition-all"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase ml-4">
                    Rango
                  </label>
                  <select
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-xs text-indigo-400 outline-none"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as UserRole,
                      })
                    }
                  >
                    {Object.values(UserRole).map((r) => (
                      <option key={r} value={r}>
                        {roleLabels[r] || r.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase ml-4">
                    Ciudad
                  </label>
                  <input
                    value={formData.location_city}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-xs text-white focus:border-indigo-500 outline-none transition-all"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location_city: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending !== null}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all mt-4"
              >
                {isPending
                  ? "Sincronizando..."
                  : editingUser
                    ? "Actualizar Registro"
                    : "Confirmar Alta"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
