"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Shield,
  Globe,
  MapPin,
  Store,
  Calendar,
  FileText,
  Layout,
  Heart,
  Users,
  Dog,
  Fingerprint,
  Map,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  PawPrint,
  UserPlus,
  Terminal,
  LogOut,
  Radio,
  Cpu,
  Lock,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth.actions";
import { createClient } from "@/lib/supabase/client";

// Carga de Menús JSON
import adminMenu from "@/config/menus/admin.json";
import govMenu from "@/config/menus/gov.json";
import proMenu from "@/config/menus/pro.json";
import shelterMenu from "@/config/menus/shelter.json";
import citizenMenu from "@/config/menus/citizen.json";
import WalletStatus from "./WalletStatus";

interface MenuItem {
  label: string;
  icon: string;
  href: string;
  requiredRole: string[];
  tier?: "free" | "premium";
  deniedMessage?: string;
  upgradeMessage?: string;
  children?: MenuItem[];
}

// Mapeo de Iconos
const IconMap: Record<
  string,
  React.ComponentType<{ size?: number | string; className?: string }>
> = {
  LayoutDashboard,
  Shield,
  Globe,
  MapPin,
  Store,
  Calendar,
  FileText,
  Layout,
  Heart,
  Users,
  Dog,
  Fingerprint,
  Map,
  ShieldAlert,
  PawPrint,
  UserPlus,
  Terminal,
  Settings,
};

function SidebarItem({
  item,
  locale,
  pathname,
  IconMap,
  currentRole,
}: {
  item: MenuItem;
  locale: string;
  pathname: string;
  IconMap: any;
  currentRole: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = IconMap[item.icon] || LayoutDashboard;

  const isLocked = item.tier === "premium" && currentRole === "citizen_free";

  // Adecuación dinámica del locale en la URL
  const localizedHref = item.href.replace(/^\/es\//, `/${locale}/`);

  const isChildActive = (childItems?: MenuItem[]): boolean => {
    if (!childItems) return false;
    return childItems.some((child) => {
      const childLocalizedHref = child.href.replace(/^\/es\//, `/${locale}/`);
      return (
        pathname === childLocalizedHref ||
        (childLocalizedHref !== `/${locale}/dashboard` &&
          pathname.startsWith(childLocalizedHref)) ||
        isChildActive(child.children)
      );
    });
  };

  const isActive =
    pathname === localizedHref ||
    (localizedHref !== `/${locale}/dashboard` &&
      pathname.startsWith(localizedHref)) ||
    isChildActive(item.children);

  useEffect(() => {
    if (isChildActive(item.children)) {
      setIsOpen(true);
    }
  }, [pathname, item.children]);

  return (
    <div className="space-y-1">
      {hasChildren ? (
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-full flex items-center justify-between px-5 py-3 rounded-2xl text-[10px] font-bold uppercase transition-all",
              isActive
                ? "bg-cyan-500/10 text-cyan-400"
                : "text-slate-500 hover:text-white hover:bg-white/5",
            )}
          >
            <div className="flex items-center gap-3">
              <Icon size={16} />
              <span className="flex items-center gap-2">
                {item.label}
                {isLocked && (
                  <Lock size={10} className="text-amber-500 animate-pulse" />
                )}
              </span>
            </div>
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {isOpen && (
            <div className="pl-4 mt-1 space-y-1 border-l border-slate-800/50 ml-6">
              {item.children?.map((child, index) => (
                <SidebarItem
                  key={index}
                  item={child}
                  locale={locale}
                  pathname={pathname}
                  IconMap={IconMap}
                  currentRole={currentRole}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <Link
          href={isLocked ? "#" : localizedHref}
          onClick={(e) => {
            if (isLocked) {
              e.preventDefault();
              setIsModalOpen(true);
            }
          }}
          className={cn(
            "flex items-center gap-3 px-5 py-3 rounded-2xl text-[10px] font-bold uppercase transition-all relative group",
            isActive
              ? "bg-cyan-500/10 text-cyan-400"
              : "text-slate-500 hover:text-white hover:bg-white/5",
            isLocked &&
              "cursor-pointer hover:border-amber-500/20 border border-transparent",
          )}
        >
          <Icon size={16} />
          <span className="flex items-center gap-2">
            {item.label}
            {isLocked && <Lock size={10} className="text-amber-500" />}
          </span>
        </Link>
      )}

      {/* Modal de Tier Premium */}
      {isModalOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="max-w-md w-full bg-slate-900 border border-amber-500/30 rounded-3xl p-8 shadow-2xl relative text-center z-10">
            <div className="bg-slate-950/80 border border-amber-500/20 p-4 rounded-2xl shadow-xl mx-auto w-14 h-14 flex items-center justify-center mb-4">
              <Lock size={24} className="text-amber-500" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">
              Contenido Premium
            </h3>
            <p className="text-slate-400 text-xs mb-6 leading-relaxed font-medium">
              {item.upgradeMessage ||
                "Esta función requiere de una cuenta DUA Premium para estar operativa."}
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  alert("Iniciando protocolo de adquisición Premium...");
                  setIsModalOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-amber-500 text-black font-black text-[10px] uppercase tracking-wider hover:bg-amber-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] font-mono"
              >
                Saber más sobre DUA Premium
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 rounded-xl bg-slate-800/50 text-slate-400 font-black text-[9px] uppercase tracking-wider border border-slate-700/30 hover:bg-slate-800 transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminSidebarNav() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "es";

  const supabase = createClient();

  // 🧠 Estado de rol y municipality_slug
  const [role, setRole] = useState<string | null>(null);
  const [municipalitySlug, setMunicipalitySlug] = useState<string | null>(null);

  useEffect(() => {
    const getAuthData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      let userRole = user.app_metadata?.role || null;
      let slug = user.app_metadata?.municipality_slug || null;

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, municipality_slug")
          .eq("id", user.id)
          .single();

        if (profile) {
          if (profile.role) userRole = profile.role;
          if (profile.municipality_slug) slug = profile.municipality_slug;
        }
      } catch (error) {
        console.error("Error syncing profile from DB:", error);
      }

      setRole(userRole);
      setMunicipalitySlug(slug);
    };

    getAuthData();
  }, []);

  const processMenuItems = (
    items: MenuItem[],
    slug: string | null
  ): MenuItem[] => {
    return items.map((item) => ({
      ...item,
      href: item.href.replace("[municipality]", slug || "global"),
      children: item.children
        ? processMenuItems(item.children, slug)
        : [],
    }));
  };

  const isAdmin = role?.toLowerCase().trim() === "admin" || role?.toLowerCase().trim() === "administrador";

  // Filtro de menú por rol
  const filterMenuByRole = (
    items: MenuItem[],
    currentRole: string | null,
  ): MenuItem[] => {
    const cRole = currentRole?.toLowerCase() || "";
    const isUserAdmin = cRole === "admin" || cRole === "administrador";

    if (isUserAdmin) return items; // Bypass total

    return items
      .filter((item) => {
        return item.requiredRole.some((reqRole) => {
          const rRole = reqRole.toLowerCase();
          const isReqAdmin = rRole === "admin" || rRole === "administrador";
          if (isUserAdmin && isReqAdmin) return true;
          return rRole === cRole;
        });
      })
      .map((item) => ({
        ...item,
        children: item.children
          ? filterMenuByRole(item.children, currentRole)
          : [],
      }));
  };

  const isPolice = role?.toLowerCase().trim() === "police";
  const menuGroups = isAdmin
      ? [
          { title: "ADMINISTRACIÓN MAESTRA", items: processMenuItems(adminMenu as MenuItem[], municipalitySlug) },
          { title: "Gobierno", items: processMenuItems(govMenu as MenuItem[], municipalitySlug) },
          { title: "Profesionales", items: processMenuItems(proMenu as MenuItem[], municipalitySlug) },
          { title: "Entidades", items: processMenuItems(shelterMenu as MenuItem[], municipalitySlug) },
          { title: "Ciudadano", items: processMenuItems(citizenMenu as MenuItem[], municipalitySlug) },
        ]
      : isPolice
      ? [
          {
            title: "Gobierno",
            items: filterMenuByRole(processMenuItems(govMenu as MenuItem[], municipalitySlug), role),
          },
          {
            title: "Ciudadano",
            items: filterMenuByRole(processMenuItems(citizenMenu as MenuItem[], municipalitySlug), role),
          },
        ].filter((group) => group.items.length > 0)
      : [
          {
            title: "Gobierno",
            items: filterMenuByRole(processMenuItems(govMenu as MenuItem[], municipalitySlug), role),
          },
          {
            title: "Profesionales",
            items: filterMenuByRole(processMenuItems(proMenu as MenuItem[], municipalitySlug), role),
          },
          {
            title: "Entidades",
            items: filterMenuByRole(processMenuItems(shelterMenu as MenuItem[], municipalitySlug), role),
          },
          {
            title: "Ciudadano",
            items: filterMenuByRole(processMenuItems(citizenMenu as MenuItem[], municipalitySlug), role),
          },
        ].filter((group) => group.items.length > 0);

  // --- 🛰️ NODO OPERATIVO ---
  const isIncidentDetail =
    pathname.includes("/incidents/") && pathname.split("/").length > 5;
  const isTerritorial = pathname.includes("/municipality/zones");
  const isCommandCenter = pathname.endsWith("/dashboard/admin");
  const isAdminLogs = pathname.includes("/logs");

  let nodeID = "GLOBAL_HUB";
  let nodeStatus = "bg-emerald-500";
  let nodeLabel = "System_Standby";

  if (isTerritorial) {
    nodeID = "GEO_INTEL_ALPHA";
    nodeStatus = "bg-cyan-500";
    nodeLabel = "Scanning_Zones";
  } else if (isIncidentDetail) {
    const shortId = pathname.split("/").pop()?.slice(-4).toUpperCase() || "X";
    nodeID = `UNIT_CELL_${shortId}`;
    nodeStatus = "bg-rose-500";
    nodeLabel = "Tactical_Response";
  } else if (isAdminLogs) {
    nodeID = "LOG_MONITOR_01";
    nodeStatus = "bg-amber-500";
    nodeLabel = "Telemetry_Audit";
  } else if (isCommandCenter) {
    nodeID = "ADMIN_CORE_BCN";
    nodeStatus = "bg-cyan-500";
    nodeLabel = "Live_Telemetry";
  }

  // 🔐 Logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error en el protocolo de salida:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-900/50 select-none shadow-2xl overflow-hidden relative">
      {/* 🚀 HEADER */}
      <div className="p-8 mb-2">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-cyan-500/20 rounded-lg blur-md animate-pulse" />
            <div className="relative bg-slate-900 p-2.5 rounded-xl border border-cyan-500/30">
              <Cpu size={20} className="text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="text-sm font-black text-white uppercase">
              BuscoHuella
            </span>
            <div className="flex items-center gap-1 mt-1">
              <div className="h-1 w-1 bg-cyan-500 rounded-full animate-ping" />
              <span className="text-[7px] text-cyan-500/60 uppercase">
                Bunker_OS_v3.5
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 📂 NAV */}
      <nav className="flex-1 px-5 space-y-8 overflow-y-auto">
        {menuGroups.map((group) => (
          <div key={group.title} className="space-y-3">
            <p className="text-[8px] font-black text-slate-700 uppercase ml-4">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items.map((item, index) => (
                <SidebarItem
                  key={index}
                  item={item}
                  locale={locale}
                  pathname={pathname}
                  IconMap={IconMap}
                  currentRole={role}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* 🚀 BOTÓN FLOTANTE ADMIN */}
      {isAdmin && (
        <Link
          href={`/${locale}/dashboard/admin/users/new`}
          className="absolute bottom-24 right-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-cyan-500 text-black text-[10px] font-black uppercase shadow-lg hover:scale-105 transition-all"
        >
          <UserPlus size={14} />
          Nuevo
        </Link>
      )}

      {/* 🛰️ FOOTER */}
      <div className="p-6 mt-auto space-y-4">
        <WalletStatus />

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between">
            <span className="text-[10px] text-white font-mono">{nodeID}</span>
            <Radio size={12} className="text-emerald-500 animate-pulse" />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase text-rose-500 bg-rose-500/10"
          >
            <LogOut size={12} />
            Terminar_Turno
          </button>
        </div>
      </div>
    </div>
  );
}
