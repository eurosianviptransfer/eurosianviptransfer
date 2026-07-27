/**
 * Bölüm 3 iş kuralı: küçük araçlarda (Vito/Transporter/Caravelle) karşılamacı
 * ZORUNLU; büyük araçlarda (Sprinter/midibüs/otobüs) OPSİYONEL.
 * Bu, hem atama ekranında validasyon hem de durum makinesinde hangi
 * aşamaların var olduğunu belirler — tek yerden yönetilsin diye saf fonksiyon.
 */

export type VehicleSize = "SMALL" | "LARGE";

export type BookingStatus =
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "ASSIGNED"
  | "GREETER_CONFIRMED"
  | "EN_ROUTE"
  | "DROPPED_OFF"
  | "COMPLETED"
  | "CANCELLED";

export function isGreeterRequired(vehicleSize: VehicleSize): boolean {
  return vehicleSize === "SMALL";
}

/** Bir atamanın geçerli olup olmadığını kontrol eder. */
export function validateAssignment(params: {
  vehicleSize: VehicleSize;
  greeterId?: string | null;
  driverFee?: number | null;
  greeterFee?: number | null;
}): { valid: boolean; reason?: string } {
  if (!params.driverFee || params.driverFee <= 0) {
    return { valid: false, reason: "Şoför ücreti girilmeli." };
  }
  if (isGreeterRequired(params.vehicleSize)) {
    if (!params.greeterId) {
      return { valid: false, reason: "Küçük araçta karşılamacı ataması zorunludur." };
    }
    if (!params.greeterFee || params.greeterFee <= 0) {
      return { valid: false, reason: "Karşılamacı ücreti girilmeli." };
    }
  }
  return { valid: true };
}

/**
 * Araç ve atama durumuna göre geçerli durum sırası.
 * Büyük araçlarda karşılamacı opsiyoneldir; atanmışsa küçük araçlardaki
 * karşılamacı onay adımı aynı şekilde uygulanır.
 */
export function stagesFor(vehicleSize: VehicleSize, hasGreeter = false): BookingStatus[] {
  return vehicleSize === "SMALL" || hasGreeter
    ? ["PENDING_APPROVAL", "APPROVED", "ASSIGNED", "GREETER_CONFIRMED", "EN_ROUTE", "DROPPED_OFF", "COMPLETED"]
    : ["PENDING_APPROVAL", "APPROVED", "ASSIGNED", "EN_ROUTE", "DROPPED_OFF", "COMPLETED"];
}

/** Bir durumdan sonra izin verilen geçerli sonraki durumlar. */
export function nextAllowedStatuses(current: BookingStatus, vehicleSize: VehicleSize, hasGreeter = false): BookingStatus[] {
  const stages = stagesFor(vehicleSize, hasGreeter);
  const idx = stages.indexOf(current);
  if (idx === -1 || idx === stages.length - 1) return ["CANCELLED"];
  return [stages[idx + 1], "CANCELLED"];
}

export function canTransition(current: BookingStatus, target: BookingStatus, vehicleSize: VehicleSize, hasGreeter = false): boolean {
  return nextAllowedStatuses(current, vehicleSize, hasGreeter).includes(target);
}
