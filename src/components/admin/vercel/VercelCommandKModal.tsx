"use client";

import React, { useEffect, useState } from "react";
import { Search, X, FileText, CalendarCheck, Car, Users, Settings, ArrowRight, ShieldCheck, CornerDownLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface VercelCommandKModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelCommandKModal: React.FC<VercelCommandKModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const searchItems = [
    { title: "Genel Bakış & İstatistikler", category: "Dashboard", href: "/admin/dashboard", icon: FileText },
    { title: "CMS Sayfa İçerikleri (TR / EN)", category: "İçerik Yönetimi", href: "/admin/cms/content", icon: FileText },
    { title: "Medya ve Görsel Kütüphanesi", category: "İçerik Yönetimi", href: "/admin/cms/media", icon: FileText },
    { title: "Rezervasyon Listesi ve Talepler", category: "Operasyon", href: "/admin/rezervasyonlar", icon: CalendarCheck },
    { title: "VIP Araç Filosu (Sprinter, Maybach, Vito)", category: "Filo", href: "/admin/filo", icon: Car },
    { title: "Sürücüler ve Ekip Yönetimi", category: "Personel", href: "/admin/personel", icon: Users },
    { title: "Bölge & Transfer Fiyatlandırması", category: "Fiyatlandırma", href: "/admin/fiyatlandirma", icon: Settings },
  ];

  const filteredItems = searchItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered from parent or button
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl transition-all">
        {/* Input Header */}
        <div className="flex items-center border-b border-zinc-800 px-4 py-3.5">
          <Search className="h-5 w-5 shrink-0 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Arama yapın veya bir komut yazın (örn: CMS, Filo, Rezervasyon)..."
            className="w-full bg-transparent px-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-700">
            ESC
          </kbd>
          <button onClick={onClose} className="ml-2 rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">
              Aramanıza uygun sonuç bulunamadı.
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                Hızlı Erişim Menüsü ({filteredItems.length})
              </div>
              {filteredItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      router.push(item.href);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 group-hover:border-zinc-700 group-hover:text-zinc-100 transition-all">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-200 group-hover:text-white">{item.title}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{item.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 text-[10px] font-mono">
                      <span>Aç</span>
                      <CornerDownLeft className="h-3 w-3" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900/50 px-4 py-2 text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px]">↑↓</kbd> Gezin
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px]">↵</kbd> Seç
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 font-sans font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Vercel Geist Command Center</span>
          </div>
        </div>
      </div>
    </div>
  );
};
