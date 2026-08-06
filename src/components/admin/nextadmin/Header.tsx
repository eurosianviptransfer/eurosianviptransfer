"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Menu, Bell, LogOut, ExternalLink, Sparkles } from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 md:px-8 backdrop-blur-xl shadow-xs">
      {/* LEFT: MOBILE TOGGLE & BRAND BADGE */}
      <div className="flex items-center gap-4">
        <button
          aria-label="Toggle Sidebar"
          onClick={(e) => {
            e.stopPropagation();
            setSidebarOpen(!sidebarOpen);
          }}
          className="lg:hidden rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-xs active:scale-95"
        >
          <Menu className="h-6 w-6 stroke-[2.5]" />
        </button>

        <div className="hidden sm:flex items-center gap-2.5 rounded-full border border-blue-200/80 bg-blue-50 px-3.5 py-1.5 text-xs font-black text-blue-700 shadow-inner">
          <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
          <span>CANLI VIP OPERASYON PANELİ</span>
        </div>
      </div>

      {/* RIGHT: QUICK ACTIONS & USER AVATAR */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* PUBLIC SITE LINK */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all shadow-xs"
        >
          <span>Müşteri Sitesini Gör</span>
          <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
        </Link>

        {/* NOTIFICATIONS BADGE */}
        <button className="relative rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-xs">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white shadow-sm">
            3
          </span>
        </button>

        {/* USER PROFILE & LOGOUT */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="hidden text-right md:block">
            <span className="block text-xs font-black text-slate-900">Sistem Yöneticisi</span>
            <span className="block text-[10px] font-bold text-blue-600">admin@eurosianviptransfer.com</span>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/giris" })}
            title="Çıkış Yap"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-xs active:scale-95"
          >
            <LogOut className="h-5 w-5 stroke-[2]" />
          </button>
        </div>
      </div>
    </header>
  );
};
