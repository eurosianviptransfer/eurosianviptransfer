"use client";

import React, { useState } from "react";
import {
  Settings,
  Image as ImageIcon,
  Save,
  Globe,
  Phone,
  Mail,
  MapPin,
  Shield,
  Upload,
  CheckCircle2
} from "lucide-react";
import { CmsNav } from "@/components/admin/cms/CmsNav";

export default function CMSSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/eurosianviptransferlogo.png");
  const [siteName, setSiteName] = useState("Eurosia VIP Transfer");
  const [phone, setPhone] = useState("+90 532 000 00 00");
  const [email, setEmail] = useState("info@eurosiaviptransfer.com");
  const [address, setAddress] = useState("İstanbul Havalimanı VIP Terminali, İstanbul, Türkiye");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* CMS pill menu */}
      <CmsNav />

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Settings className="h-7 w-7 text-amber-400" />
            Site Ayarları & Kurumsal Logo Yönetimi
          </h1>
          <p className="text-xs font-semibold text-slate-300 mt-1">
            Canlı sitenizde görünen logoyu, iletişim numaralarını ve genel SEO başlıklarını buradan yönetebilirsiniz.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 px-5 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
        >
          <Save className="h-4 w-4 stroke-[2.5]" />
          <span>{saved ? "Kaydedildi!" : "Değişiklikleri Kaydet"}</span>
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-xs font-bold text-emerald-300 animate-fade-in shadow-md">
          <CheckCircle2 className="h-4 w-4" />
          <span>Site ayarları ve logo canlı sistemde başarıyla güncellendi!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LOGO MANAGEMENT CARD */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-amber-400" />
            Kurumsal Logo Yönetimi
          </h3>
          <p className="text-xs font-medium text-slate-300">
            Header ve Footer'da yayınlanacak yüksek çözünürlüklü şeffaf (PNG/SVG) logo.
          </p>

          <div className="rounded-2xl border-2 border-dashed border-slate-700/80 bg-slate-950 p-6 text-center hover:border-amber-500/60 transition-all group">
            <div className="mx-auto flex h-24 w-full items-center justify-center p-3">
              <img
                src={logoUrl}
                alt="Site Logo"
                className="max-h-full object-contain group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/images/logo.svg";
                }}
              />
            </div>
            <p className="text-[11px] font-semibold text-slate-400 mt-2">Önerilen Boyut: 240x80px (PNG / SVG)</p>

            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-slate-100 hover:bg-slate-700 hover:text-white border border-slate-700/60 shadow-sm transition-all"
            >
              <Upload className="h-3.5 w-3.5 text-amber-400" />
              <span>Yeni Logo Yükle</span>
            </button>
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
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950 pl-9 pr-3 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
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
      </form>
    </div>
  );
}

