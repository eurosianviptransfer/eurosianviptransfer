import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/app-url";
import { fleetPages, intercityRoutes, seoAirports, seoLocales } from "@/lib/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getAppUrl(); const now = new Date(); const urls: MetadataRoute.Sitemap = [];
  for (const lang of seoLocales) {
    urls.push({ url: `${base}/${lang}`, lastModified: now, changeFrequency: "weekly", priority: 1 });
    for (const path of ["havalimani-transferi", "sehirlerarasi-transfer", "filomuz", "medikal-transfer", "kurumsal", "hakkimizda", "iletisim"]) urls.push({ url: `${base}/${lang}/${path}`, lastModified: now, changeFrequency: "weekly", priority: .8 });
    for (const airport of seoAirports) urls.push({ url: `${base}/${lang}/havalimani-transferi/${airport.slug}`, lastModified: now, changeFrequency: "monthly", priority: .7 });
    for (const route of intercityRoutes) urls.push({ url: `${base}/${lang}/sehirlerarasi-transfer/${route.slug}`, lastModified: now, changeFrequency: "monthly", priority: .7 });
    for (const vehicle of fleetPages) urls.push({ url: `${base}/${lang}/filomuz/${vehicle.slug}`, lastModified: now, changeFrequency: "monthly", priority: .6 });
  }
  return [{ url: base, lastModified: now, changeFrequency: "daily", priority: 1 }, ...urls];
}
