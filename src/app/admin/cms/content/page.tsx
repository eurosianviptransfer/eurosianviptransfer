"use client";

import React, { useState } from "react";
import { FileText, Plus, Search, Edit, Trash2, Globe2, Eye, CheckCircle2 } from "lucide-react";

interface ContentItem {
  id: string;
  key: string;
  title: string;
  lang: "TR" | "EN" | "DE" | "RU";
  category: "Hakkımızda" | "İletisim" | "Hizmetler" | "Transfer Şartları";
  updatedAt: string;
  status: "PUBLISHED" | "DRAFT";
}

const mockContents: ContentItem[] = [
  {
    id: "1",
    key: "hakkimizda",
    title: "Eurosia VIP Transfer Kurumsal Hakkımızda Metni",
    lang: "TR",
    category: "Hakkımızda",
    updatedAt: "05 Ağu 2026",
    status: "PUBLISHED",
  },
  {
    id: "2",
    key: "about-us",
    title: "Eurosia VIP Transfer Corporate About Us",
    lang: "EN",
    category: "Hakkımızda",
    updatedAt: "05 Ağu 2026",
    status: "PUBLISHED",
  },
  {
    id: "3",
    key: "iletisim",
    title: "İletişim & Rezervasyon Bilgilendirme",
    lang: "TR",
    category: "İletisim",
    updatedAt: "04 Ağu 2026",
    status: "PUBLISHED",
  },
];

export default function CMSContentPage() {
  const [contents] = useState<ContentItem[]>(mockContents);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FileText className="h-7 w-7 text-amber-400" />
            CMS Sayfa İçerikleri
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sitede yayınlanan Hakkımızda, Hizmetler ve İletişim içeriklerini çok dilli (TR/EN/DE/RU) olarak yönetin.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all">
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Yeni İçerik Ekle</span>
        </button>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-4 px-5">İçerik Başlığı & Key</th>
                <th className="py-4 px-5">Dil</th>
                <th className="py-4 px-5">Kategori</th>
                <th className="py-4 px-5">Son Güncelleme</th>
                <th className="py-4 px-5">Durum</th>
                <th className="py-4 px-5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {contents.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-white text-sm">{item.title}</div>
                    <div className="text-xs font-mono text-amber-400/80 mt-0.5">key="{item.key}"</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1 font-bold text-xs bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-200">
                      <Globe2 className="h-3 w-3 text-amber-400" /> {item.lang}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-xs text-slate-300">{item.category}</td>
                  <td className="py-4 px-5 text-xs text-slate-400">{item.updatedAt}</td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Yayında
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-amber-400">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
