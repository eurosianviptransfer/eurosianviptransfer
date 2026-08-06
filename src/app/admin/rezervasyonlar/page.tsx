"use client";

import React, { useState } from "react";
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
  MoreHorizontal,
  Edit,
  Trash2
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

export default function RezervasyonlarPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredBookings = mockBookingsData.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.pnrCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <CalendarCheck className="h-7 w-7 text-amber-400" />
            VIP Transfer Rezervasyonları
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tüm transfer taleplerini yönetin, durumlarını güncelleyin ve şoför atamalarını gerçekleştirin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-sm">
            <Download className="h-4 w-4 text-amber-400" />
            <span>Excel'e Aktar</span>
          </button>

          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all">
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
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        </div>

        {/* STATUS TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
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
              className={`rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === tab.value
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800"
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
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
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
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {b.pnrCode}
                      </span>
                      <span className="font-bold text-white text-sm">{b.customerName}</span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-500" /> {b.customerPhone}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-5 max-w-sm">
                    <div className="text-xs text-slate-200 flex items-start gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{b.pickupLocation}</span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-start gap-1.5 mt-1">
                      <span className="text-slate-600 font-bold ml-1">➔</span>
                      <span className="line-clamp-1">{b.dropoffLocation}</span>
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Car className="h-3.5 w-3.5 text-amber-400" />
                      <span>{b.vehicleType}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {b.passengers} Yolcu • {b.luggage} Bagaj
                    </div>
                  </td>

                  <td className="py-4 px-5 text-xs text-slate-200">
                    <div className="font-bold">{b.date}</div>
                    <div className="text-slate-400">{b.time}</div>
                  </td>

                  <td className="py-4 px-5">
                    <div className="font-black text-amber-400 text-sm">{b.amount}</div>
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
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Onaylandı
                      </span>
                    )}
                    {b.status === "PENDING" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
                        <Clock3 className="h-3.5 w-3.5 animate-spin" /> Beklemede
                      </span>
                    )}
                    {b.status === "COMPLETED" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-400 border border-blue-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Tamamlandı
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-amber-400 transition-all">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-all">
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
