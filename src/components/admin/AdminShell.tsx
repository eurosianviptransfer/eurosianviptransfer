"use client";

import React from "react";
import Link from "next/link";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <aside className="bg-white border-end" style={{ width: 260 }}>
        <div className="p-3 border-bottom">
          <h5 className="m-0">Eurosian Admin</h5>
          <small className="text-muted">Super Admin</small>
        </div>

        <nav className="p-2">
          <ul className="list-unstyled">
            <li className="mb-1">
              <Link className="d-block p-2 rounded text-decoration-none text-dark" href="/admin-revamp">
                Dashboard
              </Link>
            </li>
            <li className="mb-1">
              <Link className="d-block p-2 rounded text-decoration-none text-dark" href="/admin-revamp/content">
                Content
              </Link>
            </li>
            <li className="mb-1">
              <Link className="d-block p-2 rounded text-decoration-none text-dark" href="/admin-revamp/media">
                Media
              </Link>
            </li>
            <li className="mb-1">
              <Link className="d-block p-2 rounded text-decoration-none text-dark" href="/admin-revamp/users">
                Users
              </Link>
            </li>
            <li className="mb-1">
              <Link className="d-block p-2 rounded text-decoration-none text-dark" href="/admin-revamp/settings">
                Settings
              </Link>
            </li>
          </ul>
        </nav>

        <div className="position-absolute bottom-0 w-100 p-3 border-top">
          <small className="text-muted">v0.1 • Bootstrap</small>
        </div>
      </aside>

      <main className="flex-grow-1 bg-light">
        <header className="d-flex align-items-center justify-content-between p-3 border-bottom bg-white">
          <div>
            <button className="btn btn-outline-secondary btn-sm me-2">Toggle</button>
            <span className="h6 m-0">Admin Panel</span>
          </div>
          <div className="d-flex align-items-center">
            <div className="me-3 text-end">
              <div className="fw-bold">Super Admin</div>
              <small className="text-muted">admin@eurosian.com</small>
            </div>
            <img src="/avatar-placeholder.svg" alt="avatar" width={40} height={40} className="rounded-circle" />
          </div>
        </header>

        <section className="p-4">{children}</section>
      </main>
    </div>
  );
}
