import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  create: vi.fn(),
  pricingFindFirst: vi.fn(),
  enqueueGuestNotification: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    booking: {
      findUnique: mocks.findUnique,
      create: mocks.create,
    },
    pricingRule: {
      findFirst: mocks.pricingFindFirst,
    },
  },
}));

vi.mock("@/lib/queue/queues", () => ({
  enqueueGuestNotification: mocks.enqueueGuestNotification,
}));

const { POST } = await import("../bookings/route");

const booking = {
  id: "booking-1",
  code: "EVT-ABCDEF1234567890",
  idempotencyKey: "key-1",
  guestName: "Test Guest",
  guestPhone: "+905551112233",
  guestLanguage: "TR",
  originAirport: "AYT",
  destinationText: "Belek",
  regionName: "Belek",
  km: 35,
  scheduledAt: new Date(Date.now() + 86_400_000),
  passengers: 2,
  luggage: 0,
  vehicleSize: "SMALL",
  needsChildSeat: false,
  needsWheelchair: false,
  hasReturnLeg: false,
  price: 40,
  currency: "EUR",
  paymentMethod: "PAY_IN_VEHICLE",
  paymentStatus: "UNPAID",
  status: "PENDING_APPROVAL",
  createdAt: new Date(),
  updatedAt: new Date(),
};

function request(ip: string, key = "key-1") {
  return new NextRequest("http://localhost/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": key, "x-forwarded-for": ip },
    body: JSON.stringify({
      guestName: "Test Guest",
      guestPhone: "+905551112233",
      regionName: "Belek",
      destinationText: "Belek",
      vehicleSize: "SMALL",
      passengers: 2,
      scheduledAt: new Date(Date.now() + 86_400_000).toISOString(),
      paymentMethod: "PAY_IN_VEHICLE",
    }),
  });
}

describe("POST /api/bookings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.pricingFindFirst.mockResolvedValue({ regionName: "Belek", km: 35, basePriceSmall: 40, basePriceLarge: 55, active: true });
    mocks.findUnique.mockResolvedValue(null);
    mocks.create.mockResolvedValue(booking);
    mocks.enqueueGuestNotification.mockResolvedValue(undefined);
  });

  it("geçersiz JSON'u 400 döndürür", async () => {
    const response = await POST(new NextRequest("http://localhost/api/bookings", {
      method: "POST",
      headers: { "Idempotency-Key": "bad-json", "x-forwarded-for": "192.0.2.10" },
      body: "{",
    }));

    expect(response.status).toBe(400);
  });

  it("aynı idempotency key ile ikinci istekte yeni rezervasyon oluşturmaz", async () => {
    const first = await POST(request("192.0.2.11"));
    expect(first.status).toBe(201);

    mocks.findUnique.mockResolvedValue({ ...booking, paymentAttempts: [] });
    const second = await POST(request("192.0.2.11"));
    const json = await second.json();

    expect(second.status).toBe(200);
    expect(json.replayed).toBe(true);
    expect(json.booking.idempotencyKey).toBeUndefined();
    expect(mocks.create).toHaveBeenCalledTimes(1);
  });
});
