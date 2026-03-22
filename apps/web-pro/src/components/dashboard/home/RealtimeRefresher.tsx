"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RealtimeRefresher() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    console.log("[📡] Iniciando receptor de telemetría...");

    const channel = supabase
      .channel("bunker-global-sync")
      .on("postgres_changes", { event: "*", schema: "public" }, (payload) => {
        console.log(`[🔥] CAMBIO DETECTADO EN: ${payload.table}`, payload);
        router.refresh();
      })
      .subscribe((status, err) => {
        // Esto nos dirá si la conexión es exitosa o si Supabase nos rechaza
        console.log(`[📶] Estado de sintonía: ${status}`);
        if (err) console.error("[❌] Error de radio:", err);
      });

    return () => {
      console.log("[🔌] Desconectando sensores...");
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);

  return null;
}
