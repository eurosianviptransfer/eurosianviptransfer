"use client";

import React from "react";
import Link from "next/link";

export default function AdminTopbar() {
  return (
    <header style={{ padding: 16, borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" }}>Admin Dashboard</div>
        <div style={{ fontWeight: 800, fontSize: 18 }}>Eurosian VIP Transfer</div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button className="btn-admin-secondary btn-sm">Reports</button>
        <button className="btn-admin-secondary btn-sm">Notifications</button>
        <div style={{ display: "flex", gap: 10, alignItems: "center", padding: 8, borderRadius: 10, background: "var(--admin-surface)" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--admin-primary)", color: "var(--admin-primary-contrast)", display: "grid", placeItems: "center", fontWeight: 800 }}>A</div>
          <div>
            <div style={{ fontWeight: 700 }}>Super Admin</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>admin@eurosian.test</div>
          </div>
        </div>
      </div>
    </header>
  );
}
