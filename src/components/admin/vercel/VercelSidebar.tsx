"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  CalendarCheck,
  Car,
  Users,
  DollarSign,
  Settings,
  ShieldCheck,
  Radio,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Sliders,
  Database,
  Activity,
  Terminal,
  type LucideIcon,
} from "lucide-react";

interface VercelSidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
  shortcut?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Genel Bakış", href: "/admin/dashboard", icon: LayoutDashboard, shortcut: "⌘1" },
      { name: "Canlı Operasyon", href: "/admin/operasyon", icon: Radio, badge: "LIVE", badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
    ],
  },
  {
    title: "CONTENT & CMS",
    items: [
      { name: "İçerik Yönetimi", href: "/admin/cms/content", icon: FileText, badge: "CMS", shortcut: "⌘2" },
      { name: "Medya Kütüphanesi", href: "/admin/cms/media", icon: ImageIcon },
      { name: "CMS Ayarları", href: "/admin/cms/settings", icon: Sliders },
    ],
  },
  {
    title: "OPERATIONS & FLEET",
    items: [
      { name: "Rezervasyonlar", href: "/admin/rezervasyonlar", icon: CalendarCheck, badge: "YENİ", badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
      { name: "VIP Filo Araçları", href: "/admin/filo", icon: Car },
      { name: "Sürücüler & Ekip", href: "/admin/personel", icon: Users },
      { name: "Fiyat Tarifeleri", href: "/admin/fiyatlandirma", icon: DollarSign },
    ],
  },
  {
    title: "SYSTEM & ACCESS",
    items: [
      { name: "Kullanıcı Yönetimi", href: "/admin/users", icon: Users },
      { name: "Sistem Logları", href: "/admin-revamp/settings", icon: Terminal },
    ],
  },
];

export const VercelSidebar: React.FC<VercelSidebarProps> = ({ isOpen, onCloseMobile }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-950 text-zinc-300 duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* SIDEBAR HEADER / WORKSPACE */}
        <div className="flex h-14 items-center justify-between border-b border-zinc-800 px-4 bg-zinc-900/40">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100 font-bold group-hover:border-zinc-500 transition-colors">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-100 tracking-tight block leading-none font-sans">
                EUROSIA VIP
              </span>
              <span className="text-[9px] font-mono text-zinc-400 block mt-0.5">
                v2.6.0 Geist Suite
              </span>
            </div>
          </Link>

          <span className="flex items-center gap-1 rounded bg-zinc-900 px-1.5 py-0.5 text-[9px] font-mono text-zinc-400 border border-zinc-800">
            PRO
          </span>
        </div>

        {/* NAVIGATION LIST */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                {group.title}
              </div>

              {group.items.map((item, iIdx) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={iIdx}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? "bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700 shadow-sm"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive ? "text-zinc-100" : "text-zinc-500 group-hover:text-zinc-300"
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[9px] font-mono font-semibold border ${
                            item.badgeColor || "bg-zinc-800 text-zinc-300 border-zinc-700"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {item.shortcut && !item.badge && (
                        <kbd className="hidden group-hover:inline-flex items-center rounded bg-zinc-900 px-1 py-0.5 text-[9px] font-mono text-zinc-500 border border-zinc-800">
                          {item.shortcut}
                        </kbd>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="mt-auto border-t border-zinc-800 p-3 bg-zinc-900/30 space-y-2">
          {/* Uptime Indicator */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 p-2.5 text-[11px] font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>Sistem Uptime</span>
            </div>
            <span className="font-semibold text-emerald-400">%99.8</span>
          </div>

          {/* User Quick Info */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 text-xs font-bold border border-blue-500/30">
                SA
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-zinc-200 truncate">Super Admin</div>
                <div className="text-[10px] text-zinc-500 font-mono truncate">admin@eurosian.com</div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-500" />
          </div>
        </div>
      </aside>
    </>
  );
};
