"use client";

import { useEffect, useState } from "react";
import { Coins } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function WalletStatus() {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("balance_hue")
          .eq("id", user.id)
          .single();

        if (error) {
          console.warn("Error al consultar el balance de $HUE (posible migración pendiente):", error);
          setBalance(0);
        } else {
          setBalance(data?.balance_hue ?? 0);
        }
      } catch (err) {
        console.error("Error inesperado en protocolo de balance $HUE:", err);
        setBalance(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();

    // Suscribirse a cambios en tiempo real en profiles
    const subscription = supabase
      .channel("profile_balance_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
        },
        (payload) => {
          if (payload.new && "balance_hue" in payload.new) {
            setBalance(payload.new.balance_hue);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex items-center justify-between animate-pulse">
        <div className="h-4 bg-slate-800 w-24 rounded" />
        <div className="h-4 bg-slate-800 w-12 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden group transition-all hover:border-amber-500/30">
      <div className="absolute inset-0 bg-linear-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

      <div className="flex items-center gap-3 relative z-10">
        <div className="bg-slate-950 p-2 rounded-xl border border-amber-500/20 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
          <Coins size={16} className="group-hover:rotate-12 transition-transform" />
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Wallet_Protocol</span>
          <span className="text-[10px] font-black text-white uppercase tracking-wider mt-0.5">
            Balance HUE
          </span>
        </div>
      </div>

      <div className="flex items-baseline gap-1 relative z-10 font-mono">
        <span className="text-sm font-black text-amber-400">
          {balance !== null ? balance.toLocaleString() : "0"}
        </span>
        <span className="text-[8px] font-bold text-amber-500/60 uppercase">$HUE</span>
      </div>
    </div>
  );
}
