"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  vehicleSize: "SMALL" | "LARGE";
  label: string;
  initialDriverFee?: number;
  initialGreeterFee?: number | null;
  greeterRequired?: boolean;
}

export function PayoutRuleForm({ vehicleSize, label, initialDriverFee, initialGreeterFee, greeterRequired }: Props) {
  const router = useRouter();
  const [driverFee, setDriverFee] = useState(initialDriverFee ? String(initialDriverFee) : "");
  const [greeterFee, setGreeterFee] = useState(initialGreeterFee ? String(initialGreeterFee) : "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/payout-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleSize,
          suggestedDriverFee: Number(driverFee),
          suggestedGreeterFee: greeterFee ? Number(greeterFee) : null,
        }),
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

  return (
    <div className="ev-card">
      <div style={{ fontSize: 13, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          <label className="ev-label">Önerilen şoför ücreti ₺</label>
          <input className="ev-input" value={driverFee} onChange={(e) => setDriverFee(e.target.value)} />
        </div>
        <div>
          <label className="ev-label">
            Önerilen karşılamacı ücreti ₺{greeterRequired ? "" : " (opsiyonel araç tipi)"}
          </label>
          <input className="ev-input" value={greeterFee} onChange={(e) => setGreeterFee(e.target.value)} />
        </div>
        <button className="ev-btn" disabled={saving} onClick={save}>
          {saving ? "…" : "Kaydet"}
        </button>
      </div>
    </div>
  );
}
