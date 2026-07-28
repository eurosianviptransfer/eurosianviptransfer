"use client";

import { useEffect } from "react";

export function OnlineTracker({ currentUserId }: { currentUserId?: string }) {
  useEffect(() => {
    if (!currentUserId) return;

    const sendHeartbeat = async () => {
      try {
        await fetch("/api/auth/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId }),
        });
      } catch (e) {
        // Sessiz geç
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 30000); // Her 30 saniyede bir
    return () => clearInterval(interval);
  }, [currentUserId]);

  return null;
}