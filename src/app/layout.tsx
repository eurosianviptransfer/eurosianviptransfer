import type { ReactNode } from "react";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import { LanguageProvider } from "@/components/LanguageProvider";
import { getAppUrl } from "@/lib/app-url";
import "./globals.css";

function buildThemeInitScript(serverTheme: string) {
  return `
    (function() {
      try {
        const storageKey = "admin-theme";
        const savedTheme = window.localStorage.getItem(storageKey);
        // If user has a saved preference, use it; otherwise default to server-provided theme
        if (savedTheme === "light" || savedTheme === "dark") {
          document.documentElement.dataset.theme = savedTheme;
          document.documentElement.style.colorScheme = savedTheme;
        } else {
          document.documentElement.dataset.theme = "${serverTheme}";
          document.documentElement.style.colorScheme = "${serverTheme}";
          try { window.localStorage.setItem(storageKey, "${serverTheme}"); } catch(e){}
        }
      } catch (error) {
        console.error("Theme init failed", error);
      }
    })();
  `;
}

export const metadata = {
  title: "Eurosian VIP Transfer",
  description: "Antalya Havalimanı VIP transfer operasyon platformu",
  metadataBase: new URL(getAppUrl()),
  alternates: { canonical: getAppUrl() },
};

import { cookies, headers } from "next/headers";
import { getSiteLogoUrl } from "@/lib/cms/read";
import { locales, type Locale, messages } from "@/lib/i18n";

function resolveServerLocale(cookieStore: any, headersStore: any): Locale {
  // 1) special header set by middleware when ?lang=... is present on the same request
  const headerLocale = headersStore && typeof headersStore.get === 'function' ? headersStore.get("x-ev-locale") : undefined;
  if (headerLocale && locales.includes(headerLocale as Locale)) return headerLocale as Locale;

  // 2) cookie (set by middleware on prior requests)
  const cookieLocale = (cookieStore && typeof cookieStore.get === 'function') ? cookieStore.get("ev-locale")?.value : undefined;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) return cookieLocale as Locale;

  // 3) Accept-Language header fallback
  const accept = headersStore && typeof headersStore.get === 'function' ? (headersStore.get("accept-language") || "") : "";
  const first = accept.split(",")[0]?.split(";")[0]?.trim()?.toLowerCase();
  const code = first?.split("-")[0];
  if (code && locales.includes(code as Locale)) return code as Locale;

  return "en" as Locale;
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Determine server-side theme from cookie so SSR markup matches client pre-hydration
  const cookieStore = await cookies();
  // headers() may have different typings across Next versions; await it so we always have the resolved headers object
  const headersStore = await headers();
  const serverTheme = cookieStore.get("admin-theme")?.value === "light" ? "light" : "dark";

  // Resolve site logo on the server so the client header can render immediately
  const logoUrl = await getSiteLogoUrl();

  // Resolve locale server-side so SSR HTML matches the user's lang preference
  const serverLocale = resolveServerLocale(cookieStore, headersStore);

  return (
    <html lang={serverLocale} data-theme={serverTheme} style={{ colorScheme: serverTheme }}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: buildThemeInitScript(serverTheme) }} />
        {/* Bootstrap CSS (CDN) for header/navigation utilities */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" crossOrigin="anonymous" />
      </head>
      <body>
        <LanguageProvider initialLocale={serverLocale}><SessionProviderWrapper>
          <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <div className="container">
              <a className="navbar-brand d-flex align-items-center" href="/">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl || "/logo.png"} alt="Eurosian VIP Transfer" style={{ height: 36, width: "auto", objectFit: "contain" }} />
                <span className="ms-2">EUROSIAN <small>VIP TRANSFER</small></span>
              </a>

              <button className="navbar-toggler" type="button" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
              </button>

              <div className={"collapse navbar-collapse"}>
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
                  <li className="nav-item"><a className="nav-link" href={`/rezervasyon?airport=AYT&destination=&date=&passengers=2&lang=${serverLocale}`}>{messages[serverLocale].navBook}</a></li>
                  <li className="nav-item"><a className="nav-link" href={`/takip?lang=${serverLocale}`}>{messages[serverLocale].navTrack}</a></li>
                  <li className="nav-item"><a className="nav-link" href={`/karsilamaci-basvuru?lang=${serverLocale}`}>{messages[serverLocale].navGreeter ?? messages[serverLocale].navBook}</a></li>
                  <li className="nav-item"><a className="nav-link" href={`/sofor-basvuru?lang=${serverLocale}`}>{messages[serverLocale].navDriver ?? messages[serverLocale].navBook}</a></li>
                  <li className="nav-item"><a className="nav-link" href={`/basvuru-takip?lang=${serverLocale}`}>{messages[serverLocale].navApplicationTrack ?? messages[serverLocale].navBook}</a></li>
                  <li className="nav-item"><a className="nav-link" href={`/giris?lang=${serverLocale}`}>{messages[serverLocale].navTeam}</a></li>
                  <li className="nav-item d-flex ms-2"><label className="ev-locale" dir="ltr" aria-label="Language"><span aria-hidden="true">◎</span><select dir="ltr" defaultValue={serverLocale}>
                    <option value="tr">🇹🇷 Türkçe</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="de">🇩🇪 Deutsch</option>
                    <option value="ru">🇷🇺 Русский</option>
                    <option value="nl">🇳🇱 Nederlands</option>
                  </select></label></li>
                </ul>
              </div>
            </div>
          </header>

          {children}
        </SessionProviderWrapper></LanguageProvider>
      </body>
    </html>
  );
}
