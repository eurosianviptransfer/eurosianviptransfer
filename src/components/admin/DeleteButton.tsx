"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({ url, label = "Sil" }: { url: string; label?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handle = async () => {
    if (!confirm("Silinsin mi? Bu işlem geri alınamaz.")) return;
    setPending(true);
    try {
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => null);
      alert(data?.error || "Silme başarısız.");
    } catch {
      alert("Silme sırasında bir bağlantı hatası oluştu.");
    } finally {
      setPending(false);
    }
  };

  return (
    <button className="ev-btn ev-btn--danger" onClick={handle} disabled={pending}>
      {pending ? "Siliniyor…" : label}
    </button>
  );
}
