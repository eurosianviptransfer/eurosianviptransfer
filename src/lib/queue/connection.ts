import IORedis from "ioredis";

/**
 * BullMQ, ioredis bağlantısının maxRetriesPerRequest:null olmasını zorunlu kılar
 * (aksi halde worker'lar sessizce hata verir). Tek bağlantı hem queue hem worker
 * tarafında paylaşılır.
 */
let connection: IORedis | null = null;

export function getRedisConnection(): IORedis {
  if (connection) return connection;
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL eksik (Upstash Redis) — .env.example'a bak.");
  connection = new IORedis(url, { maxRetriesPerRequest: null });
  return connection;
}
