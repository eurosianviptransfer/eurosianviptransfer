"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin-revamp", label: "Overview", icon: "🏠" },
  { href: "/admin-revamp/content", label: "Content", icon: "📝" },
  { href: "/admin-revamp/media", label: "Media", icon: "🖼️" },
  { href: "/admin-revamp/users", label: "Users", icon: "👥" },
  { href: "/admin-revamp/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-panel" style={{ width: 280, minHeight: "100vh" }}>
      <div style={{ padding: 20, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--admin-primary)", color: "var(--admin-primary-contrast)", display: "grid", placeItems: "center", fontWeight: 800 }}>
            E
          </div>
          <div>
            <div style={{ fontWeight: 800 }}>Eurosian Admin</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Super Admin</div>
          </div>
        </div>
      </div>

      <nav style={{ padding: 16 }} aria-label="Admin navigation">
        <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8 }}>Navigation</div>
        <div style={{ display: "grid", gap: 6 }}>
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin-revamp" && pathname?.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={active ? "ev-card" : "ev-card ev-card--muted"} style={{ display: "flex", gap: 10, alignItems: "center", padding: 12, textDecoration: "none" }}>
                <span style={{ width: 28 }}>{item.icon}</span>
                <span style={{ fontWeight: 700 }}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div style={{ marginTop: "auto", padding: 16, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Quick actions</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/admin-revamp/content/new" className="btn-admin-secondary btn-sm">New</Link>
          <Link href="/admin-revamp/media/upload" className="btn-admin-secondary btn-sm">Upload</Link>
        </div>
      </div>
    </aside>
  );
}
