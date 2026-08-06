"use client";

import React, { useState, useEffect } from "react";
import { X, Save, CheckCircle2, Globe2, Layers, Key, FileText, Sparkles } from "lucide-react";

export interface CmsEntry {
  id?: string;
  key: string;
  title: string;
  lang: "TR" | "EN" | "DE" | "RU";
  category: string;
  content: string;
  status: "PUBLISHED" | "DRAFT";
}

interface VercelCmsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: CmsEntry) => void;
  initialData?: CmsEntry | null;
}

export const VercelCmsDrawer: React.FC<VercelCmsDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<CmsEntry>({
    key: "",
    title: "",
    lang: "TR",
    category: "Hakkımızda",
    content: "",
    status: "PUBLISHED",
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        key: "",
        title: "",
        lang: "TR",
        category: "Hakkımızda",
        content: "",
        status: "PUBLISHED",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      onSave(formData);
      setSaving(false);
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        onClose();
      }, 700);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-xl border-l border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5 bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-100">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-zinc-100 tracking-tight flex items-center gap-2">
                  {initialData ? "İçeriği Düzenle" : "Yeni İçerik Ekle"}
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                </h2>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Vercel Geist CMS Panel
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {successMsg && (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Değişiklikler başarıyla kaydedildi!</span>
              </div>
            )}

            {/* Key Field */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-zinc-500" />
                İçerik Key (Benzersiz ID)
              </label>
              <input
                type="text"
                required
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                placeholder="ör. hakkimizda-tr veya vito-transfer-details"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 font-mono focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all"
              />
              <p className="text-[11px] text-zinc-500 font-mono">
                Yazılım ve API sorguları bu anahtar kelime üzerinden çağrılır.
              </p>
            </div>

            {/* Title Field */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Başlık / Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="İçerik başlığını girin..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all"
              />
            </div>

            {/* Grid options: Lang & Category & Status */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <Globe2 className="h-3.5 w-3.5" /> Dil
                </label>
                <select
                  value={formData.lang}
                  onChange={(e) => setFormData({ ...formData, lang: e.target.value as any })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2.5 text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none"
                >
                  <option value="TR">Türkçe (TR)</option>
                  <option value="EN">English (EN)</option>
                  <option value="DE">Deutsch (DE)</option>
                  <option value="RU">Русский (RU)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5" /> Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2.5 text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none"
                >
                  <option value="Hakkımızda">Hakkımızda</option>
                  <option value="İletisim">İletişim</option>
                  <option value="Hizmetler">Hizmetler</option>
                  <option value="Transfer Şartları">Transfer Şartları</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Durum
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2.5 text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none"
                >
                  <option value="PUBLISHED">Yayında (Active)</option>
                  <option value="DRAFT">Taslak (Draft)</option>
                </select>
              </div>
            </div>

            {/* Content Body Editor */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                İçerik Metni (Markdown / HTML Destekli)
              </label>
              <textarea
                rows={10}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Sayfada görünecek detaylı metni yazın..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 p-3.5 text-xs text-zinc-200 placeholder-zinc-600 font-mono leading-relaxed focus:border-zinc-500 focus:outline-none"
              />
            </div>
          </form>

          {/* Drawer Footer */}
          <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900/60 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            >
              Vazgeç
            </button>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-2 text-xs font-semibold text-zinc-950 shadow-md hover:bg-zinc-200 active:scale-95 transition-all disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
