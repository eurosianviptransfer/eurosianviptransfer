"use client";

import React from "react";

type Booking = {
  id: string;
  status: string;
  pickup: string;
  dropoff: string;
  scheduledAt?: string;
};

export default function BookingsTable({ bookings = [] }: { bookings?: Booking[] }) {
  return (
    <table className="admin-table" style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Pickup</th>
          <th>Dropoff</th>
          <th>When</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {bookings.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ textAlign: "center" }} className="ev-empty">No bookings</td>
          </tr>
        ) : (
          bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.status}</td>
              <td>{b.pickup}</td>
              <td>{b.dropoff}</td>
              <td>{b.scheduledAt ?? "-"}</td>
              <td>
                <button className="btn-sm btn-admin-secondary">Inspect</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
