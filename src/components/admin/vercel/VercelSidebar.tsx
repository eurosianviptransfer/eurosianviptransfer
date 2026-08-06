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
  Menu,
  X,
  Search,
  Plus,
  Sparkles,
  Zap,
} from "lucide-react";

interface SidebarProps {
  onOpenCommandK: () => void;
  onOpenNewDrawer: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface NavGroup {
  groupTitle: string;
  items: {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    groupTitle: "GENEL & OPERASYON",
    items: [
      { name: "Genel Bakış", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Rezervasyonlar", href: "/admin/rezervasyonlar", icon: CalendarCheck, badge: "CANLI", badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" },
      { name: "VIP Filo Araçları", href: "/admin/filo", icon: Car },
      { name: "Sürücüler & Ekip", href: "/admin/personel", icon: Users },
      { name: "Fiyat Tarifeleri", href: "/admin/fiyatlandirma", icon: DollarSign },
    ],
  },
  {
    groupTitle: "İÇERİK YÖNETİMİ (CMS)",
    items: [
      { name: "Sayfa & İçerikler", href: "/admin/cms/content", icon: FileText, badge: "CMS", badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/40" },
      { name: "Medya Kütüphanesi", href: "/admin/cms/media", icon: ImageIcon },
    ],
  },
  {
    groupTitle: "SİSTEM",
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
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Vertical Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#090e1a] border-r border-amber-500/20 text-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* TOP BRAND & LOGO SECTION */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-amber-500/20 bg-[#060a14]">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 group"
              onClick={() => setIsMobileOpen(false)}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-white uppercase font-sans leading-none">
                  EUROSIAN VIP
                </span>
                <span className="text-[10px] font-bold text-amber-400 font-mono tracking-wider mt-1 flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5 text-amber-400" /> ADMIN PANEL
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* QUICK ACTIONS BAR */}
          <div className="p-3 border-b border-amber-500/10 bg-[#070c17]/60 space-y-2">
            <button
              type="button"
              onClick={() => {
                onOpenCommandK();
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 border border-amber-500/20 text-xs text-slate-300 hover:border-amber-500/50 hover:bg-slate-900 transition-all font-mono shadow-sm group"
            >
              <span className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                Hızlı Arama...
              </span>
              <kbd className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-black text-amber-300 border border-amber-500/30">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenNewDrawer();
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-black text-slate-950 shadow-md shadow-amber-500/15 hover:from-amber-400 hover:to-orange-400 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              Yeni İçerik Ekle
            </button>
          </div>

          {/* NAVIGATION GROUPS */}
          <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="px-3 text-[10px] font-extrabold tracking-wider text-amber-400/70 font-mono uppercase">
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
                        className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-lg shadow-amber-500/20 scale-[1.02]"
                            : "text-slate-300 hover:bg-slate-800/80 hover:text-white hover:border-l-2 hover:border-amber-400"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                              isActive ? "text-slate-950 stroke-[2.5]" : "text-amber-400/90"
                            }`}
                          />
                          <span>{item.name}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {item.badge && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-black border ${
                                isActive
                                  ? "bg-slate-950 text-amber-400 border-slate-900"
                                  : item.badgeColor || "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          {isActive && <ChevronRight className="h-3.5 w-3.5 text-slate-950 stroke-[3]" />}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM USER PROFILE & LOGOUT FOOTER */}
        <div className="p-3 border-t border-amber-500/20 bg-[#060a14] space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/20">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-black shadow-inner">
                EA
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-white leading-tight">Yönetici Paneli</span>
                <span className="text-[10px] font-mono text-amber-400/80 truncate max-w-[130px]">
                  admin@eurosian.com
                </span>
              </div>
            </div>

            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <button
            type="button"
            onClick={async () => {
              await signOut({ callbackUrl: "/admin/giris" });
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-rose-500/40 bg-rose-500/10 text-xs font-black text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/60 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <LogOut className="h-4 w-4 stroke-[2.5]" />
            Oturumu Güvenle Kapat
          </button>
        </div>
      </aside>
    </>
  );
};
