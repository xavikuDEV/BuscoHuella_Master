export const dynamic = "force-dynamic";

import AdminLayout from "@/components/layouts/AdminLayout";
// 🛡️ Importamos UserRepository y UserProfile (ahora que el build los exporta)
import { UserRepository, UserRole, UserProfile } from "@buscohuella/shared";
import { supabase } from "@/lib/supabase";

export default async function UsersAdminPage() {
  const userRepo = new UserRepository(supabase);
  const { data: users, error } = await userRepo.findAll();

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter">
              Gestión de <span className="text-indigo-400">Nodos Humanos</span>
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              Control de identidades y privilegios del sistema.
            </p>
          </div>
        </header>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-mono">
            ⚠️ Error de acceso: {error.message}
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  Usuario
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  Rol
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  Email
                </th>
                <th className="p-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {/* 🛡️ Tipamos 'user' explícitamente como UserProfile */}
              {users?.map((user: UserProfile) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="p-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        {user.full_name?.charAt(0) || "U"}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {user.full_name}
                        </p>
                        <p className="text-[9px] text-slate-500 font-mono">
                          ID: {user.id.split("-")[0]}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span
                      className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg border shadow-sm ${
                        user.role === UserRole.ADMIN
                          ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6 text-sm text-slate-400 font-medium font-mono">
                    {user.email}
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-[10px] font-black uppercase text-slate-500 hover:text-white px-4 py-2 hover:bg-slate-800 border border-transparent hover:border-slate-700 rounded-xl transition-all">
                      Gestionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
