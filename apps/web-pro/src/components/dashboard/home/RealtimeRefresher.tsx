"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RealtimeRefresher() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Escuchar CUALQUIER cambio en las tablas críticas
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pets" },
        () => router.refresh(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "incidents" },
        () => router.refresh(),
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "system_logs" },
        () => router.refresh(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);

  return null; // Es un componente de lógica, no renderiza nada
}
