"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Menu,
  Search,
  Plus,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Bell,
  RefreshCw,
} from "lucide-react";

interface TopBarProps {
  onOpenCommandK: () => void;
  onOpenNewDrawer: () => void;
  onToggleMobileMenu: () => void;
}

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Genel Bakış",
  "/admin/rezervasyonlar": "Canlı Rezervasyon Yönetimi",
  "/admin/filo": "VIP Araç Filosu",
  "/admin/personel": "Personel & Başvuru Yönetimi",
  "/admin/fiyatlandirma": "Bölgesel Fiyat Tarifeleri",
  "/admin/cms/content": "CMS İçerik Yönetimi",
  "/admin/cms/media": "Medya Kütüphanesi",
  "/admin/cms/settings": "Sistem Ayarları",
};

export const VercelTopBar: React.FC<TopBarProps> = ({
  onOpenCommandK,
  onOpenNewDrawer,
  onToggleMobileMenu,
}) => {
  const pathname = usePathname();

  const title =
    Object.entries(pageTitles).find(([route]) => pathname?.startsWith(route))?.[1] ||
    "Yönetim Paneli";

  return (
    <header className="sticky top-0 z-30 w-full h-16 border-b border-slate-800/80 bg-[#080b13]/95 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between shadow-md">
      {/* LEFT: Mobile Menu Button & Breadcrumb Navigation */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:bg-slate-800 transition-colors"
          aria-label="Menüyü Aç"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/dashboard"
            className="text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors hidden sm:inline-flex items-center gap-1.5"
          >
            <ShieldCheck className="h-4 w-4 text-amber-400" /> Admin
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-600 hidden sm:inline" />
          <h1 className="text-sm sm:text-base font-black text-white tracking-tight font-sans flex items-center gap-2">
            {title}
          </h1>
        </div>
      </div>

      {/* RIGHT: Global Search & Quick Actions */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenCommandK}
          className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0c101d] px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:border-amber-500/40 hover:bg-slate-900 transition-all font-mono shadow-sm"
        >
          <Search className="h-3.5 w-3.5 text-amber-400" />
          <span>Arama</span>
          <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-black text-slate-400 border border-slate-700">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={onOpenNewDrawer}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-3.5 py-1.5 text-xs font-black text-slate-950 shadow-md shadow-amber-500/10 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span className="hidden md:inline">Yeni İçerik</span>
        </button>

        <div className="h-4 w-px bg-slate-800 hidden sm:block" />

        <button
          type="button"
          onClick={async () => {
            await signOut({ callbackUrl: "/admin/giris" });
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/50 active:scale-95 transition-all shadow-sm cursor-pointer"
          title="Oturumu Kapat"
        >
          <LogOut className="h-4 w-4 stroke-[2.2]" />
          <span className="hidden md:inline">Çıkış Yap</span>
        </button>
      </div>
    </header>
  );
};
