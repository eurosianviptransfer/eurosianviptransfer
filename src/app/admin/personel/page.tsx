"use client";

import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
  Edit3,
  Power,
  KeyRound,
  Users,
  FileText,
  AlertTriangle,
  RefreshCw,
  Phone,
  Mail,
  Car,
  X,
  Check,
  Copy,
} from "lucide-react";

interface Application {
  id: string;
  appType: "DRIVER" | "GREETER";
  applicationNo: string;
  fullName: string;
  phone: string;
  email: string | null;
  city: string;
  vehiclePlate: string | null;
  vehicleModel: string | null;
  vehicleSize: string | null;
  experienceYears: number | null;
  languages: string[];
  notes: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  createdAt: string;
}

interface StaffUser {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: "DRIVER" | "GREETER";
  active: boolean;
  deactivationReason: string | null;
  supplierName: string | null;
  createdAt: string;
  lastSeen: string | null;
  vehicle: {
    id: string;
    plate: string;
    model: string;
    size: string;
  } | null;
}

export default function PersonelPage() {
  const [activeTab, setActiveTab] = useState<"staff" | "applications">("staff");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [staff, setStaff] = useState<StaffUser[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "DRIVER" | "GREETER">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [appStatusFilter, setAppStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");

  // Modals state
  const [editUserModal, setEditUserModal] = useState<StaffUser | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", phone: "", email: "", supplierName: "" });

  const [deactivateModal, setDeactivateModal] = useState<StaffUser | null>(null);
  const [deactivationReasonInput, setDeactivationReasonInput] = useState("");

  const [rejectAppModal, setRejectAppModal] = useState<Application | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");

  const [tempPasswordModal, setTempPasswordModal] = useState<{
    userName: string;
    phone: string;
    tempPassword: string;
    whatsappMessage?: string;
  } | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Fetch data
  async function loadData() {
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/personel");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Veriler yüklenirken hata oluştu.");
      }
      setApplications(data.applications || []);
      setStaff(data.staff || []);
    } catch (err: any) {
      console.error("Data load error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Filtered lists
  const filteredStaff = staff.filter((user) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      user.name.toLowerCase().includes(q) ||
      user.phone.includes(q) ||
      (user.email && user.email.toLowerCase().includes(q)) ||
      (user.vehicle && user.vehicle.plate.toLowerCase().includes(q));

    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && user.active) ||
      (statusFilter === "INACTIVE" && !user.active);

    return matchesQuery && matchesRole && matchesStatus;
  });

  const filteredApps = applications.filter((app) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      app.fullName.toLowerCase().includes(q) ||
      app.phone.includes(q) ||
      (app.email && app.email.toLowerCase().includes(q)) ||
      (app.vehiclePlate && app.vehiclePlate.toLowerCase().includes(q));

    const matchesRole = roleFilter === "ALL" || app.appType === roleFilter;
    const matchesStatus = appStatusFilter === "ALL" || app.status === appStatusFilter;

    return matchesQuery && matchesRole && matchesStatus;
  });

  // Action: Toggle Staff Active / Inactive
  async function handleToggleActive(user: StaffUser, newActiveState: boolean) {
    if (!newActiveState && !deactivationReasonInput.trim()) {
      alert("Lütfen bir pasife alma nedeni giriniz.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/personel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle-active",
          userId: user.id,
          active: newActiveState,
          deactivationReason: deactivationReasonInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "İşlem başarısız.");

      setActionSuccess(data.message);
      setDeactivateModal(null);
      setDeactivationReasonInput("");
      await loadData();
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setActionLoading(false);
    }
  }

  // Action: Edit Staff Info
  async function handleSaveEditInfo() {
    if (!editUserModal) return;
    if (!editFormData.name.trim() || !editFormData.phone.trim()) {
      alert("Ad Soyad ve Telefon zorunludur.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/personel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-info",
          userId: editUserModal.id,
          name: editFormData.name,
          phone: editFormData.phone,
          email: editFormData.email,
          supplierName: editFormData.supplierName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Güncelleme başarısız.");

      setActionSuccess("Personel bilgileri başarıyla güncellendi.");
      setEditUserModal(null);
      await loadData();
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setActionLoading(false);
    }
  }

  // Action: Reset Password
  async function handleResetPassword(user: StaffUser) {
    if (!confirm(`${user.name} kullanıcısının şifresini sıfırlamak istediğinize emin misiniz?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/personel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset-password",
          userId: user.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Şifre sıfırlama başarısız.");

      setTempPasswordModal({
        userName: user.name,
        phone: user.phone,
        tempPassword: data.tempPassword,
      });
      await loadData();
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setActionLoading(false);
    }
  }

  // Action: Approve Application
  async function handleApproveApplication(app: Application) {
    if (!confirm(`${app.fullName} isimli adayın başvurusunu onaylayıp sistem kullanıcısı oluşturmak istiyor musunuz?`)) {
      return;
    }

    setActionLoading(true);
    const endpoint =
      app.appType === "DRIVER"
        ? `/api/driver-applications/${app.id}`
        : `/api/greeter-applications/${app.id}`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Onaylama işlemi başarısız.");

      setTempPasswordModal({
        userName: app.fullName,
        phone: app.phone,
        tempPassword: data.temporaryPassword,
        whatsappMessage: data.application?.whatsappMessage,
      });
      setActionSuccess("Başvuru başarıyla onaylandı ve personel hesabı oluşturuldu.");
      await loadData();
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setActionLoading(false);
    }
  }

  // Action: Reject Application
  async function handleRejectApplication() {
    if (!rejectAppModal) return;

    setActionLoading(true);
    const endpoint =
      rejectAppModal.appType === "DRIVER"
        ? `/api/driver-applications/${rejectAppModal.id}`
        : `/api/greeter-applications/${rejectAppModal.id}`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          rejectionReason: rejectionReasonInput || "Başvuru şartları karşılanmadı.",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reddetme işlemi başarısız.");

      setActionSuccess("Başvuru reddedildi.");
      setRejectAppModal(null);
      setRejectionReasonInput("");
      await loadData();
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <UserCheck className="h-6 w-6" />
            </div>
            Personel & Başvuru Yönetimi
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            VIP sürücü ve karşılama personelinizin hesap durumlarını, pasife alma sebeplerini ve iş başvurularını tek merkezden yönetin.
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            loadData();
          }}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin text-amber-400" : ""}`} />
          {refreshing ? "Yenileniyor..." : "Verileri Yenile"}
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-semibold">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button type="button" onClick={() => setActionSuccess(null)} className="text-emerald-400 hover:text-white cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-semibold">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError(null)} className="text-rose-400 hover:text-white cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab("staff")}
          className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "staff"
              ? "border-amber-400 text-amber-400 bg-amber-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Users className="h-4 w-4" />
          Mevcut Ekip & Personel ({staff.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("applications")}
          className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all relative cursor-pointer ${
            activeTab === "applications"
              ? "border-amber-400 text-amber-400 bg-amber-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <FileText className="h-4 w-4" />
          İş Başvuruları ({applications.length})
          {applications.filter((a) => a.status === "PENDING").length > 0 && (
            <span className="ml-1.5 px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-500 text-slate-950">
              {applications.filter((a) => a.status === "PENDING").length} Yeni
            </span>
          )}
        </button>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="İsim, telefon veya plaka ile ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400 whitespace-nowrap">Pozisyon:</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Tüm Pozisyonlar</option>
            <option value="DRIVER">VIP Sürücü (Şoför)</option>
            <option value="GREETER">Karşılamacı</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400 whitespace-nowrap">Durum:</label>
          {activeTab === "staff" ? (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">Tüm Durumlar</option>
              <option value="ACTIVE">Sadece Aktif Hesabı Olanlar</option>
              <option value="INACTIVE">Sadece Pasife Alınanlar</option>
            </select>
          ) : (
            <select
              value={appStatusFilter}
              onChange={(e) => setAppStatusFilter(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">Tüm Başvurular</option>
              <option value="PENDING">Bekleyen Başvurular</option>
              <option value="APPROVED">Onaylanan Başvurular</option>
              <option value="REJECTED">Reddedilen Başvurular</option>
            </select>
          )}
        </div>
      </div>

      {/* CONTENT TAB 1: MEVCUT EKİP & PERSONEL */}
      {activeTab === "staff" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
              <RefreshCw className="h-8 w-8 animate-spin text-amber-400" />
              <span>Personel verileri yükleniyor...</span>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              Arama ve filtre kriterlerinize uygun personel bulunamadı.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-5">Personel / Rol</th>
                    <th className="py-4 px-5">İletişim</th>
                    <th className="py-4 px-5">Atanan Araç</th>
                    <th className="py-4 px-5">Hesap Durumu</th>
                    <th className="py-4 px-5">Pasiflik Nedeni (Gerekçe)</th>
                    <th className="py-4 px-5 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredStaff.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            u.role === "DRIVER" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}>
                            {u.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{u.name}</div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase inline-block mt-0.5 ${
                              u.role === "DRIVER" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            }`}>
                              {u.role === "DRIVER" ? "VIP Sürücü" : "Karşılamacı"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5 font-mono text-slate-200">
                          <Phone className="h-3 w-3 text-slate-500" />
                          {u.phone}
                        </div>
                        {u.email && (
                          <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                            <Mail className="h-3 w-3 text-slate-500" />
                            {u.email}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-5 text-xs">
                        {u.vehicle ? (
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-amber-400" />
                            <div>
                              <div className="font-bold font-mono text-amber-300">{u.vehicle.plate}</div>
                              <div className="text-[11px] text-slate-400">{u.vehicle.model}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs italic">Araç Atanmadı</span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        {u.active ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400 border border-rose-500/30">
                            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                            Pasif
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-xs max-w-xs">
                        {!u.active ? (
                          <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-900/50 text-rose-300">
                            <div className="font-bold text-[10px] uppercase text-rose-400 mb-0.5">Pasiflik Nedeni:</div>
                            <p className="line-clamp-2">{u.deactivationReason || "Nedeni belirtilmedi."}</p>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs">-</span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setEditUserModal(u);
                              setEditFormData({
                                name: u.name,
                                phone: u.phone,
                                email: u.email || "",
                                supplierName: u.supplierName || "",
                              });
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-amber-400" /> Düzenle
                          </button>

                          {/* Reset Password */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleResetPassword(u);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
                          >
                            <KeyRound className="h-3.5 w-3.5" /> Şifre Yenile
                          </button>

                          {/* Active / Deactivate toggle button */}
                          {u.active ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeactivateModal(u);
                                setDeactivationReasonInput(u.deactivationReason || "");
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                            >
                              <Power className="h-3.5 w-3.5" /> Pasife Al
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleToggleActive(u, true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" /> Aktifleştir
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CONTENT TAB 2: İŞ BAŞVURULARI */}
      {activeTab === "applications" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
              <RefreshCw className="h-8 w-8 animate-spin text-amber-400" />
              <span>Başvurular yükleniyor...</span>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              Arama ve filtre kriterlerinize uygun başvuru bulunamadı.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-5">Pozisyon / Aday</th>
                    <th className="py-4 px-5">İletişim</th>
                    <th className="py-4 px-5">Araç & Deneyim</th>
                    <th className="py-4 px-5">Başvuru Tarihi</th>
                    <th className="py-4 px-5">Durum</th>
                    <th className="py-4 px-5 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredApps.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                              a.appType === "DRIVER"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            }`}
                          >
                            {a.appType === "DRIVER" ? "VIP Sürücü" : "Karşılamacı"}
                          </span>
                          <span className="font-bold text-white text-sm">{a.fullName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-mono">{a.applicationNo}</div>
                      </td>
                      <td className="py-4 px-5 text-xs text-slate-300">
                        <div className="font-mono">{a.phone}</div>
                        <div className="text-slate-500">{a.email || "-"}</div>
                      </td>
                      <td className="py-4 px-5 text-xs text-slate-300">
                        {a.appType === "DRIVER" ? (
                          <div>
                            <div className="font-bold text-amber-300 font-mono">{a.vehiclePlate}</div>
                            <div className="text-slate-400">{a.vehicleModel}</div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-bold text-emerald-400">{a.experienceYears} Yıl Deneyim</div>
                            <div className="text-slate-400">{a.city}</div>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-5 text-xs text-slate-400">
                        {new Date(a.createdAt).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-5">
                        {a.status === "APPROVED" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Onaylandı
                          </span>
                        )}
                        {a.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
                            <Clock3 className="h-3.5 w-3.5 animate-spin" /> İncelemede
                          </span>
                        )}
                        {a.status === "REJECTED" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-400 border border-rose-500/20">
                            <XCircle className="h-3.5 w-3.5" /> Reddedildi
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        {a.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleApproveApplication(a);
                              }}
                              disabled={actionLoading}
                              className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="h-3.5 w-3.5" /> Onayla
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setRejectAppModal(a);
                                setRejectionReasonInput("");
                              }}
                              disabled={actionLoading}
                              className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" /> Reddet
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">İşlem Tamamlandı</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: EDIT STAFF USER INFO */}
      {editUserModal && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-amber-400" /> Personel Bilgilerini Düzenle
              </h3>
              <button type="button" onClick={() => setEditUserModal(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Telefon Numarası</label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">E-Posta Adresi</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Tedarikçi / Alt Şirket Adı</label>
                <input
                  type="text"
                  placeholder="Örn: Özgür VIP Transfer"
                  value={editFormData.supplierName}
                  onChange={(e) => setEditFormData({ ...editFormData, supplierName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditUserModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleSaveEditInfo}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-amber-500 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {actionLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DEACTIVATE STAFF (PASİFE ALMA GEREKÇESİ) */}
      {deactivateModal && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-900/50 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2">
                <Power className="h-5 w-5 text-rose-400" /> Personel Hesabını Pasife Al
              </h3>
              <button type="button" onClick={() => setDeactivateModal(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                <strong className="text-white">{deactivateModal.name}</strong> isimli personelin hesabını pasife almak üzeresiniz. Personel giriş yapmaya çalıştığında aşağıda gireceğiniz nedeni görecektir.
              </p>

              <div>
                <label className="block text-xs font-semibold text-amber-400 mb-1.5">
                  Pasife Alma Nedeni (Personel Girişte Görecektir):
                </label>
                <textarea
                  rows={3}
                  placeholder="Örn: Evrak eksikliği (Ehliyet/SRC süresi doldu). Lütfen ik departmanı ile iletişime geçiniz."
                  value={deactivationReasonInput}
                  onChange={(e) => setDeactivationReasonInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeactivateModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => handleToggleActive(deactivateModal, false)}
                disabled={actionLoading || !deactivationReasonInput.trim()}
                className="px-4 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-500 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {actionLoading ? "İşleniyor..." : "Hesabı Pasife Al"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REJECT APPLICATION REASON */}
      {rejectAppModal && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2">
                <XCircle className="h-5 w-5" /> Başvuruyu Reddet
              </h3>
              <button type="button" onClick={() => setRejectAppModal(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                <strong className="text-white">{rejectAppModal.fullName}</strong> isimli adayın başvurusunu reddediyorsunuz.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Reddetme Açıklaması:</label>
                <textarea
                  rows={3}
                  placeholder="Örn: Araç model yılı kriterleri karşılamıyor."
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRejectAppModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleRejectApplication}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-500 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {actionLoading ? "İşleniyor..." : "Başvuruyu Reddet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: TEMP PASSWORD & WHATSAPP NOTIFICATION */}
      {tempPasswordModal && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                <KeyRound className="h-5 w-5" /> Geçici Giriş Şifresi Üretildi
              </h3>
              <button type="button" onClick={() => setTempPasswordModal(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                Lütfen bu şifreyi personele iletiniz. Güvenlik nedeniyle şifre tekrar görüntülenemeyebilir.
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">Giriş Telefonu:</div>
                  <div className="font-mono text-sm text-white font-bold">{tempPasswordModal.phone}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">Geçici Şifre:</div>
                  <div className="font-mono text-base text-amber-400 font-black">{tempPasswordModal.tempPassword}</div>
                </div>
              </div>

              {tempPasswordModal.whatsappMessage && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    WhatsApp Bilgilendirme Mesajı:
                  </label>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono whitespace-pre-wrap relative">
                    {tempPasswordModal.whatsappMessage}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    tempPasswordModal.whatsappMessage ||
                      `Giriş: ${tempPasswordModal.phone}\nŞifre: ${tempPasswordModal.tempPassword}`
                  );
                  alert("Giriş bilgileri panoya kopyalandı!");
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" /> Bilgileri Kopyala
              </button>

              <button
                type="button"
                onClick={() => setTempPasswordModal(null)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-xs font-bold text-slate-950 hover:bg-amber-400 cursor-pointer"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
