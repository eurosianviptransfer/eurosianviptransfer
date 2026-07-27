"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PusherClient from "pusher-js";

/**
 * Misafirin takip sayfasında görünmez bir dinleyici: `booking-<code>` kanalında
 * bir durum değişikliği yayınlanınca sayfayı yeniden çeker (Next.js router.refresh
 * server component'i yeniden render eder, tam sayfa reload olmaz).
 */
export function BookingRealtimeListener({ code }: { code: string }) {
  const router = useRouter();

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!key || !cluster) return; // Pusher yapılandırılmamışsa sessizce atla

    const pusher = new PusherClient(key, { cluster });
    const channel = pusher.subscribe(`booking-${code}`);
    channel.bind("status-changed", () => {
      router.refresh();
    });

    return () => {
      pusher.unsubscribe(`booking-${code}`);
      pusher.disconnect();
    };
  }, [code, router]);

  return null;
}
