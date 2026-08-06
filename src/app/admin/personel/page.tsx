"use client";

import React, { useState } from "react";
import { UserCheck, Phone, Mail, FileText, CheckCircle2, XCircle, Clock3 } from "lucide-react";

interface Application {
  id: string;
  type: "SOFOR" | "KARSILAMACI";
  fullName: string;
  phone: string;
  email: string;
  city: string;
  experienceYears: number;
  languages: string[];
  appliedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const mockApplications: Application[] = [
  {
    id: "1",
    type: "SOFOR",
    fullName: "Kadir Şahin",
    phone: "+90 533 111 2233",
    email: "kadir.sahin@gmail.com",
    city: "İstanbul",
    experienceYears: 8,
    languages: ["Türkçe", "İngilizce (B2)", "Arapça (A2)"],
    appliedAt: "05 Ağu 2026",
    status: "PENDING",
  },
  {
    id: "2",
    type: "KARSILAMACI",
    fullName: "Elena Rostova",
    phone: "+90 534 999 8877",
    email: "elena.r@vip-greeter.com",
    city: "İstanbul Havalimanı (IST)",
    experienceYears: 4,
    languages: ["Rusça (Ana Dil)", "İngilizce (C1)", "Türkçe (B2)"],
    appliedAt: "04 Ağu 2026",
    status: "APPROVED",
  },
];

export default function PersonelPage() {
  const [apps] = useState<Application[]>(mockApplications);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <UserCheck className="h-7 w-7 text-amber-400" />
            Şoför & Karşılamacı Personel Başvuruları
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            VIP araç sürücülerinizin ve havalimanı karşılama personelinizin iş başvurularını değerlendirin ve onaylayın.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-4 px-5">Pozisyon / Ad Soyad</th>
                <th className="py-4 px-5">İletişim</th>
                <th className="py-4 px-5">Deneyim & Şehir</th>
                <th className="py-4 px-5">Bildiği Diller</th>
                <th className="py-4 px-5">Başvuru Tarihi</th>
                <th className="py-4 px-5">Durum</th>
                <th className="py-4 px-5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {apps.map((a) => (
                <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        a.type === "SOFOR" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}>
                        {a.type === "SOFOR" ? "VIP Sürücü" : "Karşılamacı"}
                      </span>
                      <span className="font-bold text-white text-sm">{a.fullName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-xs text-slate-300">
                    <div>{a.phone}</div>
                    <div className="text-slate-500">{a.email}</div>
                  </td>
                  <td className="py-4 px-5 text-xs text-slate-300">
                    <div className="font-bold">{a.experienceYears} Yıl Deneyim</div>
                    <div className="text-slate-400">{a.city}</div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex flex-wrap gap-1">
                      {a.languages.map((l, i) => (
                        <span key={i} className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                          {l}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-5 text-xs text-slate-400">{a.appliedAt}</td>
                  <td className="py-4 px-5">
                    {a.status === "APPROVED" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Onaylandı
                      </span>
                    )}
                    {a.status === "PENDING" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
                        <Clock3 className="h-3.5 w-3.5 animate-spin" /> İncelemede
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20">
                        Onayla
                      </button>
                      <button className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 text-xs font-bold text-rose-400 hover:bg-rose-500/20">
                        Reddet
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
