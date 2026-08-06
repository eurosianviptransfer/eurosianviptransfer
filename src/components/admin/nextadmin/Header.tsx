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
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-amber-500/20 bg-slate-950/90 px-4 md:px-8 backdrop-blur-xl shadow-xl">
      {/* LEFT: MOBILE TOGGLE & BRAND BADGE */}
      <div className="flex items-center gap-4">
        <button
          aria-label="Toggle Sidebar"
          onClick={(e) => {
            e.stopPropagation();
            setSidebarOpen(!sidebarOpen);
          }}
          className="lg:hidden rounded-2xl border border-amber-500/30 bg-slate-900/80 p-2.5 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all shadow-md active:scale-95"
        >
          <Menu className="h-6 w-6 stroke-[2.5]" />
        </button>

        <div className="hidden sm:flex items-center gap-2.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-black text-amber-300 shadow-inner">
          <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
          <span>CANLI VIP OPERASYON SİSTEMİ</span>
        </div>
      </div>

      {/* RIGHT: QUICK ACTIONS & USER AVATAR */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* PUBLIC SITE LINK */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-2.5 text-xs font-bold text-slate-300 hover:border-amber-500/40 hover:text-white hover:bg-slate-900 transition-all shadow-sm"
        >
          <span>Müşteri Sitesini Gör</span>
          <ExternalLink className="h-3.5 w-3.5 text-amber-400" />
        </Link>

        {/* NOTIFICATIONS BADGE */}
        <button className="relative rounded-2xl border border-slate-800 bg-slate-900/90 p-2.5 text-slate-300 hover:border-amber-500/40 hover:text-amber-400 transition-all shadow-sm">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-slate-950 shadow-md">
            3
          </span>
        </button>

        {/* USER PROFILE & LOGOUT */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="hidden text-right md:block">
            <span className="block text-xs font-black text-white">Sistem Yöneticisi</span>
            <span className="block text-[10px] font-bold text-amber-400">admin@eurosianviptransfer.com</span>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/giris" })}
            title="Çıkış Yap"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-slate-950 transition-all shadow-md active:scale-95"
          >
            <LogOut className="h-5 w-5 stroke-[2]" />
          </button>
        </div>
      </div>
    </header>
  );
};
