"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Rule {
  id: string;
  regionName: string;
  km: number;
  basePriceSmall: number;
  basePriceLarge: number;
  active: boolean;
}

export function PricingRuleRow({ rule }: { rule: Rule }) {
  const router = useRouter();
  const [km, setKm] = useState(String(rule.km));
  const [small, setSmall] = useState(String(rule.basePriceSmall));
  const [large, setLarge] = useState(String(rule.basePriceLarge));
  const [saving, setSaving] = useState(false);
  const dirty = km !== String(rule.km) || small !== String(rule.basePriceSmall) || large !== String(rule.basePriceLarge);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/pricing-rules/${rule.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ km: Number(km), basePriceSmall: Number(small), basePriceLarge: Number(large) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      router.refresh();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function deactivate() {
    if (!confirm(`${rule.regionName} bölgesini pasif yapmak istediğinize emin misiniz?`)) return;
    await fetch(`/api/pricing-rules/${rule.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr 90px",
        gap: 10,
        alignItems: "center",
        padding: "8px 0",
        borderTop: "1px solid var(--line)",
        opacity: rule.active ? 1 : 0.4,
      }}
    >
      <span>{rule.regionName}</span>
      <input className="ev-input" value={km} onChange={(e) => setKm(e.target.value)} />
      <input className="ev-input" value={small} onChange={(e) => setSmall(e.target.value)} />
      <input className="ev-input" value={large} onChange={(e) => setLarge(e.target.value)} />
      <div style={{ display: "flex", gap: 6 }}>
        {dirty && (
          <button className="ev-btn" style={{ padding: "6px 10px", fontSize: 12 }} disabled={saving} onClick={save}>
            {saving ? "…" : "Kaydet"}
          </button>
        )}
        {rule.active && !dirty && (
          <button className="ev-btn ev-btn--ghost" style={{ padding: "6px 10px", fontSize: 12 }} onClick={deactivate}>
            Pasif Yap
          </button>
        )}
      </div>
    </div>
  );
}

export function NewPricingRuleForm() {
  const router = useRouter();
  const [regionName, setRegionName] = useState("");
  const [km, setKm] = useState("");
  const [small, setSmall] = useState("");
  const [large, setLarge] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!regionName || !km || !small || !large) return alert("Tüm alanlar gerekli.");
    setSaving(true);
    try {
      const res = await fetch("/api/pricing-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regionName, km: Number(km), basePriceSmall: Number(small), basePriceLarge: Number(large) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setRegionName("");
      setKm("");
      setSmall("");
      setLarge("");
      router.refresh();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ev-card" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8 }}>
      <input className="ev-input" placeholder="Bölge/Otel adı" value={regionName} onChange={(e) => setRegionName(e.target.value)} />
      <input className="ev-input" placeholder="Km" value={km} onChange={(e) => setKm(e.target.value)} />
      <input className="ev-input" placeholder="Küçük araç €" value={small} onChange={(e) => setSmall(e.target.value)} />
      <input className="ev-input" placeholder="Büyük araç €" value={large} onChange={(e) => setLarge(e.target.value)} />
      <button className="ev-btn" style={{ gridColumn: "span 4" }} disabled={saving} onClick={submit}>
        {saving ? "…" : "Bölge Ekle"}
      </button>
    </div>
  );
}
