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
    name: "OPERASYON MERKEZİ",
    items: [
      { name: "Genel Bakış & İstatistik", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Canlı Harita & Takip", href: "/admin/operasyon", icon: Radio, badge: "CANLI" },
      { name: "Rezervasyon Listesi", href: "/admin/rezervasyonlar", icon: CalendarCheck, badge: "YENİ" },
    ],
  },
  {
    name: "FİLO VE EKİP YÖNETİMİ",
    items: [
      { name: "VIP Filo Araçları", href: "/admin/filo", icon: Car },
      { name: "Sürücüler & Ekip", href: "/admin/personel", icon: Users },
      { name: "Şoför Başvuruları", href: "/admin/users", icon: UserCheck },
    ],
  },
  {
    name: "FİYAT & DEĞERLENDİRME",
    items: [
      { name: "Bölge & Tarifeler", href: "/admin/fiyatlandirma", icon: DollarSign },
      { name: "Müşteri Yorumları", href: "/admin/cms/content", icon: Star },
    ],
  },
  {
    name: "SİSTEM & İÇERİK",
    items: [
      { name: "CMS Sayfa Yönetimi", href: "/admin-revamp/content", icon: FileText },
      { name: "Sistem Ayarları", href: "/admin-revamp/settings", icon: Settings },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-white text-slate-800 border-r border-slate-200/80 duration-300 ease-in-out shadow-xl lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* BRAND HEADER */}
        <div className="flex items-center justify-between gap-3 px-6 py-6 border-b border-slate-100 bg-slate-50/50">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white font-black shadow-md shadow-blue-600/30 group-hover:scale-105 transition-all">
              <Shield className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-base font-black text-slate-900 tracking-tight block leading-none font-sans">
                Eurosian VIP Transfer
              </span>
              <span className="text-[10px] font-black tracking-widest text-amber-600 uppercase mt-1 block">
                VIP EXECUTIVE PORTAL
              </span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="block lg:hidden rounded-xl p-2 text-slate-500 hover:bg-slate-100 transition-all border border-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NAV LIST */}
        <div className="no-scrollbar flex flex-col overflow-y-auto px-4 py-6 space-y-7">
          <nav className="space-y-7">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                <h3 className="mb-3 px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {group.name}
                </h3>

                <ul className="space-y-1">
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
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-black"
                              : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 transition-colors ${
                              isActive ? "text-white stroke-[2.5]" : "text-slate-400 group-hover:text-blue-600"
                            }`}
                          />
                          <span className="truncate">{item.name}</span>

                          {item.badge ? (
                            <span
                              className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-black tracking-wider ${
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-blue-50 text-blue-600 border border-blue-200"
                              }`}
                            >
                              {item.badge}
                            </span>
                          ) : (
                            <ChevronRight
                              className={`ml-auto h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                                isActive ? "hidden" : "text-slate-400"
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

        {/* USER CARD FOOTER */}
        <div className="mt-auto border-t border-slate-100 p-4 bg-slate-50/50">
          <div className="flex items-center gap-3 rounded-2xl bg-white p-3 border border-slate-200/80 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-black text-sm border border-blue-100">
              EA
            </div>
            <div className="truncate">
              <h4 className="text-xs font-black text-slate-900 truncate">Eurosian Admin</h4>
              <p className="text-[10px] font-bold text-blue-600 truncate">Sistem Yöneticisi</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
