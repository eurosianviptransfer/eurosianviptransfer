"use client";

import React, { useState } from "react";
import {
  Car,
  Plus,
  Users,
  Luggage,
  ShieldCheck,
  Wrench,
  Fuel,
  CheckCircle2,
  Edit,
  Trash2
} from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  category: "VIP Minivan" | "VIP Minibüs" | "VIP Sedan" | "Ultra Luxury";
  plate: string;
  driverName: string;
  capacity: number;
  luggageCapacity: number;
  status: "ACTIVE" | "IN_TRANSFER" | "MAINTENANCE";
  basePriceEur: number;
  imageUrl: string;
}

const mockFleetData: Vehicle[] = [
  {
    id: "1",
    name: "Mercedes-Benz Vito Tourer Extra Long VIP",
    category: "VIP Minivan",
    plate: "34 VIP 8892",
    driverName: "Ahmet Yılmaz",
    capacity: 6,
    luggageCapacity: 6,
    status: "IN_TRANSFER",
    basePriceEur: 140,
    imageUrl: "/media-library/vito-vip.jpg",
  },
  {
    id: "2",
    name: "Mercedes-Benz Sprinter Executive VIP",
    category: "VIP Minibüs",
    plate: "34 VIP 1042",
    driverName: "Mustafa Demir",
    capacity: 12,
    luggageCapacity: 12,
    status: "ACTIVE",
    basePriceEur: 280,
    imageUrl: "/media-library/sprinter-vip.jpg",
  },
  {
    id: "3",
    name: "Mercedes-Maybach S 580 4MATIC",
    category: "Ultra Luxury",
    plate: "34 VIP 0001",
    driverName: "Cengiz Özkan",
    capacity: 3,
    luggageCapacity: 3,
    status: "ACTIVE",
    basePriceEur: 450,
    imageUrl: "/media-library/maybach.jpg",
  },
  {
    id: "4",
    name: "Mercedes-Benz E 300 d AMG Line",
    category: "VIP Sedan",
    plate: "34 VIP 3409",
    driverName: "Emre Kaya",
    capacity: 3,
    luggageCapacity: 3,
    status: "MAINTENANCE",
    basePriceEur: 180,
    imageUrl: "/media-library/e-class.jpg",
  },
];

export default function FiloPage() {
  const [vehicles] = useState<Vehicle[]>(mockFleetData);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Car className="h-7 w-7 text-amber-400" />
            VIP Araç Filosu Yönetimi
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            VIP transfer araçlarınızı yönetin, plaka ve sürücü atamalarını güncelleyin.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all">
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Yeni VIP Araç Ekle</span>
        </button>
      </div>

      {/* VEHICLE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md hover:border-amber-500/30 transition-all group"
          >
            {/* CAR CARD TOP */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {v.category}
                </span>
                <h3 className="text-base font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">
                  {v.name}
                </h3>
              </div>

              {v.status === "ACTIVE" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" /> Müsait
                </span>
              )}
              {v.status === "IN_TRANSFER" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-400 border border-blue-500/20 animate-pulse">
                  <Car className="h-3 w-3" /> Görevde
                </span>
              )}
              {v.status === "MAINTENANCE" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-400 border border-rose-500/20">
                  <Wrench className="h-3 w-3" /> Bakımda
                </span>
              )}
            </div>

            {/* DETAILS */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Plaka:</span>
                <span className="font-mono font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {v.plate}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Atanan Sürücü:</span>
                <span className="font-bold text-slate-200">{v.driverName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Kapasite:</span>
                <span className="flex items-center gap-2 font-semibold">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-amber-400" /> {v.capacity} Yolcu</span>
                  <span className="flex items-center gap-1"><Luggage className="h-3.5 w-3.5 text-amber-400" /> {v.luggageCapacity} Bagaj</span>
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-400">Taban Fiyat Tarifesi:</span>
                <span className="text-base font-black text-amber-400">€{v.basePriceEur} / Transfer</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <button className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1">
                <Edit className="h-3.5 w-3.5" /> Düzenle
              </button>
              <button className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1">
                <Trash2 className="h-3.5 w-3.5" /> Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
