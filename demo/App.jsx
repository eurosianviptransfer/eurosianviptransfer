import React, { useMemo, useState } from "react";
import {
  Plane,
  Car,
  Users,
  User,
  Phone,
  Clock,
  CheckCircle2,
  Bell,
  ChevronRight,
  MapPin,
  Luggage,
  Sparkles,
} from "lucide-react";

/* ---------------------------------------------------------
   TOKENS — Mediterranean dusk / runway-lights palette.
   Deep petrol ink evokes the coastline at night; brass/amber
   is the single accent, standing in for cabin & runway light.
--------------------------------------------------------- */
const C = {
  ink: "#0E2A34",
  ink2: "#123642",
  panel: "#153B47",
  panelSoft: "#1B4655",
  line: "rgba(233, 226, 210, 0.10)",
  lineStrong: "rgba(233, 226, 210, 0.20)",
  text: "#F3ECDD",
  textMuted: "#9FBAC2",
  textFaint: "#6F8E96",
  gold: "#E3AA55",
  goldSoft: "rgba(227, 170, 85, 0.16)",
  rose: "#D9714E",
  roseSoft: "rgba(217, 113, 78, 0.16)",
  teal: "#4FA189",
  tealSoft: "rgba(79, 161, 137, 0.16)",
  blue: "#5B93B0",
  blueSoft: "rgba(91, 147, 176, 0.16)",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
.ev-display { font-family: 'Fraunces', serif; }
.ev-body { font-family: 'IBM Plex Sans', sans-serif; }
.ev-mono { font-family: 'IBM Plex Mono', monospace; }
`;

/* ---------------------------------------------------------
   MOCK REFERENCE DATA
--------------------------------------------------------- */
const REGIONS = [
  { id: "lara", name: "Lara", km: 15, price: 25 },
  { id: "merkez", name: "Antalya Merkez", km: 12, price: 25 },
  { id: "belek", name: "Belek", km: 35, price: 40 },
  { id: "kemer", name: "Kemer", km: 61, price: 60 },
  { id: "side", name: "Side", km: 66, price: 65 },
  { id: "alanya", name: "Alanya", km: 125, price: 110 },
];

const VEHICLES = [
  { plate: "07 EVT 12", model: "Mercedes Vito", size: "small", driver: "Emre Yıldız" },
  { plate: "07 EVT 34", model: "VW Transporter", size: "small", driver: "Caner Demir" },
  { plate: "07 EVT 56", model: "Mercedes Sprinter", size: "large", driver: "Hakan Su" },
];

const GREETERS = ["Aylin Kaya", "Deniz Aksoy"];

const STAGE_LABEL = {
  pending_approval: "Onay Bekliyor",
  approved: "Atama Bekleniyor",
  assigned: "Atandı",
  greeter_confirmed: "Karşılamacıda",
  en_route: "Yolda",
  dropped_off: "Otelde Bırakıldı",
  completed: "Tamamlandı",
};

const stagesFor = (b) =>
  b.vehicleSize === "small"
    ? ["pending_approval", "approved", "assigned", "greeter_confirmed", "en_route", "dropped_off", "completed"]
    : ["pending_approval", "approved", "assigned", "en_route", "dropped_off", "completed"];

let idCounter = 1000;
const nextCode = () => `EVT-${idCounter++}`;

/* ---------------------------------------------------------
   SMALL UI PRIMITIVES
--------------------------------------------------------- */
function Badge({ children, tone = "gold" }) {
  const map = {
    gold: { bg: C.goldSoft, fg: C.gold },
    rose: { bg: C.roseSoft, fg: C.rose },
    teal: { bg: C.tealSoft, fg: C.teal },
    blue: { bg: C.blueSoft, fg: C.blue },
  };
  const t = map[tone];
  return (
    <span
      className="ev-body inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs tracking-wide"
      style={{ background: t.bg, color: t.fg }}
    >
      {children}
    </span>
  );
}

function Btn({ children, onClick, tone = "gold", full, disabled }) {
  const styles =
    tone === "gold"
      ? { background: C.gold, color: C.ink, border: "none" }
      : tone === "ghost"
      ? { background: "transparent", color: C.text, border: `1px solid ${C.lineStrong}` }
      : { background: C.tealSoft, color: C.teal, border: "none" };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`ev-body text-sm font-medium rounded-lg px-4 py-2.5 transition-opacity ${
        full ? "w-full" : ""
      } ${disabled ? "opacity-40 cursor-not-allowed" : "hover:opacity-90"}`}
      style={styles}
    >
      {children}
    </button>
  );
}

/* Signature element: a boarding-pass style progress strip that
   encodes the booking's real journey through the state machine. */
function StatusStrip({ booking }) {
  const stages = stagesFor(booking);
  const idx = stages.indexOf(booking.status);
  return (
    <div className="flex items-center w-full">
      {stages.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center" style={{ minWidth: 0 }}>
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: 10,
                height: 10,
                background: i <= idx ? C.gold : "transparent",
                border: `1.5px solid ${i <= idx ? C.gold : C.lineStrong}`,
              }}
            />
            <span
              className="ev-body text-[10px] mt-1.5 text-center leading-tight"
              style={{ color: i <= idx ? C.text : C.textFaint, maxWidth: 62 }}
            >
              {STAGE_LABEL[s]}
            </span>
          </div>
          {i < stages.length - 1 && (
            <div
              className="flex-1 h-px mx-1"
              style={{ background: i < idx ? C.gold : C.line, marginBottom: 16 }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: C.panel, border: `1px solid ${C.line}`, ...style }}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------
   ROLE: MİSAFİR
--------------------------------------------------------- */
function GuestView({ bookings, onCreate, notify }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    regionId: "belek",
    vehicleSize: "small",
    passengers: 2,
    date: "",
    time: "",
    flightNumber: "",
    language: "TR",
    hasReturn: false,
    paymentMethod: "in_vehicle",
  });
  const region = REGIONS.find((r) => r.id === form.regionId);
  const oneWay = region ? region.price + (form.vehicleSize === "large" ? 15 : 0) : 0;
  const price = form.hasReturn ? oneWay * 2 : oneWay;

  const submit = () => {
    if (!form.name || !form.phone) return;
    const booking = {
      id: crypto.randomUUID(),
      code: nextCode(),
      guestName: form.name,
      phone: form.phone,
      regionName: region.name,
      km: region.km,
      price,
      vehicleSize: form.vehicleSize,
      passengers: form.passengers,
      datetime: form.date && form.time ? `${form.date} · ${form.time}` : "Belirtilmedi",
      flightNumber: form.flightNumber || null,
      language: form.language,
      hasReturn: form.hasReturn,
      paymentMethod: form.paymentMethod,
      status: "pending_approval",
      vehiclePlate: null,
      driverName: null,
      greeterName: null,
      driverFee: null,
      greeterFee: null,
    };
    onCreate(booking);
    notify(`Rezervasyon alındı: ${booking.code} — ${booking.guestName}, admin onayı bekleniyor.`);
    setForm({ ...form, name: "", phone: "", flightNumber: "" });
  };

  const mine = bookings; // demo: tek misafir oturumu, tüm rezervasyonları gösterir

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Plane size={16} color={C.gold} />
          <h3 className="ev-display text-lg" style={{ color: C.text }}>
            Havalimanı Transferi Rezervasyonu
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2 items-center rounded-lg px-3 py-2.5" style={{ background: C.ink2, border: `1px solid ${C.line}` }}>
            <MapPin size={14} color={C.textMuted} />
            <span className="ev-body text-sm" style={{ color: C.textMuted }}>Kalkış: Antalya Havalimanı (AYT)</span>
          </div>

          <select
            value={form.regionId}
            onChange={(e) => setForm({ ...form, regionId: e.target.value })}
            className="ev-body w-full rounded-lg px-3 py-2.5 text-sm outline-none"
            style={{ background: C.ink2, border: `1px solid ${C.line}`, color: C.text }}
          >
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                Varış: {r.name} ({r.km} km)
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="ev-body rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ background: C.ink2, border: `1px solid ${C.line}`, color: C.text }}
            />
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="ev-body rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ background: C.ink2, border: `1px solid ${C.line}`, color: C.text }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.vehicleSize}
              onChange={(e) => setForm({ ...form, vehicleSize: e.target.value })}
              className="ev-body rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ background: C.ink2, border: `1px solid ${C.line}`, color: C.text }}
            >
              <option value="small">Vito / Transporter (1-6 kişi)</option>
              <option value="large">Sprinter (7-14 kişi)</option>
            </select>
            <input
              type="number"
              min={1}
              value={form.passengers}
              onChange={(e) => setForm({ ...form, passengers: Number(e.target.value) })}
              className="ev-body rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ background: C.ink2, border: `1px solid ${C.line}`, color: C.text }}
              placeholder="Yolcu sayısı"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ad Soyad"
              className="ev-body rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ background: C.ink2, border: `1px solid ${C.line}`, color: C.text }}
            />
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="WhatsApp Telefon"
              className="ev-body rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ background: C.ink2, border: `1px solid ${C.line}`, color: C.text }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.flightNumber}
              onChange={(e) => setForm({ ...form, flightNumber: e.target.value })}
              placeholder="Uçuş No (opsiyonel)"
              className="ev-body rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ background: C.ink2, border: `1px solid ${C.line}`, color: C.text }}
            />
            <select
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
              className="ev-body rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ background: C.ink2, border: `1px solid ${C.line}`, color: C.text }}
            >
              {["TR", "EN", "DE", "RU"].map((l) => (
                <option key={l} value={l}>İletişim dili: {l}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer" style={{ background: C.ink2, border: `1px solid ${C.line}` }}>
            <input
              type="checkbox"
              checked={form.hasReturn}
              onChange={(e) => setForm({ ...form, hasReturn: e.target.checked })}
            />
            <span className="ev-body text-sm" style={{ color: C.textMuted }}>Dönüş transferi de ekle (aynı tutar × 2)</span>
          </label>

          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "in_vehicle", label: "Araçta Öde" },
              { id: "card_now", label: "Şimdi Öde (Kart)" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setForm({ ...form, paymentMethod: opt.id })}
                className="ev-body text-sm rounded-lg px-3 py-2.5 text-center transition-colors"
                style={{
                  background: form.paymentMethod === opt.id ? C.goldSoft : C.ink2,
                  color: form.paymentMethod === opt.id ? C.gold : C.textMuted,
                  border: `1px solid ${form.paymentMethod === opt.id ? C.gold : C.line}`,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="ev-body text-xs" style={{ color: C.textMuted }}>
                Toplam Fiyat {form.hasReturn && "(gidiş + dönüş)"}
              </div>
              <div className="ev-display text-2xl" style={{ color: C.gold }}>€{price}</div>
            </div>
            <Btn onClick={submit}>Rezervasyonu Onayla</Btn>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="ev-body text-xs tracking-widest uppercase" style={{ color: C.textFaint }}>
          Rezervasyon Takibi
        </div>
        {mine.length === 0 && (
          <Card>
            <p className="ev-body text-sm" style={{ color: C.textFaint }}>
              Henüz rezervasyon yok — soldaki formu doldurup gönderin.
            </p>
          </Card>
        )}
        {mine.map((b) => (
          <Card key={b.id}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="ev-mono text-xs" style={{ color: C.textFaint }}>{b.code}</div>
                <div className="ev-display text-base" style={{ color: C.text }}>
                  AYT → {b.regionName}
                </div>
                <div className="ev-body text-xs mt-0.5" style={{ color: C.textMuted }}>
                  {b.datetime}{b.flightNumber ? ` · Uçuş ${b.flightNumber}` : ""}{b.hasReturn ? " · Dönüş dahil" : ""}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <Badge tone={b.status === "completed" ? "teal" : "gold"}>{STAGE_LABEL[b.status]}</Badge>
                <Badge tone={b.paymentMethod === "card_now" ? "blue" : "rose"}>
                  {b.paymentMethod === "card_now" ? "Kartla ödendi" : "Araçta ödenecek"}
                </Badge>
              </div>
            </div>
            <StatusStrip booking={b} />
            {b.driverName && (
              <div className="mt-4 pt-3 flex items-center gap-2" style={{ borderTop: `1px solid ${C.line}` }}>
                <Car size={14} color={C.textMuted} />
                <span className="ev-body text-xs" style={{ color: C.textMuted }}>
                  {b.driverName} · {b.vehiclePlate} {b.greeterName ? `· Karşılamacı: ${b.greeterName}` : ""}
                </span>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   ROLE: ADMIN
--------------------------------------------------------- */
function AdminView({ bookings, onApprove, onAssign, onComplete }) {
  const [assignForm, setAssignForm] = useState({});

  const setField = (id, field, val) =>
    setAssignForm((s) => ({ ...s, [id]: { ...s[id], [field]: val } }));

  const groups = {
    pending_approval: bookings.filter((b) => b.status === "pending_approval"),
    approved: bookings.filter((b) => b.status === "approved"),
    live: bookings.filter((b) => !["pending_approval", "approved", "completed"].includes(b.status)),
    completed: bookings.filter((b) => b.status === "completed"),
  };

  return (
    <div className="space-y-8">
      <Section title="Onay Bekleyenler" tone="rose" count={groups.pending_approval.length}>
        {groups.pending_approval.map((b) => (
          <Card key={b.id}>
            <div className="flex items-center justify-between">
              <div>
                <div className="ev-mono text-xs" style={{ color: C.textFaint }}>{b.code}</div>
                <div className="ev-display text-base" style={{ color: C.text }}>
                  {b.guestName} · AYT → {b.regionName}
                </div>
                <div className="ev-body text-xs mt-0.5" style={{ color: C.textMuted }}>
                  {b.datetime} · {b.passengers} yolcu · €{b.price}
                  {b.flightNumber ? ` · Uçuş ${b.flightNumber}` : ""} · {b.paymentMethod === "card_now" ? "Kartla ödendi" : "Araçta ödenecek"}
                  {b.hasReturn ? " · Dönüş dahil" : ""} · Dil: {b.language}
                </div>
              </div>
              <Btn onClick={() => onApprove(b.id)}>Onayla</Btn>
            </div>
          </Card>
        ))}
        {groups.pending_approval.length === 0 && <EmptyRow text="Onay bekleyen rezervasyon yok." />}
      </Section>

      <Section title="Atama Bekleyenler" tone="gold" count={groups.approved.length}>
        {groups.approved.map((b) => {
          const f = assignForm[b.id] || {};
          const options = VEHICLES.filter((v) => v.size === b.vehicleSize);
          return (
            <Card key={b.id}>
              <div className="ev-display text-base mb-1" style={{ color: C.text }}>
                {b.guestName} · AYT → {b.regionName}
              </div>
              <div className="ev-body text-xs mb-3" style={{ color: C.textMuted }}>
                {b.datetime} · {b.vehicleSize === "small" ? "Küçük araç — karşılamacı zorunlu" : "Büyük araç — karşılamacı opsiyonel"}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <select
                  onChange={(e) => setField(b.id, "vehicle", e.target.value)}
                  className="ev-body rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: C.ink2, border: `1px solid ${C.line}`, color: C.text }}
                  defaultValue=""
                >
                  <option value="" disabled>Araç / Şoför seç</option>
                  {options.map((v) => (
                    <option key={v.plate} value={v.plate}>{v.plate} — {v.model} ({v.driver})</option>
                  ))}
                </select>
                {b.vehicleSize === "small" ? (
                  <select
                    onChange={(e) => setField(b.id, "greeter", e.target.value)}
                    className="ev-body rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: C.ink2, border: `1px solid ${C.line}`, color: C.text }}
                    defaultValue=""
                  >
                    <option value="" disabled>Karşılamacı seç (zorunlu)</option>
                    {GREETERS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                ) : (
                  <div className="ev-body text-xs flex items-center px-3" style={{ color: C.textFaint }}>
                    Karşılamacı gerekmiyor — şoför otoparkta kendisi karşılayacak.
                  </div>
                )}
                <input
                  type="number"
                  placeholder="Şoför ücreti (₺)"
                  onChange={(e) => setField(b.id, "driverFee", e.target.value)}
                  className="ev-body rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: C.ink2, border: `1px solid ${C.line}`, color: C.text }}
                />
                {b.vehicleSize === "small" && (
                  <input
                    type="number"
                    placeholder="Karşılamacı ücreti (₺)"
                    onChange={(e) => setField(b.id, "greeterFee", e.target.value)}
                    className="ev-body rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: C.ink2, border: `1px solid ${C.line}`, color: C.text }}
                  />
                )}
              </div>
              <div className="mt-3 flex justify-end">
                <Btn
                  disabled={!f.vehicle || !f.driverFee || (b.vehicleSize === "small" && (!f.greeter || !f.greeterFee))}
                  onClick={() => onAssign(b.id, f)}
                >
                  Ata ve Bildirim Gönder
                </Btn>
              </div>
            </Card>
          );
        })}
        {groups.approved.length === 0 && <EmptyRow text="Atama bekleyen rezervasyon yok." />}
      </Section>

      <Section title="Canlı Operasyon" tone="blue" count={groups.live.length}>
        {groups.live.map((b) => (
          <Card key={b.id}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="ev-mono text-xs" style={{ color: C.textFaint }}>{b.code}</div>
                <div className="ev-display text-base" style={{ color: C.text }}>{b.guestName} · {b.regionName}</div>
                <div className="ev-body text-xs mt-0.5" style={{ color: C.textMuted }}>
                  {b.vehiclePlate} · {b.driverName} {b.greeterName ? `· ${b.greeterName}` : ""}
                </div>
              </div>
              {b.status === "dropped_off" && <Btn tone="teal" onClick={() => onComplete(b.id)}>Tamamla</Btn>}
            </div>
            <StatusStrip booking={b} />
          </Card>
        ))}
        {groups.live.length === 0 && <EmptyRow text="Şu anda devam eden iş yok." />}
      </Section>

      <Section title="Tamamlananlar" tone="teal" count={groups.completed.length}>
        {groups.completed.map((b) => (
          <Card key={b.id}>
            <div className="flex items-center justify-between">
              <div>
                <div className="ev-display text-base" style={{ color: C.text }}>{b.guestName} · {b.regionName}</div>
                <div className="ev-body text-xs mt-0.5" style={{ color: C.textMuted }}>
                  {b.driverName} → ₺{b.driverFee}{b.greeterName ? ` · ${b.greeterName} → ₺${b.greeterFee}` : ""}
                </div>
              </div>
              <Badge tone="teal">Hakediş oluşturuldu</Badge>
            </div>
          </Card>
        ))}
        {groups.completed.length === 0 && <EmptyRow text="Henüz tamamlanan iş yok." />}
      </Section>
    </div>
  );
}

function Section({ title, tone, count, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Badge tone={tone}>{count}</Badge>
        <h3 className="ev-display text-lg" style={{ color: C.text }}>{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function EmptyRow({ text }) {
  return (
    <div className="ev-body text-sm rounded-xl px-4 py-4" style={{ color: C.textFaint, border: `1px dashed ${C.line}` }}>
      {text}
    </div>
  );
}

/* ---------------------------------------------------------
   ROLE: ŞOFÖR
--------------------------------------------------------- */
function DriverView({ bookings, driverName, setDriverName, onDriverAction }) {
  const jobs = bookings.filter((b) => b.driverName === driverName && b.status !== "pending_approval" && b.status !== "approved" && b.status !== "completed");

  return (
    <div>
      <IdentityPicker label="Şoför olarak giriş yap" value={driverName} onChange={setDriverName} options={VEHICLES.map((v) => v.driver)} />
      <div className="space-y-3 mt-5">
        {jobs.length === 0 && <EmptyRow text="Şu anda atanmış işiniz yok." />}
        {jobs.map((b) => {
          const needsPickupSelf = b.vehicleSize === "large" && b.status === "assigned";
          const canDropOff = b.status === "en_route";
          return (
            <Card key={b.id}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="ev-mono text-xs" style={{ color: C.textFaint }}>{b.code}</div>
                  <div className="ev-display text-base" style={{ color: C.text }}>{b.guestName}</div>
                </div>
                <div className="ev-display text-lg" style={{ color: C.gold }}>₺{b.driverFee}</div>
              </div>
              <div className="ev-body text-xs space-y-1 mb-3" style={{ color: C.textMuted }}>
                <div className="flex items-center gap-1.5"><MapPin size={12} /> AYT → {b.regionName}</div>
                <div className="flex items-center gap-1.5"><Clock size={12} /> {b.datetime}</div>
                <div className="flex items-center gap-1.5"><Luggage size={12} /> {b.passengers} yolcu</div>
                {b.greeterName && <div className="flex items-center gap-1.5"><Users size={12} /> Karşılamacı: {b.greeterName} — misafiri 15 dk'lık geçici park alanına getirecek</div>}
              </div>
              <StatusStrip booking={b} />
              <div className="mt-4 flex gap-2">
                {needsPickupSelf && <Btn full onClick={() => onDriverAction(b.id, "pickup")}>Misafiri Teslim Aldım</Btn>}
                {canDropOff && <Btn full tone="teal" onClick={() => onDriverAction(b.id, "dropoff")}>Otele Bıraktım</Btn>}
                {!needsPickupSelf && !canDropOff && (
                  <div className="ev-body text-xs w-full text-center py-2" style={{ color: C.textFaint }}>
                    Karşılamacının misafiri teslim etmesi bekleniyor…
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   ROLE: KARŞILAMACI
--------------------------------------------------------- */
function GreeterView({ bookings, greeterName, setGreeterName, onGreeterAction }) {
  const jobs = bookings.filter((b) => b.greeterName === greeterName && ["assigned", "greeter_confirmed"].includes(b.status));

  return (
    <div>
      <IdentityPicker label="Karşılamacı olarak giriş yap" value={greeterName} onChange={setGreeterName} options={GREETERS} />
      <div className="space-y-3 mt-5">
        {jobs.length === 0 && <EmptyRow text="Şu anda atanmış karşılama işiniz yok." />}
        {jobs.map((b) => (
          <Card key={b.id}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="ev-mono text-xs" style={{ color: C.textFaint }}>{b.code}</div>
                <div className="ev-display text-base" style={{ color: C.text }}>{b.guestName}</div>
              </div>
              <div className="ev-display text-lg" style={{ color: C.gold }}>₺{b.greeterFee}</div>
            </div>
            <div className="ev-body text-xs space-y-1 mb-3" style={{ color: C.textMuted }}>
              <div className="flex items-center gap-1.5"><Clock size={12} /> {b.datetime}</div>
              <div className="flex items-center gap-1.5"><Car size={12} /> Teslim noktası: 15 dk'lık geçici park alanı — {b.vehiclePlate} ({b.driverName})</div>
            </div>
            <StatusStrip booking={b} />
            <div className="mt-4">
              {b.status === "assigned" && (
                <Btn full onClick={() => onGreeterAction(b.id, "meet")}>Misafiri Karşıladım</Btn>
              )}
              {b.status === "greeter_confirmed" && (
                <Btn full tone="teal" onClick={() => onGreeterAction(b.id, "handover")}>Şoföre Teslim Ettim</Btn>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function IdentityPicker({ label, value, onChange, options }) {
  return (
    <div className="flex items-center gap-3">
      <User size={14} color={C.textMuted} />
      <span className="ev-body text-xs" style={{ color: C.textMuted }}>{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ev-body rounded-lg px-3 py-1.5 text-sm outline-none"
        style={{ background: C.ink2, border: `1px solid ${C.line}`, color: C.text }}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

/* ---------------------------------------------------------
   APP SHELL
--------------------------------------------------------- */
const ROLES = [
  { id: "guest", label: "Misafir" },
  { id: "admin", label: "Admin" },
  { id: "driver", label: "Şoför" },
  { id: "greeter", label: "Karşılamacı" },
];

export default function App() {
  const [role, setRole] = useState("guest");
  const [bookings, setBookings] = useState(() => [
    {
      id: crypto.randomUUID(),
      code: "EVT-1001",
      guestName: "Marco Bellini",
      phone: "+39 333 000 00 00",
      regionName: "Belek",
      km: 35,
      price: 40,
      vehicleSize: "small",
      passengers: 3,
      datetime: "22 Tem 2026 · 18:40",
      flightNumber: "TK1878",
      language: "EN",
      hasReturn: false,
      paymentMethod: "in_vehicle",
      status: "pending_approval",
      vehiclePlate: null,
      driverName: null,
      greeterName: null,
      driverFee: null,
      greeterFee: null,
    },
  ]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Sistem hazır — simüle edilmiş WhatsApp bildirimleri burada görünecek." },
  ]);
  const [driverName, setDriverName] = useState(VEHICLES[0].driver);
  const [greeterName, setGreeterName] = useState(GREETERS[0]);

  const notify = (text) =>
    setNotifications((n) => [{ id: Date.now(), text }, ...n].slice(0, 6));

  const update = (id, patch) =>
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const onCreate = (b) => setBookings((bs) => [b, ...bs]);

  const onApprove = (id) => {
    update(id, { status: "approved" });
    notify(`Admin rezervasyonu onayladı — atama bekleniyor.`);
  };

  const onAssign = (id, f) => {
    const vehicle = VEHICLES.find((v) => v.plate === f.vehicle);
    const patch = {
      status: "assigned",
      vehiclePlate: vehicle.plate,
      driverName: vehicle.driver,
      greeterName: f.greeter || null,
      driverFee: f.driverFee,
      greeterFee: f.greeterFee || null,
    };
    update(id, patch);
    notify(`WhatsApp → Misafir + ${vehicle.driver}${f.greeter ? " + " + f.greeter : ""}: "İşiniz atandı."`);
  };

  const onGreeterAction = (id, action) => {
    if (action === "meet") {
      update(id, { status: "greeter_confirmed" });
      notify(`Karşılamacı misafiri karşıladı — WhatsApp → Şoför bilgilendirildi.`);
    } else {
      update(id, { status: "en_route" });
      notify(`Karşılamacı misafiri şoföre teslim etti — yolculuk başladı.`);
    }
  };

  const onDriverAction = (id, action) => {
    if (action === "pickup") {
      update(id, { status: "en_route" });
      notify(`Şoför misafiri teslim aldı — yolculuk başladı.`);
    } else {
      update(id, { status: "dropped_off" });
      notify(`Şoför misafiri otele bıraktı — admin onayı bekleniyor.`);
    }
  };

  const onComplete = (id) => {
    const b = bookings.find((x) => x.id === id);
    update(id, { status: "completed" });
    notify(
      `WhatsApp → ${b.driverName}: "Hakedişiniz ₺${b.driverFee} kaydedildi."${
        b.greeterName ? ` / ${b.greeterName}: "Hakedişiniz ₺${b.greeterFee} kaydedildi."` : ""
      }`
    );
  };

  return (
    <div className="ev-body min-h-screen w-full" style={{ background: C.ink, color: C.text }}>
      <style>{FONTS}</style>

      {/* Header */}
      <div className="px-6 pt-8 pb-5" style={{ borderBottom: `1px solid ${C.line}` }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 34, height: 34, background: C.goldSoft }}
            >
              <Plane size={16} color={C.gold} />
            </div>
            <div>
              <div className="ev-display text-xl leading-none" style={{ color: C.text }}>Eurosian VIP Transfer</div>
              <div className="ev-body text-[10px] tracking-[0.2em] uppercase" style={{ color: C.textFaint }}>
                Operasyon Prototipi · İnteraktif Demo
              </div>
            </div>
          </div>

          <div className="flex rounded-full p-1" style={{ background: C.ink2, border: `1px solid ${C.line}` }}>
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className="ev-body text-xs sm:text-sm px-3.5 py-2 rounded-full transition-colors"
                style={{
                  background: role === r.id ? C.gold : "transparent",
                  color: role === r.id ? C.ink : C.textMuted,
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notification ticker */}
      <div className="px-6 py-3" style={{ background: C.ink2, borderBottom: `1px solid ${C.line}` }}>
        <div className="max-w-5xl mx-auto flex items-start gap-2">
          <Bell size={13} color={C.gold} className="mt-0.5 shrink-0" />
          <div className="ev-body text-xs leading-relaxed" style={{ color: C.textMuted }}>
            <span style={{ color: C.textFaint }}>Simüle bildirim akışı: </span>
            {notifications[0].text}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {role === "guest" && <GuestView bookings={bookings} onCreate={onCreate} notify={notify} />}
        {role === "admin" && (
          <AdminView bookings={bookings} onApprove={onApprove} onAssign={onAssign} onComplete={onComplete} />
        )}
        {role === "driver" && (
          <DriverView bookings={bookings} driverName={driverName} setDriverName={setDriverName} onDriverAction={onDriverAction} />
        )}
        {role === "greeter" && (
          <GreeterView bookings={bookings} greeterName={greeterName} setGreeterName={setGreeterName} onGreeterAction={onGreeterAction} />
        )}
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-10 flex items-center gap-2" style={{ color: C.textFaint }}>
        <Sparkles size={12} />
        <span className="ev-body text-[11px]">
          Bu ekran bir demodur — gerçek WhatsApp, ödeme ve harita entegrasyonu içermez. Akışı denemek için Misafir sekmesinden rezervasyon oluşturup Admin → Şoför/Karşılamacı sekmelerinde ilerletin.
        </span>
      </div>
    </div>
  );
}
