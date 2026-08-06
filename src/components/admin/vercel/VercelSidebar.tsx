"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
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
  LogOut,
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
        className={`fixed md:static inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-amber-500/30 bg-[#070b15] text-amber-400 duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* SIDEBAR HEADER / WORKSPACE */}
        <div className="flex h-14 items-center justify-between border-b border-amber-500/20 px-4 bg-[#0a0f1d]">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-400 font-bold group-hover:border-amber-400 transition-colors shadow-sm">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-black text-amber-400 tracking-tight block leading-none font-sans uppercase">
                Eurosian VIP Transfer
              </span>
              <span className="text-[9px] font-mono text-orange-400 block mt-1 font-bold">
                VIP Executive Management
              </span>
            </div>
          </Link>

          <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-mono text-orange-400 border border-orange-500/30 font-black">
            VIP
          </span>
        </div>

        {/* NAVIGATION LIST */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-mono font-black uppercase tracking-wider text-orange-400">
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
                    className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-black transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20"
                        : "text-amber-400 hover:bg-amber-500/10 hover:text-yellow-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive ? "text-slate-950" : "text-amber-400 group-hover:text-yellow-300"
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[9px] font-mono font-black border ${
                            isActive
                              ? "bg-slate-950 text-amber-400 border-slate-900"
                              : item.badgeColor || "bg-amber-500/20 text-orange-400 border-orange-500/30"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {item.shortcut && !item.badge && (
                        <kbd className="hidden group-hover:inline-flex items-center rounded bg-[#0a0f1d] px-1 py-0.5 text-[9px] font-mono text-amber-300 border border-amber-500/30 font-bold">
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
        <div className="mt-auto border-t border-amber-500/20 p-3 bg-[#0a0f1d] space-y-2">
          {/* Uptime Indicator */}
          <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-[#070b15] p-2.5 text-[11px] font-mono font-bold text-amber-300">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-400 animate-pulse" />
              <span>Sistem Uptime</span>
            </div>
            <span className="font-black text-yellow-400">%99.8</span>
          </div>

          {/* User Quick Info & SignOut */}
          <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-[#070b15] p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-500/30 text-amber-300 text-xs font-black border border-amber-500/40">
                SA
              </div>
              <div className="truncate">
                <div className="text-xs font-black text-yellow-300 truncate">Super Admin</div>
                <div className="text-[9px] text-orange-400 font-mono font-bold truncate">admin@eurosianviptransfer.com</div>
              </div>
            </div>
            <button
              type="button"
              onClick={async () => {
                await signOut({ callbackUrl: "/admin/giris" });
              }}
              className="p-1.5 rounded-lg border border-red-500/40 bg-red-500/15 text-red-400 hover:bg-red-500/30 hover:border-red-500/60 active:scale-95 transition-all shadow-sm cursor-pointer shrink-0"
              title="Oturumu Kapat"
            >
              <LogOut className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
