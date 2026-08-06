"use client";

import React from "react";
import Link from "next/link";
import {
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
  Activity,
} from "lucide-react";

export const VercelDashboardPage: React.FC = () => {
  return (
    <div className="space-y-4 font-sans text-xs">
      {/* VERCEL BANNER: SYSTEM STATUS & QUICK DEPLOYMENT INFO */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-gradient-to-r dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 p-5 text-zinc-950 dark:text-zinc-100 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-100/80 dark:bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-extrabold text-emerald-800 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500 animate-pulse" />
              <span>SİSTEM DURUMU: KUSURSUZ (99.8% UPTIME)</span>
            </div>
            <h1 className="text-base md:text-lg font-black tracking-tight text-zinc-950 dark:text-white flex items-center gap-2">
              Eurosian VIP Executive Dashboard
              <Sparkles className="h-4 w-4 text-amber-500 dark:text-emerald-400" />
            </h1>
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 max-w-xl">
              Bugün <span className="text-emerald-700 dark:text-emerald-400 font-bold">18 VIP transfer</span> var. Filonuzun <span className="text-zinc-950 dark:text-zinc-100 font-bold">%92'si görevde</span> ve sürücüler izleniyor.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/admin/rezervasyonlar"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 dark:bg-zinc-100 dark:hover:bg-white px-3.5 py-2 text-xs font-extrabold text-zinc-950 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Yeni Rezervasyon</span>
            </Link>

            <Link
              href="/admin/operasyon"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 px-3.5 py-2 text-xs font-bold text-zinc-900 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-95 transition-all"
            >
              <Compass className="h-4 w-4 text-blue-600 dark:text-emerald-400" />
              <span>Canlı Harita</span>
            </Link>
          </div>
        </div>
      </div>

      {/* METRIC STAT CARDS (VERCEL STYLE) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-2 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Toplam VIP Ciro</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 dark:bg-zinc-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-zinc-800 shadow-sm">
              <Euro className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xl font-black text-zinc-950 dark:text-zinc-100 font-mono">€482,500</span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <TrendingUp className="h-3 w-3" /> +18.4%
            </span>
          </div>
          <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono font-medium">Stripe & Nakit Dahil</p>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-2 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Aktif Rezervasyon</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 dark:bg-zinc-950 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-zinc-800 shadow-sm">
              <CalendarCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xl font-black text-zinc-950 dark:text-zinc-100 font-mono">142</span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-extrabold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 rounded">
              +12.5%
            </span>
          </div>
          <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono font-medium">Bugün 18 Sefer</p>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-2 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">VIP Filo Durumu</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-100 dark:bg-zinc-950 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-zinc-800 shadow-sm">
              <Car className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xl font-black text-zinc-950 dark:text-zinc-100 font-mono">24 Araç</span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">
              %92 Görevde
            </span>
          </div>
          <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono font-medium">Sprinter, Vito & Maybach</p>
        </div>

        {/* Card 4 */}
        <div className="rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-2 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Tamamlanan Sefer</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-100 dark:bg-zinc-950 text-teal-700 dark:text-emerald-400 border border-teal-300 dark:border-zinc-800 shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xl font-black text-zinc-950 dark:text-zinc-100 font-mono">1,280</span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">
              4.9/5 Puan
            </span>
          </div>
          <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono font-medium">Kusursuz Karşılama</p>
        </div>
      </div>

      {/* RECENT BOOKINGS TABLE */}
      <div className="rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-zinc-950 dark:text-zinc-100 tracking-tight">
              Son VIP Transfer Seferleri
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono font-medium">
              Bugün planlanan ve tamamlanan canlı VIP uçuş transferleri
            </p>
          </div>
          <Link
            href="/admin/rezervasyonlar"
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline font-mono flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-500/30"
          >
            <span>Tümünü Gör</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-300 dark:border-zinc-800 font-mono text-zinc-700 dark:text-zinc-300 uppercase bg-zinc-100 dark:bg-zinc-950 font-bold">
              <tr>
                <th className="py-2.5 px-3">Yolcu & Uçuş No</th>
                <th className="py-2.5 px-3">Güzergah</th>
                <th className="py-2.5 px-3">Araç Türü</th>
                <th className="py-2.5 px-3">Tutar</th>
                <th className="py-2.5 px-3">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60 font-semibold text-zinc-900 dark:text-zinc-200">
              <tr className="hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 transition-colors">
                <td className="py-2.5 px-3">
                  <div className="font-bold text-zinc-950 dark:text-zinc-100 text-xs">Alexander Wright</div>
                  <div className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400">TK2410 • AYT T1</div>
                </td>
                <td className="py-2.5 px-3 text-zinc-800 dark:text-zinc-200 font-medium">
                  AYT Havalimanı → Maxx Royal Belek
                </td>
                <td className="py-2.5 px-3 text-zinc-700 dark:text-zinc-300 font-mono font-medium">
                  Mercedes Maybach VIP
                </td>
                <td className="py-2.5 px-3 font-mono font-black text-emerald-700 dark:text-emerald-400">
                  €180
                </td>
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500 animate-pulse" />
                    Karşılandı
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 transition-colors">
                <td className="py-2.5 px-3">
                  <div className="font-bold text-zinc-950 dark:text-zinc-100 text-xs">Elena Rostova</div>
                  <div className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400">SU2142 • AYT T2</div>
                </td>
                <td className="py-2.5 px-3 text-zinc-800 dark:text-zinc-200 font-medium">
                  AYT Havalimanı → Rixos Premium Tekirova
                </td>
                <td className="py-2.5 px-3 text-zinc-700 dark:text-zinc-300 font-mono font-medium">
                  Mercedes Vito VIP (6 Kişi)
                </td>
                <td className="py-2.5 px-3 font-mono font-black text-emerald-700 dark:text-emerald-400">
                  €140
                </td>
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-blue-800 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30">
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
