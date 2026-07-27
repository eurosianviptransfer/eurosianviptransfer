import { createHash } from "node:crypto";
import { getRedisConnection } from "@/lib/queue/connection";

interface MemoryCounter {
  count: number;
  resetAt: number;
}

interface MemoryCacheEntry {
  value: string;
  expiresAt: number;
}

const memoryCounters = new Map<string, MemoryCounter>();
const memoryCache = new Map<string, MemoryCacheEntry>();

export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    || headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || headers.get("x-real-ip")?.trim()
    || "unknown"
  );
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; remaining: number; retryAfterSeconds: number }> {
  if (process.env.REDIS_URL) {
    try {
      const redis = getRedisConnection();
      const redisKey = `rate:${key}`;
      const count = await redis.incr(redisKey);
      if (count === 1) await redis.expire(redisKey, windowSeconds);
      return {
        allowed: count <= limit,
        remaining: Math.max(0, limit - count),
        retryAfterSeconds: windowSeconds,
      };
    } catch (error) {
      console.error("Dağıtık rate limit kullanılamadı; bellek fallback'i devrede:", error);
    }
  }

  const now = Date.now();
  const current = memoryCounters.get(key);
  const counter = !current || current.resetAt <= now
    ? { count: 0, resetAt: now + windowSeconds * 1000 }
    : current;
  counter.count += 1;
  memoryCounters.set(key, counter);
  return {
    allowed: counter.count <= limit,
    remaining: Math.max(0, limit - counter.count),
    retryAfterSeconds: Math.max(1, Math.ceil((counter.resetAt - now) / 1000)),
  };
}

export async function readThroughCache<T>(
  namespace: string,
  input: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
): Promise<T> {
  const key = `${namespace}:${createHash("sha256").update(input).digest("hex")}`;

  if (process.env.REDIS_URL) {
    try {
      const cached = await getRedisConnection().get(`cache:${key}`);
      if (cached) return JSON.parse(cached) as T;
      const value = await loader();
      await getRedisConnection().set(`cache:${key}`, JSON.stringify(value), "EX", ttlSeconds);
      return value;
    } catch (error) {
      console.error("Redis cache kullanılamadı; bellek fallback'i devrede:", error);
    }
  }

  const now = Date.now();
  const local = memoryCache.get(key);
  if (local && local.expiresAt > now) return JSON.parse(local.value) as T;

  const value = await loader();
  memoryCache.set(key, { value: JSON.stringify(value), expiresAt: now + ttlSeconds * 1000 });
  return value;
}

export function rateLimitResponse(retryAfterSeconds: number) {
  return new Response(JSON.stringify({ error: "Çok fazla istek. Lütfen daha sonra tekrar deneyin." }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(retryAfterSeconds),
    },
  });
}
