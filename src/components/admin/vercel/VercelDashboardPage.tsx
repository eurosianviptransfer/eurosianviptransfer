"use client";

import React, { useEffect, useState } from "react";
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

interface OverviewData {
  totalBookings: number;
  approvedBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  paidRevenue: number;
  vehicleCount: number;
  driverCount: number;
  greeterCount: number;
}

export const VercelDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const res = await fetch("/api/admin/overview", { cache: "no-store" });
        if (!res.ok) {
          const json = await res.json().catch(() => null);
          throw new Error(json?.error || "Dashboard verileri yüklenemedi.");
        }
        const data = await res.json();
        setOverview(data);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Dashboard verileri alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    void loadOverview();
  }, []);

  const formatCurrency = (value: number) =>
    value.toLocaleString("tr-TR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* VERCEL BANNER: SYSTEM STATUS & QUICK DEPLOYMENT INFO */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-[#0d152a] via-[#080d1a] to-[#0d152a] p-5 text-amber-400 shadow-xl shadow-amber-500/5">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-orange-500/15 px-3 py-0.5 text-[10px] font-mono font-black text-orange-400 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span>SİSTEM DURUMU: KUSURSUZ (99.8% UPTIME)</span>
            </div>
            <h1 className="text-base md:text-xl font-black tracking-tight text-yellow-400 flex items-center gap-2 drop-shadow-sm">
              Eurosian VIP Executive Dashboard
              <Sparkles className="h-5 w-5 text-amber-400" />
            </h1>
            <p className="text-xs font-bold text-amber-300 max-w-xl leading-relaxed">
              Bugün <span className="text-orange-400 font-extrabold">{loading ? "..." : overview?.pendingBookings ?? "0"} bekleyen rezervasyon</span> var. Filonuzun <span className="text-yellow-300 font-extrabold">{loading ? "..." : overview?.vehicleCount ?? "0"} araç</span> hazır durumda.
            </p>
            {error && (
              <p className="text-xs font-semibold text-rose-300">Dashboard verileri yüklenemedi: {error}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/admin/rezervasyonlar"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Yeni Rezervasyon</span>
            </Link>

            <Link
              href="/admin/operasyon"
              className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-[#0e162a] px-4 py-2.5 text-xs font-black text-amber-300 hover:bg-amber-500/10 hover:border-amber-400 active:scale-95 transition-all"
            >
              <Compass className="h-4 w-4 text-orange-400" />
              <span>Canlı Harita</span>
            </Link>
          </div>
        </div>
      </div>

      {/* METRIC STAT CARDS (VERCEL STYLE) */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-2xl border border-amber-500/30 bg-[#0c1222] p-4 space-y-2.5 hover:border-amber-400/70 transition-all shadow-lg shadow-amber-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black text-orange-400 uppercase tracking-wider">Toplam VIP Ciro</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/20 text-yellow-300 border border-amber-500/40 shadow-sm">
              <Euro className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black text-yellow-300 font-mono tracking-tight">€482,500</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-mono font-black text-orange-400 bg-orange-500/15 px-2 py-0.5 rounded-lg border border-orange-500/30">
              <TrendingUp className="h-3.5 w-3.5" /> +18.4%
            </span>
          </div>
          <p className="text-[10px] text-amber-400/80 font-mono font-bold">Stripe & Nakit Dahil</p>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-amber-500/30 bg-[#0c1222] p-4 space-y-2.5 hover:border-amber-400/70 transition-all shadow-lg shadow-amber-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black text-orange-400 uppercase tracking-wider">Aktif Rezervasyon</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/20 text-yellow-300 border border-amber-500/40 shadow-sm">
              <CalendarCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black text-yellow-300 font-mono tracking-tight">142</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-mono font-black text-orange-400 bg-orange-500/15 px-2 py-0.5 rounded-lg border border-orange-500/30">
              +12.5%
            </span>
          </div>
          <p className="text-[10px] text-amber-400/80 font-mono font-bold">Bugün 18 Sefer</p>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-amber-500/30 bg-[#0c1222] p-4 space-y-2.5 hover:border-amber-400/70 transition-all shadow-lg shadow-amber-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black text-orange-400 uppercase tracking-wider">VIP Filo Durumu</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/20 text-yellow-300 border border-amber-500/40 shadow-sm">
              <Car className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black text-yellow-300 font-mono tracking-tight">24 Araç</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-mono font-black text-orange-400 bg-orange-500/15 px-2 py-0.5 rounded-lg border border-orange-500/30">
              %92 Görevde
            </span>
          </div>
          <p className="text-[10px] text-amber-400/80 font-mono font-bold">Sprinter, Vito & Maybach</p>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-amber-500/30 bg-[#0c1222] p-4 space-y-2.5 hover:border-amber-400/70 transition-all shadow-lg shadow-amber-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black text-orange-400 uppercase tracking-wider">Tamamlanan Sefer</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/20 text-yellow-300 border border-amber-500/40 shadow-sm">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black text-yellow-300 font-mono tracking-tight">1,280</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-mono font-black text-orange-400 bg-orange-500/15 px-2 py-0.5 rounded-lg border border-orange-500/30">
              4.9/5 Puan
            </span>
          </div>
          <p className="text-[10px] text-amber-400/80 font-mono font-bold">Kusursuz Karşılama</p>
        </div>
      </div>

      {/* RECENT BOOKINGS TABLE */}
      <div className="rounded-2xl border border-amber-500/30 bg-[#0c1222] p-5 space-y-4 shadow-xl shadow-amber-500/5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-yellow-400 tracking-tight">
              Son VIP Transfer Seferleri
            </h2>
            <p className="text-xs text-amber-300/90 font-mono font-bold">
              Bugün planlanan ve tamamlanan canlı VIP uçuş transferleri
            </p>
          </div>
          <Link
            href="/admin/rezervasyonlar"
            className="text-xs font-black text-slate-950 font-mono flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 rounded-xl shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 transition-all"
          >
            <span>Tümünü Gör</span>
            <ArrowUpRight className="h-4 w-4 stroke-[3]" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-amber-500/30 font-mono text-orange-400 uppercase bg-[#070b15] font-black">
              <tr>
                <th className="py-3 px-3.5">Yolcu & Uçuş No</th>
                <th className="py-3 px-3.5">Güzergah</th>
                <th className="py-3 px-3.5">Araç Türü</th>
                <th className="py-3 px-3.5">Tutar</th>
                <th className="py-3 px-3.5">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/15 font-bold text-amber-300">
              <tr className="hover:bg-amber-500/10 transition-colors">
                <td className="py-3 px-3.5">
                  <div className="font-extrabold text-yellow-300 text-xs">Alexander Wright</div>
                  <div className="text-[10px] font-mono font-black text-orange-400">TK2410 • AYT T1</div>
                </td>
                <td className="py-3 px-3.5 text-amber-200 font-bold">
                  AYT Havalimanı → Maxx Royal Belek
                </td>
                <td className="py-3 px-3.5 text-amber-400 font-mono font-bold">
                  Mercedes Maybach VIP
                </td>
                <td className="py-3 px-3.5 font-mono font-black text-yellow-300 text-sm">
                  €180
                </td>
                <td className="py-3 px-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-0.5 text-[10px] font-mono font-black text-orange-400 border border-orange-500/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                    Karşılandı
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-amber-500/10 transition-colors">
                <td className="py-3 px-3.5">
                  <div className="font-extrabold text-yellow-300 text-xs">Elena Rostova</div>
                  <div className="text-[10px] font-mono font-black text-orange-400">SU2142 • AYT T2</div>
                </td>
                <td className="py-3 px-3.5 text-amber-200 font-bold">
                  AYT Havalimanı → Rixos Premium Tekirova
                </td>
                <td className="py-3 px-3.5 text-amber-400 font-mono font-bold">
                  Mercedes Vito VIP (6 Kişi)
                </td>
                <td className="py-3 px-3.5 font-mono font-black text-yellow-300 text-sm">
                  €140
                </td>
                <td className="py-3 px-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-0.5 text-[10px] font-mono font-black text-yellow-400 border border-amber-500/40">
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
