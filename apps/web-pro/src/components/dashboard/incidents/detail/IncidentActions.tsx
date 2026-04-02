"use client";
import { useState } from "react";
import {
  CheckCircle2,
  RotateCcw,
  FileText,
  Share2,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface IncidentActionsProps {
  status: string;
  incidentId: string;
}

export default function IncidentActions({
  status,
  incidentId,
}: IncidentActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleUpdateStatus = async (newStatus: string) => {
    if (!confirm(`¿Confirmar cambio de estado a: ${newStatus}?`)) return;

    setIsUpdating(true);
    const { error } = await supabase
      .from("incidents")
      .update({ status: newStatus })
      .eq("id", incidentId);

    if (error) {
      alert("Error al actualizar: " + error.message);
    } else {
      router.refresh(); // Refresca la página para ver el cambio
    }
    setIsUpdating(false);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {status === "ACTIVE" ? (
        <button
          onClick={() => handleUpdateStatus("RESOLVED")}
          disabled={isUpdating}
          className="col-span-2 flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-[10px] uppercase rounded-2xl transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
        >
          {isUpdating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <CheckCircle2 size={16} />
          )}
          Resolver_Incidencia
        </button>
      ) : (
        <button
          onClick={() => handleUpdateStatus("ACTIVE")}
          disabled={isUpdating}
          className="col-span-2 flex items-center justify-center gap-2 py-4 bg-rose-500/20 border border-rose-500/30 text-rose-500 font-black text-[10px] uppercase rounded-2xl hover:bg-rose-500/30 disabled:opacity-50 transition-all active:scale-95"
        >
          {isUpdating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RotateCcw size={16} />
          )}
          Reabrir_Caso
        </button>
      )}

      <button className="flex items-center justify-center gap-2 py-3 bg-slate-900 border border-slate-800 text-slate-400 font-black text-[9px] uppercase rounded-xl hover:bg-slate-800 hover:text-white transition-all">
        <FileText size={14} /> PDF_Informe
      </button>

      <button className="flex items-center justify-center gap-2 py-3 bg-slate-900 border border-slate-800 text-slate-400 font-black text-[9px] uppercase rounded-xl hover:bg-slate-800 hover:text-white transition-all">
        <Share2 size={14} /> Derivar_Caso
      </button>
    </div>
  );
}
