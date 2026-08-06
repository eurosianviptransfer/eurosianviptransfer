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
  LayoutGrid,
  List,
  Sparkles,
  Layers,
  Check,
  X,
  AlertCircle,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [notification, setNotification] = useState<string | null>(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CmsEntry | null>(null);

  const showFeedback = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

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
    const target = contents.find((c) => c.id === id);
    if (confirm(`"${target?.title || 'İçerik'}" silinsin mi?`)) {
      setContents((prev) => prev.filter((item) => item.id !== id));
      showFeedback("İçerik başarıyla silindi.");
    }
  };

  const handleSaveEntry = (savedEntry: CmsEntry) => {
    if (savedEntry.id) {
      // Update
      setContents((prev) => prev.map((item) => (item.id === savedEntry.id ? savedEntry : item)));
      showFeedback(`"${savedEntry.title}" güncellendi.`);
    } else {
      // Add
      const newEntry = {
        ...savedEntry,
        id: Date.now().toString(),
      };
      setContents((prev) => [newEntry, ...prev]);
      showFeedback(`"${savedEntry.title}" eklendi.`);
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
    <div className="space-y-3 font-sans text-xs">
      {/* NOTIFICATION FEEDBACK TOAST */}
      {notification && (
        <div className="flex items-center justify-between rounded-md border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <div>
          <h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            İçerik Yönetim Sistemi (CMS)
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-emerald-500/10 px-2 py-0.2 text-[9px] font-mono text-blue-700 dark:text-emerald-400 border border-blue-200 dark:border-emerald-500/20">
              {contents.length} Kayıt
            </span>
          </h1>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            Sayfa metinlerini çok dilli olarak ekleyin, düzenleyin ve yayınlayın.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1 rounded-md bg-zinc-900 dark:bg-zinc-100 px-3 py-1.5 text-[11px] font-bold text-white dark:text-zinc-950 shadow-sm hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Yeni İçerik Ekle</span>
        </button>
      </div>

      {/* FILTER & SEARCH ACTION BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-2 shadow-sm">
        <div className="flex flex-1 items-center gap-2 w-full">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2 h-3 w-3 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Başlık veya key ile ara..."
              className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 pl-7 pr-3 py-1 text-[11px] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
            />
          </div>

          {/* Lang Filter */}
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-2 py-1 text-[11px] text-zinc-700 dark:text-zinc-300 focus:border-zinc-400 focus:outline-none"
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
            className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-2 py-1 text-[11px] text-zinc-700 dark:text-zinc-300 focus:border-zinc-400 focus:outline-none hidden sm:block"
          >
            <option value="ALL">Tüm Durumlar</option>
            <option value="PUBLISHED">Yayında</option>
            <option value="DRAFT">Taslak</option>
          </select>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 border-l border-zinc-200 dark:border-zinc-800 pl-2">
          <button
            onClick={() => setViewMode("list")}
            className={`p-1 rounded text-[11px] transition-colors ${
              viewMode === "list"
                ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold"
                : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            }`}
            title="Liste Görünümü"
          >
            <List className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1 rounded text-[11px] transition-colors ${
              viewMode === "grid"
                ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold"
                : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            }`}
            title="Izgara Görünümü"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* CONTENT PRESENTATION */}
      {viewMode === "list" ? (
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 overflow-hidden shadow-sm">
          <table className="w-full text-left text-[11px]">
            <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-mono uppercase text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="py-2.5 px-3">İçerik Başlığı & Key</th>
                <th className="py-2.5 px-3">Dil</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3">Durum</th>
                <th className="py-2.5 px-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60 font-medium">
              {filteredContents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-400 text-[11px]">
                    Arama kriterlerinize uygun içerik bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredContents.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/80 transition-colors group">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs group-hover:text-blue-600 dark:group-hover:text-white">
                        {item.title}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
                        <span>key:</span>
                        <code className="bg-zinc-100 dark:bg-zinc-950 px-1 py-0.2 rounded text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                          {item.key}
                        </code>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 px-1.5 py-0.5 text-[9px] font-mono font-bold text-zinc-800 dark:text-zinc-200">
                        <Globe2 className="h-2.5 w-2.5 text-zinc-500" />
                        {item.lang}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-700 dark:text-zinc-300">
                      <span className="inline-flex items-center gap-1 rounded bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 text-[9px] text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {item.status === "PUBLISHED" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.2 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                          Yayında
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.2 text-[9px] font-bold text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          Taslak
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="inline-flex items-center gap-1 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 py-1 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 hover:text-blue-600 dark:hover:text-white transition-colors"
                        >
                          <Edit className="h-3 w-3 text-zinc-500" />
                          <span>Düzenle</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center gap-1 rounded border border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-950/20 px-2 py-1 text-[10px] font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Sil</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filteredContents.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-3 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 px-1.5 py-0.2 text-[9px] font-mono text-zinc-600 dark:text-zinc-400">
                    <Globe2 className="h-2.5 w-2.5" />
                    {item.lang}
                  </span>
                  {item.status === "PUBLISHED" ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                      <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                      Yayında
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 dark:text-amber-400">
                      Taslak
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs group-hover:text-blue-600 dark:group-hover:text-white leading-snug">
                  {item.title}
                </h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.content}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span className="truncate max-w-[120px]">key: {item.key}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1 rounded text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
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
