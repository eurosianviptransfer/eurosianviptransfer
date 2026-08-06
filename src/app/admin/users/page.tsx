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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Users className="h-7 w-7 text-amber-400" />
            Yöneticiler & Kullanıcı Yetkileri
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Admin paneline erişimi olan yöneticileri ve rol yetkilerini düzenleyin.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all">
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Yeni Yönetici Davet Et</span>
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-4 px-5">Yönetici Adı</th>
                <th className="py-4 px-5">E-Posta Adresi</th>
                <th className="py-4 px-5">Erişim Rolü</th>
                <th className="py-4 px-5">Kayıt Tarihi</th>
                <th className="py-4 px-5">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-5 font-bold text-white flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                      {u.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="py-4 px-5 text-xs text-slate-300">{u.email}</td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {u.role === "SUPER_ADMIN" ? "Süper Yönetici" : "Operasyon Yöneticisi"}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-xs text-slate-400">{u.createdAt}</td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
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
