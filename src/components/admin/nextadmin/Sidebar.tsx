"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Car,
  UserCheck,
  MapPin,
  FileText,
  Image as ImageIcon,
  Settings,
  Users,
  Shield,
  Activity,
  ChevronLeft,
  X
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();

  const navGroups = [
    {
      name: "PANOLAR",
      items: [
        {
          name: "Genel Bakış",
          icon: LayoutDashboard,
          href: "/admin/dashboard",
        },
        {
          name: "Canlı Operasyon",
          icon: Activity,
          href: "/admin/operasyon",
          badge: "CANLI",
        },
      ],
    },
    {
      name: "VIP TRANSFER YÖNETİMİ",
      items: [
        {
          name: "Rezervasyonlar",
          icon: CalendarCheck,
          href: "/admin/rezervasyonlar",
        },
        {
          name: "VIP Araç Filosu",
          icon: Car,
          href: "/admin/filo",
        },
        {
          name: "Şoförler & Karşılamacılar",
          icon: UserCheck,
          href: "/admin/personel",
        },
        {
          name: "Bölgeler & Fiyatlandırma",
          icon: MapPin,
          href: "/admin/fiyatlandirma",
        },
      ],
    },
    {
      name: "CMS & SİTE YÖNETİMİ",
      items: [
        {
          name: "Sayfa İçerikleri",
          icon: FileText,
          href: "/admin/cms/content",
        },
        {
          name: "Medya Kütüphanesi",
          icon: ImageIcon,
          href: "/admin/cms/media",
        },
        {
          name: "Site Ayarları & Logo",
          icon: Settings,
          href: "/admin/cms/settings",
        },
        {
          name: "Yöneticiler & Kullanıcılar",
          icon: Users,
          href: "/admin/users",
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-slate-900 text-slate-100 border-r border-slate-800 duration-300 ease-in-out shadow-2xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="flex items-center justify-between gap-2 px-6 py-5 border-b border-slate-800 bg-slate-950/50">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all">
              <Shield className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-wider block leading-none">
                EUROSIA
              </span>
              <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase mt-1 block">
                VIP Admin Suite
              </span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="block lg:hidden rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* SIDEBAR MENU */}
        <div className="no-scrollbar flex flex-col overflow-y-auto px-4 py-6 space-y-6">
          <nav className="space-y-6">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                <h3 className="mb-3 px-3 text-[11px] font-black uppercase tracking-widest text-amber-400">
                  {group.name}
                </h3>

                <ul className="space-y-1.5">
                  {group.items.map((item, itemIdx) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href || pathname.startsWith(item.href + "/");

                    return (
                      <li key={itemIdx}>
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 font-bold text-xs transition-all duration-200 shadow-sm ${
                            isActive
                              ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 transition-colors ${
                              isActive ? "text-slate-950 stroke-[2.5]" : "text-amber-400/90 group-hover:text-amber-400"
                            }`}
                          />
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <span
                              className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-black shadow-sm ${
                                isActive
                                  ? "bg-slate-950 text-amber-400 border border-amber-400/30"
                                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse"
                              }`}
                            >
                              {item.badge}
                            </span>
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

        {/* SIDEBAR FOOTER */}
        <div className="mt-auto border-t border-slate-800 p-4 bg-slate-950/40">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-800/60 p-3 border border-slate-700/60">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md">
              EA
            </div>
            <div className="truncate">
              <h4 className="text-xs font-black text-white truncate">Eurosia Admin</h4>
              <p className="text-[10px] font-bold text-amber-400 truncate">Sistem Yöneticisi</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
