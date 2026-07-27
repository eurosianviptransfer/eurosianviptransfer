"use client";

import { useEffect, useState } from "react";

export function RatingSummary() {
  const [summary, setSummary] = useState<{ id: string; name: string; role: string; average: number; count: number }[]>([]);
  useEffect(() => { fetch("/api/ratings").then(response => response.ok ? response.json() : null).then(body => body && setSummary(body.summary)).catch(() => undefined); }, []);
  return <section className="ev-card" style={{ marginTop: 24 }}><div className="ev-card-row"><div><div className="ev-eyebrow">Kalite skoru</div><h2 style={{ margin: "6px 0" }}>Şoför & karşılama puanları</h2></div><span className="ev-muted">Atama önerisi için hazır</span></div>{summary.length === 0 ? <div className="ev-empty">Henüz puan bulunmuyor.</div> : <div className="ev-grid ev-grid--3" style={{ marginTop: 14 }}>{summary.map(item => <div className="ev-card" key={item.id} style={{ background: "rgba(14,42,52,.35)" }}><strong>{item.name}</strong><div className="ev-kpi-label">{item.role === "DRIVER" ? "Şoför" : "Karşılamacı"}</div><div style={{ fontSize: 24, marginTop: 8 }}>★ {item.average.toFixed(2)} <small className="ev-muted">/ 5 · {item.count} değerlendirme</small></div></div>)}</div>}</section>;
}
