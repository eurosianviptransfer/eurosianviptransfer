"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/LanguageProvider";
import { getNavLabel } from "@/lib/nav-copy";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export default function SiteHeader({ logoUrl }: { logoUrl: string }) {
  const pathname = usePathname();
  const { t, locale } = useLocale();
  const navDriverLabel = getNavLabel(locale, "driver");
  const navApplyLabel = getNavLabel(locale, "applicationTrack");
  const navGreeterLabel = getNavLabel(locale, "greeter");
  const [open, setOpen] = useState(false);

  // Hide customer site header on admin dashboard & CMS pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl || "/logo.png"} alt="Eurosian VIP Transfer" style={{ height: 36, width: "auto", objectFit: "contain" }} />
          <span className="ms-2">EUROSIAN <small>VIP TRANSFER</small></span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={"collapse navbar-collapse" + (open ? " show" : "")}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item"><Link className="nav-link" href={`/rezervasyon?airport=AYT&destination=&date=&passengers=2&lang=${locale}`}>{t.navBook}</Link></li>
            <li className="nav-item"><Link className="nav-link" href={`/takip?lang=${locale}`}>{t.navTrack}</Link></li>
            <li className="nav-item"><Link className="nav-link" href={`/karsilamaci-basvuru?lang=${locale}`}>{navGreeterLabel}</Link></li>
            <li className="nav-item"><Link className="nav-link" href={`/sofor-basvuru?lang=${locale}`}>{navDriverLabel}</Link></li>
            <li className="nav-item"><Link className="nav-link" href={`/basvuru-takip?lang=${locale}`}>{navApplyLabel}</Link></li>
            <li className="nav-item"><Link className="nav-link" href={`/giris?lang=${locale}`}>{t.navTeam}</Link></li>
            <li className="nav-item d-flex ms-2"><LocaleSwitcher /></li>
          </ul>
        </div>
      </div>
    </header>
  );
}
