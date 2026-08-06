"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  ShieldCheck,
  Globe,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { initTheme, setTheme, type Theme } from "@/lib/theme";

interface VercelHeaderProps {
  onOpenCommandK: () => void;
  onOpenNewDrawer: () => void;
  onToggleSidebar: () => void;
}

export const VercelHeader: React.FC<VercelHeaderProps> = ({
  onOpenCommandK,
  onOpenNewDrawer,
  onToggleSidebar,
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>("dark");

  const toggleTheme = () => {
    const next = currentTheme === "dark" ? "light" : "dark";
    setTheme(next);
    setCurrentTheme(next);
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 md:px-6 backdrop-blur-md text-zinc-100">
      {/* LEFT: Scope & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="block md:hidden rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium">
          {/* Vercel Triangle Logo */}
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-100 text-zinc-950 font-black">
            <svg viewBox="0 0 76 65" fill="none" className="h-3 w-3 fill-current">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
          </div>

          <span className="text-zinc-400">/</span>

          {/* Project & Scope Switcher Button */}
          <div className="flex items-center gap-2 rounded-lg bg-zinc-900 px-2.5 py-1 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors group">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-bold">
              E
            </div>
            <span className="font-semibold text-zinc-200 group-hover:text-white transition-colors">
              eurosian-vip-transfer
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-mono font-medium text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Production
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300" />
          </div>
        </div>
      </div>

      {/* RIGHT: Search, Actions, Notifications & User */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Cmd+K Search Bar Trigger */}
        <button
          onClick={onOpenCommandK}
          className="hidden sm:flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-all font-mono"
        >
          <Search className="h-3.5 w-3.5 text-zinc-400" />
          <span>Arama yap...</span>
          <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400 border border-zinc-700">
            ⌘K
          </kbd>
        </button>

        {/* Quick Add Button */}
        <button
          onClick={onOpenNewDrawer}
          className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-950 shadow-sm hover:bg-zinc-200 active:scale-95 transition-all"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Yeni İçerik</span>
        </button>

        {/* External Site Link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 transition-colors"
          title="Canlı Siteyi Aç"
        >
          <Globe className="h-3.5 w-3.5" />
          <ExternalLink className="h-3 w-3" />
        </a>

        <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

        {/* Notification Bell */}
        <button className="relative rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-400" />
        </button>

        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
          title="Temayı Değiştir"
        >
          {currentTheme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-zinc-700 text-xs font-bold text-zinc-100 shadow-sm">
            EA
          </div>
        </div>
      </div>
    </header>
  );
};
