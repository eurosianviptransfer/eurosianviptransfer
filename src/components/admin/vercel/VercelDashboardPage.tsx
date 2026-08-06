"use client";

import React from "react";
import Link from "next/link";
import {
  Zap,
  Sparkles,
  Plus,
  Compass,
  Euro,
  CalendarCheck,
  Car,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  Radio,
  ExternalLink,
  Activity,
} from "lucide-react";

export const VercelDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* VERCEL BANNER: SYSTEM STATUS & QUICK DEPLOYMENT INFO */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 p-6 md:p-8 text-zinc-100 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SİSTEM DURUMU: KUSURSUZ (99.8% UPTIME)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              Eurosian VIP Executive Suite
              <Sparkles className="h-5 w-5 text-emerald-400" />
            </h1>
            <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
              Bugün toplam <span className="text-emerald-400 font-semibold">18 VIP transfer</span> gerçekleşiyor. Filonuzun <span className="text-zinc-200 font-semibold">%92'si görevde</span> ve sürücüleriniz canlı GPS ile izleniyor.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/rezervasyonlar"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-xs font-semibold text-zinc-950 shadow-md hover:bg-zinc-200 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Yeni Rezervasyon Gir</span>
            </Link>

            <Link
              href="/admin/operasyon"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-medium text-zinc-200 hover:border-zinc-700 hover:text-white transition-all"
            >
              <Compass className="h-4 w-4 text-emerald-400" />
              <span>Canlı Harita</span>
            </Link>
          </div>
        </div>
      </div>

      {/* METRIC STAT CARDS (VERCEL STYLE) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Toplam VIP Ciro</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-emerald-400">
              <Euro className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-zinc-100 font-mono">€482,500</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <TrendingUp className="h-3 w-3" /> +18.4%
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">Stripe & Nakit ödemeler dahil</p>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Aktif Rezervasyon</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-blue-400">
              <CalendarCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-zinc-100 font-mono">142</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-400">
              +12.5%
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">Bugün 18 Sefer Planlandı</p>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">VIP Filo Durumu</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-purple-400">
              <Car className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-zinc-100 font-mono">24 Araç</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              %92 Görevde
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">Sprinter, Vito & Maybach</p>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Tamamlanan Sefer</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-zinc-100 font-mono">1,280</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              4.9/5 Puan
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">Kusursuz Karşılama</p>
        </div>
      </div>

      {/* QUICK STATUS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200">18 Sürücü Görevde</div>
              <div className="text-[11px] text-zinc-500 font-mono">GPS Canlı Takip Aktif</div>
            </div>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200">4 Karşılamacı AYT Havalimanında</div>
              <div className="text-[11px] text-zinc-500 font-mono">VIP İsim Bordlu Karşılama</div>
            </div>
          </div>
          <span className="h-2 w-2 rounded-full bg-blue-400" />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200">Dinamik Sezon Tarifesi</div>
              <div className="text-[11px] text-zinc-500 font-mono">Yaz Sezonu %15 Otomatik Ek</div>
            </div>
          </div>
          <Link href="/admin/fiyatlandirma" className="text-xs text-amber-400 hover:text-amber-300 font-mono">
            Ayarla →
          </Link>
        </div>
      </div>

      {/* RECENT BOOKINGS / DEPLOYMENT LIST TABLE */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-100 tracking-tight">
              Son VIP Transfer Seferleri
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Bugün planlanan ve tamamlanan canlı VIP uçuş transferleri
            </p>
          </div>
          <Link
            href="/admin/rezervasyonlar"
            className="text-xs text-zinc-400 hover:text-zinc-200 font-mono flex items-center gap-1"
          >
            <span>Tümünü Gör</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 font-mono text-zinc-400 uppercase">
              <tr>
                <th className="py-3 px-4">Yolcu & Uçuş No</th>
                <th className="py-3 px-4">Güzergah</th>
                <th className="py-3 px-4">Araç Türü</th>
                <th className="py-3 px-4">Tutar</th>
                <th className="py-3 px-4">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 font-medium">
              <tr className="hover:bg-zinc-900/80 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-zinc-200">Alexander Wright</div>
                  <div className="text-[11px] font-mono text-zinc-500">TK2410 • AYT T1</div>
                </td>
                <td className="py-3.5 px-4 text-zinc-300">
                  AYT Havalimanı → Maxx Royal Belek
                </td>
                <td className="py-3.5 px-4 text-zinc-400 font-mono">
                  Mercedes Maybach VIP
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                  €180
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-emerald-400 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Karşılandı
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-zinc-900/80 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-zinc-200">Elena Rostova</div>
                  <div className="text-[11px] font-mono text-zinc-500">SU2142 • AYT T2</div>
                </td>
                <td className="py-3.5 px-4 text-zinc-300">
                  AYT Havalimanı → Rixos Premium Tekirova
                </td>
                <td className="py-3.5 px-4 text-zinc-400 font-mono">
                  Mercedes Vito VIP (6 Kişi)
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                  €140
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-blue-400 border border-blue-500/20">
                    Yolda
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
