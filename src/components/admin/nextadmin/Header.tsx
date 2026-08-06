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
    <header className="sticky top-0 z-40 flex w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-sm">
      <div className="flex flex-grow items-center justify-between px-4 py-3 md:px-6 2xl:px-11">
        {/* HAMBURGER & SEARCH */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-50 block rounded-lg border border-slate-700 bg-slate-800 p-1.5 shadow-sm lg:hidden text-slate-300 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* SEARCH BAR */}
          <div className="hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Rezervasyon no, müşteri adı veya plaka arayın..."
                className="w-full sm:w-80 md:w-96 rounded-xl border border-slate-800 bg-slate-950/80 py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
            </div>
          </div>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* LIVE SITE LINK */}
          <Link
            href="/"
            target="_blank"
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/50 transition-all"
          >
            <span>Canlı Siteyi Gör</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          {/* NOTIFICATION BUTTON */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/80 text-slate-400 hover:text-white hover:border-slate-700 transition-all">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          </button>

          {/* USER DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-1.5 pr-3 hover:border-slate-700 transition-all"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 font-bold text-slate-950 text-xs">
                {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : "ADM"}
              </div>
              <div className="hidden text-left sm:block">
                <span className="block text-xs font-bold text-slate-200">
                  {session?.user?.name || "Yönetici"}
                </span>
                <span className="block text-[10px] text-slate-400">Eurosia Admin</span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2.5 w-56 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50 text-sm text-slate-200"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="font-bold text-white text-xs">{session?.user?.name || "Yönetici"}</p>
                  <p className="text-[11px] text-slate-400 truncate">{session?.user?.email || "admin@eurosia.com"}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/admin/cms/settings"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-slate-800 hover:text-amber-400 transition-all"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    <span>Site Ayarları</span>
                  </Link>
                  <Link
                    href="/admin/users"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-slate-800 hover:text-amber-400 transition-all"
                  >
                    <ShieldCheck className="h-4 w-4 text-slate-400" />
                    <span>Kullanıcı Yetkileri</span>
                  </Link>
                </div>
                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={() => signOut({ callbackUrl: "/admin/giris" })}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-all"
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
