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

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="d-flex bg-light" style={{ minHeight: "100vh" }}>
      <aside className="bg-white border-end shadow-sm position-sticky top-0" style={{ width: 280, minHeight: "100vh" }}>
        <div className="p-4 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
              E
            </div>
            <div>
              <h5 className="mb-1">Eurosian Admin</h5>
              <small className="text-muted">Super Admin Panel</small>
            </div>
          </div>
        </div>

        <div className="px-3 py-3">
          <div className="small text-uppercase fw-semibold text-muted mb-2">Navigation</div>
          <div className="list-group list-group-flush">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin-revamp" && pathname?.startsWith(item.href));
              return (
                <Link
                  href={item.href}
                  key={item.href}
                  className={`list-group-item list-group-item-action d-flex align-items-center gap-2 rounded-3 mb-1 ${active ? "active bg-primary text-white" : "text-secondary"}`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-auto p-4 border-top">
          <div className="small text-uppercase fw-semibold text-muted mb-3">Quick actions</div>
          <div className="d-grid gap-2">
            <Link href="/admin-revamp/content/new" className="btn btn-outline-primary btn-sm">
              New Content
            </Link>
            <Link href="/admin-revamp/media/upload" className="btn btn-outline-secondary btn-sm">
              Upload Media
            </Link>
          </div>
        </div>
      </aside>

      <main className="flex-grow-1">
        <header className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 p-4 border-bottom bg-white shadow-sm">
          <div>
            <p className="text-uppercase text-muted small mb-2">Admin Dashboard</p>
            <h1 className="h4 mb-1">Eurosian VIP Transfer</h1>
            <p className="text-muted mb-0">Manage bookings, users, media, and content from one modern control center.</p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-secondary btn-sm">Reports</button>
            <button className="btn btn-outline-secondary btn-sm">Notifications</button>
            <div className="d-flex align-items-center gap-2 px-3 py-2 bg-light rounded-3 border">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ minWidth: 40, minHeight: 40 }}>
                A
              </div>
              <div>
                <div className="fw-semibold">Super Admin</div>
                <small className="text-muted">admin@eurosian.com</small>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4">{children}</main>
      </main>
    </div>
  );
}
