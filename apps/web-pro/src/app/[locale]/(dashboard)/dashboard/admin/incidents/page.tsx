export const dynamic = "force-dynamic";

import React from "react";
import { createClient } from "@/lib/supabase/server";
import IncidentReport from "@/components/dashboard/home/IncidentReport";

export default async function IncidentsPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    status?: string;
    urgency?: string;
    q?: string;
    sort?: string;
    order?: string;
    start?: string;
    end?: string;
  }>;
}) {
  const {
    page = "1",
    status = "ALL",
    urgency = "ALL",
    q = "",
    sort = "created_at",
    order = "desc",
    start = "",
    end = "",
  } = await props.searchParams;

  const supabase = await createClient();
  const limit = 10;
  const from = (parseInt(page) - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("incidents")
    .select("*, pets(name)", { count: "exact" });

  if (status !== "ALL") query = query.eq("status", status);
  if (urgency !== "ALL") query = query.eq("urgency", urgency);
  if (start) query = query.gte("created_at", `${start}T00:00:00`);
  if (end) query = query.lte("created_at", `${end}T23:59:59`);

  if (q) {
    const term = q.replace("#", "").trim();
    query = query.or(
      `message.ilike.%${term}%,sector.ilike.%${term}%,id_search.ilike.%${term}%`,
    );
  }

  const {
    data: incidents,
    count,
    error,
  } = await query.order(sort, { ascending: order === "asc" }).range(from, to);

  if (error) console.error("❌ Error Radar:", error.message);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 p-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
          Archivo <span className="text-cyan-400">Central</span>
        </h2>
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mt-2">
          Database_Intel // {count || 0} Registros_Detectados
        </p>
      </div>

      <IncidentReport
        initialIncidents={incidents || []}
        sector="ALL"
      />
    </div>
  );
}
