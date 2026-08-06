import React from "react";
import Link from "next/link";
import {
  Euro,
  CalendarCheck,
  Car,
  CheckCircle2,
  Plus,
  Compass,
  FileSpreadsheet,
  Zap,
  TrendingUp
} from "lucide-react";
import { CardDataStats } from "@/components/admin/nextadmin/CardDataStats";
import { ChartOne } from "@/components/admin/nextadmin/ChartOne";
import { ChartTwo } from "@/components/admin/nextadmin/ChartTwo";
import { RecentBookingsTable } from "@/components/admin/nextadmin/RecentBookingsTable";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* WELCOME BANNER & QUICK ACTIONS */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/20 mb-3">
              <Zap className="h-3.5 w-3.5" /> Canlı Sistem Durumu: Mükemmel
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Eurosia VIP Admin Suite 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Bugün toplam <span className="text-amber-400 font-bold">14 VIP transfer</span> gerçekleşiyor. Araç filonuzun %88'i yolda ve aktif görevde.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/rezervasyonlar"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Yeni Rezervasyon Gir</span>
            </Link>

            <Link
              href="/admin/operasyon"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-all"
            >
              <Compass className="h-4 w-4 text-amber-400" />
              <span>Canlı Harita</span>
            </Link>
          </div>
        </div>

        {/* Ambient Gradient Glow */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* STAT CARDS GRID */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
        <CardDataStats
          title="Toplam Transfer Ciro"
          total="€482,500"
          rate="+18.4%"
          levelUp
          subtitle="Bu ayki toplam VIP cirosu"
          badgeText="Stripe & Nakit Dahil"
        >
          <Euro className="h-6 w-6" />
        </CardDataStats>

        <CardDataStats
          title="Aktif Rezervasyonlar"
          total="142"
          rate="+12.5%"
          levelUp
          subtitle="Onaylı & Bekleyen talepler"
          badgeText="Bugün 14 Transfer Var"
        >
          <CalendarCheck className="h-6 w-6 text-emerald-400" />
        </CardDataStats>

        <CardDataStats
          title="VIP Filo Araç Sayısı"
          total="24 Araç"
          rate="%92 Aktif"
          levelUp
          subtitle="Vito, Sprinter, Maybach"
          badgeText="22 Araç Görevde"
        >
          <Car className="h-6 w-6 text-blue-400" />
        </CardDataStats>

        <CardDataStats
          title="Tamamlanan Seferler"
          total="1,280"
          rate="+8.2%"
          levelUp
          subtitle="Kusursuz karşılamalar"
          badgeText="Müşteri Memnuniyeti: 4.9/5"
        >
          <CheckCircle2 className="h-6 w-6 text-amber-400" />
        </CardDataStats>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <ChartOne />
        <ChartTwo />
      </div>

      {/* RECENT BOOKINGS TABLE */}
      <RecentBookingsTable />
    </div>
  );
}
