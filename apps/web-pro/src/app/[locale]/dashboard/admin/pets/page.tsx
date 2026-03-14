export const dynamic = "force-dynamic";

import AdminLayout from "@/components/layouts/AdminLayout";
import { PetRepository, UserRepository } from "@buscohuella/shared";
import { supabase } from "@/lib/supabase";
import ManagePetsClient from "@/components/dashboard/ManagePetsClient";

export default async function PetsAdminPage() {
  // 📡 1. Cargamos los datos desde el servidor (esto no cambia)
  const petRepo = new PetRepository(supabase);
  const userRepo = new UserRepository(supabase);

  const [{ data: pets }, { data: owners }] = await Promise.all([
    petRepo.findAll(),
    userRepo.findAll(),
  ]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Mantenemos tu cabecera original aquí para que 
           el servidor la renderice instantáneamente. 
        */}
        <header>
          <h2 className="text-3xl font-black text-white tracking-tighter">
            Gestión de <span className="text-cyan-400">Activos Animales</span>
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Protocolo de Integridad DUA Activo.
          </p>
        </header>

        {/* 🛡️ Aquí es donde ocurre la magia:
           He movido todo tu diseño de columnas (Grid), la Tabla y el Formulario 
           dentro de este componente. 
           
           ¿Por qué? Porque ahora la tabla puede decirle al formulario: 
           "¡Oye, que han pulsado editar en Kratos, cárgame sus datos!"
        */}
        <ManagePetsClient initialPets={pets || []} owners={owners || []} />
      </div>
    </AdminLayout>
  );
}
