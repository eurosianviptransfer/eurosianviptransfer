import type { Metadata } from "next";
import { SeoCollection } from "@/components/seo/SeoCollection";
import { seoLocales, type SeoLocale } from "@/lib/site-content";
import { getPageContent } from "@/lib/cms/read";

export const revalidate = 300;

export function generateStaticParams() { return seoLocales.map(lang => ({ lang })); }
export const metadata: Metadata = { title: "About Eurasian VIP Transfer", description: "Learn about Eurasian VIP Transfer, a nationwide Turkey airport and intercity chauffeur service." };

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = seoLocales.includes(lang as SeoLocale) ? lang as SeoLocale : "en";
  const fallback = locale === "tr" ? { breadcrumb: "Hakkımızda", title: "Türkiye genelinde profesyonel transfer operasyonları", description: "Eurasian VIP Transfer, yolcuları, hastaneleri, otelleri ve şirketleri güvenilir bir ulusal şoför ağıyla birleştirir.", heading: "Sakin varışlara odaklanıyoruz", body: "Operasyonumuz, profesyonel sürücüler, takip edilen uçuşlar, net fiyatlandırma ve her yolculuk için hızlı destek ekibiyle çalışır." } : locale === "de" ? { breadcrumb: "Über uns", title: "Professionelle Transfer-Operationen in der ganzen Türkei", description: "Eurasian VIP Transfer verbindet Reisende, Kliniken, Hotels und Unternehmen mit einem zuverlässigen landesweiten Chauffeurnetzwerk.", heading: "Auf ruhige Ankünfte ausgerichtet", body: "Unsere Operation kombiniert professionelle Fahrer, überwachte Flüge, transparente Preise und ein responsives Support-Team für jede Reise." } : locale === "ru" ? { breadcrumb: "О компании", title: "Профессиональные трансферные операции по всей Турции", description: "Eurasian VIP Transfer соединяет путешественников, клиники, отели и компании с надежной национальной сетью водителей.", heading: "Сфокусированы на спокойном прибытии", body: "Наша операционная модель объединяет профессиональных водителей, отслеживаемые рейсы, прозрачные цены и оперативную поддержку на каждом маршруте." } : { breadcrumb: "About us", title: "Professional transfer operations across Turkey", description: "Eurasian VIP Transfer connects travellers, clinics, hotels and companies with a reliable nationwide chauffeur network.", heading: "Built around calm arrivals", body: "Our operation combines professional drivers, monitored flights, clear pricing and a responsive support team for every journey." };

  // /admin/content içinde key="hakkimizda" ve ilgili dille bir kayıt oluşturup
  // yayına alırsanız (published), aşağıdaki sabit metnin yerine o kullanılır.
  const cms = await getPageContent("hakkimizda", locale);
  const heading = cms?.title || fallback.heading;
  const body = cms?.body || fallback.body;

  return (
    <SeoCollection locale={locale} breadcrumb={fallback.breadcrumb} title={fallback.title} description={fallback.description}>
      <div className="ev-card">
        <h2>{heading}</h2>
        <p className="ev-muted">{body}</p>
      </div>
    </SeoCollection>
  );
}
