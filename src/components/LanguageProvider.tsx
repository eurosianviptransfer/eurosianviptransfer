"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { locales, messages, rtlLocales, type Locale, type Messages } from "@/lib/i18n";

const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void; t: Messages }>({
  locale: "en", setLocale: () => undefined, t: messages.en,
});

function resolveBrowserLocale(): Locale | undefined {
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

  const navigatorLanguages = navigator.languages;
  if (Array.isArray(navigatorLanguages)) {
    for (const language of navigatorLanguages) {
      const match = getMatch(language);
      if (match) return match;
    }
  }

  // Fallbacks for older browsers; cast to any to satisfy TypeScript typings
  return getMatch(
    navigator.language || (navigator as any).userLanguage || (navigator as any).browserLanguage || (navigator as any).systemLanguage
  );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("ev-locale");
    if (saved && locales.includes(saved as Locale)) {
      setLocaleState(saved as Locale);
      return;
    }

    const browserLocale = resolveBrowserLocale();
    if (browserLocale) {
      setLocaleState(browserLocale);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = rtlLocales.includes(locale) ? "rtl" : "ltr";
    window.localStorage.setItem("ev-locale", locale);
  }, [locale]);

  const setLocale = (next: Locale) => setLocaleState(next);
  return <LocaleContext.Provider value={{ locale, setLocale, t: messages[locale] }}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);
