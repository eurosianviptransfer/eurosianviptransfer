"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Vehicle = { id: string; plate: string; model: string; size: "SMALL" | "LARGE"; active: boolean; driverId: string | null; supplierName: string | null; driver: { id: string; name: string } | null };
type Person = { id: string; name: string; phone: string | null; active: boolean; supplierName: string | null; role: "DRIVER" | "GREETER"; vehicle?: { plate: string; model: string; size: "SMALL" | "LARGE" } | null };

async function updateFleet(body: Record<string, unknown>) {
  const res = await fetch("/api/fleet", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Güncelleme yapılamadı.");
}

async function createFleet(body: Record<string, unknown>): Promise<any> {
  const res = await fetch("/api/fleet", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Kayıt oluşturulamadı.");
  return json;
}

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <input className="ev-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={`⌕  ${placeholder}`} aria-label={placeholder} />;
}

export function FleetManagement({ vehicles, drivers, greeters }: { vehicles: Vehicle[]; drivers: Person[]; greeters: Person[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<"vehicles" | "drivers" | "greeters">("vehicles");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [size, setSize] = useState<"all" | "SMALL" | "LARGE">("all");
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const people = tab === "drivers" ? drivers : greeters;
  const filteredVehicles = useMemo(() => vehicles.filter((v) => {
    const haystack = `${v.plate} ${v.model} ${v.driver?.name || ""}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (status === "all" || (status === "active" ? v.active : !v.active)) && (size === "all" || v.size === size);
  }), [vehicles, query, status, size]);
  const filteredPeople = useMemo(() => people.filter((p) => `${p.name} ${p.phone || ""}`.toLowerCase().includes(query.toLowerCase()) && (status === "all" || (status === "active" ? p.active : !p.active))), [people, query, status]);

  async function save(body: Record<string, unknown>, id: string) {
    setSaving(id);
    try { await updateFleet(body); setEditing(null); router.refresh(); } catch (error) { alert((error as Error).message); } finally { setSaving(null); }
  }

  return <section id="arac-sofor-yonetimi" className="ev-card" style={{ marginTop: 24 }}>
    <div className="ev-card-row" style={{ alignItems: "center", marginBottom: 18 }}>
      <div><div className="ev-eyebrow">Kaynak yönetimi</div><h2 style={{ margin: "5px 0 0", fontSize: 23 }}>Filo ve ekip</h2></div>
      <div className="ev-kpi-label">{tab === "vehicles" ? filteredVehicles.length : filteredPeople.length} kayıt</div>
    </div>
    <div className="ev-tabs" role="tablist" aria-label="Filo ve ekip sekmeleri">
      {([["vehicles", "Araçlar"], ["drivers", "Şoförler"], ["greeters", "Karşılamacılar"]] as const).map(([key, label]) => <button key={key} role="tab" aria-selected={tab === key} className={`ev-tab ${tab === key ? "ev-tab--active" : ""}`} onClick={() => { setTab(key); setQuery(""); }}>{label}</button>)}
    </div>
    <CreatePanel tab={tab} drivers={drivers} onCreated={() => router.refresh()} />
    <div className="ev-field-grid" style={{ marginTop: 14 }}>
      <div className="ev-field"><label className="ev-label" htmlFor="fleet-search">Ara</label><SearchBar value={query} onChange={setQuery} placeholder={tab === "vehicles" ? "Plaka, model veya şoför" : "İsim veya telefon"} /></div>
      <div className="ev-field"><label className="ev-label" htmlFor="fleet-status">Durum</label><select id="fleet-status" className="ev-select" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}><option value="all">Tüm durumlar</option><option value="active">Aktif</option><option value="inactive">Pasif</option></select></div>
      {tab === "vehicles" && <div className="ev-field"><label className="ev-label" htmlFor="fleet-size">Araç tipi</label><select id="fleet-size" className="ev-select" value={size} onChange={(e) => setSize(e.target.value as typeof size)}><option value="all">Tüm tipler</option><option value="SMALL">Vito / Transporter</option><option value="LARGE">Sprinter</option></select></div>}
    </div>
    {tab === "vehicles" ? <div className="ev-grid ev-grid--3" style={{ marginTop: 16 }}>{filteredVehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} drivers={drivers} editing={editing === vehicle.id} saving={saving === vehicle.id} onEdit={() => setEditing(vehicle.id)} onCancel={() => setEditing(null)} onSave={(body) => save({ type: "vehicle", id: vehicle.id, ...body }, vehicle.id)} />)}</div> : <div className="ev-grid ev-grid--3" style={{ marginTop: 16 }}>{filteredPeople.map((person) => <PersonCard key={person.id} person={person} editing={editing === person.id} saving={saving === person.id} onEdit={() => setEditing(person.id)} onCancel={() => setEditing(null)} onSave={(body) => save({ type: "user", id: person.id, ...body }, person.id)} />)}</div>}
    {((tab === "vehicles" && filteredVehicles.length === 0) || (tab !== "vehicles" && filteredPeople.length === 0)) && <div className="ev-empty" style={{ marginTop: 16 }}>Aramanızla eşleşen kayıt bulunamadı.</div>}
  </section>;
}

function CreatePanel({ tab, drivers, onCreated }: { tab: "vehicles" | "drivers" | "greeters"; drivers: Person[]; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [size, setSize] = useState<"SMALL" | "LARGE">("SMALL");
  const [driverId, setDriverId] = useState("");
  const [saving, setSaving] = useState(false);

  // Şifre Gösterme Modal State'leri
  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    phone: string;
    password: string;
    roleText: string;
  } | null>(null);

  const isVehicle = tab === "vehicles";

  async function submit() {
    setSaving(true);
    try {
      const role = tab === "drivers" ? "DRIVER" : "GREETER";
      const vehicle = !isVehicle && tab === "drivers" && plate.trim() ? { plate, model, size } : undefined;
      
      const result = await createFleet(
        isVehicle
          ? { type: "vehicle", plate, model, size, driverId, supplierName }
          : { type: "user", role, name, phone, supplierName, vehicle }
      );

      // Eğer kullanıcı oluşturulduysa ve geçici şifre döndüyse modalı aç
      if (result && result.generatedPassword) {
        setCreatedCredentials({
          name: result.user.name,
          phone: result.user.phone,
          password: result.generatedPassword,
          roleText: role === "GREETER" ? "Karşılamacı" : "Şoför",
        });
      } else {
        setOpen(false);
      }

      setName("");
      setPhone("");
      setSupplierName("");
      setPlate("");
      setModel("");
      setDriverId("");
      onCreated();
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const copyToClipboard = () => {
    if (!createdCredentials) return;
    const text = `Eurosian VIP Transfer - ${createdCredentials.roleText} Giriş Bilgileri:\nAdı: ${createdCredentials.name}\nTelefon: ${createdCredentials.phone}\nŞifre: ${createdCredentials.password}`;
    navigator.clipboard.writeText(text);
    alert("Giriş bilgileri panoya kopyalandı!");
  };

  return (
    <div style={{ marginTop: 14 }}>
      <button className="ev-btn" onClick={() => { setOpen((value) => !value); setCreatedCredentials(null); }}>
        {open ? "Formu kapat" : `+ Yeni ${isVehicle ? "araç" : tab === "drivers" ? "şoför" : "karşılamacı"} ekle`}
      </button>

      {open && (
        <div className="ev-card" style={{ marginTop: 12, background: "rgba(14, 42, 52, 0.5)" }}>
          {!createdCredentials ? (
            <>
              <div className="ev-eyebrow">Yeni kayıt</div>
              <div className="ev-field-grid" style={{ marginTop: 10 }}>
                {isVehicle ? (
                  <>
                    <div className="ev-field"><label className="ev-label">Plaka</label><input className="ev-input" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="07 EVT 99" /></div>
                    <div className="ev-field"><label className="ev-label">Model</label><input className="ev-input" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Mercedes Vito" /></div>
                    <div className="ev-field"><label className="ev-label">Araç tipi</label><select className="ev-select" value={size} onChange={(e) => setSize(e.target.value as typeof size)}><option value="SMALL">Vito / Transporter</option><option value="LARGE">Sprinter</option></select></div>
                    <div className="ev-field"><label className="ev-label">Şoför</label><select className="ev-select" value={driverId} onChange={(e) => setDriverId(e.target.value)}><option value="">Şoför atanmamış</option>{drivers.filter((d) => d.active).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                  </>
                ) : (
                  <>
                    <div className="ev-field"><label className="ev-label">Ad soyad</label><input className="ev-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ad Soyad" /></div>
                    <div className="ev-field"><label className="ev-label">Telefon</label><input className="ev-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+90..." /></div>
                    {tab === "drivers" && (
                      <>
                        <div className="ev-field"><label className="ev-label">Araç plakası</label><input className="ev-input" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="07 EVT 99" /></div>
                        <div className="ev-field"><label className="ev-label">Araç modeli</label><input className="ev-input" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Mercedes Vito" /></div>
                        <div className="ev-field"><label className="ev-label">Araç tipi</label><select className="ev-select" value={size} onChange={(e) => setSize(e.target.value as typeof size)}><option value="SMALL">Vito / Transporter</option><option value="LARGE">Sprinter</option></select></div>
                      </>
                    )}
                  </>
                )}
              </div>
              <div className="ev-actions" style={{ marginTop: 12 }}>
                <button className="ev-btn" disabled={saving} onClick={submit}>
                  {saving ? "Kaydediliyor…" : "Kaydı oluştur"}
                </button>
              </div>
            </>
          ) : (
            // Şifre Gösterme Ekranı
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{ width: 40, height: 40, background: "rgba(34, 197, 94, 0.2)", color: "#22c55e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 20, fontWeight: "bold" }}>
                ✓
              </div>
              <h3 style={{ margin: "0 0 5px", fontSize: 18, color: "#fff" }}>{createdCredentials.roleText} Başarıyla Eklendi!</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 15 }}>
                Aşağıdaki geçici şifreyi personel ile paylaşın. Bu şifre güvenlik nedeniyle tekrar gösterilmeyecektir.
              </p>

              <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: 12, borderRadius: 8, textAlign: "left", marginBottom: 15 }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Ad Soyad: <strong style={{ color: "#fff" }}>{createdCredentials.name}</strong></div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>Telefon: <strong style={{ color: "#fff" }}>{createdCredentials.phone}</strong></div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>Giriş Şifresi:</div>
                <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: "bold", color: "#38bdf8", background: "rgba(56, 189, 248, 0.1)", padding: "6:px 10px", borderRadius: 6, display: "inline-block", marginTop: 4, border: "1px solid rgba(56, 189, 248, 0.3)" }}>
                  {createdCredentials.password}
                </div>
              </div>

              <div className="ev-actions" style={{ display: "flex", gap: 8 }}>
                <button className="ev-btn" style={{ flex: 1, background: "#334155", color: "#fff" }} onClick={copyToClipboard}>
                  📋 Bilgileri Kopyala
                </button>
                <button className="ev-btn" style={{ flex: 1 }} onClick={() => { setOpen(false); setCreatedCredentials(null); }}>
                  Tamam
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function VehicleCard({ vehicle, drivers, editing, saving, onEdit, onCancel, onSave }: { vehicle: Vehicle; drivers: Person[]; editing: boolean; saving: boolean; onEdit: () => void; onCancel: () => void; onSave: (body: Record<string, unknown>) => void }) {
  const [plate, setPlate] = useState(vehicle.plate); const [model, setModel] = useState(vehicle.model); const [vehicleSize, setVehicleSize] = useState(vehicle.size); const [driverId, setDriverId] = useState(vehicle.driverId || ""); const [active, setActive] = useState(vehicle.active);
  const activeDrivers = drivers.filter((driver) => driver.active);
  return <article className="ev-card" style={{ padding: 16 }}><div className="ev-card-row"><div><span className={`ev-badge ${vehicle.active ? "ev-badge--teal" : "ev-badge--rose"}`}>{vehicle.active ? "Aktif" : "Pasif"}</span><div style={{ fontSize: 19, fontWeight: 600, marginTop: 10 }}>{vehicle.plate}</div></div><span className="ev-badge ev-badge--blue">{vehicle.size === "SMALL" ? "Küçük" : "Büyük"}</span></div>{editing ? <div className="ev-stack" style={{ marginTop: 14 }}><input className="ev-input" value={plate} onChange={(e) => setPlate(e.target.value)} aria-label="Plaka" /><input className="ev-input" value={model} onChange={(e) => setModel(e.target.value)} aria-label="Model" /><select className="ev-select" value={vehicleSize} onChange={(e) => setVehicleSize(e.target.value as typeof vehicleSize)}><option value="SMALL">Vito / Transporter</option><option value="LARGE">Sprinter</option></select><select className="ev-select" value={driverId} onChange={(e) => setDriverId(e.target.value)}><option value="">Şoför atanmamış</option>{activeDrivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select><label className="ev-choice"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Aktif araç</label><div className="ev-actions"><button className="ev-btn" disabled={saving} onClick={() => onSave({ plate, model, size: vehicleSize, driverId, active })}>{saving ? "Kaydediliyor…" : "Kaydet"}</button><button className="ev-btn ev-btn--ghost" onClick={onCancel}>Vazgeç</button></div></div> : <><div className="ev-kpi-label" style={{ marginTop: 10 }}>{vehicle.model}</div><div className="ev-kpi-label">Şoför: {vehicle.driver?.name || "Atanmamış"}</div><button className="ev-btn ev-btn--ghost" style={{ width: "100%", marginTop: 14 }} onClick={onEdit}>Düzenle</button></>}</article>;
}

function PersonCard({ person, editing, saving, onEdit, onCancel, onSave }: { person: Person; editing: boolean; saving: boolean; onEdit: () => void; onCancel: () => void; onSave: (body: Record<string, unknown>) => void }) {
  const [name, setName] = useState(person.name); const [phone, setPhone] = useState(person.phone || ""); const [active, setActive] = useState(person.active);
  return <article className="ev-card" style={{ padding: 16 }}><div className="ev-card-row"><div><span className={`ev-badge ${person.active ? "ev-badge--teal" : "ev-badge--rose"}`}>{person.active ? "Aktif" : "Pasif"}</span><div style={{ fontSize: 19, fontWeight: 600, marginTop: 10 }}>{person.name}</div></div><span className="ev-badge ev-badge--blue">{person.role === "DRIVER" ? "Şoför" : "Karşılamacı"}</span></div>{editing ? <div className="ev-stack" style={{ marginTop: 14 }}><input className="ev-input" value={name} onChange={(e) => setName(e.target.value)} aria-label="Ad soyad" /><input className="ev-input" value={phone} onChange={(e) => setPhone(e.target.value)} aria-label="Telefon" placeholder="Telefon" /><label className="ev-choice"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Aktif personel</label><div className="ev-actions"><button className="ev-btn" disabled={saving} onClick={() => onSave({ name, phone, active })}>{saving ? "Kaydediliyor…" : "Kaydet"}</button><button className="ev-btn ev-btn--ghost" onClick={onCancel}>Vazgeç</button></div></div> : <><div className="ev-kpi-label" style={{ marginTop: 10 }}>{person.phone || "Telefon eklenmemiş"}</div>{person.vehicle && <div className="ev-kpi-label">Araç: {person.vehicle.plate} · {person.vehicle.size === "SMALL" ? "Küçük" : "Büyük"}</div>}<button className="ev-btn ev-btn--ghost" style={{ width: "100%", marginTop: 14 }} onClick={onEdit}>Düzenle</button></>}</article>;
}