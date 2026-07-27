/**
 * Fiyatlandırma Motoru — saf fonksiyon.
 * Şartname Bölüm 6: bölge/otel bazlı taban fiyat + araç tipi ek ücreti.
 * Admin parametreleri (PricingRule/PayoutRule) dışarıdan enjekte edilir,
 * bu dosya hiçbir DB/network erişimi yapmaz — birim testi kolay olsun diye.
 */

export type VehicleSize = "SMALL" | "LARGE";

export interface PricingRuleInput {
  regionName: string;
  basePriceSmall: number;
  basePriceLarge: number;
  km: number;
}

export interface QuoteInput {
  rule: PricingRuleInput;
  vehicleSize: VehicleSize;
  hasReturnLeg: boolean;
  promoDiscountPercent?: number; // 0-100, Bölüm 15.4 promosyon kodu
}

export interface Quote {
  regionName: string;
  km: number;
  basePrice: number;
  returnLegPrice: number;
  discount: number;
  total: number;
}

export function quotePrice(input: QuoteInput): Quote {
  const { rule, vehicleSize, hasReturnLeg, promoDiscountPercent = 0 } = input;

  const basePrice = vehicleSize === "LARGE" ? rule.basePriceLarge : rule.basePriceSmall;
  const oneWaySubtotal = basePrice;
  const returnLegPrice = hasReturnLeg ? basePrice : 0;

  const subtotal = oneWaySubtotal + returnLegPrice;
  const discount = round2((subtotal * clampPercent(promoDiscountPercent)) / 100);
  const total = round2(subtotal - discount);

  return {
    regionName: rule.regionName,
    km: rule.km,
    basePrice: round2(basePrice),
    returnLegPrice: round2(returnLegPrice),
    discount,
    total,
  };
}

/**
 * Bekleme süresi kuralı (Bölüm 15.1): ücretsiz süreyi aşan dakikalar için
 * dakika başı ek ücret hesaplar. Aşım yoksa 0 döner.
 */
export function calculateWaitingFee(params: {
  waitedMinutes: number;
  freeMinutes: number;
  perMinuteFee: number;
}): number {
  const overage = Math.max(0, params.waitedMinutes - params.freeMinutes);
  return round2(overage * params.perMinuteFee);
}

function clampPercent(p: number): number {
  return Math.min(100, Math.max(0, p));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
