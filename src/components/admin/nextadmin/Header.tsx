"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Menu,
  Search,
  Bell,
  Settings,
  ChevronDown,
  ShieldCheck,
  ExternalLink,
  LogOut
} from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 flex w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="flex flex-grow items-center justify-between px-4 py-3 md:px-6 2xl:px-10">
        {/* HAMBURGER & SEARCH */}
        <div className="flex items-center gap-3">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-40 block rounded-xl border border-slate-200 bg-slate-100 p-2 shadow-xs lg:hidden text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-all"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* SEARCH BAR */}
          <div className="hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Rezervasyon no, müşteri adı veya plaka arayın..."
                className="w-full sm:w-80 md:w-96 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* LIVE SITE LINK */}
          <Link
            href="/"
            target="_blank"
            className="hidden md:inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-amber-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl border border-slate-200 shadow-xs transition-all hover:scale-105 active:scale-95"
          >
            <span>Canlı Siteyi Gör</span>
            <ExternalLink className="h-3.5 w-3.5 text-amber-500" />
          </Link>

          {/* NOTIFICATION BUTTON */}
          <button
            aria-label="Bildirimler"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-all shadow-xs active:scale-95"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-amber-500 animate-ping" />
          </button>

          {/* USER DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pr-3 hover:bg-slate-100 transition-all shadow-xs"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 font-black text-slate-950 text-xs shadow-md">
                {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : "EA"}
              </div>
              <div className="hidden text-left sm:block">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  {session?.user?.name || "Yönetici"}
                </span>
                <span className="block text-[10px] font-bold text-amber-600">Eurosia VIP Admin</span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2.5 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 text-xs text-slate-800"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50 rounded-xl mb-1">
                  <p className="font-bold text-slate-900 text-xs">{session?.user?.name || "Yönetici"}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{session?.user?.email || "admin@eurosia.com"}</p>
                </div>
                <div className="py-1 space-y-1">
                  <Link
                    href="/admin/cms/settings"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-amber-600 transition-all"
                  >
                    <Settings className="h-4 w-4 text-amber-500" />
                    <span>Site Ayarları</span>
                  </Link>
                  <Link
                    href="/admin/users"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-amber-600 transition-all"
                  >
                    <ShieldCheck className="h-4 w-4 text-amber-500" />
                    <span>Kullanıcı Yetkileri</span>
                  </Link>
                </div>
                <div className="pt-1 mt-1 border-t border-slate-100">
                  <button
                    onClick={() => signOut({ callbackUrl: "/admin/giris" })}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all"
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

