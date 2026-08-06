"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  ImageIcon,
  CalendarCheck,
  Car,
  Users,
  DollarSign,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
  X,
  Search,
  Plus,
  Sparkles,
  Layers,
  ChevronDown,
} from "lucide-react";

interface SidebarProps {
  onOpenCommandK: () => void;
  onOpenNewDrawer: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeVariant?: "live" | "cms" | "default";
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [
  {
    groupTitle: "OPERASYON & YÖNETİM",
    items: [
      { name: "Genel Bakış", href: "/admin/dashboard", icon: LayoutDashboard },
      {
        name: "Rezervasyonlar",
        href: "/admin/rezervasyonlar",
        icon: CalendarCheck,
        badge: "CANLI",
        badgeVariant: "live",
      },
      { name: "VIP Araç Filosu", href: "/admin/filo", icon: Car },
      { name: "Sürücü & Ekip Yönetimi", href: "/admin/personel", icon: Users },
      { name: "Fiyat Tarifeleri", href: "/admin/fiyatlandirma", icon: DollarSign },
    ],
  },
  {
    groupTitle: "İÇERİK YÖNETİMİ (CMS)",
    items: [
      {
        name: "Sayfalar & İçerikler",
        href: "/admin/cms/content",
        icon: FileText,
        badge: "CMS",
        badgeVariant: "cms",
      },
      { name: "Medya Kütüphanesi", href: "/admin/cms/media", icon: ImageIcon },
    ],
  },
  {
    groupTitle: "SİSTEM & YAPILANDIRMA",
    items: [
      { name: "Sistem Ayarları", href: "/admin/cms/settings", icon: Settings },
    ],
  },
];

export const VercelSidebar: React.FC<SidebarProps> = ({
  onOpenCommandK,
  onOpenNewDrawer,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Pro Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0b0f19] border-r border-slate-800/80 text-slate-200 flex flex-col justify-between transition-transform duration-300 ease-out shadow-2xl lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* HEADER / BRANDING AREA */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 bg-[#080b13]">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 group"
              onClick={() => setIsMobileOpen(false)}
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all">
                <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-white uppercase font-sans leading-none flex items-center gap-1.5">
                  Eurosian <span className="text-amber-400 font-extrabold">VIP</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider mt-1 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> PRO SUITE
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* QUICK SEARCH & NEW ACTION */}
          <div className="p-3.5 border-b border-slate-800/60 bg-[#090d16]/80 space-y-2">
            <button
              type="button"
              onClick={() => {
                onOpenCommandK();
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 hover:border-amber-500/40 hover:bg-slate-900 transition-all font-mono shadow-sm group"
            >
              <span className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                Hızlı Arama...
              </span>
              <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-black text-slate-400 border border-slate-700">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenNewDrawer();
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-xs font-black text-slate-950 shadow-md shadow-amber-500/10 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              Yeni İçerik Ekle
            </button>
          </div>

          {/* NAVIGATION ITEMS LIST */}
          <nav className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-230px)] custom-scrollbar">
            {navigationGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <div className="px-3 text-[10px] font-extrabold tracking-widest text-slate-400/90 font-mono uppercase mb-2">
                  {group.groupTitle}
                </div>

                <div className="space-y-1">
                  {group.items.map((item, itemIdx) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));

                    return (
                      <Link
                        key={itemIdx}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                          isActive
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/5 font-black"
                            : "text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent"
                        }`}
                      >
                        {/* Active Indicator Strip */}
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-amber-400 shadow-sm shadow-amber-400" />
                        )}

                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                              isActive
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                : "bg-slate-900/80 text-slate-400 border border-slate-800 group-hover:text-amber-400 group-hover:border-amber-500/30"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5 stroke-[2.2]" />
                          </div>
                          <span className="tracking-tight">{item.name}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {item.badge && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-black tracking-wider border ${
                                item.badgeVariant === "live"
                                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                  : item.badgeVariant === "cms"
                                  ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                  : "bg-slate-800 text-slate-300 border-slate-700"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight
                            className={`h-3.5 w-3.5 transition-transform duration-150 ${
                              isActive
                                ? "text-amber-400 opacity-100"
                                : "text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                            }`}
                          />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* USER PROFILE & LOGOUT FOOTER */}
        <div className="p-3 border-t border-slate-800/80 bg-[#080b13] space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 text-xs font-black shadow-inner">
                EA
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-white leading-tight">Yönetici Paneli</span>
                <span className="text-[10px] font-mono text-slate-400 truncate max-w-[130px]">
                  admin@eurosian.com
                </span>
              </div>
            </div>

            <span className="flex h-2 w-2 relative" title="Sistem Aktif">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <button
            type="button"
            onClick={async () => {
              await signOut({ callbackUrl: "/admin/giris" });
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs font-bold text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/50 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <LogOut className="h-4 w-4 stroke-[2.2]" />
            Oturumu Güvenle Kapat
          </button>
        </div>
      </aside>
    </>
  );
};
