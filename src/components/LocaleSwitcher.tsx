"use client";

import { localeFlags, localeLabels, locales } from "@/lib/i18n";
import { useLocale } from "@/components/LanguageProvider";

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  return <label className="ev-locale" dir="ltr" aria-label="Language">
    <span aria-hidden="true">◎</span>
    <select dir="ltr" value={locale} onChange={(event) => setLocale(event.target.value as typeof locale)}>
      {locales.map((item) => <option key={item} value={item}>{localeFlags[item]} {localeLabels[item]}</option>)}
    </select>
  </label>;
}
