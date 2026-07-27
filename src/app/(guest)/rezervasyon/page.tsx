"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AddressAutocomplete, type PlaceSelection } from "@/components/AddressAutocomplete";
import { DestinationSearch } from "@/components/booking/DestinationSearch";
import { quotePrice } from "@/lib/pricing/engine";
import { airports, type AirportCode } from "@/lib/airports";
import { useLocale } from "@/components/LanguageProvider";
import { getBookingCopy } from "@/lib/guest-copy";
import { inferRegionName } from "@/lib/search/infer-region";

interface PricingRule {
  regionName: string;
  km: number;
  basePriceSmall: number;
  basePriceLarge: number;
}

function toDatetimeLocal(value: Date) {
  const offset = value.getTimezoneOffset();
  const local = new Date(value.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export default function RezervasyonPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const copy = getBookingCopy(locale);
  const googleMapsEnabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim());
  const [place, setPlace] = useState<PlaceSelection | null>(null);
  const [originAirport, setOriginAirport] = useState<AirportCode>("AYT");
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [selectedRegionName, setSelectedRegionName] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [quote, setQuote] = useState<{ total: number; isEstimate: boolean; note?: string; km?: number; regionName?: string } | null>(null);
  const [vehicleSize, setVehicleSize] = useState<"SMALL" | "LARGE">("SMALL");
  const [hasReturnLeg, setHasReturnLeg] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [passengers, setPassengers] = useState(2);
  const [scheduledAt, setScheduledAt] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"PAY_IN_VEHICLE" | "PAY_NOW_CARD">("PAY_IN_VEHICLE");
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const idempotencyKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setScheduledAt((current) => current || toDatetimeLocal(new Date(Date.now() + 60 * 60 * 1000)));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const airport = params.get("airport");
    const destination = params.get("destination") || "";
    const date = params.get("date");
    const passengerCount = Number(params.get("passengers"));

    const timer = window.setTimeout(() => {
      if (airports.some((item) => item.code === airport)) setOriginAirport(airport as AirportCode);
      if (destination) setDestinationText(destination);
      if (date) setScheduledAt(`${date}T12:00`);
      if (Number.isInteger(passengerCount) && passengerCount >= 1 && passengerCount <= 6) setPassengers(passengerCount);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (googleMapsEnabled) return;
    let cancelled = false;

    fetch("/api/pricing-rules")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const rules = Array.isArray(json.rules) ? (json.rules as PricingRule[]) : [];
        setPricingRules(rules);
        const queryDestination = new URLSearchParams(window.location.search).get("destination") || "";
        const inferredRegion = inferRegionName(queryDestination, rules.map((rule) => rule.regionName));
        setSelectedRegionName((current) => current || inferredRegion || rules[0]?.regionName || "");
        setDestinationText((current) => current || rules[0]?.regionName || "");
      })
      .catch(() => {
        if (!cancelled) setPricingRules([]);
      });

    return () => {
      cancelled = true;
    };
  }, [googleMapsEnabled]);

  const localQuote = useMemo(() => {
    if (googleMapsEnabled || !selectedRegionName) return null;
    const rule = pricingRules.find((item) => item.regionName === selectedRegionName);
    if (!rule) return null;
    const quoteResult = quotePrice({ rule, vehicleSize, hasReturnLeg });
    return { total: quoteResult.total, isEstimate: false, note: undefined, km: quoteResult.km, regionName: quoteResult.regionName };
  }, [googleMapsEnabled, hasReturnLeg, pricingRules, selectedRegionName, vehicleSize]);
  const displayedQuote = googleMapsEnabled ? quote : localQuote;

  async function fetchQuote(selected: PlaceSelection, size: typeof vehicleSize, returnLeg: boolean, airport: AirportCode = originAirport) {
    setLoadingQuote(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationLat: selected.lat,
          destinationLng: selected.lng,
          destinationLabel: selected.label,
          originAirport: airport,
          vehicleSize: size,
          hasReturnLeg: returnLeg,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setQuote(json);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoadingQuote(false);
    }
  }

  async function submit() {
    if (!name || !phone || !scheduledAt) return alert("Ad, telefon ve tarih gerekli.");
    if (googleMapsEnabled && !place) return alert("Varış adresi gerekli.");
    if (!googleMapsEnabled && !selectedRegionName) return alert("Bölge seçimi gerekli.");
    if (!destinationText.trim()) return alert("Otel veya adres bilgisi gerekli.");
    setSubmitting(true);
    try {
      idempotencyKeyRef.current ??= crypto.randomUUID();
      const payload = googleMapsEnabled && place
        ? {
            guestName: name,
            guestPhone: phone,
            guestEmail: email,
            destinationText: destinationText || place.label,
            destinationLat: place.lat,
            destinationLng: place.lng,
            originAirport,
            guestLanguage: locale.toUpperCase(),
            vehicleSize,
            passengers,
            flightNumber,
            hasReturnLeg,
            paymentMethod,
            scheduledAt: new Date(scheduledAt).toISOString(),
          }
        : {
            guestName: name,
            guestPhone: phone,
            guestEmail: email,
            originAirport,
            guestLanguage: locale.toUpperCase(),
            destinationText,
            regionName: selectedRegionName,
            vehicleSize,
            passengers,
            flightNumber,
            hasReturnLeg,
            paymentMethod,
            scheduledAt: new Date(scheduledAt).toISOString(),
          };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKeyRef.current,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      if (json.checkoutUrl) {
        window.location.assign(json.checkoutUrl);
        return;
      }
      router.push(`/takip/${json.booking.code}`);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="ev-page">
      <div className="ev-eyebrow">Eurosian VIP Transfer</div>
      <h1 className="ev-h1" style={{ marginBottom: 16 }}>{copy.title}</h1>

      <label className="ev-label" htmlFor="origin-airport">{copy.airport}</label>
      <select id="origin-airport" className="ev-select" value={originAirport} onChange={(event) => {
        const nextAirport = event.target.value as AirportCode;
        setOriginAirport(nextAirport);
        if (googleMapsEnabled && place) fetchQuote(place, vehicleSize, hasReturnLeg, nextAirport);
      }}>
        {airports.map((airport) => <option key={airport.code} value={airport.code}>{airport.name} ({airport.code})</option>)}
      </select>
      <label className="ev-label" style={{ marginTop: 14 }}>{copy.destination}</label>
      {googleMapsEnabled ? (
        <AddressAutocomplete
          originAirport={originAirport}
          onSelect={(p) => {
            setPlace(p);
            setDestinationText(p.label);
            fetchQuote(p, vehicleSize, hasReturnLeg);
          }}
        />
      ) : (
        <>
          <DestinationSearch
            pricingRules={pricingRules}
            onPick={({ destinationText: pickedText, regionName }) => {
              setDestinationText(pickedText);
              if (regionName) {
                setSelectedRegionName(regionName);
              } else if (!selectedRegionName && pricingRules[0]?.regionName) {
                setSelectedRegionName(pricingRules[0].regionName);
              }
            }}
          />
          <div style={{ marginTop: 12 }}>
            <label className="ev-label">Bölge</label>
            <select
              className="ev-select"
              value={selectedRegionName}
              onChange={(e) => {
                const regionName = e.target.value;
                setSelectedRegionName(regionName);
                setDestinationText(regionName);
                setPlace(null);
              }}
            >
              <option value="">{pricingRules.length === 0 ? "Bölge yükleniyor…" : "Bölge seçin"}</option>
              {pricingRules.map((rule) => (
                <option key={rule.regionName} value={rule.regionName}>
                  {rule.regionName}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: 12 }}>
            <label className="ev-label">Seçilen otel/adres</label>
            <input
              className="ev-input"
              value={destinationText}
              onChange={(e) => setDestinationText(e.target.value)}
              placeholder="Arama sonucu veya manuel giriş"
            />
          </div>
        </>
      )}
      {!googleMapsEnabled && (
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
          Google Places anahtarı tanımlı değil. Bölge seçerek devam edebilirsiniz.
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
        <input className="ev-input" placeholder="Ad Soyad" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="ev-input" placeholder="WhatsApp Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input className="ev-input" placeholder="E-posta (opsiyonel)" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          className="ev-input"
          type="number"
          min={1}
          placeholder="Yolcu Sayısı"
          value={passengers}
          onChange={(e) => setPassengers(Number.isFinite(e.currentTarget.valueAsNumber) ? e.currentTarget.valueAsNumber : 1)}
        />
        <input className="ev-input" type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
        <input className="ev-input" placeholder="Uçuş No (opsiyonel)" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} />
        <select
          className="ev-select"
          value={vehicleSize}
          onChange={(e) => {
            const size = e.target.value as typeof vehicleSize;
            setVehicleSize(size);
            if (googleMapsEnabled && place) fetchQuote(place, size, hasReturnLeg);
          }}
        >
          <option value="SMALL">Vito / Transporter (küçük)</option>
          <option value="LARGE">Sprinter (büyük)</option>
        </select>
      </div>

      <label className="ev-card" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={hasReturnLeg}
          onChange={(e) => {
            setHasReturnLeg(e.target.checked);
            if (googleMapsEnabled && place) fetchQuote(place, vehicleSize, e.target.checked);
          }}
        />
        <span style={{ fontSize: 14, color: "var(--text-muted)" }}>Dönüş transferi ekle</span>
      </label>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
        <button
          className={`ev-btn ev-btn--ghost ${paymentMethod === "PAY_IN_VEHICLE" ? "ev-btn--ghost-active" : ""}`}
          onClick={() => setPaymentMethod("PAY_IN_VEHICLE")}
        >
          Araçta Öde
        </button>
        <button
          className={`ev-btn ev-btn--ghost ${paymentMethod === "PAY_NOW_CARD" ? "ev-btn--ghost-active" : ""}`}
          onClick={() => setPaymentMethod("PAY_NOW_CARD")}
        >
          Şimdi Öde (Kart)
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Toplam Fiyat</div>
          <div className="ev-price">{loadingQuote ? "…" : displayedQuote ? `€${displayedQuote.total}` : "—"}</div>
          {displayedQuote?.km !== undefined && (
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {displayedQuote.regionName ? `${displayedQuote.regionName} · ` : ""}
              {displayedQuote.km} km
            </div>
          )}
          {displayedQuote?.isEstimate && <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{displayedQuote.note}</div>}
        </div>
        <button className="ev-btn" onClick={submit} disabled={submitting}>
          {submitting ? "…" : "Rezervasyonu Onayla"}
        </button>
      </div>
    </main>
  );
}
