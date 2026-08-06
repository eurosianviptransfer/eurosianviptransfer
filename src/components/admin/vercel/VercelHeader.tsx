"use client";

import React, { useState } from "react";
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
  Sparkles,
} from "lucide-react";
import { initTheme, setTheme, type Theme } from "@/lib/theme";

interface VercelHeaderProps {
  onOpenCommandK: () => void;
  onOpenNewDrawer: () => void;
}

const topNavTabs = [
  { name: "Genel Bakış", href: "/admin/dashboard", icon: LayoutDashboard, iconColor: "text-blue-400" },
  { name: "İçerik Yönetimi (CMS)", href: "/admin/cms/content", icon: FileText, iconColor: "text-amber-400", badge: "CMS" },
  { name: "Medya Kütüphanesi", href: "/admin/cms/media", icon: ImageIcon, iconColor: "text-purple-400" },
  { name: "Rezervasyonlar", href: "/admin/rezervasyonlar", icon: CalendarCheck, iconColor: "text-emerald-400", badge: "CANLI" },
  { name: "VIP Filo Araçları", href: "/admin/filo", icon: Car, iconColor: "text-indigo-400" },
  { name: "Sürücüler & Ekip", href: "/admin/personel", icon: Users, iconColor: "text-rose-400" },
  { name: "Fiyat Tarifeleri", href: "/admin/fiyatlandirma", icon: DollarSign, iconColor: "text-teal-400" },
  { name: "Sistem Ayarları", href: "/admin/cms/settings", icon: Settings, iconColor: "text-zinc-400" },
];

export const VercelHeader: React.FC<VercelHeaderProps> = ({
  onOpenCommandK,
  onOpenNewDrawer,
}) => {
  const pathname = usePathname();
  const [currentTheme, setCurrentTheme] = useState<Theme>("dark");

  const toggleTheme = () => {
    const next = currentTheme === "dark" ? "light" : "dark";
    setTheme(next);
    setCurrentTheme(next);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md text-zinc-100 m-0 p-0 shadow-lg">
      {/* ROW 1: TOP EXECUTIVE SCOPE BAR */}
      <div className="flex h-12 items-center justify-between px-4 md:px-6 border-b border-zinc-900 bg-zinc-950">
        {/* Left: Brand & Scope */}
        <div className="flex items-center gap-2.5">
          <Link href="/admin/dashboard" className="flex items-center gap-2 group">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-100 text-zinc-950 font-black group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-3.5 w-3.5 text-zinc-950" />
            </div>
            <span className="text-xs font-bold tracking-tight text-zinc-100 font-sans">
              EUROSIA VIP
            </span>
          </Link>

          <span className="text-zinc-800">/</span>

          {/* Scope Switcher Pill */}
          <div className="flex items-center gap-2 rounded-lg bg-zinc-900 px-2.5 py-1 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors group">
            <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-600/30 text-blue-400 text-[9px] font-bold">
              E
            </div>
            <span className="text-xs font-medium text-zinc-200 group-hover:text-white transition-colors">
              eurosian-vip-transfer
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-mono font-medium text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Production
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
          </div>
        </div>

        {/* Right: Cmd+K, New Content, Theme, User Profile */}
        <div className="flex items-center gap-2">
          {/* Cmd+K Search Button */}
          <button
            onClick={onOpenCommandK}
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-all font-mono"
          >
            <Search className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Arama (Cmd+K)</span>
            <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] text-zinc-400 border border-zinc-700">
              ⌘K
            </kbd>
          </button>

          {/* New Content Drawer Button */}
          <button
            onClick={onOpenNewDrawer}
            className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-950 shadow-sm hover:bg-zinc-200 active:scale-95 transition-all"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Yeni İçerik</span>
          </button>

          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
            title="Temayı Değiştir"
          >
            {currentTheme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-zinc-700 text-xs font-bold text-zinc-100 shadow-sm">
              EA
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: VERCEL GEIST TAB BUTTONS WITH DISTINCT ICONS & PILLS */}
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto px-4 md:px-6 py-2 bg-zinc-950">
        {topNavTabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/admin/dashboard" && pathname?.startsWith(tab.href));

          return (
            <Link
              key={idx}
              href={tab.href}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-md font-bold"
                  : "bg-zinc-900/60 text-zinc-400 border border-zinc-800/80 hover:bg-zinc-900 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-zinc-100" : tab.iconColor}`} />
              <span>{tab.name}</span>

              {tab.badge && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[9px] font-mono font-bold border ${
                    isActive
                      ? "bg-zinc-100 text-zinc-950 border-zinc-100"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800"
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
