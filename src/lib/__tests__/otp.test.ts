import { describe, it, expect } from "vitest";
import { generateOtp, verifyOtp, normalizePhone } from "../auth/otp";

describe("generateOtp", () => {
  it("6 haneli sayısal kod üretir", () => {
    const rec = generateOtp("+905551112233");
    expect(rec.code).toMatch(/^\d{6}$/);
    expect(rec.attempts).toBe(0);
  });
});

describe("verifyOtp", () => {
  const now = Date.now();
  const rec = generateOtp("+905551112233", now);

  it("doğru kod ve süre içinde ok:true döner", () => {
    expect(verifyOtp(rec, rec.code, now + 1000)).toEqual({ ok: true });
  });

  it("yanlış kod mismatch döner", () => {
    const wrong = rec.code === "000000" ? "111111" : "000000";
    expect(verifyOtp(rec, wrong, now + 1000)).toEqual({ ok: false, reason: "mismatch" });
  });

  it("süresi dolmuş OTP expired döner", () => {
    expect(verifyOtp(rec, rec.code, now + 6 * 60 * 1000)).toEqual({ ok: false, reason: "expired" });
  });

  it("çok fazla deneme sonrası too_many_attempts döner", () => {
    const maxedOut = { ...rec, attempts: 5 };
    expect(verifyOtp(maxedOut, rec.code, now + 1000)).toEqual({ ok: false, reason: "too_many_attempts" });
  });
});

describe("normalizePhone", () => {
  it("0 ile başlayan numarayı +90'a çevirir", () => {
    expect(normalizePhone("0555 111 22 33")).toBe("+905551112233");
  });
  it("zaten + ile başlıyorsa dokunmaz", () => {
    expect(normalizePhone("+905551112233")).toBe("+905551112233");
  });
  it("90 ile başlıyorsa + ekler", () => {
    expect(normalizePhone("905551112233")).toBe("+905551112233");
  });
});
