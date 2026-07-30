import type { Metadata } from "next";
import Link from "next/link";
import { SeoCollection } from "@/components/seo/SeoCollection";
import { seoLocales, type SeoLocale } from "@/lib/site-content";
import { getPageContent } from "@/lib/cms/read";

export const revalidate = 300;

export function generateStaticParams() { return seoLocales.map(lang => ({ lang })); }
export const metadata: Metadata = { title: "Contact Eurasian VIP Transfer", description: "Contact Eurasian VIP Transfer for airport, intercity, medical and corporate chauffeur services in Turkey." };

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = seoLocales.includes(lang as SeoLocale) ? lang as SeoLocale : "en";
  const fallback = locale === "tr" ? { breadcrumb: "İletişim", title: "Transfer ekibimizle iletişime geçin", description: "Rota, tarih ve yolcu detaylarını paylaşın. Operasyon ekibimiz size doğru aracı planlamada yardımcı olur.", heading: "Hemen fiyat alın", body: "Anında fiyat için rezervasyon formunu kullanın. Grup, klinik ve kurumsal programlar için doğrudan operasyon ekibimizle iletişime geçin.", button: "Rezervasyon formunu aç" } : locale === "de" ? { breadcrumb: "Kontakt", title: "Kontaktieren Sie unser Transfer-Team", description: "Teilen Sie uns Route, Datum und Passagierdetails mit. Unser Betriebsteam hilft Ihnen bei der Auswahl des richtigen Fahrzeugs.", heading: "Starten Sie mit einem Angebot", body: "Für einen sofortigen Preis nutzen Sie unser Buchungsformular. Für Gruppen, Kliniken und Firmenprogramme wenden Sie sich direkt an unser Team.", button: "Buchungsformular öffnen" } : locale === "ru" ? { breadcrumb: "Контакты", title: "Свяжитесь с нашей службой трансфера", description: "Поделитесь маршрутом, датой и данными о пассажирах. Наша операционная команда поможет подобрать подходящий автомобиль.", heading: "Начните с расчёта стоимости", body: "Для мгновенного расчёта используйте форму бронирования. Для групп, клиник и корпоративных программ обращайтесь напрямую в нашу операционную команду.", button: "Открыть форму бронирования" } : { breadcrumb: "Contact", title: "Contact our transfer team", description: "Tell us your route, date and passenger details. Our operations team will help you plan the right vehicle.", heading: "Start with a quote", body: "For an instant route price, use our booking form. For groups, clinics and corporate programs, contact the operations team directly.", button: "Open booking form" };

  // /admin/content içinde key="iletisim" ve ilgili dille bir kayıt oluşturup
  // yayına alırsanız (published), aşağıdaki sabit metnin yerine o kullanılır.
  const cms = await getPageContent("iletisim", locale);
  const heading = cms?.title || fallback.heading;
  const body = cms?.body || fallback.body;

  return (
    <SeoCollection locale={locale} breadcrumb={fallback.breadcrumb} title={fallback.title} description={fallback.description}>
      <div className="ev-card">
        <h2>{heading}</h2>
        <p className="ev-muted">{body}</p>
        <div className="ev-actions" style={{ marginTop: 16 }}>
          <Link className="ev-btn" href={`/rezervasyon?lang=${locale}`}>{fallback.button}</Link>
        </div>
      </div>
    </SeoCollection>
  );
}
