import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoDetail } from "@/components/seo/SeoDetail";
import { findFleet, fleetPages, seoLocales } from "@/lib/site-content";
import { allSeoKeywords } from "@/lib/seo-keywords";

export function generateStaticParams() { return seoLocales.flatMap(lang => fleetPages.map(vehicle => ({ lang, vehicle: vehicle.slug }))); }
export async function generateMetadata({ params }: { params: Promise<{ lang: string; vehicle: string }> }): Promise<Metadata> { const { vehicle: slug } = await params; const vehicle = findFleet(slug); if (!vehicle) return {}; return { title: `${vehicle.name} Turkey | Eurasian VIP Transfer`, description: vehicle.description, keywords: [...allSeoKeywords.filter(keyword => keyword.includes("mercedes") || keyword.includes("sprinter") || keyword.includes("v class"))] }; }
export default async function FleetDetailPage({ params }: { params: Promise<{ lang: string; vehicle: string }> }) { const { lang, vehicle: slug } = await params; const vehicle = findFleet(slug); if (!vehicle) notFound(); return <SeoDetail locale={lang} parentPath="filomuz" parentLabel="Our fleet" title={vehicle.name} description={vehicle.description}><h2>{vehicle.name} with professional chauffeur</h2><p className="ev-muted">Capacity: {vehicle.capacity}. Every vehicle is prepared for a calm, private journey with Wi-Fi, USB charging, refreshments and luggage support.</p></SeoDetail>; }
