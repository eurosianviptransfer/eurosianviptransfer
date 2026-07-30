"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBack, IconMedia, IconOverview, IconPages, IconSettings } from "./icons";

const links = [
  { href: "/admin/cms", label: "Genel Bakış", icon: IconOverview, exact: true },
  { href: "/admin/content", label: "Sayfalar & Metinler", icon: IconPages, exact: false },
  { href: "/admin/media", label: "Medya & Logolar", icon: IconMedia, exact: false },
  { href: "/admin/settings", label: "Site Ayarları", icon: IconSettings, exact: false },
];

export function CmsNav() {
  const pathname = usePathname() || "";

  return (
    <nav className="ev-cms-nav">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link key={href} href={href} className={active ? "ev-cms-nav-active" : ""}>
            <Icon />
            {label}
          </Link>
        );
      })}
      <div className="ev-cms-nav-back">
        <Link href="/admin">
          <IconBack />
          Operasyon Paneline Dön
        </Link>
      </div>
    </nav>
  );
}
