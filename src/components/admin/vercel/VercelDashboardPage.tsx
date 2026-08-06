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
    <div className="space-y-3 font-sans text-xs">
      {/* VERCEL BANNER: SYSTEM STATUS & QUICK DEPLOYMENT INFO */}
      <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-gradient-to-r dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 p-4 text-zinc-900 dark:text-zinc-100 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.2 text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              <span>SİSTEM DURUMU: KUSURSUZ (99.8% UPTIME)</span>
            </div>
            <h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-1.5">
              Eurosian VIP Executive Dashboard
              <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-emerald-400" />
            </h1>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-xl">
              Bugün <span className="text-emerald-600 dark:text-emerald-400 font-bold">18 VIP transfer</span> var. Filonuzun <span className="text-zinc-900 dark:text-zinc-200 font-bold">%92'si görevde</span> ve sürücüler izleniyor.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/rezervasyonlar"
              className="inline-flex items-center gap-1 rounded-md bg-zinc-900 dark:bg-zinc-100 px-3 py-1.5 text-[11px] font-bold text-white dark:text-zinc-950 shadow-sm hover:opacity-90 active:scale-95 transition-all"
            >
              <Plus className="h-3 w-3 stroke-[2.5]" />
              <span>Yeni Rezervasyon</span>
            </Link>

            <Link
              href="/admin/operasyon"
              className="inline-flex items-center gap-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              <Compass className="h-3 w-3 text-blue-600 dark:text-emerald-400" />
              <span>Canlı Harita</span>
            </Link>
          </div>
        </div>
      </div>

      {/* METRIC STAT CARDS (VERCEL STYLE) */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-3 space-y-1.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Toplam VIP Ciro</span>
            <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-50 dark:bg-zinc-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-zinc-800">
              <Euro className="h-3 w-3" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-mono">€482,500</span>
            <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-2.5 w-2.5" /> +18.4%
            </span>
          </div>
          <p className="text-[9px] text-zinc-400 font-mono">Stripe & Nakit Dahil</p>
        </div>

        {/* Card 2 */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-3 space-y-1.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Aktif Rezervasyon</span>
            <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-50 dark:bg-zinc-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-zinc-800">
              <CalendarCheck className="h-3 w-3" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-mono">142</span>
            <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400">
              +12.5%
            </span>
          </div>
          <p className="text-[9px] text-zinc-400 font-mono">Bugün 18 Sefer</p>
        </div>

        {/* Card 3 */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-3 space-y-1.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">VIP Filo Durumu</span>
            <div className="flex h-5 w-5 items-center justify-center rounded bg-purple-50 dark:bg-zinc-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-zinc-800">
              <Car className="h-3 w-3" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-mono">24 Araç</span>
            <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
              %92 Görevde
            </span>
          </div>
          <p className="text-[9px] text-zinc-400 font-mono">Sprinter, Vito & Maybach</p>
        </div>

        {/* Card 4 */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-3 space-y-1.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Tamamlanan Sefer</span>
            <div className="flex h-5 w-5 items-center justify-center rounded bg-teal-50 dark:bg-zinc-950 text-teal-600 dark:text-emerald-400 border border-teal-200 dark:border-zinc-800">
              <CheckCircle2 className="h-3 w-3" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-mono">1,280</span>
            <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
              4.9/5 Puan
            </span>
          </div>
          <p className="text-[9px] text-zinc-400 font-mono">Kusursuz Karşılama</p>
        </div>
      </div>

      {/* RECENT BOOKINGS TABLE */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-3 space-y-2 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Son VIP Transfer Seferleri
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono">
              Bugün planlanan ve tamamlanan canlı VIP uçuş transferleri
            </p>
          </div>
          <Link
            href="/admin/rezervasyonlar"
            className="text-[11px] text-blue-600 dark:text-zinc-400 hover:underline font-mono flex items-center gap-0.5"
          >
            <span>Tümünü Gör</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="border-b border-zinc-200 dark:border-zinc-800 font-mono text-zinc-500 dark:text-zinc-400 uppercase bg-zinc-50 dark:bg-zinc-950">
              <tr>
                <th className="py-2 px-2.5">Yolcu & Uçuş No</th>
                <th className="py-2 px-2.5">Güzergah</th>
                <th className="py-2 px-2.5">Araç Türü</th>
                <th className="py-2 px-2.5">Tutar</th>
                <th className="py-2 px-2.5">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50 font-medium">
              <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/80 transition-colors">
                <td className="py-2 px-2.5">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-200 text-xs">Alexander Wright</div>
                  <div className="text-[9px] font-mono text-zinc-400">TK2410 • AYT T1</div>
                </td>
                <td className="py-2 px-2.5 text-zinc-700 dark:text-zinc-300">
                  AYT Havalimanı → Maxx Royal Belek
                </td>
                <td className="py-2 px-2.5 text-zinc-500 dark:text-zinc-400 font-mono">
                  Mercedes Maybach VIP
                </td>
                <td className="py-2 px-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  €180
                </td>
                <td className="py-2 px-2.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.2 text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                    Karşılandı
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/80 transition-colors">
                <td className="py-2 px-2.5">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-200 text-xs">Elena Rostova</div>
                  <div className="text-[9px] font-mono text-zinc-400">SU2142 • AYT T2</div>
                </td>
                <td className="py-2 px-2.5 text-zinc-700 dark:text-zinc-300">
                  AYT Havalimanı → Rixos Premium Tekirova
                </td>
                <td className="py-2 px-2.5 text-zinc-500 dark:text-zinc-400 font-mono">
                  Mercedes Vito VIP (6 Kişi)
                </td>
                <td className="py-2 px-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  €140
                </td>
                <td className="py-2 px-2.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.2 text-[9px] font-mono font-bold text-blue-700 dark:text-blue-400 border border-blue-500/20">
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
