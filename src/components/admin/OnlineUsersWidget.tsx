"use client";

import { useEffect, useState } from "react";

type OnlineUser = {
  id: string;
  name: string;
  phone: string | null;
  role: string;
  supplierName: string | null;
  lastSeen: string;
};

export function OnlineUsersWidget() {
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOnlineUsers = async () => {
    try {
      const res = await fetch("/api/admin/online-users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOnlineUsers();
    const timer = setInterval(fetchOnlineUsers, 10000); // Her 10 saniyede bir listeyi güncelle
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="ev-card" style={{ marginTop: 24, padding: 20 }}>
      <div className="ev-card-row" style={{ alignItems: "center", marginBottom: 14 }}>
        <div>
          <div className="ev-eyebrow">Canlı Takip</div>
          <h3 style={{ margin: "4px 0 0", fontSize: 20 }}>Anlık Online Kullanıcılar</h3>
        </div>
        <span className="ev-badge ev-badge--teal" style={{ fontSize: 13, padding: "4px 10px" }}>
          🟢 {users.length} Aktif Oturum
        </span>
      </div>

      {loading ? (
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Yükleniyor...</div>
      ) : users.length === 0 ? (
        <div className="ev-empty">Şu anda sistemde aktif kullanıcı bulunmuyor.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginTop: 12 }}>
          {users.map((u) => {
            const roleBadgeText = u.role === "ADMIN" ? "Admin" : u.role === "DRIVER" ? "Şoför" : "Karşılamacı";
            const badgeClass = u.role === "ADMIN" ? "ev-badge--rose" : u.role === "DRIVER" ? "ev-badge--blue" : "ev-badge--teal";

            return (
              <div key={u.id} style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", padding: 14, borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <strong style={{ fontSize: 15, color: "#fff" }}>{u.name}</strong>
                  <span className={`ev-badge ${badgeClass}`} style={{ fontSize: 11 }}>{roleBadgeText}</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{u.phone || "Telefon yok"}</div>
                {u.supplierName && <div style={{ fontSize: 11, color: "#38bdf8", marginTop: 2 }}>Tedarikçi: {u.supplierName}</div>}
                
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                  <span>Durum: <strong style={{ color: "#22c55e" }}>Aktif</strong></span>
                  <span>Son Sinyal: Az önce</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}