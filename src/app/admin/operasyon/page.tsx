"use client";

import React from "react";
import {
  Activity,
  Car,
  CheckCircle2,
  Compass,
  MapPin,
  Navigation,
  Radio,
  Sparkles,
  Users2,
} from "lucide-react";

export default function OperasyonPage() {
  const stats = [
    { label: "Görevde Araç", value: "14", detail: "2 rötar izleniyor" },
    { label: "Bugün Karşılama", value: "26", detail: "IST / SAW / AYT" },
    { label: "Yolda Transfer", value: "9", detail: "%78 on-time" },
  ];

  const trips = [
    { pnr: "EV-8921", driver: "Ahmet Y. (34 VIP 8892)", route: "IST ➔ Çırağan Palace", status: "Yolda (%65)" },
    { pnr: "EV-8922", driver: "Mustafa D. (34 VIP 1042)", route: "SAW ➔ Bodrum Marina", status: "Yolda (%30)" },
    { pnr: "EV-8925", driver: "Cengiz Ö. (34 VIP 0001)", route: "Galataport ➔ Sapanca", status: "Karşılamada" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
            <Sparkles className="h-3.5 w-3.5" /> Operasyon merkezi
          </div>
          <h1 className="mt-3 flex items-center gap-2.5 text-2xl font-black tracking-tight text-white">
            <Compass className="h-7 w-7 text-amber-400" />
            Canlı VIP Operasyon & Takip Paneli
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Araç, koordinasyon ve rötar akışını tek ekranda gören modern bir operasyon kontrol merkezi.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400">
          <Radio className="h-4 w-4 animate-ping" />
          <span>Sistem Canlı Bağlı (Pusher Realtime Active)</span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg shadow-black/10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-2xl font-black text-white">{stat.value}</span>
              <span className="text-xs text-amber-300">{stat.detail}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md lg:col-span-8">
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold text-white">
              <Navigation className="h-4 w-4 text-amber-400" /> İstanbul & Marmara Canlı VIP Harita
            </h3>
            <span className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] font-bold text-slate-400">
              14 Araç Görevde
            </span>
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

          <div className="relative z-10 my-auto py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400 animate-bounce">
              <Car className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Canlı GPS & Telemetri Takibi Active</h4>
            <p className="mx-auto mt-1 max-w-md text-xs text-slate-400">
              Google Maps / Serper harita servisi üzerinden tüm araçlarımızın ve rötarlı uçuşların takibi sağlanmaktadır.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-2 border-t border-slate-800/80 pt-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>IST Havalimanı Karşılama: <strong className="text-white">6 Araç</strong></span>
            <span>SAW Havalimanı Karşılama: <strong className="text-white">4 Araç</strong></span>
            <span>Şehirlerarası Yolda: <strong className="text-white">4 Araç</strong></span>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md lg:col-span-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-bold text-white">
              <Car className="h-4 w-4 text-amber-400" /> Anlık Aktif Transferler
            </h3>
            <span className="rounded-full border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] font-semibold text-slate-400">
              Live
            </span>
          </div>

          <div className="space-y-3">
            {trips.map((trip, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-400">{trip.pnr}</span>
                  <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-400">{trip.status}</span>
                </div>
                <div className="font-bold text-white">{trip.driver}</div>
                <div className="flex items-center gap-1 text-slate-400">
                  <MapPin className="h-3 w-3 text-slate-500" /> {trip.route}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Users2 className="h-4 w-4 text-amber-400" /> Operasyon ekibi
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
              <span>Yönetim ofisi</span>
              <span className="font-semibold text-white">3 aktif</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-slate-400">
              <span>Rötar takibi</span>
              <span className="font-semibold text-white">2 izleme</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-slate-400">
              <span>Transfer kontrolleri</span>
              <span className="font-semibold text-white">100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
