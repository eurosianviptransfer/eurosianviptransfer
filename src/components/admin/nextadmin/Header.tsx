"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  ChevronDown,
  ShieldCheck,
  ExternalLink
} from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 flex w-full bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800/80 shadow-lg">
      <div className="flex flex-grow items-center justify-between px-4 py-3 md:px-6 2xl:px-10">
        {/* HAMBURGER & SEARCH */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-50 block rounded-xl border border-slate-700/80 bg-slate-900 p-2 shadow-sm lg:hidden text-amber-400 hover:text-amber-300 hover:bg-slate-800 transition-all"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* SEARCH BAR */}
          <div className="hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Rezervasyon no, müşteri adı veya plaka arayın..."
                className="w-full sm:w-80 md:w-96 rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-400 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-amber-400/80" />
            </div>
          </div>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* LIVE SITE LINK AS MODERN BUTTON */}
          <Link
            href="/"
            target="_blank"
            className="hidden md:inline-flex items-center gap-2 text-xs font-bold text-slate-100 hover:text-amber-300 bg-slate-900 hover:bg-slate-800/90 px-3.5 py-2 rounded-xl border border-slate-700/70 shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <span>Canlı Siteyi Gör</span>
            <ExternalLink className="h-3.5 w-3.5 text-amber-400" />
          </Link>

          {/* NOTIFICATION BUTTON */}
          <button
            aria-label="Bildirimler"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/70 bg-slate-900 text-slate-200 hover:text-amber-400 hover:bg-slate-800 transition-all shadow-sm active:scale-95"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400" />
          </button>

          {/* USER DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-900 p-1.5 pr-3 hover:bg-slate-800 transition-all shadow-sm"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 font-black text-slate-950 text-xs shadow-md shadow-amber-500/20">
                {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : "ADM"}
              </div>
              <div className="hidden text-left sm:block">
                <span className="block text-xs font-bold text-white leading-tight">
                  {session?.user?.name || "Yönetici"}
                </span>
                <span className="block text-[10px] font-semibold text-amber-400/90">Eurosia Admin</span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-300" />
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2.5 w-60 rounded-2xl border border-slate-700/80 bg-slate-950 p-2 shadow-2xl z-50 text-xs text-slate-100 backdrop-blur-2xl"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-3.5 py-2.5 border-b border-slate-800/80 bg-slate-900/60 rounded-xl mb-1">
                  <p className="font-bold text-white text-xs">{session?.user?.name || "Yönetici"}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{session?.user?.email || "admin@eurosia.com"}</p>
                </div>
                <div className="py-1 space-y-1">
                  <Link
                    href="/admin/cms/settings"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-amber-400 transition-all"
                  >
                    <Settings className="h-4 w-4 text-amber-400" />
                    <span>Site Ayarları</span>
                  </Link>
                  <Link
                    href="/admin/users"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-amber-400 transition-all"
                  >
                    <ShieldCheck className="h-4 w-4 text-amber-400" />
                    <span>Kullanıcı Yetkileri</span>
                  </Link>
                </div>
                <div className="pt-1 mt-1 border-t border-slate-800/80">
                  <button
                    onClick={() => signOut({ callbackUrl: "/admin/giris" })}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Oturumu Kapat</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
