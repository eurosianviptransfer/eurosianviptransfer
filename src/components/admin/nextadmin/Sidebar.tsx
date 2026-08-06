"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Car,
  DollarSign,
  Users,
  Settings,
  X,
  Shield,
  FileText,
  Radio,
  UserCheck,
  Star,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const navGroups = [
  {
    name: "CANLI OPERASYON",
    items: [
      { name: "Pano & İstatistikler", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Saha Haritası & Takip", href: "/admin/operasyon", icon: Radio, badge: "CANLI" },
      { name: "Rezervasyonlar", href: "/admin/rezervasyonlar", icon: CalendarCheck, badge: "YENİ" },
    ],
  },
  {
    name: "FİLO VE EKİP YÖNETİMİ",
    items: [
      { name: "VIP Filo Araçları", href: "/admin/filo", icon: Car },
      { name: "Sürücüler & Karşılayıcılar", href: "/admin/personel", icon: Users },
      { name: "Şoför Başvuruları", href: "/admin/users", icon: UserCheck },
    ],
  },
  {
    name: "FİYAT & DEĞERLENDİRME",
    items: [
      { name: "Bölge & Km Tarifeleri", href: "/admin/fiyatlandirma", icon: DollarSign },
      { name: "Müşteri Değerlendirmeleri", href: "/admin/cms/content", icon: Star },
    ],
  },
  {
    name: "İÇERİK VE SİSTEM",
    items: [
      { name: "CMS & Sayfa Yönetimi", href: "/admin-revamp/content", icon: FileText },
      { name: "Sistem Ayarları", href: "/admin-revamp/settings", icon: Settings },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-slate-950 text-slate-100 border-r border-amber-500/20 duration-300 ease-in-out shadow-[0_0_50px_rgba(0,0,0,0.8)] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* SIDEBAR BRAND HEADER */}
        <div className="flex items-center justify-between gap-2 px-6 py-6 border-b border-amber-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950">
          <Link href="/admin/dashboard" className="flex items-center gap-3.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-all">
              <Shield className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-wider block leading-none font-serif">
                EUROSIAN
              </span>
              <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase mt-1 block">
                VIP OBSIDIAN SUITE
              </span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="block lg:hidden rounded-xl p-2 text-slate-400 hover:bg-slate-900 hover:text-amber-400 transition-all border border-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="no-scrollbar flex flex-col overflow-y-auto px-4 py-6 space-y-7">
          <nav className="space-y-7">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                <h3 className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-amber-400/80">
                  {group.name}
                </h3>

                <ul className="space-y-1.5">
                  {group.items.map((item, itemIdx) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

                    return (
                      <li key={itemIdx}>
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`group relative flex items-center gap-3.5 rounded-2xl px-4 py-3 font-bold text-xs transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/30 translate-x-1"
                              : "text-slate-300 hover:bg-slate-900/90 hover:text-white hover:border-amber-500/30 border border-transparent"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 transition-colors ${
                              isActive ? "text-slate-950 stroke-[2.5]" : "text-amber-400/90 group-hover:text-amber-400"
                            }`}
                          />
                          <span className="truncate">{item.name}</span>

                          {item.badge ? (
                            <span
                              className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-black tracking-wider ${
                                isActive
                                  ? "bg-slate-950 text-amber-400 border border-amber-400/40"
                                  : "bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse"
                              }`}
                            >
                              {item.badge}
                            </span>
                          ) : (
                            <ChevronRight
                              className={`ml-auto h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                                isActive ? "hidden" : "text-slate-500"
                              }`}
                            />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* SIDEBAR USER STATUS FOOTER */}
        <div className="mt-auto border-t border-amber-500/20 p-4 bg-slate-950">
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 p-3.5 border border-amber-500/20 shadow-inner">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black text-sm shadow-md ring-2 ring-amber-400/30">
              EV
            </div>
            <div className="truncate">
              <h4 className="text-xs font-black text-white truncate">Eurosian Admin</h4>
              <p className="text-[10px] font-bold text-amber-400 truncate">Operasyon Başyöneticisi</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
