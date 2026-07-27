import { Worker } from "bullmq";
import { getRedisConnection } from "../connection";
import { getWhatsAppProvider } from "@/lib/providers/whatsapp";
import { getTranslationProvider } from "@/lib/providers/translation";
import type { GuestNotificationJobData } from "../queues";

export function startGuestNotificationWorker() {
  const worker = new Worker<GuestNotificationJobData>(
    "guest-notifications",
    async (job) => {
      const { toPhone, targetLang, textTr } = job.data;

      const text = targetLang.toUpperCase() === "TR" ? textTr : await translate(textTr, targetLang);

      const provider = getWhatsAppProvider();
      return provider.sendTemplateMessage({
        toPhone,
        templateName: process.env.WHATSAPP_PROVIDER === "meta" ? "guest_notification" : "guest_notification_freeform",
        language: targetLang,
        variables: { text },
      });
    },
    { connection: getRedisConnection(), concurrency: 5 }
  );

  worker.on("completed", (job) => {
    console.log(`✓ Misafir bildirimi gönderildi (${job.data.targetLang}) → ${job.data.toPhone}`);
  });
  worker.on("failed", (job, err) => {
    console.error(`✗ Misafir bildirimi gönderilemedi → ${job?.data.toPhone}:`, err.message);
  });

  return worker;
}

async function translate(text: string, targetLang: string): Promise<string> {
  try {
    return await getTranslationProvider(targetLang).translate(text, targetLang);
  } catch (err) {
    console.error(`Çeviri başarısız (${targetLang}), Türkçe orijinal gönderiliyor:`, err);
    return text; // Çeviri API'si çökerse misafir en azından Türkçe mesajı alır.
  }
}
