"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

async function post(url: string, body?: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Hata");
  return json;
}

export function ApproveButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      className="ev-btn"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await post(`/api/bookings/${bookingId}/approve`);
          router.refresh();
        } catch (e) {
          alert((e as Error).message);
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? "…" : "Onayla"}
    </button>
  );
}

export function CompleteButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      className="ev-btn"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await post(`/api/bookings/${bookingId}/complete`);
          router.refresh();
        } catch (e) {
          alert((e as Error).message);
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? "…" : "Tamamla"}
    </button>
  );
}

interface AssignFormProps {
  bookingId: string;
  vehicleSize: "SMALL" | "LARGE";
  vehicles: { id: string; label: string; size: string; driverId: string | null }[];
  drivers: { id: string; name: string }[];
  greeters: { id: string; name: string }[];
  suggestedFee?: { suggestedDriverFee: number; suggestedGreeterFee: number | null };
  edit?: boolean;
  initial?: { vehicleId: string | null; driverId: string | null; greeterId: string | null; driverFee: number | null; greeterFee: number | null };
}

export function AssignForm({ bookingId, vehicleSize, vehicles, drivers, greeters, suggestedFee, edit = false, initial }: AssignFormProps) {
  const router = useRouter();
  const [vehicleId, setVehicleId] = useState(initial?.vehicleId ?? "");
  const [driverId, setDriverId] = useState(initial?.driverId ?? "");
  const [greeterId, setGreeterId] = useState(initial?.greeterId ?? "");
  const [driverFee, setDriverFee] = useState(initial?.driverFee != null ? String(initial.driverFee) : suggestedFee ? String(suggestedFee.suggestedDriverFee) : "");
  const [greeterFee, setGreeterFee] = useState(
    initial?.greeterFee != null ? String(initial.greeterFee) : suggestedFee?.suggestedGreeterFee ? String(suggestedFee.suggestedGreeterFee) : ""
  );
  const [loading, setLoading] = useState(false);
  const greeterRequired = vehicleSize === "SMALL";
  const matching = vehicles.filter((v) => v.size === vehicleSize);

  async function submit() {
    setLoading(true);
    try {
      await post(edit ? `/api/bookings/${bookingId}/assignment` : `/api/bookings/${bookingId}/assign`, {
        vehicleId,
        driverId: driverId || null,
        greeterId: greeterId || null,
        driverFee: Number(driverFee),
        greeterFee: greeterFee ? Number(greeterFee) : null,
      });
      router.refresh();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, minWidth: 320 }}>
      <select className="ev-select" value={vehicleId} onChange={(e) => {
        const nextVehicleId = e.target.value;
        setVehicleId(nextVehicleId);
        if (!driverId) setDriverId(vehicles.find((v) => v.id === nextVehicleId)?.driverId || "");
      }}>
        <option value="">Araç/Şoför seç</option>
        {matching.map((v) => (
          <option key={v.id} value={v.id}>{v.label}</option>
        ))}
      </select>
      <select className="ev-select" value={driverId} onChange={(e) => setDriverId(e.target.value)}>
        <option value="">Şoför seç</option>
        {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>
      <select className="ev-select" value={greeterId} onChange={(e) => setGreeterId(e.target.value)}>
        <option value="">{greeterRequired ? "Karşılamacı seç (zorunlu)" : "Karşılamacı (opsiyonel)"}</option>
        {greeters.map((g) => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>
      <input className="ev-input" placeholder="Şoför ücreti ₺" value={driverFee} onChange={(e) => setDriverFee(e.target.value)} />
      <input className="ev-input" placeholder="Karşılamacı ücreti ₺" value={greeterFee} onChange={(e) => setGreeterFee(e.target.value)} />
      <button className="ev-btn" style={{ gridColumn: "span 2" }} disabled={loading} onClick={submit}>
        {loading ? "…" : edit ? "Atamayı Güncelle" : "Ata"}
      </button>
    </div>
  );
}
