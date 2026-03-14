export const dynamic = "force-dynamic";

import AdminLayout from "@/components/layouts/AdminLayout";
import { PetRepository, UserRepository, PetSpecies } from "@buscohuella/shared";
import { supabase } from "@/lib/supabase";
import PetRegistrationForm from "@/components/forms/PetRegistrationForm";
import PetTableActions from "@/components/dashboard/PetTableActions";

export default async function PetsAdminPage() {
  const petRepo = new PetRepository(supabase);
  const userRepo = new UserRepository(supabase);

  const [{ data: pets }, { data: owners }] = await Promise.all([
    petRepo.findAll(),
    userRepo.findAll(),
  ]);

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <header>
            <h2 className="text-3xl font-black text-white tracking-tighter">
              Gestión de <span className="text-cyan-400">Activos Animales</span>
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              Protocolo de Integridad DUA Activo.
            </p>
          </header>

          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Mascota
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    DUA ID
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Raza / Especie
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {pets && pets.length > 0 ? (
                  pets.map((pet) => (
                    <tr
                      key={pet.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="p-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl border border-slate-700">
                            {{
                              [PetSpecies.CAT]: "🐱",
                              [PetSpecies.DOG]: "🐶",
                              [PetSpecies.BIRD]: "🦜",
                              [PetSpecies.HAMSTER]: "🐹",
                              [PetSpecies.REPTILE]: "🦎",
                              [PetSpecies.OTHER]: "✨",
                            }[pet.species as PetSpecies] || "🐾"}
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-bold text-white">
                              {pet.name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              ID: {pet.id.split("-")[0]}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="font-mono text-[11px] text-cyan-400 bg-cyan-500/5 px-3 py-1 rounded-md border border-cyan-500/10">
                          {pet.dua_id}
                        </span>
                      </td>
                      <td className="p-6">
                        <p className="text-sm text-slate-300 font-medium">
                          {pet.breed || "N/A"}
                        </p>
                        <p className="text-[9px] text-slate-500 uppercase font-black">
                          {pet.species}
                        </p>
                      </td>
                      <td className="p-6 text-right">
                        {/* 🛡️ Ahora pasamos petId y petName como exige el componente */}
                        <PetTableActions petId={pet.id} petName={pet.name} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-20 text-center text-slate-500">
                      Vacío.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-10">
            <h3 className="text-xl font-black text-white mb-6 flex items-center">
              <span className="mr-3 text-2xl">⚡</span> Registro Génesis
            </h3>
            <PetRegistrationForm owners={owners || []} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
