"use client";

import React, { useState } from "react";
import { Users, Plus, ShieldCheck, Mail, KeyRound, CheckCircle2 } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "DISPATCHER" | "CONTENT_MANAGER";
  createdAt: string;
  status: "ACTIVE" | "INACTIVE";
}

const mockUsers: AdminUser[] = [
  {
    id: "1",
    name: "Şenol Kehya",
    email: "senol@eurosiaviptransfer.com",
    role: "SUPER_ADMIN",
    createdAt: "01 Oca 2026",
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "Operasyon Yetkilisi",
    email: "operasyon@eurosiaviptransfer.com",
    role: "DISPATCHER",
    createdAt: "15 Şub 2026",
    status: "ACTIVE",
  },
];

export default function UsersPage() {
  const [users] = useState<AdminUser[]>(mockUsers);

  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-3xl border border-slate-800 bg-[linear-gradient(135deg,rgba(8,16,31,0.96),rgba(15,23,42,0.96))] p-5 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Erişim yönetimi
            </div>
            <h1 className="mt-3 flex items-center gap-2.5 text-2xl font-black tracking-tight text-white">
              <Users className="h-7 w-7 text-amber-400" />
              Yöneticiler & Kullanıcı Yetkileri
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Admin paneline erişimi olan yöneticileri ve rol yetkilerini düzenleyin.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-105">
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Yeni Yönetici Davet Et</span>
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Toplam kullanıcı</p>
            <p className="mt-1 text-xl font-black text-white">{users.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Süper admin</p>
            <p className="mt-1 text-xl font-black text-white">{users.filter((u) => u.role === "SUPER_ADMIN").length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Aktif hesap</p>
            <p className="mt-1 text-xl font-black text-white">{users.filter((u) => u.status === "ACTIVE").length}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-4">Yönetici Adı</th>
                <th className="px-5 py-4">E-Posta Adresi</th>
                <th className="px-5 py-4">Erişim Rolü</th>
                <th className="px-5 py-4">Kayıt Tarihi</th>
                <th className="px-5 py-4">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-slate-800/40">
                  <td className="flex items-center gap-2 px-5 py-4 font-bold text-white">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-xs font-bold text-amber-400">
                      {u.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-300">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {u.role === "SUPER_ADMIN" ? "Süper Yönetici" : "Operasyon Yöneticisi"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-400">{u.createdAt}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Aktif
                    </span>
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
