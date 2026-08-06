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
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Car className="h-6 w-6" />
            </div>
            Araç Filosu & Sürücü Yönetimi
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            VIP transfer araçlarınızı, plakaları ve sürücü/karşılamacı atamalarınızı yönetin.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchFleet}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-amber-400" : ""}`} />
          Yenile
        </button>
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
