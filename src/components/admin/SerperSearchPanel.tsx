"use client";

import { useState } from "react";

type SearchResult = {
  title: string;
  link: string;
  snippet: string;
};

export function SerperSearchPanel() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState("");

  async function search() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || (json?.message ?? "Arama başarısız."));
      setResults(Array.isArray(json.results) ? json.results : []);
    } catch (e) {
      setResults([]);
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ev-card" style={{ marginTop: 16 }}>
      <div className="ev-section-title" style={{ marginTop: 0 }}>Web Arama</div>
      <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: -4 }}>
        Serper API ile otel, bölge veya adres araması yap. Bu alan admin kullanımına yöneliktir.
      </p>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          className="ev-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Örn. Belek hotels"
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <button className="ev-btn" onClick={search} disabled={loading || !q.trim()}>
          {loading ? "…" : "Ara"}
        </button>
      </div>
      {error && <p style={{ color: "var(--rose)", fontSize: 13, marginTop: 8 }}>{error}</p>}
      {results.length > 0 && (
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {results.map((result) => (
            <a key={`${result.title}-${result.link}`} href={result.link} target="_blank" rel="noreferrer" className="ev-card" style={{ textDecoration: "none", color: "inherit" }}>
              <b>{result.title}</b>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{result.snippet}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
