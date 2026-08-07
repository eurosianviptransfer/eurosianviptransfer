"use client";

import React, { useEffect, useState } from "react";
import { FleetManagement } from "@/components/admin/FleetManagement";
import { Car, RefreshCw } from "lucide-react";

export default function FiloPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [greeters, setGreeters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchFleet() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/fleet");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Filo verileri çekilemedi.");
      setVehicles(data.vehicles || []);
      setDrivers(data.drivers || []);
      setGreeters(data.greeters || []);
    } catch (err: any) {
      console.error("Fleet fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFleet();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-3xl border border-slate-800 bg-[linear-gradient(135deg,rgba(8,16,31,0.96),rgba(15,23,42,0.96))] p-5 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              <Car className="h-3.5 w-3.5" /> Filo kontrol merkezi
            </div>
            <h1 className="mt-3 flex items-center gap-3 text-2xl font-black tracking-tight text-white">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-2.5 text-amber-400">
                <Car className="h-6 w-6" />
              </div>
              Araç Filosu & Sürücü Yönetimi
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              VIP transfer araçlarınızı, plakaları ve sürücü/karşılamacı atamalarınızı yönetin.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchFleet}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 transition-all hover:bg-slate-700"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-amber-400" : ""}`} />
            Yenile
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Araç sayısı</p>
            <p className="mt-1 text-xl font-black text-white">{vehicles.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Sürücü</p>
            <p className="mt-1 text-xl font-black text-white">{drivers.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Karşılamacı</p>
            <p className="mt-1 text-xl font-black text-white">{greeters.length}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-amber-400" />
          <span>Filo verileri yükleniyor...</span>
        </div>
      ) : (
        <FleetManagement vehicles={vehicles} drivers={drivers} greeters={greeters} />
      )}
    </div>
  );
}
