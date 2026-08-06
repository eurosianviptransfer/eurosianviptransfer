import React from "react";
import Link from "next/link";
import {
  Euro,
  CalendarCheck,
  Car,
  CheckCircle2,
  Plus,
  Compass,
  Zap,
  UserCheck,
  ShieldCheck,
  ArrowUpRight,
  Sliders,
  Sparkles
} from "lucide-react";
import { CardDataStats } from "@/components/admin/nextadmin/CardDataStats";
import { ChartOne } from "@/components/admin/nextadmin/ChartOne";
import { ChartTwo } from "@/components/admin/nextadmin/ChartTwo";
import { RecentBookingsTable } from "@/components/admin/nextadmin/RecentBookingsTable";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* TAILADMIN WELCOME BANNER & QUICK ACTIONS */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-6 md:p-8 shadow-2xl backdrop-blur-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3.5 py-1 text-xs font-black text-amber-300 border border-amber-500/30 mb-3 shadow-md">
              <Zap className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span>Canlı VIP Operasyon Durumu: Kusursuz (%99.4)</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              Eurosia VIP Admin Suite
              <Sparkles className="h-6 w-6 text-amber-400" />
            </h1>
            <p className="text-xs md:text-sm font-medium text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Bugün toplam <span className="text-amber-400 font-bold">14 VIP transfer</span> gerçekleşiyor. Araç filonuzun <span className="text-emerald-400 font-bold">%88'i yolda ve aktif görevde</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/rezervasyonlar"
              className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Yeni Rezervasyon Gir</span>
            </Link>

            <Link
              href="/admin/operasyon"
              className="inline-flex items-center gap-2.5 rounded-xl border border-slate-700/80 bg-slate-900/90 px-5 py-3 text-xs font-bold text-white hover:bg-slate-800 hover:border-amber-500/50 shadow-md transition-all duration-200"
            >
              <Compass className="h-4 w-4 text-amber-400" />
              <span>Canlı Harita Takibi</span>
            </Link>
          </div>
        </div>

        {/* Ambient Gradient Glows */}
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* TAILADMIN STAT CARDS GRID */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
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

      {/* QUICK LIVE STATUS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">18 Aktif Şoför Sahada</p>
              <p className="text-[11px] text-slate-400">Tüm sürücüler üniformalı & GPS aktif</p>
            </div>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">4 Karşılamacı Havalimanında</p>
              <p className="text-[11px] text-slate-400">IST ve SAW VIP Karşılama hazır</p>
            </div>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Otomatik Fiyatlandırma</p>
              <p className="text-[11px] text-slate-400">Dinamik Sezon Tarifesi Aktif</p>
            </div>
          </div>
          <Link href="/admin/fiyatlandirma" className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
            <span>Ayarla</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* TAILADMIN CHARTS SECTION */}
      <div className="grid grid-cols-12 gap-5 md:gap-6">
        <ChartOne />
        <ChartTwo />
      </div>

      {/* TAILADMIN RECENT BOOKINGS TABLE */}
      <RecentBookingsTable />
    </div>
  );
}

