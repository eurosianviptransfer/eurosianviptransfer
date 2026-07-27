import type { Metadata } from "next";
import { SeoCollection } from "@/components/seo/SeoCollection";
import { FleetShowcase } from "@/components/seo/FleetShowcase";
import { seoLocales, type SeoLocale } from "@/lib/site-content";
import { SITE_NAME } from "@/lib/seo";

export function generateStaticParams() { return seoLocales.map(lang => ({ lang })); }
export const metadata: Metadata = { title: `VIP Fleet Turkey | ${SITE_NAME}`, description: "Mercedes Maybach, V-Class and Sprinter VIP vehicles with professional chauffeur across Turkey." };
export default async function FleetPage({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; const locale = seoLocales.includes(lang as SeoLocale) ? lang as SeoLocale : "en"; return <SeoCollection locale={locale} breadcrumb="Our fleet" title="Luxury VIP Fleet With Chauffeur" description="Choose the right vehicle for a private airport, intercity, medical or corporate transfer."><FleetShowcase locale={locale} /></SeoCollection>; }
