"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
import Link from "next/link";
import {
  useRouter,
  usePathname,
  useSearchParams,
  useParams,
} from "next/navigation";
import {
  ChevronUp,
  ChevronDown,
  Check,
  Trash2,
  CheckCircle,
  Eye,
  Share2,
  MessageCircle,
  Link2,
  ChevronLeft,
  ChevronRight,
  Copy,
} from "lucide-react";
import {
  resolveIncidentAction,
  deleteIncidentAction,
  bulkResolveIncidentsAction,
  bulkDeleteIncidentsAction,
} from "@/lib/actions/incidents.actions";
import IncidentsFilters from "./IncidentsFilters";

export default function IncidentsTableContainer({
  initialData,
  count,
  totalPages,
  params,
}: any) {
  const router = useRouter();
  const { locale } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeShareId, setActiveShareId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  // 🖱️ Cerrar menú de compartir al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target as Node)
      ) {
        setActiveShareId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateParams = (newParams: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) current.delete(key);
      else current.set(key, value);
    });
    router.push(`${pathname}?${current.toString()}`);
  };

  const handleSort = (key: string) => {
    const newOrder =
      params.sort === key && params.order === "asc" ? "desc" : "asc";
    updateParams({ sort: key, order: newOrder });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExport = () => {
    const headers = "ID,Mensaje,Estado,Urgencia,Sector,Fecha\n";
    const rows = initialData
      .map(
        (i: any) =>
          `${i.id},"${i.message}",${i.status},${i.urgency},${i.sector},${i.created_at}`,
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SBD-FULL-REPORT-${new Date().getTime()}.csv`;
    a.click();
  };

  return (
    <div className="w-full space-y-6 relative pb-24 animate-in fade-in duration-500">
      {/* 🚀 HUD ACCIONES MASIVAS (Z-INDEX SUPERIOR) */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-1000 bg-slate-950/90 border border-cyan-500/50 p-4 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.5)] flex items-center gap-6 backdrop-blur-2xl animate-in slide-in-from-bottom-10">
          <div className="flex items-center gap-3 border-r border-slate-800 pr-6">
            <span className="bg-cyan-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black">
              {selectedIds.length}
            </span>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">
              En Selección
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                startTransition(() => bulkResolveIncidentsAction(selectedIds))
              }
              className="px-4 py-2 bg-emerald-500 text-black rounded-xl text-[9px] font-black uppercase hover:scale-105 transition-all"
            >
              RESOLVER
            </button>
            <button
              onClick={() => {
                if (confirm(`¿ELIMINAR ${selectedIds.length} REGISTROS?`))
                  startTransition(() => bulkDeleteIncidentsAction(selectedIds));
              }}
              className="px-4 py-2 bg-rose-600 text-white rounded-xl text-[9px] font-black uppercase flex items-center gap-2 hover:bg-rose-500 transition-all"
            >
              <Trash2 size={12} /> ELIMINAR
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-[9px] font-black uppercase hover:bg-slate-700"
            >
              CANCELAR
            </button>
          </div>
        </div>
      )}

      {/* 🔍 PANEL DE FILTROS (ANCHO TOTAL) */}
      <div className="w-full">
        <IncidentsFilters
          params={params}
          updateParams={updateParams}
          handleExport={handleExport}
        />
      </div>

      {/* 📋 TABLA MAESTRA (SIN DESPLAZADOR, ANCHO TOTAL) */}
      <div className="w-full bg-slate-900/50 border border-slate-800 rounded-[3rem] overflow-visible shadow-2xl backdrop-blur-xl">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-500">
              {/* Columna de Check alineada al pixel */}
              <th className="w-[80px] min-w-[80px] p-0">
                <div className="flex justify-center items-center">
                  <button
                    onClick={() =>
                      setSelectedIds(
                        selectedIds.length === initialData.length &&
                          initialData.length > 0
                          ? []
                          : initialData.map((i: any) => i.id),
                      )
                    }
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                      selectedIds.length > 0
                        ? "bg-cyan-500 border-cyan-500"
                        : "border-slate-700"
                    }`}
                  >
                    {selectedIds.length > 0 && (
                      <Check size={14} className="text-black stroke-[3px]" />
                    )}
                  </button>
                </div>
              </th>

              <th
                onClick={() => handleSort("id")}
                className="w-[140px] px-4 py-6 text-[10px] font-black uppercase cursor-pointer hover:text-cyan-400 transition-colors"
              >
                <div className="flex items-center gap-2">
                  REF_ID{" "}
                  {params.sort === "id" &&
                    (params.order === "asc" ? (
                      <ChevronUp size={12} />
                    ) : (
                      <ChevronDown size={12} />
                    ))}
                </div>
              </th>

              <th
                onClick={() => handleSort("message")}
                className="px-4 py-6 text-[10px] font-black uppercase cursor-pointer hover:text-cyan-400 transition-colors"
              >
                INCIDENCIA
              </th>

              <th
                onClick={() => handleSort("urgency")}
                className="w-[100px] px-4 py-6 text-[10px] font-black uppercase text-center cursor-pointer hover:text-cyan-400"
              >
                URGENCIA
              </th>

              <th
                onClick={() => handleSort("status")}
                className="w-[110px] px-4 py-6 text-[10px] font-black uppercase text-center cursor-pointer hover:text-cyan-400"
              >
                ESTADO
              </th>

              <th className="w-[110px] px-4 py-6 text-[10px] font-black uppercase text-center">
                DPTO.
              </th>

              <th
                onClick={() => handleSort("created_at")}
                className="w-[110px] px-4 py-6 text-[10px] font-black uppercase cursor-pointer hover:text-cyan-400 text-right"
              >
                FECHA
              </th>

              <th className="w-[180px] px-6 py-6 text-right text-[10px] font-black uppercase">
                ACCIONES
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/30">
            {initialData.map((inc: any) => (
              <tr
                key={inc.id}
                className={`group hover:bg-slate-800/20 transition-all ${selectedIds.includes(inc.id) ? "bg-cyan-500/5" : ""}`}
              >
                {/* Check de fila alineado al pixel */}
                <td className="w-[80px] min-w-[80px] p-0">
                  <div className="flex justify-center items-center">
                    <button
                      onClick={() =>
                        setSelectedIds((prev) =>
                          prev.includes(inc.id)
                            ? prev.filter((id) => id !== inc.id)
                            : [...prev, inc.id],
                        )
                      }
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                        selectedIds.includes(inc.id)
                          ? "bg-cyan-500 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                          : "border-slate-800"
                      }`}
                    >
                      {selectedIds.includes(inc.id) && (
                        <Check size={14} className="text-black stroke-[3px]" />
                      )}
                    </button>
                  </div>
                </td>

                <td className="px-4 py-6">
                  <div className="flex items-center gap-2 group/id">
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-tighter">
                      #{inc.id.slice(0, 14)}...
                    </span>
                    <button
                      onClick={() => copyToClipboard(inc.id, inc.id)}
                      className="p-1 hover:bg-slate-800 rounded transition-colors"
                    >
                      <Copy
                        size={12}
                        className={
                          copiedId === inc.id
                            ? "text-emerald-400"
                            : "text-slate-700 opacity-0 group-hover/id:opacity-100 transition-all"
                        }
                      />
                    </button>
                  </div>
                </td>

                <td className="px-4 py-6">
                  <Link
                    href={`/${locale}/dashboard/admin/incidents/${inc.id}`}
                    className="block group/link"
                  >
                    <p className="text-sm font-bold text-white group-hover/link:text-cyan-400 transition-colors line-clamp-1">
                      {inc.message}
                    </p>
                    <p className="text-[8px] text-slate-600 uppercase mt-1 font-mono tracking-tighter">
                      COORD: {inc.sector || "SBD-GEN"}
                    </p>
                  </Link>
                </td>

                <td className="px-4 py-6 text-center">
                  <span
                    className={`text-[9px] font-black px-2 py-1 rounded-full border ${inc.urgency === "CRITICAL" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-slate-800 text-slate-500 border-slate-700"}`}
                  >
                    {inc.urgency}
                  </span>
                </td>

                <td className="px-4 py-6 text-center">
                  <div
                    className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase ${inc.status === "ACTIVE" ? "text-rose-500" : "text-emerald-400"}`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${inc.status === "ACTIVE" ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`}
                    />
                    {inc.status}
                  </div>
                </td>

                <td className="px-4 py-6 text-center">
                  <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 uppercase tracking-tighter">
                    {inc.department || "SEGURIDAD"}
                  </span>
                </td>

                <td className="px-4 py-6 text-[10px] font-mono text-slate-500 text-right">
                  {new Date(inc.created_at).toLocaleDateString()}
                </td>

                <td className="px-6 py-6">
                  <div className="flex justify-end gap-1 relative">
                    <Link
                      href={`/${locale}/dashboard/admin/incidents/${inc.id}`}
                      title="Auditar"
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-all"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm("¿Confirmar resolución?"))
                          resolveIncidentAction(inc.id);
                      }}
                      className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500 rounded-xl text-emerald-500 hover:text-black transition-all"
                    >
                      <CheckCircle size={18} />
                    </button>

                    <div
                      className="relative"
                      ref={activeShareId === inc.id ? shareMenuRef : null}
                    >
                      <button
                        onClick={() =>
                          setActiveShareId(
                            activeShareId === inc.id ? null : inc.id,
                          )
                        }
                        className={`p-2.5 rounded-xl transition-all ${activeShareId === inc.id ? "bg-cyan-500 text-black shadow-lg" : "bg-slate-800 text-slate-400 hover:text-white"}`}
                      >
                        <Share2 size={18} />
                      </button>
                      {activeShareId === inc.id && (
                        <div className="absolute bottom-full right-0 mb-3 w-44 bg-slate-950 border border-slate-700 rounded-2xl p-1 shadow-2xl z-1100 animate-in zoom-in-95 origin-bottom-right">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${window.location.origin}/${locale}/dashboard/admin/incidents/${inc.id}`,
                              );
                              setActiveShareId(null);
                            }}
                            className="w-full flex items-center justify-between p-3 hover:bg-slate-800 rounded-xl text-[9px] font-black uppercase text-slate-300"
                          >
                            LINK <Link2 size={14} />
                          </button>
                          <a
                            href={`https://wa.me/?text=Incidencia Sabadell: ${inc.message}`}
                            target="_blank"
                            className="w-full flex items-center justify-between p-3 hover:bg-emerald-500/10 rounded-xl text-[9px] font-black uppercase text-emerald-500"
                          >
                            WHATSAPP <MessageCircle size={14} />
                          </a>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (confirm("¿Eliminar del registro?"))
                          deleteIncidentAction(inc.id);
                      }}
                      className="p-2.5 bg-rose-500/10 hover:bg-rose-500 rounded-xl text-rose-500 hover:text-white transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🔢 PAGINACIÓN (CENTRO DE DATOS) */}
        <footer className="p-6 bg-slate-950/50 border-t border-slate-800 flex justify-between items-center">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            Terminal_Archive // Página {params.page} de {totalPages} // {count}{" "}
            Incidentes
          </p>
          <div className="flex gap-2">
            <button
              onClick={() =>
                updateParams({ page: (parseInt(params.page) - 1).toString() })
              }
              disabled={parseInt(params.page) <= 1}
              className="p-3 rounded-xl border border-slate-800 hover:bg-slate-800 disabled:opacity-20 transition-all shadow-inner"
            >
              <ChevronLeft size={16} className="text-white" />
            </button>
            <button
              onClick={() =>
                updateParams({ page: (parseInt(params.page) + 1).toString() })
              }
              disabled={parseInt(params.page) >= totalPages}
              className="p-3 rounded-xl border border-slate-800 hover:bg-slate-800 disabled:opacity-20 transition-all shadow-inner"
            >
              <ChevronRight size={16} className="text-white" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
