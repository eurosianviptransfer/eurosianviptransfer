"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, CheckCircle2, AlertCircle, Car, User } from "lucide-react";

const sampleBookings = [
  {
    id: "EVT-1001",
    guestName: "Alexander Wright",
    phone: "+44 7911 123456",
    origin: "Antalya Havalimanı (AYT)",
    destination: "Rixos Premium Belek",
    date: "Bugün 21:30",
    vehicle: "Mercedes-Benz Vito VIP",
    price: "€85",
    status: "APPROVED",
    statusLabel: "Onaylandı",
  },
  {
    id: "EVT-1002",
    guestName: "Elena Rostova",
    phone: "+7 916 555 0192",
    origin: "Antalya Havalimanı (AYT)",
    destination: "Maxx Royal Kemer Resort",
    date: "Bugün 22:15",
    vehicle: "Mercedes-Benz Sprinter VIP",
    price: "€140",
    status: "ASSIGNED",
    statusLabel: "Şoför Atandı",
  },
  {
    id: "EVT-1003",
    guestName: "Marcus Weber",
    phone: "+49 171 888 4321",
    origin: "Lara Barut Collection",
    destination: "Antalya Havalimanı (AYT)",
    date: "Yarın 06:00",
    vehicle: "Maybach VIP Class",
    price: "€190",
    status: "PENDING_APPROVAL",
    statusLabel: "Onay Bekliyor",
  },
  {
    id: "EVT-1004",
    guestName: "David Miller",
    phone: "+1 202 555 0148",
    origin: "Antalya Havalimanı (AYT)",
    destination: "Regnum Carya Belek",
    date: "Yarın 10:45",
    vehicle: "Mercedes-Benz Vito VIP",
    price: "€95",
    status: "APPROVED",
    statusLabel: "Onaylandı",
  },
];

export const RecentBookingsTable: React.FC = () => {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm">
      {/* TABLE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black text-blue-600 border border-blue-200 mb-2">
            <Clock className="h-3 w-3" />
            <span>CANLI REZERVASYON AKIŞI</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight font-sans">
            Son VIP Transfer Talepleri
          </h3>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Anlık rezervasyon onayları, şoför atamaları ve karşılama durumları
          </p>
        </div>

        <Link
          href="/admin/rezervasyonlar"
          className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-xs font-black text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-xs active:scale-95"
        >
          <span>Tüm Rezervasyonları Gör</span>
          <ArrowUpRight className="h-4 w-4 stroke-[3]" />
        </Link>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block overflow-x-auto mt-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400">
              <th className="py-4 px-4">Kod / Müşteri</th>
              <th className="py-4 px-4">Güzergah</th>
              <th className="py-4 px-4">Tarih / Zaman</th>
              <th className="py-4 px-4">Araç Tipi</th>
              <th className="py-4 px-4 text-right">Tutar</th>
              <th className="py-4 px-4 text-center">Durum</th>
              <th className="py-4 px-4 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
            {sampleBookings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50 transition-colors group">
                <td className="py-4 px-4">
                  <span className="inline-block rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-600 border border-blue-200 mb-1">
                    {b.id}
                  </span>
                  <div className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>{b.guestName}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 block">{b.phone}</span>
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5 text-slate-900">
                    <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>{b.origin}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 pl-5">
                    ➔ {b.destination}
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-1.5 text-slate-700 border border-slate-200">
                    <Clock className="h-3.5 w-3.5 text-blue-600" />
                    <span>{b.date}</span>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5">
                    <Car className="h-4 w-4 text-blue-600" />
                    <span>{b.vehicle}</span>
                  </div>
                </td>

                <td className="py-4 px-4 text-right">
                  <span className="text-base font-black text-slate-900 font-sans">{b.price}</span>
                </td>

                <td className="py-4 px-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black shadow-xs ${
                      b.status === "ASSIGNED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : b.status === "APPROVED"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {b.status === "ASSIGNED" ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    <span>{b.statusLabel}</span>
                  </span>
                </td>

                <td className="py-4 px-4 text-right">
                  <Link
                    href={`/admin/rezervasyonlar`}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                  >
                    Detay
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="lg:hidden grid grid-cols-1 gap-4 mt-6">
        {sampleBookings.map((b) => (
          <div
            key={b.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-blue-50 px-2.5 py-0.5 text-xs font-black text-blue-600 border border-blue-200">
                {b.id}
              </span>
              <span className="text-base font-black text-slate-900">{b.price}</span>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900">{b.guestName}</h4>
              <p className="text-xs text-slate-500">{b.phone}</p>
            </div>

            <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-slate-200">
              <p className="text-slate-900 font-bold">📍 {b.origin}</p>
              <p className="text-slate-500">➔ {b.destination}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-600">⏰ {b.date}</span>
              <Link
                href="/admin/rezervasyonlar"
                className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-black text-white shadow-xs"
              >
                Yönet
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
