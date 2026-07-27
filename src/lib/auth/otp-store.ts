import type { OtpRecord } from "./otp";
import { getRedisConnection } from "@/lib/queue/connection";

/**
 * ÖNEMLİ: Vercel serverless fonksiyonları arasında bellek paylaşılmaz — yani
 * process-in-memory bir Map, prod'da "kod isteği" ve "kod doğrulama" farklı
 * instance'lara denk gelirse çalışmaz. Bu yüzden REDIS_URL tanımlıysa
 * Redis-backed store kullanılır (Upstash); tanımlı değilse (yerel geliştirme,
 * Redis kurulmadan hızlı test) bellek içi store'a düşer.
 */
export interface OtpStore {
  get(phone: string): Promise<OtpRecord | undefined>;
  set(phone: string, record: OtpRecord): Promise<void>;
  delete(phone: string): Promise<void>;
}

class InMemoryOtpStore implements OtpStore {
  private map = new Map<string, OtpRecord>();
  async get(phone: string) {
    return this.map.get(phone);
  }
  async set(phone: string, record: OtpRecord) {
    this.map.set(phone, record);
  }
  async delete(phone: string) {
    this.map.delete(phone);
  }
}

class RedisOtpStore implements OtpStore {
  async get(phone: string): Promise<OtpRecord | undefined> {
    const raw = await getRedisConnection().get(`otp:${phone}`);
    return raw ? JSON.parse(raw) : undefined;
  }

  async set(phone: string, record: OtpRecord): Promise<void> {
    // TTL, OTP_TTL_MS ile hizalı — kayıt kendiliğinden süresi dolunca Redis'ten
    // silinir, ekstra bir temizlik job'una ihtiyaç yok.
    const ttlSeconds = Math.max(1, Math.ceil((record.expiresAt - Date.now()) / 1000));
    await getRedisConnection().set(`otp:${phone}`, JSON.stringify(record), "EX", ttlSeconds);
  }

  async delete(phone: string): Promise<void> {
    await getRedisConnection().del(`otp:${phone}`);
  }
}

let singleton: OtpStore | null = null;

export function getOtpStore(): OtpStore {
  if (singleton) return singleton;
  singleton = process.env.REDIS_URL ? new RedisOtpStore() : new InMemoryOtpStore();
  return singleton;
}
