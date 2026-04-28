"use client";

import React, { useState, useEffect } from "react";
import { awardHueAction } from "@/lib/actions/wallet.actions";

interface PatrolDashboardProps {
  user: {
    id: string;
    display_name: string;
    role: string;
    assigned_sector_id?: string | null;
  };
  sectorName: string;
}

export default function PatrolDashboard({ user, sectorName }: PatrolDashboardProps) {
  const [isOnDuty, setIsOnDuty] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [seconds, setSeconds] = useState<number>(0);

  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 🔄 Cargar Persistencia de Guardia
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDuty = localStorage.getItem("patrol_isOnDuty") === "true";
      const storedStart = localStorage.getItem("patrol_startTime");
      
      if (storedDuty && storedStart) {
        setIsOnDuty(true);
        setStartTime(parseInt(storedStart));
        const currentSeconds = Math.floor((Date.now() - parseInt(storedStart)) / 1000);
        setSeconds(currentSeconds > 0 ? currentSeconds : 0);
      }
    }
  }, []);

  // ⏱️ Cronómetro Visual
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isOnDuty && startTime) {
      interval = setInterval(() => {
        const diffSeconds = Math.floor((Date.now() - startTime) / 1000);
        setSeconds(diffSeconds > 0 ? diffSeconds : 0);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isOnDuty, startTime]);

  // Algoritmo de Recompensa en tiempo real
  const minutesTranscurridos = seconds / 60;
  const accumulatedTokens = parseFloat(((minutesTranscurridos / 10) * 5).toFixed(2));

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [hours, minutes, secs]
      .map((v) => (v < 10 ? "0" + v : v))
      .join(":");
  };

  const handleStartPatrol = async () => {
    setIsStarting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Al pulsar 'INICIAR GUARDIA': Llama a awardHueAction con 10 $HUE (Bono de Despliegue)
      const result = await awardHueAction(
        user.id,
        10,
        "Bono de Despliegue Sectorial",
        user.id
      );

      if (result.success) {
        const now = Date.now();
        localStorage.setItem("patrol_startTime", now.toString());
        localStorage.setItem("patrol_isOnDuty", "true");
        setStartTime(now);
        setIsOnDuty(true);
        setSeconds(0);
        setSuccessMessage("¡Guardia iniciada! +10 $HUE abonados como Bono de Despliegue.");
      } else {
        setErrorMessage(result.error || "Error al iniciar protocolo de guardia.");
      }
    } catch (err: any) {
      setErrorMessage("Fallo de conexión con la red central.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleEndPatrol = async () => {
    setIsEnding(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Al pulsar 'FINALIZAR TURNO': Llama a awardHueAction con el Total Acumulado por tiempo
      const finalMinutes = seconds / 60;
      const finalTokens = Math.floor((finalMinutes / 10) * 5);

      let rewardSuccess = true;
      let errorText = "";

      if (finalTokens > 0) {
        const result = await awardHueAction(
          user.id,
          finalTokens,
          "Recompensa por Tiempo de Guardia",
          user.id
        );
        rewardSuccess = result.success;
        errorText = result.error || "Error al abonar recompensa de guardia.";
      }

      if (rewardSuccess) {
        localStorage.removeItem("patrol_startTime");
        localStorage.removeItem("patrol_isOnDuty");
        setIsOnDuty(false);
        setStartTime(null);
        setSeconds(0);
        setSuccessMessage(`¡Guardia finalizada con éxito! Se han abonado +${finalTokens} $HUE.`);
      } else {
        setErrorMessage(errorText);
      }
    } catch (err: any) {
      setErrorMessage("Fallo de conexión con la red central al finalizar guardia.");
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800/60 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl max-w-xl mx-auto text-center space-y-6 relative overflow-hidden group">
      {/* Glow Effect */}
      <div className="absolute -inset-px bg-linear-to-r from-cyan-500 to-indigo-500 rounded-[2.5rem] opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

      <div className="relative z-10">
        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
          {isOnDuty ? "GUARDIA EN PROGRESO" : "MODO PATRULLA INACTIVO"}
        </span>

        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mt-4">
          Oficial {user.display_name || "Sin Nombre"}
        </h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center justify-center gap-1">
          <span className="text-indigo-400">📍 Sector asignado:</span> {sectorName || "NO ASIGNADO"}
        </p>
      </div>

      {isOnDuty && (
        <div className="relative z-10 p-6 bg-slate-950/40 border border-slate-800/50 rounded-2xl space-y-4">
          <div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              TIEMPO TRANSCURRIDO
            </span>
            <div className="text-4xl font-black text-cyan-400 font-mono tracking-wider mt-1 animate-pulse">
              {formatTime(seconds)}
            </div>
          </div>

          <div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              $HUE ACUMULADOS (TIEMPO REAL)
            </span>
            <div className="text-2xl font-black text-emerald-400 tracking-wide mt-1 font-mono">
              +{accumulatedTokens} <span className="text-xs text-emerald-500">$HUE</span>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 py-4">
        {!isOnDuty ? (
          <button
            onClick={handleStartPatrol}
            disabled={isStarting || isOnDuty}
            className="w-full py-5 px-8 text-slate-950 text-sm font-black uppercase tracking-widest rounded-2xl bg-linear-to-r from-cyan-400 via-indigo-400 to-cyan-400 bg-size-[200%_100%] animate-pulse hover:animate-none hover:bg-right transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(129,140,248,0.5)] border border-cyan-300/50"
          >
            {isStarting ? "Sincronizando Red..." : "INICIAR PROTOCOLO DE GUARDIA"}
          </button>
        ) : (
          <button
            onClick={handleEndPatrol}
            disabled={isEnding}
            className="w-full py-5 px-8 text-white text-sm font-black uppercase tracking-widest rounded-2xl bg-linear-to-r from-rose-600 via-red-500 to-rose-600 bg-size-[200%_100%] hover:bg-right transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] border border-rose-500/50"
          >
            {isEnding ? "Consolidando Turno..." : "FINALIZAR TURNO"}
          </button>
        )}
      </div>

      {/* Success & Error Banners */}
      {successMessage && (
        <div className="relative z-10 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-bold uppercase tracking-widest animate-in slide-in-from-bottom duration-300">
          🎉 {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="relative z-10 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-bold uppercase tracking-widest animate-in slide-in-from-bottom duration-300">
          🚨 {errorMessage}
        </div>
      )}
    </div>
  );
}
