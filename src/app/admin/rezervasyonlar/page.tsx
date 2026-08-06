"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CalendarCheck,
  Search,
  Filter,
  Download,
  Plus,
  Car,
  CheckCircle2,
  Clock3,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  X,
  Save,
  Check,
  AlertTriangle,
  User,
  ShieldCheck,
  DollarSign
} from "lucide-react";

interface Booking {
  id: string;
  pnrCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupLocation: string;
  dropoffLocation: string;
  vehicleType: string;
  date: string;
  time: string;
  passengers: number;
  luggage: number;
  amount: string;
  paymentStatus: "PAID" | "PENDING_CASH" | "FAILED";
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED";
}

const mockBookingsData: Booking[] = [
  {
    id: "1",
    pnrCode: "EV-8921",
    customerName: "Alexander Wright",
    customerPhone: "+44 7700 900077",
    customerEmail: "alex.w@vip-client.co.uk",
    pickupLocation: "İstanbul Havalimanı (IST) - Dış Hatlar C Çıkışı",
    dropoffLocation: "Çırağan Palace Kempinski",
    vehicleType: "Mercedes Vito VIP Extra",
    date: "06 Ağu 2026",
    time: "14:30",
    passengers: 4,
    luggage: 4,
    amount: "€140",
    paymentStatus: "PAID",
    status: "CONFIRMED",
  },
  {
    id: "2",
    pnrCode: "EV-8922",
    customerName: "Dr. Mehmet Yılmaz",
    customerPhone: "+90 532 555 0199",
    customerEmail: "mehmet.yilmaz@medholding.com",
    pickupLocation: "Sabiha Gökçen (SAW) Havalimanı",
    dropoffLocation: "Bodrum Yalıkavak VIP Marina",
    vehicleType: "Mercedes Sprinter VIP (10 Kişi)",
    date: "06 Ağu 2026",
    time: "16:00",
    passengers: 8,
    luggage: 8,
    amount: "€650",
    paymentStatus: "PENDING_CASH",
    status: "PENDING",
  },
  {
    id: "3",
    pnrCode: "EV-8920",
    customerName: "Sarah Jenkins",
    customerPhone: "+1 202 555 0143",
    customerEmail: "s.jenkins@diplomatic.us",
    pickupLocation: "Four Seasons Hotel Bosphorus",
    dropoffLocation: "İstanbul Havalimanı (IST)",
    vehicleType: "Maybach S-Class VIP",
    date: "06 Ağu 2026",
    time: "11:15",
    passengers: 2,
    luggage: 2,
    amount: "€320",
    paymentStatus: "PAID",
    status: "COMPLETED",
  },
  {
    id: "4",
    pnrCode: "EV-8919",
    customerName: "Khaled Al-Mansoor",
    customerPhone: "+971 50 123 4567",
    customerEmail: "k.almansoor@emiratesgroup.ae",
    pickupLocation: "Galataport VIP Kruvaziyer Limanı",
    dropoffLocation: "Sapanca Swissôtel Resort",
    vehicleType: "Mercedes Vito VIP Extra",
    date: "05 Ağu 2026",
    time: "19:00",
    passengers: 5,
    luggage: 5,
    amount: "€280",
    paymentStatus: "PAID",
    status: "COMPLETED",
  },
];

function RezervasyonlarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>(mockBookingsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modals state
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check URL query id parameter on mount
  useEffect(() => {
    const idParam = searchParams?.get("id");
    if (idParam) {
      const found = bookings.find((b) => b.id === idParam);
      if (found) {
        setEditingBooking(found);
      }
    }
  }, [searchParams, bookings]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === editingBooking.id ? editingBooking : b))
    );
    showNotification(`${editingBooking.pnrCode} numaralı rezervasyon başarıyla güncellendi!`);
    setEditingBooking(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingBooking) return;
    setBookings((prev) => prev.filter((b) => b.id !== deletingBooking.id));
    showNotification(`${deletingBooking.pnrCode} numaralı rezervasyon silindi.`);
    setDeletingBooking(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = (bookings.length + 1).toString();
    const newPnr = `EV-${Math.floor(8000 + Math.random() * 1000)}`;
    const newBooking: Booking = {
      id: newId,
      pnrCode: newPnr,
      customerName: "Yeni VIP Müşteri",
      customerPhone: "+90 532 111 22 33",
      customerEmail: "musteri@vip.com",
      pickupLocation: "İstanbul Havalimanı (IST)",
      dropoffLocation: "Beşiktaş VIP Otel",
      vehicleType: "Mercedes Vito VIP Extra",
      date: "07 Ağu 2026",
      time: "12:00",
      passengers: 3,
      luggage: 3,
      amount: "€150",
      paymentStatus: "PENDING_CASH",
      status: "CONFIRMED",
    };
    setBookings([newBooking, ...bookings]);
    showNotification(`${newPnr} yeni manuel rezervasyon başarıyla eklendi!`);
    setIsAddModalOpen(false);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.pnrCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-emerald-500/90 text-slate-950 px-5 py-3 font-bold text-xs shadow-2xl backdrop-blur-md animate-bounce">
          <CheckCircle2 className="h-5 w-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <CalendarCheck className="h-7 w-7 text-amber-400" />
            VIP Transfer Rezervasyonları
          </h1>
          <p className="text-xs font-semibold text-slate-300 mt-1">
            Tüm transfer taleplerini yönetin, durumlarını güncelleyin ve detaylı işlemler gerçekleştirin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => showNotification("Rezervasyon listesi Excel (CSV) formatında indirildi.")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <Download className="h-4 w-4 text-amber-400" />
            <span>Excel'e Aktar</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Manuel Rezervasyon Ekle</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* SEARCH */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="PNR kodu, Müşteri adı veya Konum ile arayın..."
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-amber-400" />
        </div>

        {/* STATUS TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {[
            { label: "Tümü", value: "ALL" },
            { label: "Onaylananlar", value: "CONFIRMED" },
            { label: "Bekleyenler", value: "PENDING" },
            { label: "Tamamlananlar", value: "COMPLETED" },
            { label: "İptaller", value: "CANCELLED" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                statusFilter === tab.value
                  ? "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-amber-500/20 shadow-md scale-105"
                  : "bg-slate-950 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-200">
            <thead className="bg-slate-950 text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800">
              <tr>
                <th className="py-4 px-5">PNR / Müşteri</th>
                <th className="py-4 px-5">Transfer Güzergahı</th>
                <th className="py-4 px-5">Araç & Kapasite</th>
                <th className="py-4 px-5">Tarih / Saat</th>
                <th className="py-4 px-5">Ücret & Ödeme</th>
                <th className="py-4 px-5">Durum</th>
                <th className="py-4 px-5 text-right">Eylemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-semibold">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                    Arama kriterlerinize uygun rezarvasyon bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30">
                          {b.pnrCode}
                        </span>
                        <span className="font-bold text-white text-sm">{b.customerName}</span>
                      </div>
                      <div className="text-xs text-slate-300 flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 font-semibold">
                          <Phone className="h-3.5 w-3.5 text-amber-400" /> {b.customerPhone}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-5 max-w-sm">
                      <div className="text-xs text-slate-100 font-bold flex items-start gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{b.pickupLocation}</span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium flex items-start gap-1.5 mt-1">
                        <span className="text-amber-400 font-bold ml-1">➔</span>
                        <span className="line-clamp-1">{b.dropoffLocation}</span>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                        <Car className="h-3.5 w-3.5 text-amber-400" />
                        <span>{b.vehicleType}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                        {b.passengers} Yolcu • {b.luggage} Bagaj
                      </div>
                    </td>

                    <td className="py-4 px-5 text-xs text-slate-200">
                      <div className="font-bold text-white">{b.date}</div>
                      <div className="text-slate-400 font-medium">{b.time}</div>
                    </td>

                    <td className="py-4 px-5">
                      <div className="font-black text-amber-400 text-base">{b.amount}</div>
                      <div className="text-[10px] font-bold mt-0.5">
                        {b.paymentStatus === "PAID" && (
                          <span className="text-emerald-400">Stripe İle Ödendi</span>
                        )}
                        {b.paymentStatus === "PENDING_CASH" && (
                          <span className="text-amber-400">Araçta Nakit Ödeme</span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      {b.status === "CONFIRMED" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 shadow-sm">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Onaylandı
                        </span>
                      )}
                      {b.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30 shadow-sm">
                          <Clock3 className="h-3.5 w-3.5 animate-spin text-amber-400" /> Beklemede
                        </span>
                      )}
                      {b.status === "COMPLETED" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-500/30 shadow-sm">
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> Tamamlandı
                        </span>
                      )}
                      {b.status === "CANCELLED" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-300 border border-rose-500/30 shadow-sm">
                          <XCircle className="h-3.5 w-3.5 text-rose-400" /> İptal Edildi
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingBooking({ ...b })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-amber-400 border border-slate-700/80 shadow-sm transition-all active:scale-95"
                        >
                          <Edit className="h-3.5 w-3.5 text-amber-400" />
                          <span>Düzenle / Detay</span>
                        </button>
                        <button
                          onClick={() => setDeletingBooking(b)}
                          className="p-1.5 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 shadow-sm transition-all active:scale-95"
                          aria-label="Rezervasyonu Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DÜZENLEME & DETAY MODALI */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl text-slate-100 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Edit className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Rezervasyon Düzenle & Detaylar
                  </h3>
                  <p className="text-xs font-semibold text-amber-400">
                    PNR: {editingBooking.pnrCode}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingBooking(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">
                    Müşteri Adı Soyadı
                  </label>
                  <input
                    type="text"
                    value={editingBooking.customerName}
                    onChange={(e) =>
                      setEditingBooking({ ...editingBooking, customerName: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">
                    Telefon Numarası
                  </label>
                  <input
                    type="text"
                    value={editingBooking.customerPhone}
                    onChange={(e) =>
                      setEditingBooking({ ...editingBooking, customerPhone: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">
                    Alış Konumu
                  </label>
                  <input
                    type="text"
                    value={editingBooking.pickupLocation}
                    onChange={(e) =>
                      setEditingBooking({ ...editingBooking, pickupLocation: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">
                    Bırakış Konumu
                  </label>
                  <input
                    type="text"
                    value={editingBooking.dropoffLocation}
                    onChange={(e) =>
                      setEditingBooking({ ...editingBooking, dropoffLocation: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">
                    Araç Tipi
                  </label>
                  <input
                    type="text"
                    value={editingBooking.vehicleType}
                    onChange={(e) =>
                      setEditingBooking({ ...editingBooking, vehicleType: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">
                    Transfer Ücreti
                  </label>
                  <input
                    type="text"
                    value={editingBooking.amount}
                    onChange={(e) =>
                      setEditingBooking({ ...editingBooking, amount: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">
                    Rezervasyon Durumu
                  </label>
                  <select
                    value={editingBooking.status}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="CONFIRMED">Onaylandı (CONFIRMED)</option>
                    <option value="PENDING">Beklemede (PENDING)</option>
                    <option value="COMPLETED">Tamamlandı (COMPLETED)</option>
                    <option value="CANCELLED">İptal Edildi (CANCELLED)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">
                    Ödeme Durumu
                  </label>
                  <select
                    value={editingBooking.paymentStatus}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        paymentStatus: e.target.value as any,
                      })
                    }
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="PAID">Stripe İle Ödendi (PAID)</option>
                    <option value="PENDING_CASH">Araçta Nakit Ödeme (PENDING_CASH)</option>
                    <option value="FAILED">Başarısız / İptal (FAILED)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                >
                  <Save className="h-4 w-4" />
                  <span>Değişiklikleri Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SİLME ONAY MODALI */}
      {deletingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-5 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Rezervasyonu Sil</h3>
              <p className="text-xs text-slate-300 mt-1">
                <strong className="text-amber-400">{deletingBooking.pnrCode}</strong> PNR kodlu{" "}
                <strong>{deletingBooking.customerName}</strong> isimli müşterinin rezervasyonunu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingBooking(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all"
              >
                Vazgeç
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-black text-white shadow-lg shadow-rose-600/30 transition-all"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUEL EKLEME MODALI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-amber-400" />
                Yeni Manuel VIP Rezervasyon Gir
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <p className="text-xs text-slate-300">
                Telefon ile gelen veya doğrudan iletilen özel VIP transfer talebini sisteme ekleyin.
              </p>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-slate-200"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/20"
                >
                  Rezervasyonu Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RezervasyonlarPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white font-bold text-center">Yükleniyor...</div>}>
      <RezervasyonlarContent />
    </Suspense>
  );
}

