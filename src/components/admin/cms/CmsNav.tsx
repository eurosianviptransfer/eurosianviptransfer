"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBack, IconMedia, IconOverview, IconPages, IconSettings } from "./icons";
import { ArrowLeft } from "lucide-react";

const links = [
  { href: "/admin/cms/content", label: "Sayfalar & Metinler", icon: IconPages, exact: false },
  { href: "/admin/cms/media", label: "Medya & Logolar", icon: IconMedia, exact: false },
  { href: "/admin/cms/settings", label: "Site Ayarları", icon: IconSettings, exact: false },
];

export function CmsNav() {
  const pathname = usePathname() || "";

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl shadow-lg mb-6">
      {/* Modern Button Group Menu */}
      <nav className="flex flex-wrap items-center gap-2">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 shadow-sm ${
                active
                  ? "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-amber-500/20 shadow-lg scale-[1.02]"
                  : "bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700/50"
              }`}
            >
              <Icon className={active ? "text-slate-950" : "text-amber-400"} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Back to Operasyon Button */}
      <div>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 shadow-sm transition-all hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4 text-amber-400" />
          <span>Operasyon Paneline Dön</span>
        </Link>
      </div>
    </div>
  );
}

