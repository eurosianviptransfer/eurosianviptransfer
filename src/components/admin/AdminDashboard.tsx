"use client";

import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import KpiCard from "./KpiCard";
import BookingsTable from "./BookingsTable";

export default function AdminDashboard() {
  const sampleBookings = [
    { id: "BKG-001", status: "confirmed", pickup: "IST Airport", dropoff: "Levent", scheduledAt: "2026-08-08 10:00" },
    { id: "BKG-002", status: "pending", pickup: "Sabiha Gökçen", dropoff: "Kadiköy", scheduledAt: "2026-08-09 09:00" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1 }}>
        <AdminTopbar />
        <main style={{ padding: 20 }}>
          <section style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <KpiCard title="Bookings" value={128} sub="Last 24h" />
            <KpiCard title="Active Drivers" value={24} sub="Online now" />
            <KpiCard title="Pending Approvals" value={3} sub="Needs review" />
          </section>

          <section style={{ marginTop: 20 }}>
            <h3 style={{ margin: "0 0 12px" }}>Recent bookings</h3>
            <div className="card">
              <BookingsTable bookings={sampleBookings} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
