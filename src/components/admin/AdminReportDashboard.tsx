"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { useLocale } from "@/components/LanguageProvider";
import { getAdminCopy } from "@/lib/admin-copy";

export interface AdminReportBooking {
  id: string;
  code: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string | null;
  destinationText: string;
  regionName: string | null;
  flightNumber: string | null;
  scheduledAt: string;
  completedAt: string | null;
  createdAt: string;
  status: string;
  vehicleSize: string;
  driverName: string | null;
  greeterName: string | null;
  vehiclePlate: string | null;
  price: number;
  currency: string;
  paymentStatus: string;
  paymentMethod: string;
  driverFee: number | null;
  greeterFee: number | null;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING_APPROVAL: "Onay bekliyor",
  APPROVED: "Atama bekliyor",
  ASSIGNED: "Atandı",
  GREETER_CONFIRMED: "Karşılamacı tamamladı",
  EN_ROUTE: "Yolda",
  DROPPED_OFF: "Otele bırakıldı",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal edildi",
};

const PAYMENT_LABEL: Record<string, string> = {
  UNPAID: "Ödenmedi",
  PENDING: "Ödeme bekliyor",
  PAID: "Ödendi",
  FAILED: "Başarısız",
  REFUNDED: "İade edildi",
};

const FILTER_STATUSES = ["ALL", "PENDING_APPROVAL", "APPROVED", "ASSIGNED", "GREETER_CONFIRMED", "EN_ROUTE", "DROPPED_OFF", "COMPLETED", "CANCELLED"];

function dateKey(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function money(value: number, currency = "EUR") {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}

function normalized(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ğ/g, "g").replace(/Ğ/g, "G");
}

function downloadBlob(content: BlobPart, fileName: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function reportRows(bookings: AdminReportBooking[]) {
  return bookings.map((booking) => ({
    Rezervasyon: booking.code,
    Misafir: booking.guestName,
    Telefon: booking.guestPhone,
    Eposta: booking.guestEmail ?? "",
    Destinasyon: booking.destinationText || booking.regionName || "",
    Ucus: booking.flightNumber ?? "",
    TransferTarihi: formatDate(booking.scheduledAt),
    TamamlanmaTarihi: formatDate(booking.completedAt),
    Durum: STATUS_LABEL[booking.status] ?? booking.status,
    AracTipi: booking.vehicleSize,
    Sofor: booking.driverName ?? "",
    Karsilamaci: booking.greeterName ?? "",
    Plaka: booking.vehiclePlate ?? "",
    Tutar: booking.price,
    ParaBirimi: booking.currency,
    OdemeDurumu: PAYMENT_LABEL[booking.paymentStatus] ?? booking.paymentStatus,
    SoforHakedis: booking.driverFee ?? 0,
    KarsilamaciHakedis: booking.greeterFee ?? 0,
  }));
}

export function AdminReportDashboard({ bookings }: { bookings: AdminReportBooking[] }) {
  const { locale } = useLocale();
  const copy = getAdminCopy(locale);
  const [status, setStatus] = useState("ALL");
  const [paymentStatus, setPaymentStatus] = useState("ALL");
  const [vehicleSize, setVehicleSize] = useState("ALL");
  const [driver, setDriver] = useState("ALL");
  const [greeter, setGreeter] = useState("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [query, setQuery] = useState("");

  const drivers = useMemo(() => [...new Set(bookings.map((item) => item.driverName).filter(Boolean))].sort(), [bookings]);
  const greeters = useMemo(() => [...new Set(bookings.map((item) => item.greeterName).filter(Boolean))].sort(), [bookings]);

  const filtered = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("tr-TR");
    return bookings.filter((item) => {
      if (status !== "ALL" && item.status !== status) return false;
      if (paymentStatus !== "ALL" && item.paymentStatus !== paymentStatus) return false;
      if (vehicleSize !== "ALL" && item.vehicleSize !== vehicleSize) return false;
      if (driver !== "ALL" && item.driverName !== driver) return false;
      if (greeter !== "ALL" && item.greeterName !== greeter) return false;
      if (from && dateKey(item.scheduledAt) < from) return false;
      if (to && dateKey(item.scheduledAt) > to) return false;
      if (!search) return true;
      return [item.code, item.guestName, item.guestPhone, item.destinationText, item.regionName, item.flightNumber, item.driverName, item.greeterName]
        .filter(Boolean)
        .some((value) => value!.toLocaleLowerCase("tr-TR").includes(search));
    }).sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  }, [bookings, driver, from, greeter, paymentStatus, query, status, to, vehicleSize]);

  const metrics = useMemo(() => ({
    total: filtered.length,
    completed: filtered.filter((item) => item.status === "COMPLETED").length,
    live: filtered.filter((item) => ["ASSIGNED", "GREETER_CONFIRMED", "EN_ROUTE", "DROPPED_OFF"].includes(item.status)).length,
    pending: filtered.filter((item) => ["PENDING_APPROVAL", "APPROVED"].includes(item.status)).length,
    revenue: filtered.filter((item) => item.status === "COMPLETED").reduce((sum, item) => sum + item.price, 0),
    paid: filtered.filter((item) => item.paymentStatus === "PAID").reduce((sum, item) => sum + item.price, 0),
    payout: filtered.reduce((sum, item) => sum + (item.driverFee ?? 0) + (item.greeterFee ?? 0), 0),
  }), [filtered]);

  const statusData = useMemo(() => Object.entries(STATUS_LABEL).map(([key, label]) => ({ key, label, value: filtered.filter((item) => item.status === key).length })).filter((item) => item.value > 0), [filtered]);
  const paymentData = useMemo(() => Object.entries(PAYMENT_LABEL).map(([key, label]) => ({ key, label, value: filtered.filter((item) => item.paymentStatus === key).length })).filter((item) => item.value > 0), [filtered]);
  const dailyRevenue = useMemo(() => {
    const days = [...Array(7)].map((_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      const key = dateKey(date.toISOString());
      return { key, label: new Intl.DateTimeFormat("tr-TR", { weekday: "short" }).format(date), value: filtered.filter((item) => item.status === "COMPLETED" && dateKey(item.completedAt ?? item.scheduledAt) === key).reduce((sum, item) => sum + item.price, 0) };
    });
    return days;
  }, [filtered]);

  const clearFilters = () => { setStatus("ALL"); setPaymentStatus("ALL"); setVehicleSize("ALL"); setDriver("ALL"); setGreeter("ALL"); setFrom(""); setTo(""); setQuery(""); };

  const exportCsv = () => {
    const rows = reportRows(filtered);
    const headers = Object.keys(rows[0] ?? {});
    const csv = [headers, ...rows.map((row) => headers.map((header) => String(row[header as keyof typeof row] ?? "")))]
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(";"))
      .join("\n");
    downloadBlob(`\uFEFF${csv}`, `eurosian-rapor-${dateKey(new Date().toISOString())}.csv`, "text/csv;charset=utf-8");
  };

  const exportXlsx = () => {
    const sheet = XLSX.utils.json_to_sheet(reportRows(filtered));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Rezervasyonlar");
    XLSX.writeFile(workbook, `eurosian-rapor-${dateKey(new Date().toISOString())}.xlsx`);
  };

  const exportPdf = () => {
    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const lines = [
      "Eurosian VIP Transfer - Operasyon Raporu",
      `Kayit: ${filtered.length} | Tamamlanan: ${metrics.completed} | Ciro: ${money(metrics.revenue)}`,
      "",
      ...filtered.slice(0, 32).map((item) => `${item.code} | ${normalized(item.guestName)} | ${normalized(item.destinationText)} | ${STATUS_LABEL[item.status]} | ${money(item.price, item.currency)}`),
    ];
    pdf.setFontSize(10);
    lines.forEach((line, index) => pdf.text(line.slice(0, 150), 32, 34 + index * 16));
    pdf.save(`eurosian-rapor-${dateKey(new Date().toISOString())}.pdf`);
  };

  return (
    <section className="ev-admin-report ev-no-print-area">
      <div className="ev-admin-report-hero">
        <div><div className="ev-eyebrow">Yönetim · Raporlama Merkezi</div><h2>Operasyon analitiği</h2><p>Rezervasyon, ödeme, atama ve hakediş verilerini tek ekrandan yönetin.</p></div>
        <div className="ev-admin-report-actions ev-no-print"><button className="ev-btn" onClick={exportXlsx}>Excel (.xlsx)</button><button className="ev-btn ev-btn--ghost" onClick={exportCsv}>CSV</button><button className="ev-btn ev-btn--ghost" onClick={exportPdf}>PDF</button><button className="ev-btn ev-btn--ghost" onClick={() => window.print()}>Yazdır</button></div>
      </div>

      <div className="ev-admin-kpis">
        <div className="ev-admin-kpi"><span>Filtrelenen rezervasyon</span><strong>{metrics.total}</strong><small>{metrics.pending} bekleyen · {metrics.live} canlı</small></div>
        <div className="ev-admin-kpi ev-admin-kpi--gold"><span>Tamamlanan ciro</span><strong>{money(metrics.revenue)}</strong><small>{metrics.completed} tamamlanan iş</small></div>
        <div className="ev-admin-kpi ev-admin-kpi--teal"><span>Tahsil edilen</span><strong>{money(metrics.paid)}</strong><small>Ödeme durumu: ödendi</small></div>
        <div className="ev-admin-kpi ev-admin-kpi--rose"><span>Toplam hakediş</span><strong>{money(metrics.payout, "TRY")}</strong><small>Şoför + karşılamacı</small></div>
      </div>

      <div className="ev-card ev-admin-filters ev-no-print">
        <div className="ev-admin-filter-head"><div><span className="ev-section-title ev-section-title--tight">Detaylı filtreleme</span><p>Birden fazla filtreyi birlikte kullanabilirsiniz.</p></div><span className="ev-badge ev-badge--blue">{filtered.length} kayıt</span></div>
        <div className="ev-admin-filter-grid">
          <label>Durum<select className="ev-select" value={status} onChange={(event) => setStatus(event.target.value)}>{FILTER_STATUSES.map((item) => <option key={item} value={item}>{item === "ALL" ? "Tüm durumlar" : STATUS_LABEL[item]}</option>)}</select></label>
          <label>Ödeme<select className="ev-select" value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)}><option value="ALL">Tüm ödemeler</option>{Object.entries(PAYMENT_LABEL).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
          <label>Araç tipi<select className="ev-select" value={vehicleSize} onChange={(event) => setVehicleSize(event.target.value)}><option value="ALL">Tüm araçlar</option><option value="SMALL">Küçük</option><option value="LARGE">Büyük</option></select></label>
          <label>Şoför<select className="ev-select" value={driver} onChange={(event) => setDriver(event.target.value)}><option value="ALL">Tüm şoförler</option>{drivers.map((item) => <option key={item} value={item!}>{item}</option>)}</select></label>
          <label>Karşılamacı<select className="ev-select" value={greeter} onChange={(event) => setGreeter(event.target.value)}><option value="ALL">Tüm karşılamacılar</option>{greeters.map((item) => <option key={item} value={item!}>{item}</option>)}</select></label>
          <label>Başlangıç<input className="ev-input" type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label>
          <label>Bitiş<input className="ev-input" type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label>
          <label className="ev-admin-search">Ara<input className="ev-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Kod, misafir, destinasyon, uçuş..." /></label>
        </div>
        <button className="ev-btn ev-btn--ghost ev-admin-clear" onClick={clearFilters}>Filtreleri temizle</button>
      </div>

      <div className="ev-admin-chart-grid">
        <div className="ev-card ev-admin-chart-card"><div className="ev-admin-card-heading"><div><span className="ev-section-title ev-section-title--tight">Dağılım</span><h3>Rezervasyon durumları</h3></div><span className="ev-badge ev-badge--gold">Pie chart</span></div><DonutChart data={statusData} total={filtered.length} /><ChartLegend data={statusData} /></div>
        <div className="ev-card ev-admin-chart-card"><div className="ev-admin-card-heading"><div><span className="ev-section-title ev-section-title--tight">Finans</span><h3>Ödeme durumları</h3></div><span className="ev-badge ev-badge--teal">Pie chart</span></div><DonutChart data={paymentData} total={filtered.length} offset={2} /><ChartLegend data={paymentData} /></div>
        <div className="ev-card ev-admin-chart-card ev-admin-chart-card--wide"><div className="ev-admin-card-heading"><div><span className="ev-section-title ev-section-title--tight">Son 7 gün</span><h3>Tamamlanan ciro trendi</h3></div><strong className="ev-admin-chart-total">{money(metrics.revenue)}</strong></div><BarChart data={dailyRevenue} /></div>
      </div>

      <div className="ev-card ev-admin-table-card" id="admin-report-table"><div className="ev-admin-card-heading"><div><span className="ev-section-title ev-section-title--tight">Operasyon raporu</span><h3>Tamamlanan ve filtrelenen işler</h3></div><span className="ev-muted">{filtered.length} satır</span></div><div className="ev-admin-table-wrap"><table className="ev-admin-table"><thead><tr><th>Kod / tarih</th><th>Misafir</th><th>Güzergâh</th><th>Atama</th><th>Durum</th><th>Ödeme</th><th>Tutar</th><th>Hakediş</th></tr></thead><tbody>{filtered.length === 0 ? <tr><td colSpan={8}><div className="ev-empty">Filtreye uyan kayıt bulunamadı.</div></td></tr> : filtered.map((item) => <tr key={item.id}><td><strong className="ev-mono">{item.code}</strong><small>{formatDate(item.scheduledAt)}</small></td><td><strong>{item.guestName}</strong><small>{item.guestPhone}</small></td><td>{item.destinationText || item.regionName || "—"}<small>{item.flightNumber ? `Uçuş ${item.flightNumber}` : "Uçuş belirtilmedi"}</small></td><td><small>Şoför: {item.driverName || "—"}</small><small>Karşılamacı: {item.greeterName || "—"}</small><small>{item.vehiclePlate || item.vehicleSize}</small></td><td><span className="ev-badge ev-badge--blue">{STATUS_LABEL[item.status] ?? item.status}</span></td><td><span className={`ev-badge ${item.paymentStatus === "PAID" ? "ev-badge--teal" : item.paymentStatus === "FAILED" ? "ev-badge--rose" : "ev-badge--gold"}`}>{PAYMENT_LABEL[item.paymentStatus] ?? item.paymentStatus}</span></td><td><strong>{money(item.price, item.currency)}</strong></td><td><small>Şoför: {money(item.driverFee ?? 0, "TRY")}</small><small>Karşılamacı: {money(item.greeterFee ?? 0, "TRY")}</small></td></tr>)}</tbody></table></div></div>
    </section>
  );
}

function DonutChart({ data, total, offset = 0 }: { data: { key: string; label: string; value: number }[]; total: number; offset?: number }) {
  const colors = ["#e3aa55", "#4fa189", "#5b93b0", "#d9714e", "#b28aeb", "#8db5a4", "#d9c27b", "#8094a5"];
  const gradient = data.reduce<{ cursor: number; parts: string[] }>((result, item, index) => {
    const start = result.cursor;
    const end = start + (total ? (item.value / total) * 360 : 0);
    return { cursor: end, parts: [...result.parts, `${colors[(index + offset) % colors.length]} ${start}deg ${end}deg`] };
  }, { cursor: 0, parts: [] }).parts.join(", ");
  return <div className="ev-donut-layout"><div className="ev-donut" style={{ background: gradient ? `conic-gradient(${gradient})` : "var(--line)" }}><div><strong>{total}</strong><span>kayıt</span></div></div></div>;
}

function ChartLegend({ data }: { data: { key: string; label: string; value: number }[] }) {
  const colors = ["#e3aa55", "#4fa189", "#5b93b0", "#d9714e", "#b28aeb", "#8db5a4", "#d9c27b", "#8094a5"];
  return <div className="ev-chart-legend">{data.map((item, index) => <div key={item.key}><i style={{ background: colors[index % colors.length] }} /><span>{item.label}</span><strong>{item.value}</strong></div>)}</div>;
}

function BarChart({ data }: { data: { key: string; label: string; value: number }[] }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return <div className="ev-bar-chart" aria-label="Son yedi gün ciro grafiği">{data.map((item) => <div className="ev-bar-item" key={item.key}><span>{item.value ? money(item.value) : "—"}</span><div className="ev-bar-track"><i style={{ height: `${Math.max(4, (item.value / max) * 100)}%` }} /></div><small>{item.label}</small></div>)}</div>;
}
