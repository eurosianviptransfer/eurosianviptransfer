"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type MediaItem = { id: string; url: string; filename: string; mime: string | null };

export function LogoPicker({ currentUrl, settingKey }: { currentUrl: string | null; settingKey: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [saving, setSaving] = useState(false);

  const openPicker = async () => {
    setOpen((v) => !v);
    if (!items) {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/media");
        const data = await res.json();
        setItems((data.results || []).filter((m: MediaItem) => m.mime?.startsWith("image")));
      } finally {
        setLoading(false);
      }
    }
  };

  const selectLogo = async (url: string) => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: settingKey, value: { url } }),
      });
      setOpen(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ev-logo-card">
      <div className="ev-logo-preview">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={currentUrl || "/eurosianviptransferlogo.png"} alt="Site logosu" />
      </div>
      <div className="ev-logo-info">
        <h3>Site Logosu</h3>
        <p>Bu logo sitenin genelinde ve admin panelinde kullanılır. Medya kütüphanenizden seçin ya da yeni bir dosya yükleyin.</p>
      </div>
      <div className="ev-actions">
        <button className="ev-btn ev-btn--ghost ev-btn--sm" onClick={openPicker} disabled={saving}>
          {open ? "Kapat" : "Medyadan Seç"}
        </button>
        <Link className="ev-btn ev-btn--sm" href="/admin/media/upload">Yeni Logo Yükle</Link>
      </div>

      {open && (
        <div style={{ width: "100%", marginTop: 12 }}>
          {loading && <div className="ev-empty">Yükleniyor…</div>}
          {!loading && items && items.length === 0 && (
            <div className="ev-empty">Medya kütüphanesinde görsel yok. Önce bir dosya yükleyin.</div>
          )}
          {!loading && items && items.length > 0 && (
            <div className="ev-media-grid">
              {items.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="ev-media-card"
                  style={{ border: "none", cursor: "pointer", padding: 0 }}
                  onClick={() => selectLogo(m.url)}
                  disabled={saving}
                >
                  <div className="ev-media-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.url} alt={m.filename} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
