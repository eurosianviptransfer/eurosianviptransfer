"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/LanguageProvider";

export default function TrackBookingClient({ initialLocale, copy }: { initialLocale: string; copy: { trackTitle: string; trackSubtitle: string; trackCode: string; trackButton: string } }) {
  const router = useRouter();
  const { locale, setLocale } = useLocale();
  const [code, setCode] = useState("");

  // Sync LanguageProvider with server-provided initialLocale on mount
  useEffect(() => {
    if (initialLocale && locale !== initialLocale) setLocale(initialLocale as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLocale]);

  return (
    <main className="ev-page ev-shell">
      <div className="ev-card ev-track-card">
        <div className="ev-eyebrow">Eurosian VIP Transfer</div>
        <h1 className="ev-h1">{copy.trackTitle}</h1>
        <p className="ev-muted">{copy.trackSubtitle}</p>
        <label className="ev-label" htmlFor="tracking-code">{copy.trackCode}</label>
        <input
          id="tracking-code"
          className="ev-input"
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="EVT-1001"
        />
        <button
          className="ev-btn"
          style={{ marginTop: 14, width: "100%" }}
          disabled={!code.trim()}
          onClick={() => router.push(`/takip/${encodeURIComponent(code.trim())}`)}
        >
          {copy.trackButton} →
        </button>
      </div>
    </main>
  );
}
