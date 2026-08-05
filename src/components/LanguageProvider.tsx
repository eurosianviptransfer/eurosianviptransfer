"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { locales, messages, rtlLocales, type Locale, type Messages } from "@/lib/i18n";

const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void; t: Messages }>({
  locale: "en", setLocale: () => undefined, t: messages.en,
});

function resolveBrowserLocale(): Locale | undefined {
  if (typeof navigator === "undefined") return undefined;
  const available = new Set(locales);
  const getMatch = (value: string | null | undefined) => {
    if (!value) return undefined;
    const normalized = value.toLowerCase().trim();
    const exact = normalized.split("-")[0];
    if (available.has(exact as Locale)) return exact as Locale;
    if (normalized.startsWith("nl")) return "nl";
    if (normalized.startsWith("de")) return "de";
    if (normalized.startsWith("en")) return "en";
    if (normalized.startsWith("ru")) return "ru";
    if (normalized.startsWith("tr")) return "tr";
    return undefined;
  };

  const langs = Array.isArray(navigator.languages) && navigator.languages.length ? navigator.languages : [navigator.language ?? (navigator as any).userLanguage];
  for (const language of langs) {
    const match = getMatch(language);
    if (match) return match;
  }
  return undefined;
}

export function LanguageProvider({ children, initialLocale: serverInitial }: { children: ReactNode; initialLocale?: Locale }) {
  // If server provided an initialLocale, prefer it on first render to avoid
  // hydration mismatch and content flicker. Otherwise fall back to the previous
  // client-side resolution logic.
  const initialLocale = (() => {
    if (serverInitial) return serverInitial;
    if (typeof window === "undefined") return "en" as Locale;

    // 1) query param
    try {
      const params = new URLSearchParams(window.location.search);
      const queryLocale = params.get("lang");
      if (queryLocale && locales.includes(queryLocale as Locale)) return queryLocale as Locale;
    } catch (e) {}

    // 2) path prefix (/tr/...) — keep parity with previous logic
    try {
      const pathLocale = window.location.pathname.match(/^\/(\w{2})(?:\/|$)/)?.[1];
      if (pathLocale && locales.includes(pathLocale as Locale)) return pathLocale as Locale;
    } catch (e) {}

    // 3) saved in localStorage
    try {
      const saved = window.localStorage.getItem("ev-locale");
      if (saved && locales.includes(saved as Locale)) return saved as Locale;
    } catch (e) {}

    // 4) browser preferences
    const browserLocale = resolveBrowserLocale();
    if (browserLocale) return browserLocale;

    return "en" as Locale;
  })();

  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    // Keep URL in sync and persist preference
    try {
      document.documentElement.lang = locale;
      document.documentElement.dir = rtlLocales.includes(locale) ? "rtl" : "ltr";
      window.localStorage.setItem("ev-locale", locale);

      const url = new URL(window.location.href);
      if (url.searchParams.get("lang") !== locale) {
        url.searchParams.set("lang", locale);
        window.history.replaceState({}, "", url.toString());
      }

      // Also set a cookie so the server can pick it up on the next request
      try {
        document.cookie = `ev-locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
      } catch (e) {}
    } catch (e) {
      // non-fatal
    }
  }, [locale]);

  const setLocale = (next: Locale) => setLocaleState(next);
  return <LocaleContext.Provider value={{ locale, setLocale, t: messages[locale] }}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);
