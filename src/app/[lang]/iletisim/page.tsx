import type { Metadata } from "next";
import Link from "next/link";
import { SeoCollection } from "@/components/seo/SeoCollection";
import { seoLocales, type SeoLocale } from "@/lib/site-content";

export function generateStaticParams() { return seoLocales.map(lang => ({ lang })); }
export const metadata: Metadata = { title: "Contact Eurasian VIP Transfer", description: "Contact Eurasian VIP Transfer for airport, intercity, medical and corporate chauffeur services in Turkey." };
export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; const locale = seoLocales.includes(lang as SeoLocale) ? lang as SeoLocale : "en"; return <SeoCollection locale={locale} breadcrumb="Contact" title="Contact Our Transfer Team" description="Tell us your route, date and passenger details. Our operations team will help you plan the right vehicle."><div className="ev-card"><h2>Start with a quote</h2><p className="ev-muted">For an instant route price, use our booking form. For groups, clinics and corporate programs, contact the operations team directly.</p><div className="ev-actions" style={{ marginTop: 16 }}><Link className="ev-btn" href="/rezervasyon">Open booking form</Link></div></div></SeoCollection>; }
