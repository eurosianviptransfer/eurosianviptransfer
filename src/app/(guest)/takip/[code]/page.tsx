import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { BookingRealtimeListener } from "@/components/BookingRealtimeListener";
import { airports } from "@/lib/airports";
import { headers } from "next/headers";
import { checkRateLimit, getClientIp } from "@/lib/security/request-controls";

export const dynamic = "force-dynamic";

const STAGE_LABEL: Record<string, string> = {
  PENDING_APPROVAL: "Onay Bekliyor",
  APPROVED: "Atama Bekleniyor",
  ASSIGNED: "Atandı",
  GREETER_CONFIRMED: "Karşılamacıda",
  EN_ROUTE: "Yolda",
  DROPPED_OFF: "Otelde Bırakıldı",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal Edildi",
};

export default async function TakipPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const requestHeaders = await headers();
  const rate = await checkRateLimit(`tracking-page:${getClientIp(requestHeaders)}`, 30, 60);
  if (!rate.allowed) return notFound();

  const booking = await prisma.booking.findUnique({
    where: { code },
    select: {
      code: true,
      originAirport: true,
      destinationText: true,
      flightNumber: true,
      scheduledAt: true,
      price: true,
      currency: true,
      paymentStatus: true,
      paymentMethod: true,
      status: true,
    },
  });
  if (!booking) return notFound();
  const airportName = airports.find((airport) => airport.code === booking.originAirport)?.code ?? booking.originAirport;

  return (
    <main className="ev-page">
      <BookingRealtimeListener code={booking.code} />
      <div className="ev-eyebrow">Eurosian VIP Transfer</div>
      <h1 className="ev-h1">Rezervasyon {booking.code}</h1>
      <div className="ev-card" style={{ marginTop: 12 }}>
        <span className="ev-badge ev-badge--gold" style={{ fontSize: 13 }}>{STAGE_LABEL[booking.status]}</span>
      <div style={{ marginTop: 10, fontSize: 14 }}>{airportName} → {booking.destinationText}</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
          {booking.flightNumber ? `Uçuş ${booking.flightNumber} · ` : ""}
          {booking.paymentStatus === "PAID" ? "Kartla ödendi" : booking.paymentMethod === "PAY_NOW_CARD" ? "Ödeme bekleniyor" : "Araçta ödenecek"} · €{booking.price}
        </div>
      </div>
    </main>
  );
}
