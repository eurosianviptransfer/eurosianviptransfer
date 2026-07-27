"use client";

import { useState } from "react";

const labels: Record<string, string> = { PENDING: "Admin onayında bekliyor", APPROVED: "Onaylandı", REJECTED: "Reddedildi" };

export default function ApplicationTrackingPage() {
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
    <div className="ev-eyebrow">Başvuru takip</div><h1 className="ev-h1">Başvurunuzun durumu</h1>
    <form className="ev-card ev-stack" onSubmit={track}>
      <label className="ev-field"><span className="ev-label">Başvuru numarası</span><input className="ev-input" required value={applicationNo} onChange={e => setApplicationNo(e.target.value)} placeholder="EVT-SOF-1234" /></label>
      <label className="ev-field"><span className="ev-label">Başvuruda kullandığınız telefon</span><input className="ev-input" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+90 5xx xxx xx xx" /></label>
      <button className="ev-btn" disabled={loading}>{loading ? "Sorgulanıyor…" : "Durumu sorgula"}</button>
      {error && <div className="ev-alert ev-alert--error">{error}</div>}
    </form>
    {result && <section className="ev-card" style={{ marginTop: 16 }}><div className="ev-card-row"><strong>{result.applicationNo}</strong><span className="ev-badge ev-badge--gold">{labels[result.status] ?? result.status}</span></div><p>{result.fullName} · {result.vehiclePlate} · {result.vehicleModel}</p>{result.rejectionReason && <div className="ev-alert ev-alert--error">Red nedeni: {result.rejectionReason}</div>}{result.status === "APPROVED" && <p className="ev-muted">Giriş bilgileriniz admin tarafından WhatsApp üzerinden iletilecektir.</p>}<small className="ev-muted">Son güncelleme: {new Date(result.updatedAt).toLocaleString("tr-TR")}</small></section>}
  </main>;
}
