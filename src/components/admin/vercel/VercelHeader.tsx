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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/98 dark:bg-zinc-950/98 backdrop-blur-md text-zinc-900 dark:text-zinc-100 m-0 p-0 shadow-sm transition-colors">
      {/* ROW 1: TOP EXECUTIVE SCOPE BAR */}
      <div className="flex h-11 items-center justify-between px-3 md:px-5 border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950">
        {/* Left: Brand & Scope */}
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard" className="flex items-center gap-2 group">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-500 font-black shadow-sm group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-xs font-black tracking-tight text-zinc-950 dark:text-zinc-100 font-sans uppercase">
              Eurosian VIP Transfer
            </span>
          </Link>

          <span className="text-zinc-300 dark:text-zinc-800">/</span>

          {/* Scope Switcher Pill */}
          <div className="flex items-center gap-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 border border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 cursor-pointer transition-colors group">
            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-blue-600/20 text-blue-700 dark:text-blue-400 text-[8px] font-bold">
              E
            </div>
            <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
              eurosian-vip-transfer
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[8px] font-mono font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              Production
            </span>
            <ChevronDown className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
          </div>
        </div>

        {/* Right: Cmd+K, New Content, Theme, User Profile */}
        <div className="flex items-center gap-2">
          {/* Cmd+K Search Button */}
          <button
            type="button"
            onClick={onOpenCommandK}
            className="flex items-center gap-1.5 rounded-md border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-200/80 dark:hover:bg-zinc-800 transition-all font-mono active:scale-95"
          >
            <Search className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
            <span className="hidden sm:inline">Arama (Cmd+K)</span>
            <kbd className="rounded bg-zinc-200 dark:bg-zinc-800 px-1 py-0.2 text-[8px] font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
              ⌘K
            </kbd>
          </button>

          {/* New Content Drawer Button */}
          <button
            type="button"
            onClick={onOpenNewDrawer}
            className="inline-flex items-center gap-1 rounded-md bg-zinc-950 dark:bg-zinc-100 px-2.5 py-1 text-[11px] font-bold text-white dark:text-zinc-950 shadow-sm hover:bg-zinc-800 dark:hover:bg-white active:scale-95 transition-all"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Yeni İçerik</span>
          </button>

          <div className="h-3.5 w-px bg-zinc-300 dark:bg-zinc-800 hidden sm:block" />

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md p-1.5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-95 transition-all border border-zinc-200 dark:border-zinc-800"
            title="Temayı Değiştir (Aydınlık / Karanlık)"
          >
            {currentTheme === "dark" ? (
              <Sun className="h-3.5 w-3.5 text-amber-400" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-zinc-800" />
            )}
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-1 pl-0.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/40 text-[10px] font-bold shadow-sm">
              EA
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: VERCEL GEIST TAB BUTTONS WITH ICON & PILL STYLING */}
      <div className="no-scrollbar flex items-center gap-1 overflow-x-auto px-3 md:px-5 py-1.5 bg-zinc-100/70 dark:bg-zinc-950 border-t border-zinc-200/60 dark:border-zinc-900">
        {topNavTabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/admin/dashboard" && pathname?.startsWith(tab.href));

          return (
            <Link
              key={idx}
              href={tab.href}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all ${
                isActive
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 shadow-sm"
                  : "bg-transparent text-zinc-700 dark:text-zinc-400 border border-transparent hover:bg-white/80 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-zinc-100"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-amber-600 dark:text-amber-400" : tab.iconColor}`} />
              <span>{tab.name}</span>

              {tab.badge && (
                <span
                  className={`rounded-full px-1.5 py-0.1 text-[8px] font-mono font-bold border ${
                    isActive
                      ? "bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-950 dark:border-zinc-100"
                      : "bg-zinc-200 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-400 border-zinc-300 dark:border-zinc-800"
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
