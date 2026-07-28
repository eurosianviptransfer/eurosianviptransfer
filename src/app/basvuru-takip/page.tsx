"use client";

import { useState } from "react";
import { useLocale } from "@/components/LanguageProvider";
import { getDriverCopy } from "@/lib/driver-copy";

export default function ApplicationTrackingPage() {
  const { locale } = useLocale();
  const copy = getDriverCopy(locale);
  const [applicationNo, setApplicationNo] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function track(event: React.FormEvent) {
    event.preventDefault(); setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`/api/driver-applications?applicationNo=${encodeURIComponent(applicationNo)}&phone=${encodeURIComponent(phone)}`);
      const body = await res.json(); if (!res.ok) throw new Error(body.error);
      setResult(body.application);
    } catch (e) { setError((e as Error).message); } finally { setLoading(false); }
  }

  return <main className="ev-page" style={{ maxWidth: 680 }}>
    <div className="ev-eyebrow">{copy.trackingEyebrow}</div><h1 className="ev-h1">{copy.trackingTitle}</h1>
    <form className="ev-card ev-stack" onSubmit={track}>
      <label className="ev-field"><span className="ev-label">{copy.applicationNoLabel}</span><input className="ev-input" required value={applicationNo} onChange={e => setApplicationNo(e.target.value)} placeholder={copy.placeholderApplicationNo} /></label>
      <label className="ev-field"><span className="ev-label">{copy.phoneLabel}</span><input className="ev-input" required value={phone} onChange={e => setPhone(e.target.value)} placeholder={copy.placeholderPhone} /></label>
      <button className="ev-btn" disabled={loading}>{loading ? copy.trackingLoading : copy.trackingButton}</button>
      {error && <div className="ev-alert ev-alert--error">{error}</div>}
    </form>
    {result && <section className="ev-card" style={{ marginTop: 16 }}><div className="ev-card-row"><strong>{result.applicationNo}</strong><span className="ev-badge ev-badge--gold">{copy.statusLabels[result.status] ?? result.status}</span></div><p>{result.fullName} · {result.vehiclePlate} · {result.vehicleModel}</p>{result.rejectionReason && <div className="ev-alert ev-alert--error">{copy.rejectionPrefix} {result.rejectionReason}</div>}{result.status === "APPROVED" && <p className="ev-muted">{copy.approvedNote}</p>}<small className="ev-muted">{copy.lastUpdatedPrefix} {new Date(result.updatedAt).toLocaleString(locale === "tr" ? "tr-TR" : locale)}</small></section>}
  </main>;
}
