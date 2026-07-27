"use client";

import { useMemo, useState } from "react";
import { DriverActionButton } from "@/app/sofor/_actions";
import { GreeterActionButton } from "@/app/karsilamaci/_actions";
import { SignOutButton } from "@/components/auth/SignOutButton";

export type OperationsRole = "DRIVER" | "GREETER";

export interface OperationsJob {
  id: string;
  code: string;
  guestName: string;
  destinationText: string;
  regionName: string | null;
  flightNumber: string | null;
  scheduledAt: string;
  status: string;
  vehicleSize: string;
  greeter?: { name: string } | null;
  driver?: { name: string } | null;
  vehicle?: { plate: string } | null;
}

interface Props {
  role: OperationsRole;
  name: string;
  jobs: OperationsJob[];
}

type Filter = "ALL" | "ACTIVE" | "COMPLETED" | "CANCELLED";

const ACTIVE_STATUSES = new Set(["ASSIGNED", "GREETER_CONFIRMED", "EN_ROUTE", "DROPPED_OFF"]);
const WAITING_STATUSES = new Set(["ASSIGNED", "GREETER_CONFIRMED", "DROPPED_OFF"]);

const STATUS_LABEL: Record<string, string> = {
  ASSIGNED: "Atandı",
  GREETER_CONFIRMED: "Karşılamacı tamamladı",
  EN_ROUTE: "Yolda",
  DROPPED_OFF: "Otele bırakıldı",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal edildi",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function dateOnly(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isToday(value: string) {
  return dateOnly(value) === dateOnly(new Date().toISOString());
}

function isThisWeek(value: string) {
  const now = new Date();
  const date = new Date(value);
  const start = new Date(now);
  const day = start.getDay() || 7;
  start.setDate(start.getDate() - day + 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return date >= start && date < end;
}

function statusClass(status: string) {
  if (status === "COMPLETED") return "ev-status-dot ev-status-dot--done";
  if (status === "EN_ROUTE") return "ev-status-dot ev-status-dot--live";
  if (status === "CANCELLED") return "ev-status-dot ev-status-dot--cancelled";
  return "ev-status-dot ev-status-dot--waiting";
}

export function OperationsDashboard({ role, name, jobs }: Props) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const metrics = useMemo(() => ({
    total: jobs.length,
    today: jobs.filter((job) => isToday(job.scheduledAt)).length,
    waiting: jobs.filter((job) => WAITING_STATUSES.has(job.status)).length,
    live: jobs.filter((job) => job.status === "EN_ROUTE").length,
    completed: jobs.filter((job) => job.status === "COMPLETED").length,
    week: jobs.filter((job) => isThisWeek(job.scheduledAt)).length,
  }), [jobs]);

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
    return jobs
      .filter((job) => {
        if (filter === "ACTIVE" && !ACTIVE_STATUSES.has(job.status)) return false;
        if (filter === "COMPLETED" && job.status !== "COMPLETED") return false;
        if (filter === "CANCELLED" && job.status !== "CANCELLED") return false;
        if (filter === "ALL" && job.status === "CANCELLED") return false;
        if (dateFrom && dateOnly(job.scheduledAt) < dateFrom) return false;
        if (dateTo && dateOnly(job.scheduledAt) > dateTo) return false;
        if (!normalizedQuery) return true;
        return [job.guestName, job.code, job.destinationText, job.regionName, job.flightNumber]
          .filter(Boolean)
          .some((value) => value!.toLocaleLowerCase("tr-TR").includes(normalizedQuery));
      })
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  }, [dateFrom, dateTo, filter, jobs, query]);

  const activeJobs = filteredJobs.filter((job) => ACTIVE_STATUSES.has(job.status));
  const completedJobs = filteredJobs.filter((job) => job.status === "COMPLETED");
  const cancelledJobs = filteredJobs.filter((job) => job.status === "CANCELLED");
  const roleTitle = role === "DRIVER" ? "Şoför Operasyon Paneli" : "Karşılamacı Operasyon Paneli";

  return (
    <main className="ev-page ev-page--wide ev-operations-page">
      <div className="ev-operations-hero">
        <div>
          <div className="ev-eyebrow">Eurosian VIP Transfer · Saha Operasyonu</div>
          <h1 className="ev-h1">{roleTitle}</h1>
          <p className="ev-operations-welcome">Hoş geldiniz, <strong>{name}</strong>. Bugünkü operasyon akışınız burada.</p>
        </div>
        <SignOutButton />
      </div>

      <section className="ev-operations-kpis" aria-label="Operasyon özeti">
        <div className="ev-operation-kpi"><span className="ev-kpi-icon ev-kpi-icon--gold">◷</span><div><strong>{metrics.waiting}</strong><span>Bekleyen iş</span></div></div>
        <div className="ev-operation-kpi"><span className="ev-kpi-icon ev-kpi-icon--teal">↗</span><div><strong>{metrics.live}</strong><span>Canlı iş</span></div></div>
        <div className="ev-operation-kpi"><span className="ev-kpi-icon ev-kpi-icon--blue">24h</span><div><strong>{metrics.today}</strong><span>Bugünkü iş</span></div></div>
        <div className="ev-operation-kpi"><span className="ev-kpi-icon ev-kpi-icon--rose">✓</span><div><strong>{metrics.completed}</strong><span>Tamamlanan</span></div></div>
      </section>

      <section className="ev-card ev-operations-toolbar" aria-label="İş filtreleri">
        <div className="ev-operations-toolbar-heading">
          <div><span className="ev-section-title ev-section-title--tight">İş görünümü</span><p>Durum, tarih veya misafir bilgisine göre filtreleyin.</p></div>
          <span className="ev-badge ev-badge--blue">Bu hafta: {metrics.week}</span>
        </div>
        <div className="ev-operations-filter-tabs" role="tablist" aria-label="İş durumu filtresi">
          {(["ALL", "ACTIVE", "COMPLETED", "CANCELLED"] as Filter[]).map((item) => (
            <button key={item} className={`ev-tab ${filter === item ? "ev-tab--active" : ""}`} onClick={() => setFilter(item)} role="tab" aria-selected={filter === item}>
              {item === "ALL" ? "Aktif görünüm" : item === "ACTIVE" ? "Bekleyen + canlı" : item === "COMPLETED" ? "Tamamlananlar" : "İptaller"}
            </button>
          ))}
        </div>
        <div className="ev-operations-filter-fields">
          <input className="ev-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Misafir, kod, uçuş veya destinasyon ara" aria-label="İşlerde ara" />
          <label><span>Başlangıç</span><input className="ev-input" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} /></label>
          <label><span>Bitiş</span><input className="ev-input" type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} /></label>
          <button className="ev-btn ev-btn--ghost" onClick={() => { setFilter("ALL"); setQuery(""); setDateFrom(""); setDateTo(""); }}>Filtreyi temizle</button>
        </div>
      </section>

      <section className="ev-operations-section" aria-labelledby="active-jobs-title">
        <div className="ev-operations-section-heading"><div><span className="ev-section-title ev-section-title--tight">Öncelikli akış</span><h2 id="active-jobs-title">Bekleyen ve canlı işler</h2></div><span className="ev-badge ev-badge--gold">{activeJobs.length} iş</span></div>
        {activeJobs.length === 0 ? <div className="ev-empty">Bu filtreye uyan bekleyen veya canlı iş bulunmuyor.</div> : <div className="ev-operations-list">{activeJobs.map((job) => <JobCard key={job.id} job={job} role={role} />)}</div>}
      </section>

      <section className="ev-operations-section ev-operations-section--completed" aria-labelledby="completed-jobs-title">
        <div className="ev-operations-section-heading"><div><span className="ev-section-title ev-section-title--tight">Raporlama</span><h2 id="completed-jobs-title">Tamamlanan işler</h2></div><span className="ev-badge ev-badge--teal">{completedJobs.length} iş</span></div>
        {completedJobs.length === 0 ? <div className="ev-empty">Bu filtreye uyan tamamlanmış iş bulunmuyor.</div> : <div className="ev-operations-list">{completedJobs.map((job) => <JobCard key={job.id} job={job} role={role} />)}</div>}
      </section>

      {cancelledJobs.length > 0 && filter === "CANCELLED" && <section className="ev-operations-section"><div className="ev-operations-section-heading"><h2>İptal edilen işler</h2><span className="ev-badge ev-badge--rose">{cancelledJobs.length} iş</span></div><div className="ev-operations-list">{cancelledJobs.map((job) => <JobCard key={job.id} job={job} role={role} />)}</div></section>}
    </main>
  );
}

function JobCard({ job, role }: { job: OperationsJob; role: OperationsRole }) {
  const isCompleted = job.status === "COMPLETED";
  const canDriverPickup = role === "DRIVER" && ((job.vehicleSize === "LARGE" && (job.status === "ASSIGNED" || (job.greeter && job.status === "GREETER_CONFIRMED"))) || (job.vehicleSize === "SMALL" && job.status === "GREETER_CONFIRMED"));
  const canDriverDropoff = role === "DRIVER" && job.status === "EN_ROUTE";
  const canGreeterMeet = role === "GREETER" && job.status === "ASSIGNED";
  const canGreeterHandover = role === "GREETER" && job.status === "GREETER_CONFIRMED";

  return (
    <article className={`ev-operation-card ${isCompleted ? "ev-operation-card--completed" : ""}`}>
      <div className="ev-operation-card-main">
        <div className="ev-operation-card-topline"><span className={statusClass(job.status)} aria-hidden="true" /><span className="ev-mono ev-operation-code">{job.code}</span><span className="ev-badge ev-badge--blue">{STATUS_LABEL[job.status] ?? job.status}</span><time dateTime={job.scheduledAt}>{formatDate(job.scheduledAt)}</time></div>
        <h3>{job.guestName}</h3>
        <p className="ev-operation-route"><span>AYT</span><b>→</b>{job.destinationText || job.regionName || "Destinasyon belirtilmedi"}</p>
        <div className="ev-operation-meta">
          {job.flightNumber && <span>✈ Uçuş {job.flightNumber}</span>}
          {role === "DRIVER" && <span>Karşılamacı: {job.greeter?.name || "Yok"}</span>}
          {role === "GREETER" && <span>Şoför: {job.driver?.name || "Atanmadı"}</span>}
          {job.vehicle?.plate && <span>▣ {job.vehicle.plate}</span>}
        </div>
      </div>
      <div className="ev-operation-card-action">
        {canDriverPickup && <DriverActionButton bookingId={job.id} action="pickup" label="Misafiri teslim aldım" />}
        {canDriverDropoff && <DriverActionButton bookingId={job.id} action="dropoff" label="Otele bıraktım" />}
        {canGreeterMeet && <GreeterActionButton bookingId={job.id} action="meet" label="Misafiri karşıladım" />}
        {canGreeterHandover && <GreeterActionButton bookingId={job.id} action="handover" label="Şoföre teslim ettim" />}
        {job.status === "DROPPED_OFF" && <span className="ev-operation-awaiting">Admin tamamlaması bekleniyor</span>}
        {isCompleted && <span className="ev-operation-completed">✓ Operasyon tamamlandı</span>}
        {!isCompleted && job.status === "GREETER_CONFIRMED" && role === "GREETER" && <span className="ev-operation-awaiting">Şoförün hareketi bekleniyor</span>}
      </div>
    </article>
  );
}
