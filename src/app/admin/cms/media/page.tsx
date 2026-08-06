"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Upload, Search, Trash2, Copy, Check } from "lucide-react";

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
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ImageIcon className="h-7 w-7 text-amber-400" />
            Medya Kütüphanesi
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Araç görselleri, bannerlar ve promosyon fotoğraflarını yönetin ve CDN bağlantılarını kopyalayın.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all">
          <Upload className="h-4 w-4 stroke-[2.5]" />
          <span>Yeni Dosya Yükle</span>
        </button>
      </div>

      {/* MEDIA GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mockMediaList.map((m) => (
          <div
            key={m.id}
            className="group rounded-2xl border border-slate-800 bg-slate-900/90 p-3 shadow-xl backdrop-blur-md hover:border-amber-500/40 transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-video w-full rounded-xl bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800">
              <ImageIcon className="h-8 w-8 text-slate-600 group-hover:scale-110 transition-transform" />
            </div>

            <div className="mt-3 space-y-1">
              <p className="text-xs font-bold text-white truncate">{m.name}</p>
              <p className="text-[10px] text-slate-400">{m.size} • {m.createdAt}</p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => copyUrl(m.id, m.url)}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                {copiedId === m.id ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>URL Kopyala</span>
                  </>
                )}
              </button>

              <button className="text-slate-500 hover:text-rose-400">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
