"use client";

import React, { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Globe2,
  CheckCircle2,
  Edit,
  Trash2,
  Eye,
  Sliders,
  Filter,
  LayoutGrid,
  List,
  Sparkles,
  Layers,
  Clock,
  MoreVertical,
  ArrowUpRight,
} from "lucide-react";
import { VercelCmsDrawer, type CmsEntry } from "./VercelCmsDrawer";

const initialContents: CmsEntry[] = [
  {
    id: "1",
    key: "hakkimizda",
    title: "Eurosia VIP Transfer Kurumsal Hakkımızda Metni",
    lang: "TR",
    category: "Hakkımızda",
    content: "Eurosia VIP Transfer, Antalya ve Türkiye genelinde yüksek standartlarda VIP transfer hizmetleri sunar.",
    status: "PUBLISHED",
  },
  {
    id: "2",
    key: "about-us",
    title: "Eurosia VIP Transfer Corporate About Us Page",
    lang: "EN",
    category: "Hakkımızda",
    content: "Eurosia VIP Transfer delivers premier luxury chauffeur services across Turkey.",
    status: "PUBLISHED",
  },
  {
    id: "3",
    key: "vito-transfer-hizmetleri",
    title: "Mercedes-Benz Vito VIP Transfer Detayları",
    lang: "TR",
    category: "Hizmetler",
    content: "Ultra lüks dizayn edilmiş Mercedes Vito araçlarımız ile 6 kişiye kadar konforlu seyahat.",
    status: "PUBLISHED",
  },
  {
    id: "4",
    key: "sprinter-vip-details",
    title: "Mercedes Sprinter Large Group VIP Experience",
    lang: "EN",
    category: "Hizmetler",
    content: "Spacious Sprinter VIP buses for up to 13 passengers with reclining leather seats.",
    status: "DRAFT",
  },
  {
    id: "5",
    key: "iletisim-sayfasi",
    title: "7/24 VIP Destek ve İletişim Bilgileri",
    lang: "TR",
    category: "İletisim",
    content: "Havalimanı ve otel transferleriniz için 7 gün 24 saat kesintisiz whatsapp & telefon desteği.",
    status: "PUBLISHED",
  },
];

export const VercelCmsPage: React.FC = () => {
  const [contents, setContents] = useState<CmsEntry[]>(initialContents);
  const [activeTab, setActiveTab] = useState<"pages" | "media" | "seo" | "settings">("pages");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CmsEntry | null>(null);

  const handleOpenCreate = () => {
    setEditingEntry(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (entry: CmsEntry) => {
    setEditingEntry(entry);
    setDrawerOpen(true);
  };

  const handleDelete = (id?: string) => {
    if (!id) return;
    setContents((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveEntry = (savedEntry: CmsEntry) => {
    if (savedEntry.id) {
      // Edit existing
      setContents((prev) => prev.map((item) => (item.id === savedEntry.id ? savedEntry : item)));
    } else {
      // Create new
      const newEntry = {
        ...savedEntry,
        id: Date.now().toString(),
      };
      setContents((prev) => [newEntry, ...prev]);
    }
  };

  const filteredContents = contents.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = selectedLang === "ALL" || item.lang === selectedLang;
    const matchesStatus = selectedStatus === "ALL" || item.status === selectedStatus;

    return matchesSearch && matchesLang && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* VERCEL TABS NAVIGATION BAR */}
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2.5">
              İçerik Yönetim Sistemi (CMS)
              <Sparkles className="h-4 w-4 text-emerald-400" />
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Vercel Geist mimarisiyle çok dilli web sayfaları, hizmetler ve yayın içeriklerini yönetin.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-950 shadow-md hover:bg-zinc-200 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Yeni İçerik Ekle</span>
          </button>
        </div>

        {/* Tab List */}
        <div className="flex items-center gap-1 font-sans text-xs">
          <button
            onClick={() => setActiveTab("pages")}
            className={`px-3 py-2 font-medium rounded-lg transition-colors ${
              activeTab === "pages"
                ? "bg-zinc-800 text-zinc-100 font-semibold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            Tüm Sayfalar ({contents.length})
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`px-3 py-2 font-medium rounded-lg transition-colors ${
              activeTab === "media"
                ? "bg-zinc-800 text-zinc-100 font-semibold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            Medya Varlıkları (142)
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`px-3 py-2 font-medium rounded-lg transition-colors ${
              activeTab === "seo"
                ? "bg-zinc-800 text-zinc-100 font-semibold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            SEO & Meta Etiketler
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH ACTION BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
        <div className="flex flex-1 items-center gap-3 w-full">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Başlık veya key ile ara..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-9 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
            />
          </div>

          {/* Lang Filter */}
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 focus:border-zinc-600 focus:outline-none"
          >
            <option value="ALL">Tüm Diller</option>
            <option value="TR">Türkçe (TR)</option>
            <option value="EN">English (EN)</option>
            <option value="DE">Deutsch (DE)</option>
            <option value="RU">Русский (RU)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 focus:border-zinc-600 focus:outline-none hidden sm:block"
          >
            <option value="ALL">Tüm Durumlar</option>
            <option value="PUBLISHED">Yayında</option>
            <option value="DRAFT">Taslak</option>
          </select>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 border-l border-zinc-800 pl-3">
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === "list" ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
            }`}
            title="Liste Görünümü"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === "grid" ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
            }`}
            title="Izgara Görünümü"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* CONTENT PRESENTATION */}
      {viewMode === "list" ? (
        /* VERCEL DATA TABLE */
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-950/80 font-mono uppercase text-zinc-400">
              <tr>
                <th className="py-3.5 px-5">İçerik Başlığı & Key</th>
                <th className="py-3.5 px-5">Dil</th>
                <th className="py-3.5 px-5">Kategori</th>
                <th className="py-3.5 px-5">Durum</th>
                <th className="py-3.5 px-5 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium">
              {filteredContents.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-900/80 transition-colors group">
                  <td className="py-4 px-5">
                    <div className="font-semibold text-zinc-100 text-sm group-hover:text-white">
                      {item.title}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 mt-0.5 flex items-center gap-1.5">
                      <span className="text-zinc-500">key:</span>
                      <code className="bg-zinc-950 px-1.5 py-0.5 rounded text-zinc-300 border border-zinc-800">
                        {item.key}
                      </code>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs font-mono font-semibold text-zinc-200">
                      <Globe2 className="h-3.5 w-3.5 text-zinc-400" />
                      {item.lang}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-zinc-300">
                    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-1 text-zinc-400 border border-zinc-800">
                      <Layers className="h-3 w-3 text-zinc-500" />
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    {item.status === "PUBLISHED" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Yayında
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        Taslak
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5 text-zinc-400" />
                        <span>Düzenle</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-900/30 bg-rose-950/20 px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-900/30 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* VERCEL CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContents.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                    <Globe2 className="h-3 w-3" />
                    {item.lang}
                  </span>
                  {item.status === "PUBLISHED" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Yayında
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400">
                      Taslak
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-zinc-100 text-sm group-hover:text-white leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                  {item.content}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span className="truncate max-w-[150px]">key: {item.key}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DRAWER COMPONENT INTEGRATION */}
      <VercelCmsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveEntry}
        initialData={editingEntry}
      />
    </div>
  );
};
