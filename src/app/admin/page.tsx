import { prisma } from "@/lib/db";
import { ApproveButton, AssignForm, CompleteButton } from "./_actions";
import { SerperSearchPanel } from "@/components/admin/SerperSearchPanel";
import { FleetManagement } from "@/components/admin/FleetManagement";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { AdminReportDashboard, type AdminReportBooking } from "@/components/admin/AdminReportDashboard";
import { DriverApplicationsPanel } from "@/components/admin/DriverApplicationsPanel";
import { RatingSummary } from "@/components/admin/RatingSummary";
import { unseal } from "@/lib/security/sealed";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      vehicle: true,
      driver: true,
      greeter: true,
      statusEvents: {
        where: { status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
  });
  const [allFleet, allDrivers, allGreeters] = await Promise.all([
    prisma.vehicle.findMany({ include: { driver: true } }),
    prisma.user.findMany({ where: { role: "DRIVER" }, include: { vehicle: true } }),
    prisma.user.findMany({ where: { role: "GREETER" } }),
  ]);
  const fleet = allFleet.filter((vehicle) => vehicle.active);
  const drivers = allDrivers.filter((driver) => driver.active);
  const greeters = allGreeters.filter((greeter) => greeter.active);
  const payoutRules = await prisma.payoutRule.findMany({ where: { active: true } });
  const applications = await prisma.driverApplication.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  const pending = bookings.filter((b) => b.status === "PENDING_APPROVAL");
  const approved = bookings.filter((b) => b.status === "APPROVED");
  const live = bookings.filter((b) => !["PENDING_APPROVAL", "APPROVED", "COMPLETED", "CANCELLED"].includes(b.status));
  const completed = bookings.filter((b) => b.status === "COMPLETED");
  const reportBookings: AdminReportBooking[] = bookings.map((booking) => ({
    id: booking.id,
    code: booking.code,
    guestName: booking.guestName,
    guestPhone: booking.guestPhone,
    guestEmail: booking.guestEmail,
    destinationText: booking.destinationText,
    regionName: booking.regionName,
    flightNumber: booking.flightNumber,
    scheduledAt: booking.scheduledAt.toISOString(),
    completedAt: booking.statusEvents[0]?.createdAt.toISOString() ?? null,
    createdAt: booking.createdAt.toISOString(),
    status: booking.status,
    vehicleSize: booking.vehicleSize,
    driverName: booking.driver?.name ?? null,
    greeterName: booking.greeter?.name ?? null,
    vehiclePlate: booking.vehicle?.plate ?? null,
    price: booking.price,
    currency: booking.currency,
    paymentStatus: booking.paymentStatus,
    paymentMethod: booking.paymentMethod,
    driverFee: booking.driverFee,
    greeterFee: booking.greeterFee,
  }));

  return (
    <main className="ev-page ev-page--wide">
      <div className="ev-eyebrow">Eurosian VIP Transfer</div>
      <div className="ev-card-row" style={{ alignItems: "center" }}>
        <h1 className="ev-h1">Admin — Operasyon Panosu</h1>
        <div className="ev-actions"><a href="/admin/fiyatlar" className="ev-btn ev-btn--ghost">Fiyat Tablosu →</a><SignOutButton /></div>
      </div>

      <nav className="ev-card-row" aria-label="Admin bölümleri" style={{ gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <a className="ev-btn ev-btn--ghost" href="#arac-sofor-yonetimi">Araç & Şoför</a>
        <a className="ev-btn ev-btn--ghost" href="#karsilamaci-yonetimi">Karşılamacılar</a>
        <a className="ev-btn ev-btn--ghost" href="#rezervasyon-yonetimi">Rezervasyonlar</a>
      </nav>

      <AdminReportDashboard bookings={reportBookings} />

      <DriverApplicationsPanel applications={applications.map((application) => ({ ...application, whatsappMessage: application.whatsappMessage ? unseal(application.whatsappMessage) : null, createdAt: application.createdAt.toISOString() }))} />
      <RatingSummary />

      <SerperSearchPanel />

      <FleetManagement
        vehicles={allFleet.map((v) => ({ id: v.id, plate: v.plate, model: v.model, size: v.size, active: v.active, driverId: v.driverId, supplierName: v.supplierName, driver: v.driver ? { id: v.driver.id, name: v.driver.name } : null }))}
        drivers={allDrivers.map((d) => ({ id: d.id, name: d.name, phone: d.phone, active: d.active, supplierName: d.supplierName, role: "DRIVER" as const, vehicle: d.vehicle ? { plate: d.vehicle.plate, model: d.vehicle.model, size: d.vehicle.size } : null }))}
        greeters={allGreeters.map((g) => ({ id: g.id, name: g.name, phone: g.phone, active: g.active, supplierName: g.supplierName, role: "GREETER" as const }))}
      />

      <section id="rezervasyon-yonetimi">
        <div className="ev-section-title">Rezervasyon Yönetimi ({bookings.length})</div>
        <div className="ev-card-row" style={{ gap: 12, flexWrap: "wrap" }}>
          <span className="ev-badge ev-badge--gold">Onay bekleyen: {pending.length}</span>
          <span className="ev-badge">Atama bekleyen: {approved.length}</span>
          <span className="ev-badge">Canlı: {live.length}</span>
          <span className="ev-badge">Tamamlanan: {completed.length}</span>
        </div>
      </section>

      <div className="ev-section-title">Rezervasyonlar — Onay Bekleyenler ({pending.length})</div>
      {pending.length === 0 && <div className="ev-empty">Yok.</div>}
      {pending.map((b) => (
        <div key={b.id} className="ev-card ev-card-row">
          <div>
            <b>{b.guestName}</b> · {b.destinationText || b.regionName}
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>€{b.price} · {b.vehicleSize}</div>
          </div>
          <ApproveButton bookingId={b.id} />
        </div>
      ))}

      <div className="ev-section-title">Atama Bekleyenler ({approved.length})</div>
      {approved.length === 0 && <div className="ev-empty">Yok.</div>}
      {approved.map((b) => (
        <div key={b.id} className="ev-card ev-card-row">
          <div>
            <b>{b.guestName}</b> · {b.destinationText || b.regionName}
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {b.vehicleSize === "SMALL" ? "Küçük araç — karşılamacı zorunlu" : "Büyük araç — karşılamacı opsiyonel"}
            </div>
          </div>
          <AssignForm
            bookingId={b.id}
            vehicleSize={b.vehicleSize}
            vehicles={fleet.map((v) => ({ id: v.id, label: `${v.plate} (${v.driver?.name ?? "?"})`, size: v.size, driverId: v.driverId }))}
            drivers={drivers.map((d) => ({ id: d.id, name: d.name }))}
            greeters={greeters.map((g) => ({ id: g.id, name: g.name }))}
            suggestedFee={payoutRules.find((r) => r.vehicleSize === b.vehicleSize)}
          />
        </div>
      ))}

      <div className="ev-section-title">Canlı Operasyon ({live.length})</div>
      {live.length === 0 && <div className="ev-empty">Yok.</div>}
      {live.map((b) => (
        <div key={b.id} className="ev-card ev-card-row">
          <div>
            <b>{b.guestName}</b>
            <span className="ev-badge ev-badge--gold" style={{ marginLeft: 8 }}>{STAGE_LABEL[b.status]}</span>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
              {b.driver?.name} {b.vehicle?.plate} {b.greeter ? `· Karşılamacı: ${b.greeter.name}` : ""}
            </div>
          </div>
          <div style={{ minWidth: 340 }}>
            {["ASSIGNED", "GREETER_CONFIRMED", "EN_ROUTE"].includes(b.status) && (
              <AssignForm
                bookingId={b.id}
                vehicleSize={b.vehicleSize}
                edit
                initial={{ vehicleId: b.vehicleId, driverId: b.driverId, greeterId: b.greeterId, driverFee: b.driverFee, greeterFee: b.greeterFee }}
                vehicles={fleet.filter((v) => v.size === b.vehicleSize).map((v) => ({ id: v.id, label: `${v.plate} (${v.driver?.name ?? "?"})`, size: v.size, driverId: v.driverId }))}
                drivers={drivers.map((d) => ({ id: d.id, name: d.name }))}
                greeters={greeters.map((g) => ({ id: g.id, name: g.name }))}
              />
            )}
            {b.status === "DROPPED_OFF" && <CompleteButton bookingId={b.id} />}
          </div>
        </div>
      ))}

      <div className="ev-section-title">Tamamlananlar ({completed.length})</div>
      {completed.length === 0 && <div className="ev-empty">Yok.</div>}
      {completed.map((b) => (
        <div key={b.id} className="ev-card ev-card-row">
          <div>
            <b>{b.guestName}</b>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {b.driver?.name} → ₺{b.driverFee}
              {b.greeter ? ` · ${b.greeter.name} → ₺${b.greeterFee}` : ""}
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}

const STAGE_LABEL: Record<string, string> = {
  ASSIGNED: "Atandı",
  GREETER_CONFIRMED: "Karşılamacıda",
  EN_ROUTE: "Yolda",
  DROPPED_OFF: "Otelde Bırakıldı",
};
