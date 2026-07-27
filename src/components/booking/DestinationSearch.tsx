"use client";

import { useState } from "react";
import { inferRegionName } from "@/lib/search/infer-region";

type PricingRule = { regionName: string };
type SerperResult = { title: string; link: string; snippet: string; location?: string };

interface Props {
  pricingRules: PricingRule[];
  onPick: (value: { destinationText: string; regionName?: string }) => void;
}

export function DestinationSearch({ pricingRules, onPick }: Props) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SerperResult[]>([]);
  const [error, setError] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");

  async function search() {
    setSelectedDestination("");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Arama başarısız.");
      setResults(Array.isArray(json.results) ? json.results : []);
    } catch (e) {
      setResults([]);
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ev-card" style={{ marginTop: 12 }}>
      <div className="ev-label" style={{ marginBottom: 8 }}>Otel veya adres ara</div>
      <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 0 }}>
        Serper ile otel/adres önerisi al, sonra sonucu seçerek formu doldur.
      </p>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          className="ev-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Örn. Lara beach hotel"
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <button className="ev-btn" onClick={search} disabled={loading || !q.trim()}>
          {loading ? "…" : "Ara"}
        </button>
      </div>
      {error && <p style={{ color: "var(--rose)", fontSize: 13, marginTop: 8 }}>{error}</p>}
      {results.length > 0 && (
        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {results.map((result) => {
            const inferredRegion = inferRegionName(`${result.title} ${result.snippet}`, pricingRules.map((rule) => rule.regionName));
            const location = result.location || inferredRegion || "Türkiye";
            const destinationText = `${result.title}${location && !result.title.toLocaleLowerCase("tr").includes(location.toLocaleLowerCase("tr")) ? ` — ${location}` : ""}`;
            return (
              <button
                key={`${result.title}-${result.link}`}
                type="button"
                className="ev-card"
                style={{ textAlign: "left" }}
                aria-pressed={selectedDestination === destinationText}
                onClick={() => {
                  setSelectedDestination(destinationText);
                  onPick({ destinationText, regionName: inferredRegion ?? undefined });
                }}
              >
                <b>{result.title}</b>
                <div style={{ fontSize: 12, color: "var(--gold)", marginTop: 4 }}>📍 {location}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{result.snippet}</div>
                {inferredRegion && (
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
                    Eşleşen bölge: {inferredRegion}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
      {selectedDestination && <div className="ev-selected-location" role="status">✓ Seçilen konum: <strong>{selectedDestination}</strong></div>}
    </div>
  );
}
