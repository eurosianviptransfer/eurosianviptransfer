"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CONTENT_TYPE_LABELS, CONTENT_TYPES, LOCALE_LABELS } from "@/lib/cms/constants";

type ContentEntry = {
  id: string;
  key: string;
  locale: string;
  type: string;
  title: string | null;
  body: string | null;
  slug: string | null;
  published: boolean;
  sortOrder: number;
};

export function ContentForm({ initial }: { initial?: ContentEntry }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [key, setKey] = useState(initial?.key ?? "");
  const [locale, setLocale] = useState(initial?.locale ?? "tr");
  const [type, setType] = useState(initial?.type ?? "PAGE");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!key.trim()) {
      setError("Anahtar (key) zorunludur.");
      return;
    }
    setSaving(true);
    try {
      const payload = { key: key.trim(), locale, type, title, slug, body, published, sortOrder: Number(sortOrder) || 0 };
      const res = await fetch(isEdit ? `/api/admin/content/${initial!.id}` : "/api/admin/content", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Kaydedilemedi.");
        return;
      }
      router.push("/admin/content");
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
              placeholder="ornek: hakkimizda.giris"
              disabled={isEdit}
            />
          </div>
          <div className="ev-field">
            <label className="ev-label">Tür</label>
            <select className="ev-select" value={type} onChange={(e) => setType(e.target.value)}>
              {CONTENT_TYPES.map((t) => (
                <option key={t} value={t}>{CONTENT_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div className="ev-field">
            <label className="ev-label">Dil</label>
            <select className="ev-select" value={locale} onChange={(e) => setLocale(e.target.value)}>
              {Object.entries(LOCALE_LABELS).map(([code, label]) => (
                <option key={code} value={code}>{label} ({code})</option>
              ))}
            </select>
          </div>
          <div className="ev-field">
            <label className="ev-label">Sıra (sortOrder)</label>
            <input
              className="ev-input"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
          </div>
          <div className="ev-field ev-field--full">
            <label className="ev-label">Başlık</label>
            <input className="ev-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Görünen başlık" />
          </div>
          <div className="ev-field ev-field--full">
            <label className="ev-label">Slug (opsiyonel)</label>
            <input className="ev-input" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="ornek-sayfa-yolu" />
          </div>
          <div className="ev-field ev-field--full">
            <label className="ev-label">İçerik metni</label>
            <textarea
              className="ev-textarea"
              rows={12}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Sayfa veya statik metin içeriği (HTML/Markdown/düz metin olabilir)"
            />
          </div>
          <div className="ev-field ev-field--full">
            <label className="ev-switch-row">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              Yayında (published)
            </label>
          </div>
        </div>
      </div>

      <div className="ev-actions" style={{ marginTop: 20 }}>
        <button className="ev-btn" onClick={submit} disabled={saving}>
          {saving ? "Kaydediliyor…" : isEdit ? "Değişiklikleri Kaydet" : "İçeriği Oluştur"}
        </button>
        <button className="ev-btn ev-btn--ghost" onClick={() => router.push("/admin/content")} disabled={saving}>
          İptal
        </button>
      </div>
    </div>
  );
}
