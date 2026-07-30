"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconUpload } from "./icons";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

async function uploadFile(file: File): Promise<{ url: string; filename: string; mime: string; size: number }> {
  const targetRes = await fetch("/api/uploads/media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type }),
  });
  const target = await targetRes.json();
  if (!targetRes.ok) throw new Error(target.error || "Yükleme hedefi alınamadı.");

  if (target.fields) {
    // Cloudinary-style multipart form upload
    const form = new FormData();
    Object.entries(target.fields as Record<string, string>).forEach(([k, v]) => form.append(k, String(v)));
    form.append("file", file);
    const res = await fetch(target.uploadUrl, { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Yükleme başarısız.");
    return { url: data.secure_url, filename: file.name, mime: file.type, size: file.size };
  }

  // Direct PUT upload (R2 presigned URL or local dev fallback)
  const putRes = await fetch(target.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!putRes.ok) throw new Error("Dosya yüklenemedi.");
  return { url: target.publicUrl, filename: file.name, mime: file.type, size: file.size };
}

export function MediaUploader({ onUploaded }: { onUploaded?: (url: string) => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        if (!ACCEPTED.includes(file.type)) {
          setError(`Desteklenmeyen dosya türü: ${file.type || file.name}`);
          continue;
        }
        const uploaded = await uploadFile(file);
        const registerRes = await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(uploaded),
        });
        const registered = await registerRes.json();
        if (!registerRes.ok) throw new Error(registered.error || "Medya kaydedilemedi.");
        onUploaded?.(uploaded.url);
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message || "Yükleme sırasında bir hata oluştu.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="ev-empty" style={{ borderColor: "var(--rose)", color: "var(--rose)", marginBottom: 12 }}>
          {error}
        </div>
      )}
      <div
        className={`ev-dropzone ${dragActive ? "ev-dropzone--active" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <IconUpload />
          <div>{busy ? "Yükleniyor…" : "Dosyaları sürükleyip bırakın ya da tıklayarak seçin"}</div>
          <div style={{ fontSize: 11, color: "var(--text-faint)" }}>JPG, PNG, WebP veya SVG</div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
