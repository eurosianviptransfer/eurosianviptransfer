"use me";
"use client";

import React, { useState } from "react";
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
  ChevronDown,
  LogOut,
  Shield,
  Activity,
  ChevronLeft
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>("YÖNETİM");

  const toggleGroup = (groupName: string) => {
    setOpenGroup(openGroup === groupName ? null : groupName);
  };

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
    <aside
      className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-slate-900 duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6 border-b border-slate-800">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <Shield className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-wider block leading-none">
              EUROSIA
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-amber-400 uppercase">
              VIP Admin Suite
            </span>
          </div>
        </Link>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden text-slate-400 hover:text-white"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>

      {/* SIDEBAR MENU */}
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear px-4 py-4">
        <nav className="space-y-6">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {group.name}
              </h3>

              <ul className="space-y-1">
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href || pathname.startsWith(item.href + "/");

                  return (
                    <li key={itemIdx}>
                      <Link
                        href={item.href}
                        className={`group relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 font-medium text-sm duration-200 ease-in-out ${
                          isActive
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm"
                            : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 shrink-0 transition-colors ${
                            isActive ? "text-amber-400" : "text-slate-400 group-hover:text-amber-400"
                          }`}
                        />
                        <span className="truncate">{item.name}</span>
                        {item.badge && (
                          <span className="ml-auto rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
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
      <div className="mt-auto border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-800/40 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-bold text-sm border border-amber-500/30">
            EV
          </div>
          <div className="truncate">
            <h4 className="text-xs font-bold text-white truncate">Eurosia Admin</h4>
            <p className="text-[11px] text-slate-400 truncate">Sistem Yöneticisi</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
