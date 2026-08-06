"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Upload, Search, Trash2, Copy, Check } from "lucide-react";
import { CmsNav } from "@/components/admin/cms/CmsNav";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  createdAt: string;
}

const mockMediaList: MediaItem[] = [
  {
    id: "1",
    name: "vito-vip-interior.jpg",
    url: "/media-library/vito-vip.jpg",
    size: "1.4 MB",
    createdAt: "05 Ağu 2026",
  },
  {
    id: "2",
    name: "sprinter-executive.jpg",
    url: "/media-library/sprinter-vip.jpg",
    size: "2.1 MB",
    createdAt: "04 Ağu 2026",
  },
  {
    id: "3",
    name: "istanbul-airport-vip.jpg",
    url: "/media-library/ist-airport.jpg",
    size: "890 KB",
    createdAt: "02 Ağu 2026",
  },
];

export default function CMSMediaPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* CMS pill menu */}
      <CmsNav />

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ImageIcon className="h-7 w-7 text-amber-400" />
            Medya Kütüphanesi
          </h1>
          <p className="text-xs font-semibold text-slate-300 mt-1">
            Araç görselleri, bannerlar ve promosyon fotoğraflarını yönetin ve CDN bağlantılarını kopyalayın.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all">
          <Upload className="h-4 w-4 stroke-[2.5]" />
          <span>Yeni Dosya Yükle</span>
        </button>
      </div>

      {/* MEDIA GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {mockMediaList.map((m) => (
          <div
            key={m.id}
            className="group rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md hover:border-amber-500/40 transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-video w-full rounded-xl bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800">
              <ImageIcon className="h-8 w-8 text-amber-400/60 group-hover:scale-110 transition-transform" />
            </div>

            <div className="mt-3 space-y-1">
              <p className="text-xs font-bold text-white truncate">{m.name}</p>
              <p className="text-[11px] font-semibold text-slate-400">{m.size} • {m.createdAt}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 justify-between">
              <button
                onClick={() => copyUrl(m.id, m.url)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-all"
              >
                {copiedId === m.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>URL Kopyala</span>
                  </>
                )}
              </button>

              <button
                aria-label="Dosyayı Sil"
                className="p-1.5 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

