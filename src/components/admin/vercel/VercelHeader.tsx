"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  LayoutDashboard,
  FileText,
  ImageIcon,
  CalendarCheck,
  Car,
  Users,
  DollarSign,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { initTheme, setTheme, getPreferredTheme, type Theme } from "@/lib/theme";

interface VercelHeaderProps {
  onOpenCommandK: () => void;
  onOpenNewDrawer: () => void;
}

const topNavTabs = [
  { name: "Genel Bakış", href: "/admin/dashboard", icon: LayoutDashboard, iconColor: "text-blue-600 dark:text-blue-400" },
  { name: "İçerik Yönetimi (CMS)", href: "/admin/cms/content", icon: FileText, iconColor: "text-amber-600 dark:text-amber-400", badge: "CMS" },
  { name: "Medya Kütüphanesi", href: "/admin/cms/media", icon: ImageIcon, iconColor: "text-purple-600 dark:text-purple-400" },
  { name: "Rezervasyonlar", href: "/admin/rezervasyonlar", icon: CalendarCheck, iconColor: "text-emerald-600 dark:text-emerald-400", badge: "CANLI" },
  { name: "VIP Filo Araçları", href: "/admin/filo", icon: Car, iconColor: "text-indigo-600 dark:text-indigo-400" },
  { name: "Sürücüler & Ekip", href: "/admin/personel", icon: Users, iconColor: "text-rose-600 dark:text-rose-400" },
  { name: "Fiyat Tarifeleri", href: "/admin/fiyatlandirma", icon: DollarSign, iconColor: "text-teal-600 dark:text-teal-400" },
  { name: "Sistem Ayarları", href: "/admin/cms/settings", icon: Settings, iconColor: "text-zinc-500" },
];

export const VercelHeader: React.FC<VercelHeaderProps> = ({
  onOpenCommandK,
  onOpenNewDrawer,
}) => {
  const pathname = usePathname();
  const [currentTheme, setCurrentTheme] = useState<Theme>("light");

  useEffect(() => {
    const t = initTheme();
    setCurrentTheme(t);
  }, []);

  const toggleTheme = () => {
    const next = currentTheme === "light" ? "dark" : "light";
    setTheme(next);
    setCurrentTheme(next);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-500/30 bg-[#0a0f1d]/98 backdrop-blur-md text-amber-400 m-0 p-0 shadow-lg shadow-amber-500/5">
      {/* ROW 1: TOP EXECUTIVE SCOPE BAR */}
      <div className="flex h-12 items-center justify-between px-3 md:px-5 border-b border-amber-500/20 bg-[#070b15]">
        {/* Left: Brand & Scope */}
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-400 font-black shadow-sm group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <span className="text-xs md:text-sm font-black tracking-tight text-amber-400 font-sans uppercase drop-shadow-sm">
              Eurosian VIP Transfer
            </span>
          </Link>

          <span className="text-amber-500/40">/</span>

          {/* Scope Switcher Pill */}
          <div className="flex items-center gap-1.5 rounded-lg bg-[#0e162a] px-2.5 py-1 border border-amber-500/30 hover:border-amber-400 cursor-pointer transition-colors group">
            <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-black">
              E
            </div>
            <span className="text-xs font-bold text-amber-300 group-hover:text-amber-200 transition-colors font-mono">
              eurosian-vip-transfer
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-mono font-black text-orange-400 border border-orange-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
              Production
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-amber-400/70" />
          </div>
        </div>

        {/* Right: Cmd+K, New Content, Theme, User Profile */}
        <div className="flex items-center gap-2">
          {/* Cmd+K Search Button */}
          <button
            type="button"
            onClick={onOpenCommandK}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-[#0e162a] px-3 py-1.5 text-xs font-bold text-amber-300 hover:border-amber-400 hover:bg-[#121c35] transition-all font-mono active:scale-95 shadow-sm"
          >
            <Search className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Arama (Cmd+K)</span>
            <kbd className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-black text-amber-300 border border-amber-500/30">
              ⌘K
            </kbd>
          </button>

          {/* New Content Drawer Button */}
          <button
            type="button"
            onClick={onOpenNewDrawer}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-1.5 text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Yeni İçerik</span>
          </button>

          <div className="h-4 w-px bg-amber-500/20 hidden sm:block" />

          {/* User Profile Avatar */}
          <div className="flex items-center gap-1 pl-0.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 text-xs font-black shadow-sm">
              EA
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: VERCEL GEIST TAB BUTTONS WITH ICON & PILL STYLING */}
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto px-3 md:px-5 py-2 bg-[#080d1a] border-t border-amber-500/10">
        {topNavTabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/admin/dashboard" && pathname?.startsWith(tab.href));

          return (
            <Link
              key={idx}
              href={tab.href}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${
                isActive
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-[#0d1427] text-amber-400 border border-amber-500/20 hover:bg-amber-500/10 hover:text-yellow-300 hover:border-amber-500/40"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
              <span>{tab.name}</span>

              {tab.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-black border ${
                    isActive
                      ? "bg-slate-950 text-amber-400 border-slate-900"
                      : "bg-amber-500/20 text-orange-400 border-orange-500/30"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </header>
  );
};
