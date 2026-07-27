"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { locales, messages, rtlLocales, type Locale, type Messages } from "@/lib/i18n";

const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void; t: Messages }>({
  locale: "tr", setLocale: () => undefined, t: messages.tr,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("tr");

  useEffect(() => {
    const saved = window.localStorage.getItem("ev-locale");
    if (!saved || !locales.includes(saved as Locale)) return;
    const timer = window.setTimeout(() => setLocaleState(saved as Locale), 0);
    return () => window.clearTimeout(timer);
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
