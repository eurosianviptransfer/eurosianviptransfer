import Link from "next/link";
import { Breadcrumbs } from "./Breadcrumbs";
import { HeroBookingWidget } from "@/components/booking/HeroBookingWidget";
import { TrustBanner } from "./TrustBanner";
import { type SeoLocale } from "@/lib/site-content";

export function SeoCollection({ locale, title, description, children, breadcrumb }: { locale: SeoLocale; title: string; description: string; children: React.ReactNode; breadcrumb: string }) { return <main className="ev-page ev-page--wide"><Breadcrumbs items={[{ label: "Eurasian VIP Transfer", href: `/${locale}` }, { label: breadcrumb }]} /><div className="ev-eyebrow">Eurasian VIP Transfer · Turkey nationwide</div><h1 className="ev-h1">{title}</h1><p className="ev-muted" style={{ maxWidth: 820 }}>{description}</p><div style={{ margin: "26px 0" }}><HeroBookingWidget /></div>{children}<TrustBanner /><div className="ev-actions" style={{ marginTop: 24 }}><Link className="ev-btn" href={`/rezervasyon?lang=${locale}`}>Book a private transfer →</Link></div></main>; }

export function SeoCards({ locale, hrefBase, items }: { locale: string; hrefBase: string; items: { slug: string; title: string; description: string; meta?: string }[] }) { return <div className="ev-grid ev-grid--3">{items.map(item => <Link className="ev-card ev-link-card" href={`/${locale}/${hrefBase}/${item.slug}`} key={item.slug}><div className="ev-eyebrow">{item.meta || "VIP transfer"}</div><h2 style={{ margin: "8px 0", fontSize: 21 }}>{item.title}</h2><p className="ev-muted">{item.description}</p><span>Explore →</span></Link>)}</div>; }
