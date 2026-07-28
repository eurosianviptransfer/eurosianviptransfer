"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { seoAirports } from "@/lib/site-content";
import { useLocale } from "@/components/LanguageProvider";
import { getBookingCopy } from "@/lib/guest-copy";

export function HeroBookingWidget() {
  const [pickup, setPickup] = useState("IST");
  const [dropoff, setDropoff] = useState("AYT");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [passengers, setPassengers] = useState("2");
  const [luggage, setLuggage] = useState("2");
  const [roundTrip, setRoundTrip] = useState(false);
  const [currency, setCurrency] = useState("EUR");

  const { locale, t } = useLocale();
  const copy = getBookingCopy(locale);

  const query = useMemo(
    () =>
      new URLSearchParams({
        airport: pickup,
        destination: seoAirports.find((item) => item.code === dropoff)?.city || dropoff,
        date,
        time,
        passengers,
        luggage,
        roundTrip: String(roundTrip),
        currency,
      }).toString(),
    [currency, date, dropoff, luggage, passengers, pickup, roundTrip, time]
  );

  return (
    <section className="ev-card" aria-label="VIP transfer price calculator">
      <div className="ev-eyebrow">{copy.cardEyebrow ?? copy.title}</div>
      <h2 style={{ margin: "8px 0 18px" }}>{copy.cardTitle}</h2>

      <div className="ev-field-grid">
        <label className="ev-field">
          <span className="ev-label">{copy.airport}</span>
          <select className="ev-select" value={pickup} onChange={(e) => setPickup(e.target.value)}>
            {seoAirports.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name} ({item.code})
              </option>
            ))}
          </select>
        </label>

        <label className="ev-field">
          <span className="ev-label">{copy.destination}</span>
          <select className="ev-select" value={dropoff} onChange={(e) => setDropoff(e.target.value)}>
            {seoAirports.map((item) => (
              <option key={item.code} value={item.code}>
                {item.city}
              </option>
            ))}
          </select>
        </label>

        <label className="ev-field">
          <span className="ev-label">{copy.date}</span>
          <input className="ev-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>

        <label className="ev-field">
          <span className="ev-label">{copy.time}</span>
          <input className="ev-input" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </label>

        <label className="ev-field">
          <span className="ev-label">{copy.passengers}</span>
          <input className="ev-input" type="number" min={1} max={16} value={passengers} onChange={(e) => setPassengers(e.target.value)} />
        </label>

        <label className="ev-field">
          <span className="ev-label">{copy.luggage}</span>
          <input className="ev-input" type="number" min={0} max={30} value={luggage} onChange={(e) => setLuggage(e.target.value)} />
        </label>

        <label className="ev-field">
          <span className="ev-label">{copy.currency}</span>
          <select className="ev-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option>TRY</option>
            <option>EUR</option>
            <option>USD</option>
            <option>GBP</option>
            <option>RUB</option>
          </select>
        </label>
      </div>

      <label className="ev-choice" style={{ margin: "14px 0" }}>
        <input type="checkbox" checked={roundTrip} onChange={(e) => setRoundTrip(e.target.checked)} /> {copy.returnTrip}
      </label>

      <div style={{ marginTop: 12 }}>
        <Link className="ev-btn" href={`/rezervasyon?${query}&lang=${locale}`}>
          {copy.instantQuote} →
        </Link>
        <Link className="ev-btn ev-btn--ghost" href={`/rezervasyon?lang=${locale}`} style={{ marginLeft: 8 }}>
          {copy.estimate}
        </Link>
      </div>
    </section>
  );
}
