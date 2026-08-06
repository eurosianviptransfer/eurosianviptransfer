"use client";

import React from "react";
import Link from "next/link";
import {
  Car,
  Calendar,
  Clock,
  User,
  Phone,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  Clock3,
  XCircle,
  Navigation
} from "lucide-react";

export interface BookingRow {
  id: string;
  pnrCode: string;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  vehicleType: string;
  date: string;
  time: string;
  amount: string;
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED";
}

const mockBookings: BookingRow[] = [
  {
    id: "1",
    pnrCode: "EV-8921",
    customerName: "Alexander Wright",
    customerPhone: "+44 7700 900077",
    pickupLocation: "İstanbul Havalimanı (IST)",
    dropoffLocation: "Çırağan Palace Kempinski",
    vehicleType: "Mercedes Vito VIP Extra",
    date: "06 Ağu 2026",
    time: "14:30",
    amount: "€140",
    status: "CONFIRMED",
  },
  {
    id: "2",
    pnrCode: "EV-8922",
    customerName: "Dr. Mehmet Yılmaz",
    customerPhone: "+90 532 555 0199",
    pickupLocation: "Sabiha Gökçen (SAW)",
    dropoffLocation: "Bodrum VIP Marina",
    vehicleType: "Mercedes Sprinter VIP (10 Kişi)",
    date: "06 Ağu 2026",
    time: "16:00",
    amount: "€650",
    status: "PENDING",
  },
  {
    id: "3",
    pnrCode: "EV-8920",
    customerName: "Sarah Jenkins",
    customerPhone: "+1 202 555 0143",
    pickupLocation: "Four Seasons Bosphorus",
    dropoffLocation: "İstanbul Havalimanı (IST)",
    vehicleType: "Maybach S-Class VIP",
    date: "06 Ağu 2026",
    time: "11:15",
    amount: "€320",
    status: "COMPLETED",
  },
  {
    id: "4",
    pnrCode: "EV-8919",
    customerName: "Khaled Al-Mansoor",
    customerPhone: "+971 50 123 4567",
    pickupLocation: "Galataport VIP Terminal",
    dropoffLocation: "Sapanca Swissôtel Resort",
    vehicleType: "Mercedes Vito VIP Extra",
    date: "05 Ağu 2026",
    time: "19:00",
    amount: "€280",
    status: "COMPLETED",
  },
];

export const RecentBookingsTable: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Car className="h-5 w-5 text-amber-400" />
            Son VIP Transfer Rezervasyonları
          </h3>
          <p className="text-xs font-medium text-slate-300 mt-1">
            Anlık rezervasyon istekleri ve karşılama durumları
          </p>
        </div>

        <Link
          href="/admin/rezervasyonlar"
          className="flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 px-3.5 py-2 rounded-xl border border-amber-500/40 transition-all shadow-sm"
        >
          <span>Tümünü Gör</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-200">
          <thead className="bg-slate-950 text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800">
            <tr>
              <th className="py-4 px-4 rounded-l-xl">PNR / Müşteri</th>
              <th className="py-4 px-4">Rota (Nereden ➔ Nereye)</th>
              <th className="py-4 px-4">Araç Segmenti</th>
              <th className="py-4 px-4">Tarih & Saat</th>
              <th className="py-4 px-4">Tutar</th>
              <th className="py-4 px-4">Durum</th>
              <th className="py-4 px-4 rounded-r-xl text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-semibold">
            {mockBookings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-800/60 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                      {b.pnrCode}
                    </span>
                    <span>{b.customerName}</span>
                  </div>
                  <div className="text-xs text-slate-300 flex items-center gap-1 mt-1 font-normal">
                    <Phone className="h-3 w-3 text-slate-400" />
                    <span>{b.customerPhone}</span>
                  </div>
                </td>

                <td className="py-4 px-4 max-w-xs">
                  <div className="flex items-center gap-1.5 text-xs text-slate-100 font-bold truncate">
                    <Navigation className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{b.pickupLocation}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 truncate mt-1 font-medium">
                    <span className="text-amber-400 font-bold ml-1">➔</span>
                    <span className="truncate">{b.dropoffLocation}</span>
                  </div>
                </td>

                <td className="py-4 px-4 text-xs font-bold text-slate-100">
                  {b.vehicleType}
                </td>

                <td className="py-4 px-4">
                  <div className="text-xs text-slate-100 font-bold flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{b.date}</span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>{b.time}</span>
                  </div>
                </td>

                <td className="py-4 px-4 font-black text-amber-400 text-base">
                  {b.amount}
                </td>

                <td className="py-4 px-4">
                  {b.status === "CONFIRMED" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Onaylandı
                    </span>
                  )}
                  {b.status === "PENDING" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
                      <Clock3 className="h-3.5 w-3.5 animate-spin" /> Beklemede
                    </span>
                  )}
                  {b.status === "COMPLETED" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-500/30">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Tamamlandı
                    </span>
                  )}
                </td>

                <td className="py-4 px-4 text-right">
                  <button className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
