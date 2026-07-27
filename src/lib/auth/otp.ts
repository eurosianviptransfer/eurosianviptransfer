import { randomInt } from "crypto";

/**
 * SMS OTP — şoför/karşılamacı sahada telefonla giriş (Bölüm 1: "telefon numarası +
 * SMS OTP, sahada pratik"). Saf fonksiyonlar: OTP üretimi/doğrulaması DB'den
 * bağımsız test edilebilsin diye (Talimat Bölüm 16).
 */

export interface OtpRecord {
  code: string;
  phone: string;
  expiresAt: number; // epoch ms
  attempts: number;
}

const OTP_LENGTH = 6;
const OTP_TTL_MS = 5 * 60 * 1000; // 5 dakika
const MAX_ATTEMPTS = 5;

export function generateOtp(phone: string, now: number = Date.now()): OtpRecord {
  const code = randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, "0");
  return { code, phone, expiresAt: now + OTP_TTL_MS, attempts: 0 };
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "expired" | "mismatch" | "too_many_attempts" };

export function verifyOtp(record: OtpRecord, submittedCode: string, now: number = Date.now()): VerifyResult {
  if (record.attempts >= MAX_ATTEMPTS) return { ok: false, reason: "too_many_attempts" };
  if (now > record.expiresAt) return { ok: false, reason: "expired" };
  if (record.code !== submittedCode) return { ok: false, reason: "mismatch" };
  return { ok: true };
}

/** Basit telefon normalizasyonu — +90 önekini garanti eder (TR odaklı sahada kullanım). */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("0")) return `+90${digits.slice(1)}`;
  if (digits.startsWith("90")) return `+${digits}`;
  return `+90${digits}`;
}
