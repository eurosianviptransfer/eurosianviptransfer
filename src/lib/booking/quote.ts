import { z } from "zod";
import { prisma } from "@/lib/db";
import { getDistanceFromAirport } from "@/lib/providers/maps/distance-matrix";
import { resolvePriceForKm } from "@/lib/pricing/resolve-by-distance";
import { airportCodes, type AirportCode } from "@/lib/airports";

export const vehicleSizeSchema = z.enum(["SMALL", "LARGE"]);
export const paymentMethodSchema = z.enum(["PAY_NOW_CARD", "PAY_IN_VEHICLE"]);
export const airportCodeSchema = z.enum(airportCodes as [string, ...string[]]);

function emptyToUndefined(value: unknown) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

const optionalTextSchema = z.preprocess(emptyToUndefined, z.string().min(1).optional());
const optionalEmailSchema = z.preprocess(emptyToUndefined, z.string().email().optional());
const optionalLanguageSchema = z.preprocess(
  emptyToUndefined,
  z.string().min(2).max(8).optional()
).transform((value) => value ?? "TR");

export const quoteRequestSchema = z.object({
  originAirport: airportCodeSchema.default("AYT"),
  destinationLat: z.coerce.number(),
  destinationLng: z.coerce.number(),
  destinationLabel: z.string().trim().min(2, "destinationLabel gerekli."),
  vehicleSize: vehicleSizeSchema,
  hasReturnLeg: z.coerce.boolean().default(false),
});

export const bookingRequestSchema = z.object({
  originAirport: airportCodeSchema.default("AYT"),
  guestName: z.string().trim().min(2, "guestName gerekli."),
  guestPhone: z.string().trim().min(7, "guestPhone gerekli."),
  guestEmail: optionalEmailSchema,
  guestLanguage: optionalLanguageSchema,
  destinationText: z.string().trim().min(2, "destinationText gerekli."),
  regionName: optionalTextSchema,
  destinationLat: z.coerce.number().optional(),
  destinationLng: z.coerce.number().optional(),
  flightNumber: optionalTextSchema,
  scheduledAt: z.coerce.date().refine((value) => value.getTime() > Date.now(), "Transfer zamanı gelecekte olmalı."),
  passengers: z.coerce.number().int().positive(),
  luggage: z.coerce.number().int().min(0).default(0),
  vehicleSize: vehicleSizeSchema,
  needsChildSeat: z.coerce.boolean().default(false),
  needsWheelchair: z.coerce.boolean().default(false),
  hasReturnLeg: z.coerce.boolean().default(false),
  paymentMethod: paymentMethodSchema,
  promoCode: optionalTextSchema,
}).refine(
  (value) =>
    (typeof value.destinationLat === "number" && typeof value.destinationLng === "number") ||
    typeof value.regionName === "string",
  {
    message: "Adres seçimi veya bölge adı gerekli.",
    path: ["destinationText"],
  }
);

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
export type BookingRequest = z.infer<typeof bookingRequestSchema>;

export async function buildBookingQuote(input: QuoteRequest) {
  const [rules, distance] = await Promise.all([
    prisma.pricingRule.findMany({ where: { active: true } }),
    getDistanceFromAirport(input.destinationLat, input.destinationLng, input.originAirport as AirportCode),
  ]);

  if (rules.length === 0) {
    throw new Error("Fiyat tablosu boş.");
  }

  const resolved = resolvePriceForKm(distance.km, rules, input.vehicleSize, input.destinationLabel);
  const total = input.hasReturnLeg ? resolved.basePrice * 2 * 0.9 : resolved.basePrice;

  return {
    km: resolved.km,
    regionName: resolved.regionName,
    basePrice: resolved.basePrice,
    total,
    returnDiscount: input.hasReturnLeg ? 0.1 : 0,
    isEstimate: resolved.isEstimate,
    note: resolved.isEstimate
      ? "Bu bölge fiyat tablosunda henüz tanımlı değil — mesafeye göre tahmini fiyat gösteriliyor."
      : undefined,
  };
}
