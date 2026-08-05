"use client";

import Link from "next/link";
import { useState } from "react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useLocale } from "@/components/LanguageProvider";
import { getNavLabel } from "@/lib/nav-copy";
import { airports, type AirportCode } from "@/lib/airports";

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function HomePageClient({ logoUrl }: { logoUrl: string }) {
  const { t, locale } = useLocale();
  const navDriverLabel = getNavLabel(locale, "driver");
  const navApplyLabel = getNavLabel(locale, "applicationTrack");
  const navGreeterLabel = getNavLabel(locale, "greeter");
  const [originAirport, setOriginAirport] = useState<AirportCode>("AYT");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(2);
  const bookingParams = new URLSearchParams({ airport: originAirport, destination, date, passengers: String(passengers), lang: locale });
  const bookingHref = `/rezervasyon?${bookingParams.toString()}`;
  return <main className="ev-home">

    <section className="ev-landing-hero ev-container">
      <div className="ev-hero-copy">
        <div className="ev-eyebrow"><span className="ev-pulse" />{t.eyebrow}</div>
        <h1>{t.title.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h1>
        <p>{t.lead}</p>
        <div className="ev-actions">
          <Link href={bookingHref} className="ev-btn">{t.primary} <Arrow /></Link>
          <Link href={`/takip?lang=${locale}`} className="ev-text-link">{t.secondary} <Arrow /></Link>
        </div>
        <div className="ev-hero-note"><span>✦</span>{t.note}</div>
      </div>
      <div className="ev-booking-card">
        <div className="ev-card-kicker">{t.cardEyebrow}<span>01 / 03</span></div>
        <h2>{t.cardTitle}</h2>
        <div className="ev-route-line"><div className="ev-route-dot ev-route-dot--gold" /><div className="ev-route-field"><label htmlFor="home-airport">{t.from}</label><select id="home-airport" className="ev-origin-select" value={originAirport} onChange={(event) => setOriginAirport(event.target.value as AirportCode)}>{airports.map((airport) => <option key={airport.code} value={airport.code}>{airport.name} ({airport.code})</option>)}</select></div><span className="ev-field-arrow">⌄</span></div>
        <div className="ev-route-connector" />
        <div className="ev-route-line"><div className="ev-route-dot" /><div className="ev-route-field"><label htmlFor="home-destination">{t.to}</label><input id="home-destination" value={destination} onChange={(event) => setDestination(event.target.value)} placeholder={t.toPlaceholder} /></div><span className="ev-field-arrow">⌄</span></div>
        <div className="ev-booking-fields"><div><label htmlFor="home-date">{t.date}</label><input id="home-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></div><div><label htmlFor="home-passengers">{t.guests}</label><select id="home-passengers" className="ev-guest-select" value={passengers} onChange={(event) => setPassengers(Number(event.target.value))}><option value={1}>1 {t.guests}</option><option value={2}>2 {t.guests}</option><option value={3}>3 {t.guests}</option><option value={4}>4 {t.guests}</option><option value={5}>5 {t.guests}</option><option value={6}>6 {t.guests}</option></select></div></div>
        <Link href={bookingHref} className="ev-btn ev-btn--wide">{t.quote} <Arrow /></Link>
        <p className="ev-card-foot">{t.cardFoot}</p>
      </div>
    </section>

    <section className="ev-trust ev-container">
      <div className="ev-trust-intro">
        <div className="ev-eyebrow">EUROSIAN STANDARD</div>
        <h2>{t.trustTitle}</h2>
        <p>{t.trustLead}</p>
      </div>
      <div className="ev-feature-grid">{t.features.map(([number, title, body]) => <article className="ev-feature" key={number}><span className="ev-feature-number">{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
    </section>
    <section className="ev-stats ev-container"><div><strong>{t.stat1}</strong><span>{t.stat1Label}</span></div><div><strong>{t.stat2}</strong><span>{t.stat2Label}</span></div><div><strong>{t.stat3}</strong><span>{t.stat3Label}</span></div></section>
    <footer className="ev-footer ev-container"><p>{t.footer}</p><Link href={bookingHref} className="ev-text-link">{t.footerCta}</Link></footer>
  </main>;
}