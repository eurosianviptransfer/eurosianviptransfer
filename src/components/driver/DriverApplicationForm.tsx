"use client";

import { useState } from "react";
import { useLocale } from "@/components/LanguageProvider";
import { getDriverCopy } from "@/lib/driver-copy";

const initial = { fullName: "", phone: "", email: "", address: "", licenseNumber: "", vehiclePlate: "", vehicleModel: "", vehicleYear: "", vehicleSize: "SMALL", passengerCapacity: "4", luggageCapacity: "", features: "", notes: "" };

export function DriverApplicationForm() {
  const { locale } = useLocale();
  const copy = getDriverCopy(locale);
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
      if (!presign.ok) throw new Error(body.error || copy.imageUploadUrlError);
      const upload = await fetch(body.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!upload.ok) throw new Error(copy.imageUploadError);
      return body.publicUrl;
    }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const imageUrls = await uploadFiles();
      const res = await fetch("/api/driver-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          vehicleYear: form.vehicleYear ? Number(form.vehicleYear) : null,
          passengerCapacity: Number(form.passengerCapacity),
          luggageCapacity: form.luggageCapacity ? Number(form.luggageCapacity) : null,
          features: form.features.split(",").map(item => item.trim()).filter(Boolean),
          imageUrls,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || copy.applicationSubmitError);
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
      <div className="ev-eyebrow">{copy.submittedEyebrow}</div>
      <h2 style={{ margin: "8px 0" }}>{copy.submittedTitlePrefix} {result.applicationNo}</h2>
      <p>{copy.submittedNote}</p>
      <a className="ev-btn" href={`/basvuru-takip?applicationNo=${result.applicationNo}&lang=${locale}`}>{copy.followButton}</a>
    </section>
  );

  return (
    <form className="ev-card" style={{ marginTop: 24 }} onSubmit={submit}>
      <div className="ev-section-title">{copy.sectionPersonal}</div>
      <div className="ev-field-grid">
        <Field label={copy.labelFullName} value={form.fullName} onChange={v => set("fullName", v)} required />
        <Field label={copy.labelPhone} value={form.phone} onChange={v => set("phone", v)} placeholder="+90" required />
        <Field label={copy.labelEmail} value={form.email} onChange={v => set("email", v)} type="email" />
        <Field label={copy.labelAddress} value={form.address} onChange={v => set("address", v)} />
        <Field label={copy.labelLicense} value={form.licenseNumber} onChange={v => set("licenseNumber", v)} />
      </div>

      <div className="ev-section-title" style={{ marginTop: 26 }}>{copy.sectionVehicle}</div>
      <div className="ev-field-grid">
        <Field label={copy.labelVehiclePlate} value={form.vehiclePlate} onChange={v => set("vehiclePlate", v)} required />
        <Field label={copy.labelVehicleModel} value={form.vehicleModel} onChange={v => set("vehicleModel", v)} required />
        <Field label={copy.labelVehicleYear} value={form.vehicleYear} onChange={v => set("vehicleYear", v)} type="number" />
        <label className="ev-field">
          <span className="ev-label">{copy.labelVehicleSize}</span>
          <select className="ev-select" value={form.vehicleSize} onChange={e => set("vehicleSize", e.target.value)}>
            <option value="SMALL">{copy.vehicleOptionSmall}</option>
            <option value="LARGE">{copy.vehicleOptionLarge}</option>
          </select>
        </label>
        <Field label={copy.labelPassengerCapacity} value={form.passengerCapacity} onChange={v => set("passengerCapacity", v)} type="number" required />
        <Field label={copy.labelLuggageCapacity} value={form.luggageCapacity} onChange={v => set("luggageCapacity", v)} type="number" />
        <Field label={copy.labelFeatures} value={form.features} onChange={v => set("features", v)} placeholder={copy.labelFeatures} />
      </div>

      <label className="ev-field" style={{ marginTop: 12 }}>
        <span className="ev-label">{copy.labelPhotos}</span>
        <input className="ev-input" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => readFiles(e.target.files)} />
      </label>

      {error && <div className="ev-alert ev-alert--error" style={{ marginTop: 12 }}>{error}</div>}

      <div style={{ marginTop: 12 }}>
        <button className="ev-btn" disabled={loading}>{loading ? copy.submitLoading : copy.submitButton}</button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, required }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; required?: boolean }) { return <label className="ev-field"><span className="ev-label">{label}</span><input className="ev-input" required={required} type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} /></label>; }
