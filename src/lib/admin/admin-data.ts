export type AdminBookingStatus = "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED";
export type AdminPaymentStatus = "PAID" | "PENDING_CASH" | "FAILED";

export interface AdminBookingRow {
  id: string;
  pnrCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupLocation: string;
  dropoffLocation: string;
  vehicleType: string;
  date: string;
  time: string;
  passengers: number;
  luggage: number;
  amount: string;
  paymentStatus: AdminPaymentStatus;
  status: AdminBookingStatus;
}

export function normalizeBookingForAdmin(booking: any): AdminBookingRow {
  const vehicleType = booking.vehicleSize === "LARGE"
    ? "Mercedes Sprinter VIP"
    : "Mercedes Vito VIP Extra";

  const date = booking.scheduledAt
    ? new Date(booking.scheduledAt).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })
    : "-";

  const time = booking.scheduledAt
    ? new Date(booking.scheduledAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    : "-";

  const paymentStatus: AdminPaymentStatus = booking.paymentStatus === "PAID"
    ? "PAID"
    : booking.paymentStatus === "PENDING" || booking.paymentStatus === "AUTHORIZED"
      ? "PENDING_CASH"
      : "FAILED";

  const status: AdminBookingStatus = booking.status === "COMPLETED"
    ? "COMPLETED"
    : booking.status === "CANCELLED"
      ? "CANCELLED"
      : booking.status === "APPROVED" || booking.status === "ASSIGNED" || booking.status === "EN_ROUTE"
        ? "CONFIRMED"
        : "PENDING";

  return {
    id: booking.id,
    pnrCode: booking.code,
    customerName: booking.guestName ?? "-",
    customerPhone: booking.guestPhone ?? "-",
    customerEmail: booking.guestEmail ?? "-",
    pickupLocation: booking.originAirport ? `${booking.originAirport} Havalimanı` : "-",
    dropoffLocation: booking.destinationText ?? "-",
    vehicleType,
    date,
    time,
    passengers: booking.passengers ?? 0,
    luggage: booking.luggage ?? 0,
    amount: `€${Number(booking.price ?? 0).toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
    paymentStatus,
    status,
  };
}
