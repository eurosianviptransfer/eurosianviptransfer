"use client";
import React from "react";

export function DeleteButton({ url, label = "Sil" }: { url: string; label?: string }) {
  const handle = async () => {
    if (!confirm('Silinsin mi?')) return;
    const res = await fetch(url, { method: "DELETE" });
    if (res.ok) location.reload();
    else alert('Silme başarısız');
  };
  return <button className="ev-btn ev-btn--danger" onClick={handle}>{label}</button>;
}
