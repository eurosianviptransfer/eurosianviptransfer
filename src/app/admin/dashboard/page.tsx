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
  Sparkles,
} from "lucide-react";
import { CardDataStats } from "@/components/admin/nextadmin/CardDataStats";
import { ChartOne } from "@/components/admin/nextadmin/ChartOne";
import { ChartTwo } from "@/components/admin/nextadmin/ChartTwo";
import { RecentBookingsTable } from "@/components/admin/nextadmin/RecentBookingsTable";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* OBSIDIAN GOLD HERO WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-6 md:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-4 py-1.5 text-xs font-black text-amber-300 border border-amber-500/30 mb-4 shadow-md">
              <Zap className="h-4 w-4 text-amber-400 animate-pulse" />
              <span>CANLI VİP OPERASYON DURUMU: KUSURSUZ (%99.8)</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3 font-serif">
              Eurosian VIP Executive Suite
              <Sparkles className="h-7 w-7 text-amber-400 shrink-0" />
            </h1>
            <p className="text-xs md:text-sm font-semibold text-slate-300 mt-3 max-w-2xl leading-relaxed">
              Bugün toplam <span className="text-amber-400 font-black">18 VIP transfer</span> gerçekleşiyor. VIP filonuzun <span className="text-emerald-400 font-black">%92&apos;si aktif görevde</span> ve sürücüleriniz GPS ile izleniyor.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5">
            <Link
              href="/admin/rezervasyonlar"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-6 py-4 text-xs font-black text-slate-950 shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Yeni Rezervasyon Gir</span>
            </Link>

            <Link
              href="/admin/operasyon"
              className="inline-flex items-center gap-2.5 rounded-2xl border border-amber-500/40 bg-slate-900/90 px-6 py-4 text-xs font-black text-amber-400 hover:bg-amber-500 hover:text-slate-950 shadow-lg transition-all duration-200"
            >
              <Compass className="h-4 w-4 text-amber-400" />
              <span>Canlı Harita Takibi</span>
            </Link>
          </div>
        </div>

        {/* Ambient Gradient Glows */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* OBSIDIAN GOLD STAT CARDS GRID */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
        <CardDataStats
          title="Toplam Transfer Ciro"
          total="€482,500"
          rate="+18.4%"
          subtitle="Bu ayki toplam VIP cirosu"
          badgeText="Stripe & Nakit Dahil"
        >
          <Euro className="h-6 w-6 text-amber-400" />
        </CardDataStats>

        <CardDataStats
          title="Aktif Rezervasyonlar"
          total="142"
          rate="+12.5%"
          subtitle="Onaylı & Bekleyen talepler"
          badgeText="Bugün 18 Transfer Var"
        >
          <CalendarCheck className="h-6 w-6 text-emerald-400" />
        </CardDataStats>

        <CardDataStats
          title="VIP Filo Araç Sayısı"
          total="24 Araç"
          rate="%92 Aktif"
          subtitle="Vito, Sprinter, Maybach"
          badgeText="22 Araç Görevde"
        >
          <Car className="h-6 w-6 text-amber-400" />
        </CardDataStats>

        <CardDataStats
          title="Tamamlanan Seferler"
          total="1,280"
          rate="+8.2%"
          subtitle="Kusursuz karşılama"
          badgeText="Müşteri Puanı: 4.9/5"
        >
          <CheckCircle2 className="h-6 w-6 text-amber-400" />
        </CardDataStats>
      </div>

      {/* QUICK LIVE STATUS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-3xl border border-amber-500/20 bg-slate-950/80 p-5 flex items-center justify-between shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black text-white">18 Aktif Şoför Sahada</p>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Tüm sürücüler üniformalı & GPS aktif</p>
            </div>
          </div>
          <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
        </div>

        <div className="rounded-3xl border border-amber-500/20 bg-slate-950/80 p-5 flex items-center justify-between shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black text-white">4 Karşılamacı Havalimanında</p>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">AYT VIP Karşılama Ekibi Hazır</p>
            </div>
          </div>
          <span className="h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
        </div>

        <div className="rounded-3xl border border-amber-500/20 bg-slate-950/80 p-5 flex items-center justify-between shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Sliders className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black text-white">Otomatik Fiyatlandırma</p>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Dinamik Sezon Tarifesi Aktif</p>
            </div>
          </div>
          <Link href="/admin/fiyatlandirma" className="text-xs font-black text-amber-400 hover:text-amber-300 flex items-center gap-1">
            <span>Ayarla</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-12 gap-6">
        <ChartOne />
        <ChartTwo />
      </div>

      {/* RECENT BOOKINGS TABLE */}
      <RecentBookingsTable />
    </div>
  );
}


