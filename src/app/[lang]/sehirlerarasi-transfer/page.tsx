import type { Metadata } from "next";
import { SeoCollection, SeoCards } from "@/components/seo/SeoCollection";
import { intercityRoutes, seoLocales, type SeoLocale } from "@/lib/site-content";
import { allSeoKeywords } from "@/lib/seo-keywords";
import { localizedCopy, languageAlternates, SITE_NAME } from "@/lib/seo";

export function generateStaticParams() { return seoLocales.map(lang => ({ lang })); }
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> { const { lang } = await params; return { title: `Intercity VIP Transfer Turkey | ${SITE_NAME}`, description: "High-comfort private intercity transfers between Istanbul, Bursa, Antalya, Fethiye, Bodrum, Marmaris, Izmir, Cesme and Cappadocia.", keywords: [...allSeoKeywords.filter(key => key.includes("to") || key.includes("transfer"))], alternates: { canonical: `/${lang}/sehirlerarasi-transfer`, languages: languageAlternates("sehirlerarasi-transfer") } }; }
export default async function IntercityPage({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; const locale = seoLocales.includes(lang as SeoLocale) ? lang as SeoLocale : "en"; return <SeoCollection locale={locale} breadcrumb={localizedCopy(locale).routes} title="Intercity VIP Transfers Across Turkey" description="Travel between Turkey's cities with a professional chauffeur, premium vehicle and door-to-door planning."><SeoCards locale={locale} hrefBase="sehirlerarasi-transfer" items={intercityRoutes.map(route => ({ slug: route.slug, title: `${route.from} to ${route.to} VIP Transfer`, description: route.description, meta: route.distance }))} /></SeoCollection>; }
