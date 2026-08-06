"use client";

import React, { useState } from "react";
import { MapPin, Plus, Edit, Trash2, ArrowRight, DollarSign } from "lucide-react";

interface RoutePricing {
  id: string;
  origin: string;
  destination: string;
  vitoPriceEur: number;
  sprinterPriceEur: number;
  maybachPriceEur: number;
  distanceKm: number;
  durationMin: number;
}

const mockRoutes: RoutePricing[] = [
  {
    id: "1",
    origin: "İstanbul Havalimanı (IST)",
    destination: "Taksim / Beşiktaş / Şişli",
    vitoPriceEur: 140,
    sprinterPriceEur: 240,
    maybachPriceEur: 380,
    distanceKm: 42,
    durationMin: 45,
  },
  {
    id: "2",
    origin: "Sabiha Gökçen Havalimanı (SAW)",
    destination: "Karaköy / Galataport VIP",
    vitoPriceEur: 160,
    sprinterPriceEur: 260,
    maybachPriceEur: 420,
    distanceKm: 48,
    durationMin: 55,
  },
  {
    id: "3",
    origin: "İstanbul (Tüm Bölgeler)",
    destination: "Bodrum / Yalıkavak VIP Transfer",
    vitoPriceEur: 750,
    sprinterPriceEur: 1100,
    maybachPriceEur: 1950,
    distanceKm: 690,
    durationMin: 420,
  },
];

export default function FiyatlandirmaPage() {
  const [routes] = useState<RoutePricing[]>(mockRoutes);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <MapPin className="h-7 w-7 text-amber-400" />
            Transfer Bölgeleri & Fiyatlandırma Tarifesi
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Havalimanı - Otel ve Şehirlerarası VIP transfer sabit rota fiyat tarifelerinizi yönetin.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all">
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Yeni Rota Tarifesi Ekle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {routes.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-amber-500/30 transition-all"
          >
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <span>{r.origin}</span>
                <ArrowRight className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="text-amber-400">{r.destination}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Tahmini Mesafe: {r.distanceKm} km • Yolculuk Süresi: ~{r.durationMin} dakika
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="rounded-xl bg-slate-950 px-3.5 py-2 border border-slate-800 text-center">
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Vito VIP</span>
                <span className="text-sm font-black text-amber-400">€{r.vitoPriceEur}</span>
              </div>

              <div className="rounded-xl bg-slate-950 px-3.5 py-2 border border-slate-800 text-center">
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Sprinter VIP</span>
                <span className="text-sm font-black text-amber-400">€{r.sprinterPriceEur}</span>
              </div>

              <div className="rounded-xl bg-slate-950 px-3.5 py-2 border border-slate-800 text-center">
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Maybach VIP</span>
                <span className="text-sm font-black text-amber-400">€{r.maybachPriceEur}</span>
              </div>

              <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:text-amber-400 hover:bg-slate-700 border border-slate-700/60 transition-all">
                  <Edit className="h-3.5 w-3.5 text-amber-400" />
                  <span>Düzenle</span>
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-all">
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Sil</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
