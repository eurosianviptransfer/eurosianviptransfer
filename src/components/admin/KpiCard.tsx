"use client";

import React from "react";

type Props = {
  title: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
};

export default function KpiCard({ title, value, sub, icon }: Props) {
  return (
    <div className="admin-stat-card card">
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div className="admin-stat-icon">{icon ?? "📈"}</div>
        <div>
          <div className="admin-stat-title">{title}</div>
          <div className="admin-stat-value">{value}</div>
          {sub ? <div className="admin-helper" style={{ marginTop: 6 }}>{sub}</div> : null}
        </div>
      </div>
    </div>
  );
}
