"use client";

import { useState } from "react";
import { useLocale } from "@/components/LanguageProvider";

const initial = { fullName: "", phone: "", email: "", address: "", experienceYears: "", languages: "", notes: "" };

export function GreeterApplicationForm() {
  const { locale } = useLocale();
  const [form, setForm] = useState(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (key: keyof typeof initial, value: string) => setForm(current => ({ ...current, [key]: value }));

  function readFiles(list: FileList | null) {
    if (!list) return;
    const selected = Array.from(list).filter(file => file.size <= 5_000_000).slice(0, 3);
    setFiles(selected);
  }

  async function uploadFiles() {
    if (files.length === 0) return [];
    return Promise.all(files.map(async file => {
      const presign = await fetch("/api/uploads/vehicle-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contentType: file.type }) });
      const body = await presign.json();
      if (!presign.ok) throw new Error("Resim yükleme başlatılamadı.");

      if (body.fields && body.fields.api_key) {
        const formData = new FormData();
        formData.append("file", file);
        Object.entries(body.fields).forEach(([k, v]) => { if (v !== undefined && v !== null) formData.append(k, String(v)); });
        const uploadRes = await fetch(body.uploadUrl, { method: "POST", body: formData });
        const uploadJson = await uploadRes.json();
        const secureUrl = uploadJson.secure_url || uploadJson.url;
        try {
          const persistRes = await fetch("/api/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: secureUrl, filename: uploadJson.original_filename || file.name, mime: uploadJson.format ? `image/${uploadJson.format}` : file.type, width: uploadJson.width, height: uploadJson.height, size: uploadJson.bytes, meta: { public_id: uploadJson.public_id, raw: uploadJson } }) });
          const persisted = await persistRes.json();
          if (!persistRes.ok) throw new Error(persisted.error || "Resim kaydedilemedi.");
          return persisted.media?.url || secureUrl;
        } catch (err) { console.error("Media persist failed:", err); return secureUrl; }
      }

      if (body.uploadUrl) {
        const upload = await fetch(body.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
        if (!upload.ok) throw new Error("Resim yükleme başarısız.");
        return body.publicUrl;
      }

      throw new Error("Resim yükleme url'u alınamadı.");
    }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const imageUrls = await uploadFiles();
      const res = await fetch("/api/greeter-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          experienceYears: form.experienceYears ? Number(form.experienceYears) : null,
          languages: form.languages.split(",").map(s => s.trim()).filter(Boolean),
          imageUrls,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Başvuru gönderilemedi.");
      setResult(body.application);
      setForm(initial);
      setFiles([]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (result) return (
    <section className="ev-card" style={{ marginTop: 24 }}>
      <div className="ev-eyebrow">Başvuru alındı</div>
      <h2 style={{ margin: "8px 0" }}>Başvuru numarası: {result.applicationNo}</h2>
      <p>Başvurunuz kaydedildi. Başvuru takibi sayfasından ilerlemeyi kontrol edebilirsiniz.</p>
      <a className="ev-btn" href={`/basvuru-takip?applicationNo=${result.applicationNo}`}>Başvuru takibi</a>
    </section>
  );

  return (
    <form className="ev-card" style={{ marginTop: 24 }} onSubmit={submit}>
      <div className="ev-section-title">Kişisel bilgiler</div>
      <div className="ev-field-grid">
        <label className="ev-field"><span className="ev-label">Ad Soyad</span><input className="ev-input" value={form.fullName} onChange={e => set("fullName", e.target.value)} required /></label>
        <label className="ev-field"><span className="ev-label">Telefon</span><input className="ev-input" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+90" required /></label>
        <label className="ev-field"><span className="ev-label">E-posta</span><input className="ev-input" value={form.email} onChange={e => set("email", e.target.value)} type="email" /></label>
        <label className="ev-field"><span className="ev-label">Adres</span><input className="ev-input" value={form.address} onChange={e => set("address", e.target.value)} /></label>
      </div>

      <div className="ev-section-title" style={{ marginTop: 26 }}>Deneyim & diller</div>
      <div className="ev-field-grid">
        <label className="ev-field"><span className="ev-label">Deneyim (yıl)</span><input className="ev-input" value={form.experienceYears} onChange={e => set("experienceYears", e.target.value)} type="number" /></label>
        <label className="ev-field"><span className="ev-label">Konuşulan diller (virgülle ayır)</span><input className="ev-input" value={form.languages} onChange={e => set("languages", e.target.value)} placeholder="TR,EN" /></label>
      </div>

      <label className="ev-field" style={{ marginTop: 12 }}>
        <span className="ev-label">Fotoğraflar</span>
        <input className="ev-input" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => readFiles(e.target.files)} />
      </label>

      <label className="ev-field" style={{ marginTop: 12 }}>
        <span className="ev-label">Notlar</span>
        <textarea className="ev-input" rows={4} value={form.notes} onChange={e => set("notes", e.target.value)} />
      </label>

      {error && <div className="ev-alert ev-alert--error" style={{ marginTop: 12 }}>{error}</div>}

      <div style={{ marginTop: 12 }}>
        <button className="ev-btn" disabled={loading}>{loading ? "Gönderiliyor…" : "Başvur"}</button>
      </div>
    </form>
  );
}
