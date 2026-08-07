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
  onSave: (entry: CmsEntry) => Promise<boolean>;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const success = await onSave(formData);
      if (success) {
        setSuccessMsg(true);
        setTimeout(() => {
          setSuccessMsg(false);
          onClose();
        }, 500);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-lg border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-5 py-4 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                <FileText className="h-4 w-4 text-blue-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-1.5">
                  {initialData ? "İçeriği Düzenle" : "Yeni İçerik Ekle"}
                  <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-emerald-400" />
                </h2>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  Vercel Geist CMS Editör
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Drawer Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {successMsg && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 p-3 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Değişiklikler başarıyla kaydedildi!</span>
              </div>
            )}

            {/* Key Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                <Key className="h-3 w-3 text-zinc-400" />
                İçerik Key (ID)
              </label>
              <input
                type="text"
                required
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                placeholder="hakkimizda-tr"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Title Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Başlık / Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Sayfa başlığını yazın..."
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Grid options: Lang & Category & Status */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Dil
                </label>
                <select
                  value={formData.lang}
                  onChange={(e) => setFormData({ ...formData, lang: e.target.value as any })}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="TR">TR</option>
                  <option value="EN">EN</option>
                  <option value="DE">DE</option>
                  <option value="RU">RU</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Hakkımızda">Hakkımızda</option>
                  <option value="İletisim">İletişim</option>
                  <option value="Hizmetler">Hizmetler</option>
                  <option value="Transfer Şartları">Transfer Şartları</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Durum
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="PUBLISHED">Yayında</option>
                  <option value="DRAFT">Taslak</option>
                </select>
              </div>
            </div>

            {/* Content Body Editor */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                İçerik Metni
              </label>
              <textarea
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Sayfa içeriğini girin..."
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-xs text-zinc-900 dark:text-zinc-100 font-mono leading-relaxed focus:border-blue-500 focus:outline-none"
              />
            </div>
          </form>

          {/* Drawer Footer */}
          <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Vazgeç
            </button>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 px-4 py-1.5 text-xs font-semibold text-white dark:text-zinc-950 shadow hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{saving ? "Kaydediliyor..." : "Kaydet"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
