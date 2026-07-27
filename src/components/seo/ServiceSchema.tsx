import { JsonLd } from "./JsonLd";
import { SITE_NAME, siteUrl } from "@/lib/seo";

export function ServiceSchema() {
  const phone = process.env.PUBLIC_PHONE;
  return <JsonLd value={{ "@context": "https://schema.org", "@type": "TaxiService", name: SITE_NAME, image: `${siteUrl()}/images/logo.png`, "@id": siteUrl(), url: siteUrl(), ...(phone ? { telephone: phone } : {}), priceRange: "$$$", address: { "@type": "PostalAddress", ...(process.env.BUSINESS_STREET ? { streetAddress: process.env.BUSINESS_STREET } : {}), addressLocality: process.env.BUSINESS_CITY || "Istanbul", addressCountry: "TR" }, areaServed: [{ "@type": "Country", name: "Turkey" }, ...["Istanbul", "Antalya", "Bodrum", "Izmir", "Ankara", "Dalaman", "Nevsehir / Cappadocia", "Trabzon"].map(name => ({ "@type": "City", name }))], serviceType: ["Airport VIP Transfer", "Intercity Private Transfer", "Medical Tourism Transfer", "Daily Chauffeur Service"] }} />;
}
