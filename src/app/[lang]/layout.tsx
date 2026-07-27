import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceSchema } from "@/components/seo/ServiceSchema";
import { SITE_DESCRIPTION, SITE_NAME, languageAlternates, localeOpenGraph } from "@/lib/seo";
import { seoLocales, type SeoLocale } from "@/lib/site-content";

export function generateStaticParams() { return seoLocales.map(lang => ({ lang })); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params; const locale = seoLocales.includes(lang as SeoLocale) ? lang as SeoLocale : "en";
  return { title: SITE_NAME, description: SITE_DESCRIPTION, alternates: { canonical: `/${locale}`, languages: languageAlternates("") }, openGraph: { title: SITE_NAME, description: SITE_DESCRIPTION, siteName: SITE_NAME, url: `/${locale}`, locale: localeOpenGraph[locale], type: "website" } };
}

export default async function SeoLocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params; if (!seoLocales.includes(lang as SeoLocale)) notFound();
  return <><ServiceSchema />{children}</>;
}
