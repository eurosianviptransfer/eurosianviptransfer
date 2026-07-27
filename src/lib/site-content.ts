import { airports as operationalAirports } from "@/lib/airports";

export const seoLocales = ["tr", "en", "de", "ru"] as const;
export type SeoLocale = (typeof seoLocales)[number];

export const seoLocaleNames: Record<SeoLocale, string> = { tr: "Türkçe", en: "English", de: "Deutsch", ru: "Русский" };

export type SeoAirport = { code: string; city: string; name: string; slug: string; description: string };

const extraAirports: SeoAirport[] = [
  { code: "KYA", city: "Konya", name: "Konya Havalimanı", slug: "konya-havalimani-kya", description: "Konya şehir merkezi ve çevre ilçelere VIP havalimanı transferi." },
  { code: "DIY", city: "Diyarbakır", name: "Diyarbakır Havalimanı", slug: "diyarbakir-havalimani-diy", description: "Diyarbakır ve Güneydoğu Anadolu için özel araçlı transfer." },
  { code: "GNY", city: "Şanlıurfa", name: "Şanlıurfa GAP Havalimanı", slug: "sanliurfa-havalimani-gny", description: "Şanlıurfa şehir merkezi ve turistik rotalara konforlu transfer." },
  { code: "MLX", city: "Malatya", name: "Malatya Havalimanı", slug: "malatya-havalimani-mlx", description: "Malatya şehir içi ve bölgesel VIP transfer hizmeti." },
  { code: "SZF", city: "Samsun", name: "Samsun Çarşamba Havalimanı", slug: "samsun-havalimani-szf", description: "Samsun, Ordu ve Karadeniz destinasyonlarına transfer." },
  { code: "OGU", city: "Ordu-Giresun", name: "Ordu-Giresun Havalimanı", slug: "ordu-giresun-havalimani-ogu", description: "Karadeniz sahil şehirleri için özel şoförlü ulaşım." },
  { code: "ERZ", city: "Erzurum", name: "Erzurum Havalimanı", slug: "erzurum-havalimani-erz", description: "Erzurum ve kayak merkezlerine güvenli VIP transfer." },
  { code: "ADF", city: "Adıyaman", name: "Adıyaman Havalimanı", slug: "adiyaman-havalimani-adf", description: "Adıyaman ve Nemrut rotaları için özel transfer." },
  { code: "HTY", city: "Hatay", name: "Hatay Havalimanı", slug: "hatay-havalimani-hty", description: "Hatay şehir merkezi ve çevresine konforlu transfer." },
  { code: "MQM", city: "Mardin", name: "Mardin Havalimanı", slug: "mardin-havalimani-mqm", description: "Mardin ve çevre turizm rotalarına VIP transfer." },
];

export const seoAirports: SeoAirport[] = [
  ...operationalAirports.map((airport) => ({ ...airport, slug: `${airport.city.toLocaleLowerCase("tr-TR").replaceAll("ı", "i").replaceAll("İ", "i").replaceAll("ğ", "g").replaceAll("ü", "u").replaceAll("ş", "s").replaceAll("ö", "o").replaceAll("ç", "c").replaceAll(" ", "-")}-havalimani-${airport.code.toLocaleLowerCase()}`, description: `${airport.name} ve ${airport.city} çevresine özel şoförlü VIP transfer hizmeti.` })),
  ...extraAirports,
];

export const intercityRoutes = [
  { slug: "istanbul-bursa", from: "İstanbul", to: "Bursa", distance: "155 km", description: "İstanbul'dan Bursa'ya feribot bağlantılı özel araçlı transfer." },
  { slug: "istanbul-sapanca", from: "İstanbul", to: "Sapanca", distance: "140 km", description: "İstanbul ve Sabiha Gökçen'den Sapanca'ya VIP transfer." },
  { slug: "antalya-alanya", from: "Antalya", to: "Alanya", distance: "135 km", description: "Antalya Havalimanı ve şehir merkezinden Alanya'ya konforlu transfer." },
  { slug: "antalya-kas", from: "Antalya", to: "Kaş", distance: "190 km", description: "Antalya'dan Kaş'a özel şoförlü sahil rotası transferi." },
  { slug: "izmir-cesme", from: "İzmir", to: "Çeşme", distance: "95 km", description: "İzmir Adnan Menderes Havalimanı'ndan Çeşme'ye VIP transfer." },
  { slug: "bodrum-marmaris", from: "Bodrum", to: "Marmaris", distance: "155 km", description: "Milas-Bodrum Havalimanı ve Bodrum'dan Marmaris'e özel transfer." },
  { slug: "kayseri-kapadokya", from: "Kayseri", to: "Kapadokya", distance: "75 km", description: "Kayseri Havalimanı'ndan Göreme, Avanos ve Ürgüp'e transfer." },
  { slug: "istanbul-ankara", from: "İstanbul", to: "Ankara", distance: "450 km", description: "İstanbul-Ankara arasında saatlik planlamalı şehirlerarası VIP transfer." },
] as const;

export const fleetPages = [
  { slug: "mercedes-vito-vip", name: "Mercedes Vito VIP", capacity: "1–7 yolcu", description: "Havalimanı ve şehir içi transferler için konforlu Mercedes Vito VIP." },
  { slug: "mercedes-sprinter-vip", name: "Mercedes Sprinter VIP", capacity: "1–16 yolcu", description: "Gruplar, kurumsal ekipler ve uzun mesafe transferleri için geniş araç." },
  { slug: "mercedes-maybach-vip", name: "Mercedes-Maybach VIP", capacity: "1–3 yolcu", description: "Özel günler ve premium karşılama için üst segment sedan deneyimi." },
] as const;

export function findAirport(slug: string) { return seoAirports.find((airport) => airport.slug === slug); }
export function findRoute(slug: string) { return intercityRoutes.find((route) => route.slug === slug); }
export function findFleet(slug: string) { return fleetPages.find((vehicle) => vehicle.slug === slug); }

export function localizedPath(locale: SeoLocale, path = "") { return `/${locale}${path ? `/${path.replace(/^\//, "")}` : ""}`; }
