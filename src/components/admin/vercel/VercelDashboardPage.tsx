"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarRange,
  Car,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  Plus,
  Sparkles,
  TrendingUp,
  Users2,
  Wallet2,
} from "lucide-react";

interface OverviewData {
  totalBookings: number;
  approvedBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  paidRevenue: number;
  vehicleCount: number;
  driverCount: number;
  greeterCount: number;
}

export const VercelDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const res = await fetch("/api/admin/overview", { cache: "no-store" });
        if (!res.ok) {
          const json = await res.json().catch(() => null);
          throw new Error(json?.error || "Dashboard verileri yüklenemedi.");
        }
        const data = await res.json();
        setOverview(data);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Dashboard verileri alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    void loadOverview();
  }, []);

  const formatCurrency = (value: number) =>
    value.toLocaleString("tr-TR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  const stats = [
    {
      title: "Toplam Ciro",
      value: formatCurrency(overview?.paidRevenue ?? 482500),
      badge: "+18.4%",
      icon: <Wallet2 className="admin-icon" />,
      helper: "Nakit + Stripe",
    },
    {
      title: "Bekleyen Rezervasyon",
      value: `${overview?.pendingBookings ?? 14}`,
      badge: "Live",
      icon: <Clock3 className="admin-icon" />,
      helper: "Bugün 6 yeni talep",
    },
    {
      title: "Aktif Araç",
      value: `${overview?.vehicleCount ?? 24}`,
      badge: "%92 görevde",
      icon: <Car className="admin-icon" />,
      helper: "Vito, Sprinter, Maybach",
    },
    {
      title: "Tamamlanan Sefer",
      value: `${overview?.completedBookings ?? 1280}`,
      badge: "4.9/5",
      icon: <CheckCircle2 className="admin-icon" />,
      helper: "Kusursuz karşılama",
    },
  ];

  return (
    <div className="container-fluid p-0">
      <div className="row g-3">
        <div className="col-12">
          <div className="card admin-hero shadow-sm border-0">
            <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-start align-items-lg-center">
              <div>
                <span className="badge admin-badge mb-3">
                  <Sparkles size={14} /> Yönetim Merkezi
                </span>
                <h1 className="admin-title mb-2">Eurosian VIP Executive Dashboard</h1>
                <p className="admin-subtitle mb-0">
                  Rezervasyonlar, filo durumu ve operasyonel hızın tek ekranda görüldüğü modern bir kontrol paneli.
                </p>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <Link href="/admin/rezervasyonlar" className="btn btn-admin-primary">
                  <Plus size={16} /> Yeni Rezervasyon
                </Link>
                <Link href="/admin/operasyon" className="btn btn-admin-secondary">
                  <BarChart3 size={16} /> Canlı Operasyon
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mt-1">
        {stats.map((item) => (
          <div key={item.title} className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 admin-stat-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="admin-stat-title">{item.title}</p>
                  <h3 className="admin-stat-value">{item.value}</h3>
                </div>
                <div className="admin-stat-icon">{item.icon}</div>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="admin-helper">{item.helper}</span>
                <span className="badge admin-chip">{item.badge}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mt-1">
        <div className="col-12 col-xl-8">
          <div className="card h-100 admin-panel">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="admin-panel-title">Bugünün performansı</h2>
                <p className="admin-panel-subtitle">Bugün planlanan ve tamamlanan transferlerin akış durumu.</p>
              </div>
              <span className="badge admin-chip">{loading ? "Yükleniyor..." : "Canlı"}</span>
            </div>

            {error ? (
              <div className="alert admin-alert" role="alert">{error}</div>
            ) : (
              <>
                <div className="row g-3">
                  <div className="col-12 col-lg-6">
                    <div className="admin-progress-card">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="admin-progress-label">Onay Bekleyen</span>
                        <span className="admin-progress-value">{overview?.pendingBookings ?? 14}</span>
                      </div>
                      <div className="progress admin-progress">
                        <div className="progress-bar" style={{ width: `${Math.min(100, (overview?.pendingBookings ?? 14) * 4)}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="admin-progress-card">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="admin-progress-label">Onaylı Rezervasyon</span>
                        <span className="admin-progress-value">{overview?.approvedBookings ?? 76}</span>
                      </div>
                      <div className="progress admin-progress">
                        <div className="progress-bar progress-bar-success" style={{ width: `${Math.min(100, (overview?.approvedBookings ?? 76) * 2)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 admin-list">
                  <div className="d-flex align-items-center justify-content-between py-2 border-bottom border-white-10">
                    <div className="d-flex align-items-center gap-2">
                      <LayoutDashboard size={16} className="text-primary" />
                      <span>Operasyon odası</span>
                    </div>
                    <span className="admin-helper">12 görev aktif</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between py-2 border-bottom border-white-10">
                    <div className="d-flex align-items-center gap-2">
                      <CalendarRange size={16} className="text-primary" />
                      <span>Akşam transferleri</span>
                    </div>
                    <span className="admin-helper">08:30 / 19:40</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between py-2">
                    <div className="d-flex align-items-center gap-2">
                      <Users2 size={16} className="text-primary" />
                      <span>Yolcu ekibi güncellemesi</span>
                    </div>
                    <span className="admin-helper">Tamamlandı</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card h-100 admin-panel">
            <h2 className="admin-panel-title">Hızlı aksiyonlar</h2>
            <p className="admin-panel-subtitle">En sık kullanılan yönetim işlemleri.</p>
            <div className="d-grid gap-2">
              <Link href="/admin/rezervasyonlar" className="btn btn-admin-primary justify-content-between">
                <span>Rezervasyonları Gör</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/admin/cms/content" className="btn btn-admin-secondary justify-content-between">
                <span>CMS İçeriğini Düzenle</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/admin/operasyon" className="btn btn-admin-secondary justify-content-between">
                <span>Canlı Haritayı Aç</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-4 admin-mini-card">
              <div className="d-flex align-items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-primary" />
                <span className="admin-panel-title">Haftalık trend</span>
              </div>
              <p className="admin-helper mb-2">Son 7 günde rezervasyon hacmi %14 arttı.</p>
              <div className="progress admin-progress">
                <div className="progress-bar" style={{ width: "74%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-12">
          <div className="card admin-panel">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="admin-panel-title">Son transferler</h2>
                <p className="admin-panel-subtitle">En son güncellenen transfer kayıtları.</p>
              </div>
              <Link href="/admin/rezervasyonlar" className="btn btn-admin-secondary btn-sm">
                Tümünü Gör
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table admin-table">
                <thead>
                  <tr>
                    <th>Yolcu</th>
                    <th>Güzergah</th>
                    <th>Araç</th>
                    <th>Tarih</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="fw-semibold">Alexander Wright</div>
                      <small className="admin-helper">TK2410 • AYT T1</small>
                    </td>
                    <td>AYT → Maxx Royal Belek</td>
                    <td>Maybach VIP</td>
                    <td>08:30 • Bugün</td>
                    <td><span className="badge admin-chip">Karşılandı</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="fw-semibold">Elena Rostova</div>
                      <small className="admin-helper">SU2142 • AYT T2</small>
                    </td>
                    <td>AYT → Rixos Tekirova</td>
                    <td>Mercedes Vito</td>
                    <td>19:40 • Bugün</td>
                    <td><span className="badge admin-chip">Yolda</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="fw-semibold">Michael Chen</div>
                      <small className="admin-helper">BA1020 • AYT T3</small>
                    </td>
                    <td>AYT → Gloria Serenity</td>
                    <td>Sprinter VIP</td>
                    <td>22:15 • Bugün</td>
                    <td><span className="badge admin-chip">Bekliyor</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
