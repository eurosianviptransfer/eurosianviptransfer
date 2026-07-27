"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DriverActionButton({
  bookingId,
  action,
  label,
}: {
  bookingId: string;
  action: "pickup" | "dropoff";
  label: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      className="ev-btn"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/bookings/${bookingId}/driver/${action}`, { method: "POST" });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error);
          router.refresh();
        } catch (e) {
          alert((e as Error).message);
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? "…" : label}
    </button>
  );
}
