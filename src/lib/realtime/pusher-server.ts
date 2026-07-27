import Pusher from "pusher";

/**
 * Bölüm 1/2.3: misafirin takip sayfası ve admin'in "Canlı Operasyon Panosu"
 * anlık güncellenmeli. Her booking kendi kanalına yayın yapar: `booking-<code>`.
 * Ayrıca tüm admin ekranlarının dinleyebileceği genel `admin-operations` kanalı var.
 */
let pusherServer: Pusher | null = null;

function getPusherServer(): Pusher {
  if (pusherServer) return pusherServer;
  const { PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER } = process.env;
  if (!PUSHER_APP_ID || !PUSHER_KEY || !PUSHER_SECRET || !PUSHER_CLUSTER) {
    throw new Error("Pusher ortam değişkenleri eksik (.env.example'a bak).");
  }
  pusherServer = new Pusher({
    appId: PUSHER_APP_ID,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: PUSHER_CLUSTER,
    useTLS: true,
  });
  return pusherServer;
}

export interface BookingUpdateEvent {
  bookingId: string;
  code: string;
  status: string;
  driverName?: string | null;
  vehiclePlate?: string | null;
}

/**
 * Bir booking durumu her değiştiğinde çağrılır. API route'larda DB güncellemesinden
 * sonra fire-and-forget şeklinde çağrılmalı — Pusher hatası ana işlemi bloklamamalı.
 */
export async function publishBookingUpdate(event: BookingUpdateEvent): Promise<void> {
  try {
    const pusher = getPusherServer();
    await Promise.all([
      pusher.trigger(`booking-${event.code}`, "status-changed", event),
      pusher.trigger("admin-operations", "booking-updated", event),
    ]);
  } catch (err) {
    // Realtime bildirimi opsiyoneldir — asıl işlemi (DB güncellemesi) engellemez.
    console.error("Pusher yayını başarısız:", err);
  }
}
