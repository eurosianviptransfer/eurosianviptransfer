import { getAppUrl } from "@/lib/app-url";
import { localizedPath, seoLocales, type SeoLocale } from "@/lib/site-content";

export const SITE_NAME = "Eurasian VIP Transfer";
export const SITE_DESCRIPTION = "Türkiye genelinde havalimanı, şehirlerarası, medikal ve kurumsal VIP transfer hizmeti.";

export function siteUrl() { return getAppUrl(); }

export function validSeoLocale(value: string): SeoLocale { return seoLocales.includes(value as SeoLocale) ? value as SeoLocale : "en"; }

export function languageAlternates(path: string) {
  return Object.fromEntries(seoLocales.map((locale) => [locale, `${siteUrl()}${localizedPath(locale, path)}`]));
}

export const localeOpenGraph: Record<SeoLocale, string> = { tr: "tr_TR", en: "en_US", de: "de_DE", ru: "ru_RU" };

export function localizedCopy(locale: SeoLocale) {
  return {
    tr: { home: "Türkiye genelinde VIP transfer", book: "Transfer rezervasyonu yap", airports: "Havalimanları", routes: "Şehirlerarası transfer", fleet: "Filomuz", medical: "Medikal transfer", corporate: "Kurumsal hizmetler", about: "Hakkımızda", contact: "İletişim", explore: "Detayları incele", lead: "Tüm büyük havalimanlarından güvenli, konforlu ve profesyonel özel transfer." },
    en: { home: "Nationwide VIP transfer in Turkey", book: "Book your transfer", airports: "Airports", routes: "Intercity transfer", fleet: "Our fleet", medical: "Medical transfer", corporate: "Corporate services", about: "About us", contact: "Contact", explore: "Explore details", lead: "Safe, comfortable and professional private transfers from every major airport in Turkey." },
    de: { home: "VIP-Transfer in der ganzen Türkei", book: "Transfer buchen", airports: "Flughäfen", routes: "Überlandtransfer", fleet: "Unsere Flotte", medical: "Medizinischer Transfer", corporate: "Firmenservice", about: "Über uns", contact: "Kontakt", explore: "Details ansehen", lead: "Sichere, komfortable und professionelle Privattransfers von allen wichtigen Flughäfen der Türkei." },
    ru: { home: "VIP-трансфер по всей Турции", book: "Забронировать трансфер", airports: "Аэропорты", routes: "Междугородний трансфер", fleet: "Наш автопарк", medical: "Медицинский трансфер", corporate: "Корпоративные услуги", about: "О компании", contact: "Контакты", explore: "Подробнее", lead: "Безопасные, комфортные и профессиональные индивидуальные трансферы из всех крупных аэропортов Турции." },
  }[locale];
}
