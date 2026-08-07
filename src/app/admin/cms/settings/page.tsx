"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Settings,
  Image as ImageIcon,
  Save,
  Globe,
  Phone,
  Mail,
  MapPin,
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { CmsNav } from "@/components/admin/cms/CmsNav";

export default function CMSSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [logoUrl, setLogoUrl] = useState("/eurosianviptransferlogo.png");
  const [siteName, setSiteName] = useState("Eurosia VIP Transfer");
  const [phone, setPhone] = useState("+90 532 000 00 00");
  const [email, setEmail] = useState("info@eurosiaviptransfer.com");
  const [address, setAddress] = useState("İstanbul Havalimanı VIP Terminali, İstanbul, Türkiye");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Veritabanından mevcut ayarları yükle
  async function loadSettings() {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (res.ok && data.results) {
        const settingsMap: Record<string, any> = {};
        data.results.forEach((item: any) => {
          settingsMap[item.key] = item.value;
        });

        if (settingsMap["site_name"]) setSiteName(settingsMap["site_name"]);
        if (settingsMap["logo_url"]) setLogoUrl(settingsMap["logo_url"]);
        if (settingsMap["support_phone"]) setPhone(settingsMap["support_phone"]);
        if (settingsMap["support_email"]) setEmail(settingsMap["support_email"]);
        if (settingsMap["office_address"]) setAddress(settingsMap["office_address"]);
      }
    } catch (err: any) {
      console.error("Ayarlar yüklenirken hata oluştu:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  // Ayarları veritabanına kaydetme fonksiyonu
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setErrorMessage(null);

    const payload = [
      { key: "site_name", value: siteName },
      { key: "logo_url", value: logoUrl },
      { key: "support_phone", value: phone },
      { key: "support_email", value: email },
      { key: "office_address", value: address },
    ];

    try {
      for (const item of payload) {
        const res = await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `${item.key} kaydedilemedi.`);
        }
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      console.error("Kayıt hatası:", err);
      setErrorMessage(err.message || "Ayarlar kaydedilirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  // Logo Yükleme İşlemi
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/uploads/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Logo yüklenemedi.");
      }

      if (data.url) {
        setLogoUrl(data.url);
      }
    } catch (err: any) {
      console.error("Logo upload error:", err);
      // Yerel dosya okuyucu yedekleme
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* CMS Pill Nav */}
      <CmsNav />

      <div className="rounded-3xl border border-slate-800 bg-[linear-gradient(135deg,rgba(8,16,31,0.96),rgba(15,23,42,0.96))] p-5 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              <Settings className="h-3.5 w-3.5" /> Site ayarları
            </div>
            <h1 className="mt-3 flex items-center gap-2.5 text-2xl font-black tracking-tight text-white">
              <Settings className="h-7 w-7 text-amber-400" />
              Site Ayarları & Kurumsal Logo Yönetimi
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Canlı sitenizde görünen kurumsal logoyu, iletişim numaralarını ve genel adres bilgilerini buradan yönetebilirsiniz.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-500 px-6 py-3 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Save className="h-4 w-4 stroke-[2.5]" />
            <span>{saving ? "Kaydediliyor..." : "Ayarları Kaydet"}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-xs font-bold text-emerald-300 shadow-md animate-fadeIn">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>Site ayarları ve kurumsal logo veritabanına başarıyla kaydedildi!</span>
        </div>
      )}

      {/* ERROR NOTIFICATION */}
      {errorMessage && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 p-4 text-xs font-bold text-rose-300 shadow-md animate-fadeIn">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3 bg-slate-900/60 rounded-2xl border border-slate-800">
          <RefreshCw className="h-8 w-8 animate-spin text-amber-400" />
          <span>Ayarlar veritabanından yükleniyor...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LOGO MANAGEMENT CARD */}
            <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-amber-400" />
                Kurumsal Logo Yönetimi
              </h3>
              <p className="text-xs font-medium text-slate-400">
                Header ve Footer'da yayınlanacak yüksek çözünürlüklü şeffaf (PNG/SVG) logo.
              </p>

              <div className="rounded-2xl border-2 border-dashed border-slate-700/80 bg-slate-950 p-6 text-center hover:border-amber-500/60 transition-all group">
                <div className="mx-auto flex h-28 w-full items-center justify-center p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                  <img
                    src={logoUrl}
                    alt="Kurumsal Logo"
                    className="max-h-full object-contain group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/eurosianviptransferlogo.png";
                    }}
                  />
                </div>
                <p className="text-[11px] font-semibold text-slate-400 mt-3">Önerilen Boyut: 240x80px (PNG / SVG)</p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-100 hover:bg-slate-700 hover:text-white border border-slate-700/60 shadow-sm transition-all cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5 text-amber-400" />
                  <span>{uploadingLogo ? "Yükleniyor..." : "Yeni Logo Yükle"}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Logo Görsel URL'i</label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-slate-300 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* GENERAL SETTINGS CARD */}
            <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-amber-400" />
                Genel Firma & İletişim Bilgileri
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">Firma / Marka Adı</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">Müşteri Destek Telefonu</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950 pl-9 pr-3 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono"
                    />
                    <Phone className="absolute left-3 top-3 h-3.5 w-3.5 text-amber-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">E-Posta Adresi</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950 pl-9 pr-3 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                    <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-amber-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">Merkez Adres</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950 pl-9 pr-3 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                    <MapPin className="absolute left-3 top-3 h-3.5 w-3.5 text-amber-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM MAIN SAVE BUTTON */}
          <div className="flex items-center justify-end border-t border-slate-800 pt-5">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-500 px-8 py-3.5 text-xs font-black text-slate-950 shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4 stroke-[2.5]" />
              <span>{saving ? "Değişiklikler Kaydediliyor..." : "Tüm Ayarları Kaydet"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
