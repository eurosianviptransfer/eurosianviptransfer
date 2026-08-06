"use client";

import React from "react";
import { Compass, Car, Navigation, Radio, MapPin, CheckCircle2 } from "lucide-react";

export default function OperasyonPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Compass className="h-7 w-7 text-amber-400" />
            Canlı VIP Operasyon & Takip Paneli
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Yoldaki araçların anlık GPS konumları, havaalanı karşılama durumları ve uçak rötar takibi.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-400">
          <Radio className="h-4 w-4 animate-ping" />
          <span>Sistem Canlı Bağlı (Pusher Realtime Active)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAP PLACEHOLDER */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md relative min-h-[420px] flex flex-col justify-between overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Navigation className="h-4 w-4 text-amber-400" /> İstanbul & Marmara Canlı VIP Harita
            </h3>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              14 Araç Görevde
            </span>
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
          
          <div className="relative z-10 my-auto text-center py-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4 animate-bounce">
              <Car className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Canlı GPS & Telemetri Takibi Active</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Google Maps / Serper harita servisi üzerinden tüm araçlarımızın ve rötarlı uçuşların takibi sağlanmaktadır.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/80">
            <span>IST Havalimanı Karşılama: <strong className="text-white">6 Araç</strong></span>
            <span>SAW Havalimanı Karşılama: <strong className="text-white">4 Araç</strong></span>
            <span>Şehirlerarası Yolda: <strong className="text-white">4 Araç</strong></span>
          </div>
        </div>

        {/* ACTIVE TRIPS SIDEBAR */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Car className="h-4 w-4 text-amber-400" /> Anlık Aktif Transferler
          </h3>

          <div className="space-y-3">
            {[
              { pnr: "EV-8921", driver: "Ahmet Y. (34 VIP 8892)", route: "IST ➔ Çırağan Palace", status: "Yolda (%65)" },
              { pnr: "EV-8922", driver: "Mustafa D. (34 VIP 1042)", route: "SAW ➔ Bodrum Marina", status: "Yolda (%30)" },
              { pnr: "EV-8925", driver: "Cengiz Ö. (34 VIP 0001)", route: "Galataport ➔ Sapanca", status: "Karşılamada" },
            ].map((trip, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-400">{trip.pnr}</span>
                  <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{trip.status}</span>
                </div>
                <div className="font-bold text-white">{trip.driver}</div>
                <div className="text-slate-400 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-500" /> {trip.route}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
