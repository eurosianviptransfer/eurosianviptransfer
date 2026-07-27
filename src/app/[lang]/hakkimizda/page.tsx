import type { Metadata } from "next";
import { SeoCollection } from "@/components/seo/SeoCollection";
import { seoLocales, type SeoLocale } from "@/lib/site-content";

export function generateStaticParams() { return seoLocales.map(lang => ({ lang })); }
export const metadata: Metadata = { title: "About Eurasian VIP Transfer", description: "Learn about Eurasian VIP Transfer, a nationwide Turkey airport and intercity chauffeur service." };
export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; const locale = seoLocales.includes(lang as SeoLocale) ? lang as SeoLocale : "en"; return <SeoCollection locale={locale} breadcrumb="About us" title="Professional Transfer Operations Across Turkey" description="Eurasian VIP Transfer connects travellers, clinics, hotels and companies with a reliable nationwide chauffeur network."><div className="ev-card"><h2>Built around calm arrivals</h2><p className="ev-muted">Our operation combines professional drivers, monitored flights, clear pricing and a responsive support team for every journey.</p></div></SeoCollection>; }
