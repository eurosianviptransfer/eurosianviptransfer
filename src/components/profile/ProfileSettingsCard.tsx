"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "@/components/LanguageProvider";
import { setTheme, type Theme } from "@/lib/theme";

interface ProfileData {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  supplierName: string | null;
  profileImageUrl: string | null;
  preferredTheme: string | null;
  preferredLocale: string | null;
  bio: string | null;
}

export function ProfileSettingsCard() {
  const { data: session, update } = useSession();
  const { locale, setLocale } = useLocale();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formState, setFormState] = useState({ name: "", email: "", supplierName: "", bio: "", currentPassword: "", newPassword: "", theme: "dark" as Theme, localeValue: "tr" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void fetchProfile();
  }, []);

  async function fetchProfile() {
    const response = await fetch("/api/profile");
    if (!response.ok) return;
    const data = (await response.json()) as ProfileData;
    setProfile(data);
    setFormState({
      name: data.name ?? "",
      email: data.email ?? "",
      supplierName: data.supplierName ?? "",
      bio: data.bio ?? "",
      currentPassword: "",
      newPassword: "",
      theme: (data.preferredTheme === "light" ? "light" : "dark"),
      localeValue: data.preferredLocale ?? locale,
    });
  }

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formState.name,
        email: formState.email,
        supplierName: formState.supplierName,
        bio: formState.bio,
        preferredTheme: formState.theme,
        preferredLocale: formState.localeValue,
        currentPassword: formState.currentPassword,
        newPassword: formState.newPassword,
      }),
    });

    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "Profil güncellenemedi.");
      return;
    }

    setProfile((current) => current ? { ...current, ...data } : data);
    setTheme(formState.theme);
    setLocale(formState.localeValue as any);
    await update?.();
    setMessage("Profil başarıyla güncellendi.");
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string | null;
      if (!result) return;
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileImageData: result }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(data.error ?? "Profil resmi yüklenemedi.");
        return;
      }
      setProfile((current) => current ? { ...current, profileImageUrl: data.profileImageUrl ?? current.profileImageUrl } : current);
      setMessage("Profil resmi güncellendi.");
    };
    reader.readAsDataURL(file);
  }

  if (!profile) return null;

  return (
    <section className="ev-card" style={{ marginTop: 24 }}>
      <div className="ev-card-row" style={{ alignItems: "center" }}>
        <div>
          <div className="ev-eyebrow">Profil & Ayarlar</div>
          <h2 className="ev-h1" style={{ fontSize: 24, marginTop: 6 }}>Kişisel alanınız</h2>
          <p className="ev-muted" style={{ marginTop: 6 }}>İsim, e-posta, şifre, dil, tema ve profil fotoğrafını burada yönetebilirsiniz.</p>
        </div>
        <div className="ev-badge ev-badge--teal">{profile.role === "ADMIN" ? "Admin" : profile.role === "DRIVER" ? "Şoför" : "Karşılamacı"}</div>
      </div>

      <form onSubmit={saveProfile} className="ev-stack" style={{ marginTop: 18 }}>
        <div className="ev-card-row" style={{ gap: 20, alignItems: "center" }}>
          <div style={{ width: 88, height: 88, borderRadius: "50%", overflow: "hidden", background: "var(--panel-soft)", display: "grid", placeItems: "center", border: "1px solid var(--line)" }}>
            {profile.profileImageUrl ? <img src={profile.profileImageUrl} alt="Profil fotoğrafı" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 28 }}>{profile.name?.[0] ?? "U"}</span>}
          </div>
          <label className="ev-btn ev-btn--ghost" style={{ cursor: "pointer" }}>
            Profil resmi yükle
            <input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={handleImageUpload} />
          </label>
        </div>

        <div className="ev-field-grid">
          <label className="ev-field">
            <span className="ev-label">Ad Soyad</span>
            <input className="ev-input" value={formState.name} onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))} />
          </label>
          <label className="ev-field">
            <span className="ev-label">E-posta</span>
            <input className="ev-input" type="email" value={formState.email} onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))} />
          </label>
          <label className="ev-field">
            <span className="ev-label">Telefon</span>
            <input className="ev-input" value={profile.phone ?? ""} disabled />
          </label>
          <label className="ev-field">
            <span className="ev-label">Firma / tedarik adı</span>
            <input className="ev-input" value={formState.supplierName} onChange={(event) => setFormState((current) => ({ ...current, supplierName: event.target.value }))} />
          </label>
          <label className="ev-field ev-field--full">
            <span className="ev-label">Kısa bio</span>
            <textarea className="ev-input" rows={3} value={formState.bio} onChange={(event) => setFormState((current) => ({ ...current, bio: event.target.value }))} />
          </label>
        </div>

        <div className="ev-field-grid">
          <label className="ev-field">
            <span className="ev-label">Tema</span>
            <select className="ev-select" value={formState.theme} onChange={(event) => setFormState((current) => ({ ...current, theme: event.target.value as Theme }))}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>
          <label className="ev-field">
            <span className="ev-label">Dil</span>
            <select className="ev-select" value={formState.localeValue} onChange={(event) => setFormState((current) => ({ ...current, localeValue: event.target.value }))}>
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </label>
        </div>

        <div className="ev-field-grid">
          <label className="ev-field">
            <span className="ev-label">Mevcut şifre</span>
            <input className="ev-input" type="password" value={formState.currentPassword} onChange={(event) => setFormState((current) => ({ ...current, currentPassword: event.target.value }))} />
          </label>
          <label className="ev-field">
            <span className="ev-label">Yeni şifre</span>
            <input className="ev-input" type="password" value={formState.newPassword} onChange={(event) => setFormState((current) => ({ ...current, newPassword: event.target.value }))} />
          </label>
        </div>

        {message && <div className="ev-empty" style={{ textAlign: "left" }}>{message}</div>}
        <button className="ev-btn" type="submit" disabled={loading}>{loading ? "Kaydediliyor…" : "Profili kaydet"}</button>
      </form>
    </section>
  );
}
