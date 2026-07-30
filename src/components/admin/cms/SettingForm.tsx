"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LOCALE_LABELS } from "@/lib/cms/constants";

type SiteSettingRow = {
  id: string;
  key: string;
  locale: string | null;
  value: unknown;
};

export function SettingForm({ initial }: { initial?: SiteSettingRow }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [key, setKey] = useState(initial?.key ?? "");
  const [locale, setLocale] = useState(initial?.locale ?? "");
  const [valueText, setValueText] = useState(
    initial ? JSON.stringify(initial.value, null, 2) : '{\n  \n}'
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!key.trim()) {
      setError("Anahtar (key) zorunludur.");
      return;
    }
    let parsedValue: unknown;
    try {
      parsedValue = JSON.parse(valueText);
    } catch {
      setError("Değer geçerli bir JSON olmalıdır. Örn: \"metin\", 123, true, {\"a\":1} veya [1,2,3]");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(isEdit ? `/api/admin/settings/${initial!.id}` : "/api/admin/settings", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key.trim(), locale: locale || null, value: parsedValue }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Kaydedilemedi.");
        return;
      }
      router.push("/admin/settings");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ev-card">
      {error && (
        <div className="ev-empty" style={{ borderColor: "var(--rose)", color: "var(--rose)", marginBottom: 16 }}>
          {error}
        </div>
      )}
      <div className="ev-form-section">
        <div className="ev-field-grid">
          <div className="ev-field">
            <label className="ev-label">Anahtar (key)</label>
            <input
              className="ev-input"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="ornek: iletisim.telefon"
              disabled={isEdit}
            />
          </div>
          <div className="ev-field">
            <label className="ev-label">Dil (opsiyonel — boş = global)</label>
            <select className="ev-select" value={locale} onChange={(e) => setLocale(e.target.value)}>
              <option value="">Global</option>
              {Object.entries(LOCALE_LABELS).map(([code, label]) => (
                <option key={code} value={code}>{label} ({code})</option>
              ))}
            </select>
          </div>
          <div className="ev-field ev-field--full">
            <label className="ev-label">Değer (JSON)</label>
            <textarea
              className="ev-textarea"
              rows={10}
              value={valueText}
              onChange={(e) => setValueText(e.target.value)}
              placeholder='"basit bir metin" ya da {"telefon": "+90 5xx xxx xx xx"}'
            />
          </div>
        </div>
      </div>

      <div className="ev-actions" style={{ marginTop: 20 }}>
        <button className="ev-btn" onClick={submit} disabled={saving}>
          {saving ? "Kaydediliyor…" : isEdit ? "Değişiklikleri Kaydet" : "Ayarı Oluştur"}
        </button>
        <button className="ev-btn ev-btn--ghost" onClick={() => router.push("/admin/settings")} disabled={saving}>
          İptal
        </button>
      </div>
    </div>
  );
}
