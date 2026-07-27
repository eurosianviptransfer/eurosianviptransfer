"use client";

import { useEffect, useRef, useState } from "react";
import { airports, type AirportCode } from "@/lib/airports";

export interface PlaceSelection {
  label: string;
  lat: number;
  lng: number;
}

interface Props {
  onSelect: (place: PlaceSelection) => void;
  originAirport?: AirportCode;
}

/**
 * Google Places Autocomplete — Bölüm 2.1 ("Varış — otel/bölge Google Places
 * Autocomplete ile arama"). Yeni nesil `PlaceAutocompleteElement` web component'i
 * kullanılıyor (eski `Autocomplete` sınıfı 2025'ten itibaren "legacy").
 * Script'i bir kez global olarak yüklemek için basit bir yükleyici içerir.
 *
 * NOT: GOOGLE_MAPS_API_KEY istemci tarafı anahtardır — Google Cloud Console'da
 * HTTP referrer kısıtlaması (sadece eurosianviptransfer.com) eklenmesi zorunludur.
 */
export function AddressAutocomplete({ onSelect, originAirport = "AYT" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const hasApiKey = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim());
  const [available, setAvailable] = useState(hasApiKey);
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
    if (!key) return;

    loadGoogleMapsScript().then(() => setReady(true)).catch(() => setAvailable(false));
  }, []);

  useEffect(() => {
    if (!available || !ready || !containerRef.current) return;

    // @ts-expect-error — google.maps.places tipleri @types/google.maps paketiyle eklenmeli
    const el = new google.maps.places.PlaceAutocompleteElement({
      // Antalya çevresine ağırlık ver (havalimanı merkezli arama)
      locationBias: { radius: 120000, center: airports.find((airport) => airport.code === originAirport) ? { lat: Number(airports.find((airport) => airport.code === originAirport)!.coordinates.split(",")[0]), lng: Number(airports.find((airport) => airport.code === originAirport)!.coordinates.split(",")[1]) } : { lat: 36.8987, lng: 30.8005 } },
    });
    el.style.width = "100%";
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(el);

    el.addEventListener("gmp-placeselect", async (event: any) => {
      const place = event.place;
      await place.fetchFields({ fields: ["displayName", "formattedAddress", "location"] });
      const name = place.displayName ?? "";
      const address = place.formattedAddress ?? "";
      const label = address && !address.toLocaleLowerCase("tr").includes(name.toLocaleLowerCase("tr")) ? `${name} — ${address}` : name;
        setSelectedLabel(label);
        onSelect({
          label,
        lat: place.location.lat(),
        lng: place.location.lng(),
      });
    });
  }, [available, ready, onSelect, originAirport]);

  if (!available) {
    return (
      <input
        disabled
        placeholder="Google adres araması için API anahtarı gerekiyor"
        className="ev-body w-full rounded-lg px-3 py-2.5 text-sm opacity-50"
      />
    );
  }

  return (
    <div>
      <div ref={containerRef} />
      {!ready && (
        <input
          disabled
          placeholder="Adres araması yükleniyor…"
          className="ev-body w-full rounded-lg px-3 py-2.5 text-sm opacity-50"
        />
      )}
      {selectedLabel && <div className="ev-selected-location" role="status">✓ Seçilen konum: <strong>{selectedLabel}</strong></div>}
    </div>
  );
}

let scriptPromise: Promise<void> | null = null;

function loadGoogleMapsScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if ((window as any).google?.maps?.places) return resolve();

    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key?.trim()) {
      reject(new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY eksik."));
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&v=weekly`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps script yüklenemedi."));
    document.head.appendChild(script);
  });
  return scriptPromise;
}
