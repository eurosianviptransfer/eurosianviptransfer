/**
 * Çalıştırma: npm run worker
 * Bu, Next.js dev/build sürecinden tamamen ayrı, sürekli çalışan bir Node.js
 * process'idir. Vercel'de deploy edilmez — Railway/Render/VPS'te ayrı bir
 * "worker" servisi olarak çalıştırılmalı (Bölüm 1'deki mimari not).
 */
import { createServer } from "node:http";
import { startWhatsAppWorker } from "./workers/whatsapp-worker";
import { startGuestNotificationWorker } from "./workers/guest-notification-worker";
import { getRedisConnection } from "./connection";

const whatsappWorker = startWhatsAppWorker();
const guestWorker = startGuestNotificationWorker();
const startedAt = new Date().toISOString();
let lastHeartbeat = Date.now();
const heartbeat = setInterval(() => {
  lastHeartbeat = Date.now();
}, 15_000);

const healthPort = Number(process.env.WORKER_HEALTH_PORT ?? 3001);
const healthServer = createServer(async (req, res) => {
  if (req.url !== "/health" && req.url !== "/healthz") {
    res.writeHead(404).end();
    return;
  }

  let redisHealthy = false;
  try {
    redisHealthy = (await getRedisConnection().ping()) === "PONG";
  } catch {
    redisHealthy = false;
  }
  const healthy = Date.now() - lastHeartbeat < 45_000 && redisHealthy && whatsappWorker.isRunning() && guestWorker.isRunning();
  res.writeHead(healthy ? 200 : 503, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: healthy ? "ok" : "degraded", startedAt, lastHeartbeat: new Date(lastHeartbeat).toISOString() }));
});
healthServer.listen(healthPort, "0.0.0.0", () => {
  console.log(`Worker health endpoint: :${healthPort}/health`);
});
console.log("Worker'lar çalışıyor: whatsapp-messages, guest-notifications");

process.on("SIGTERM", async () => {
  clearInterval(heartbeat);
  healthServer.close();
  await Promise.all([whatsappWorker.close(), guestWorker.close()]);
  process.exit(0);
});

process.on("SIGINT", async () => {
  clearInterval(heartbeat);
  healthServer.close();
  await Promise.all([whatsappWorker.close(), guestWorker.close()]);
  process.exit(0);
});
