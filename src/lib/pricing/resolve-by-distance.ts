/**
 * Bölüm 6: Google Distance Matrix'ten gelen km değeri, admin'in tanımladığı
 * PricingRule tablosuyla eşleştirilir. Tam eşleşme yoksa (yeni bir otel/bölge,
 * henüz tabloya girilmemiş), en yakın iki bölge arasında km bazlı doğrusal
 * interpolasyonla bir tahmini fiyat üretilir — admin daha sonra bu bölgeyi
 * kalıcı olarak tabloya ekleyebilir. Saf fonksiyon: DB/network erişimi yok.
 */

export interface PricingRuleLike {
  regionName: string;
  km: number;
  basePriceSmall: number;
  basePriceLarge: number;
}

export type VehicleSize = "SMALL" | "LARGE";

export interface ResolvedPrice {
  regionName: string;
  km: number;
  basePrice: number;
  isEstimate: boolean; // true ise: tam eşleşme yok, interpolasyonla tahmin edildi
  matchedRuleKm?: number; // en yakın eşleşen kuralın km'si (referans için)
}

const EXACT_MATCH_TOLERANCE_KM = 2; // ±2 km içindeyse "aynı bölge" say

export function resolvePriceForKm(
  actualKm: number,
  rules: PricingRuleLike[],
  vehicleSize: VehicleSize,
  destinationLabel: string
): ResolvedPrice {
  if (rules.length === 0) {
    throw new Error("Fiyat tablosu boş — admin en az bir PricingRule tanımlamalı.");
  }

  const sorted = [...rules].sort((a, b) => a.km - b.km);

  // 1) Tam eşleşme (tolerans içinde) ara.
  const exact = sorted.find((r) => Math.abs(r.km - actualKm) <= EXACT_MATCH_TOLERANCE_KM);
  if (exact) {
    return {
      regionName: exact.regionName,
      km: actualKm,
      basePrice: priceFor(exact, vehicleSize),
      isEstimate: false,
      matchedRuleKm: exact.km,
    };
  }

  // 2) actualKm, tablodaki en düşük km'den küçükse: en yakın (en düşük) bölgeyi kullan.
  if (actualKm <= sorted[0].km) {
    return {
      regionName: destinationLabel,
      km: actualKm,
      basePrice: priceFor(sorted[0], vehicleSize),
      isEstimate: true,
      matchedRuleKm: sorted[0].km,
    };
  }

  // 3) actualKm, tablodaki en yüksek km'den büyükse: en uzak bölgenin oran(₺/km)ını uzat.
  const last = sorted[sorted.length - 1];
  if (actualKm >= last.km) {
    const perKm = priceFor(last, vehicleSize) / last.km;
    return {
      regionName: destinationLabel,
      km: actualKm,
      basePrice: round2(perKm * actualKm),
      isEstimate: true,
      matchedRuleKm: last.km,
    };
  }

  // 4) actualKm iki bölge arasında: doğrusal interpolasyon.
  const upperIdx = sorted.findIndex((r) => r.km >= actualKm);
  const lower = sorted[upperIdx - 1];
  const upper = sorted[upperIdx];
  const ratio = (actualKm - lower.km) / (upper.km - lower.km);
  const lowerPrice = priceFor(lower, vehicleSize);
  const upperPrice = priceFor(upper, vehicleSize);
  const interpolated = lowerPrice + ratio * (upperPrice - lowerPrice);

  return {
    regionName: destinationLabel,
    km: actualKm,
    basePrice: round2(interpolated),
    isEstimate: true,
    matchedRuleKm: undefined,
  };
}

function priceFor(rule: PricingRuleLike, vehicleSize: VehicleSize): number {
  return vehicleSize === "LARGE" ? rule.basePriceLarge : rule.basePriceSmall;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
