import { Worker } from "bullmq";
import { getRedisConnection } from "../connection";
import { getWhatsAppProvider } from "@/lib/providers/whatsapp";
import type { WhatsAppJobData } from "../queues";

/**
 * Bu worker Next.js API route'larından AYRI bir process olarak çalışır
 * (Vercel serverless fonksiyonları uzun süreli process barındıramaz).
 * Ayrı bir Node.js process olarak (örn. Railway/Render'da "worker" servisi
 * ya da VPS'te pm2 ile) `npm run worker` komutuyla başlatılır.
 */
export function startWhatsAppWorker() {
  const worker = new Worker<WhatsAppJobData>(
    "whatsapp-messages",
    async (job) => {
      const provider = getWhatsAppProvider();
      const result = await provider.sendTemplateMessage(job.data);
      return result;
    },
    { connection: getRedisConnection(), concurrency: 5 }
  );

  worker.on("completed", (job) => {
    console.log(`✓ WhatsApp gönderildi — job ${job.id} → ${job.data.toPhone}`);
  });

  worker.on("failed", (job, err) => {
    console.error(`✗ WhatsApp gönderilemedi — job ${job?.id} → ${job?.data.toPhone}:`, err.message);
  });

  return worker;
}
