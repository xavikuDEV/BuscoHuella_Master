export const dynamic = "force-dynamic";

import React from "react";
import ManagePetsClient from "@/components/dashboard/ManagePetsClient";
import { createClient } from "@/lib/supabase/server";
import { logSystemEvent } from "@/lib/actions/logs.actions";

export default async function PetsPage() {
  const supabase = await createClient();

  // 🛰️ CONSULTA CON ESPECIFICACIÓN DE RELACIÓN
  const { data: pets, error: petsError } = await supabase
    .from("pets")
    .select(
      `
    *,
    profiles!pets_owner_id_fkey (
      display_name,
      email
    )
  `,
    )
    .order("created_at", { ascending: false });

  // 📥 Obtenemos los dueños para el censo
  const { data: owners, error: ownersError } = await supabase
    .from("profiles")
    .select("*")
    .order("display_name", { ascending: true });

  const error = petsError || ownersError;

  // 🛡️ LOG SEGURO: El 'false' final es vital para que Next.js no explote
  if (error) {
    await logSystemEvent(
      {
        level: "ERROR",
        module: "PETS_ADMIN",
        message: `Fallo de sincronización: ${error.message}`,
      },
      false,
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end border-b border-slate-800/50 pb-8">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            Gestión de <span className="text-cyan-400">Activos Animales</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 italic font-medium text-balance">
            Protocolo de Integridad DUA Activo. Sincronización de red estable.
          </p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 px-6 py-3 rounded-2xl hidden md:block text-right">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Censo Activo
          </p>
          <p className="text-2xl font-black text-white">
            {pets?.length || 0}
          </p>
        </div>
      </header>

      {error ? (
        <div className="p-8 bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] space-y-2">
          <div className="flex items-center gap-3 text-rose-500">
            <span className="text-2xl">🚨</span>
            <p className="font-black uppercase tracking-tight">
              Interferencia en la señal de datos
            </p>
          </div>
          <p className="text-xs text-rose-400/70 font-mono pl-10">
            {error.message}
          </p>
          <p className="text-[10px] text-slate-600 pl-10 italic mt-4">
            Tip Archon: Verifica que la relación 'owner_id' sea única en el
            esquema SQL.
          </p>
        </div>
      ) : (
        <main className="relative">
          <div className="absolute -top-8 right-4 text-[8px] font-black text-slate-700 uppercase tracking-[0.3em]">
            Link_Status:{" "}
            <span className="text-emerald-500">Encrypted_Link_OK</span>
          </div>
          <ManagePetsClient initialPets={pets || []} owners={owners || []} />
        </main>
      )}
    </div>
  );
}
