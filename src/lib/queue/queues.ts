import { Queue } from "bullmq";
import { getRedisConnection } from "./connection";

/**
 * Bölüm 1: "WhatsApp gönderimi ve çeviri kuyruğa alınmalı, API isteğini bloklamamalı".
 * Örneğin admin "Ata" butonuna bastığında WhatsApp API 3-4 saniye sürebilir/timeout
 * olabilir — bu, atama işleminin kendisini (DB güncellemesi) asla engellememeli.
 */
export interface WhatsAppJobData {
  toPhone: string;
  templateName: string;
  variables: Record<string, string>;
}

let whatsappQueue: Queue<WhatsAppJobData> | null = null;

export function getWhatsAppQueue(): Queue<WhatsAppJobData> {
  if (whatsappQueue) return whatsappQueue;
  whatsappQueue = new Queue<WhatsAppJobData>("whatsapp-messages", {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: { count: 200 },
      removeOnFail: { count: 500 }, // başarısızlar admin panelinde incelenebilsin diye tutulur
    },
  });
  return whatsappQueue;
}

/**
 * API route'larda `await whatsapp.sendTemplateMessage(...)` yerine bu çağrılır.
 * Enqueue işlemi milisaniyeler sürer — asıl gönderim worker'da arka planda olur.
 */
export async function enqueueWhatsAppMessage(data: WhatsAppJobData): Promise<void> {
  try {
    await getWhatsAppQueue().add("send", data);
  } catch (err) {
    // Redis'e ulaşılamıyorsa (örn. yerel geliştirmede kurulmamışsa) sessizce logla —
    // WhatsApp bildirimi opsiyoneldir, asıl booking işlemini engellememeli.
    console.error("WhatsApp job kuyruğa eklenemedi:", err);
  }
}

/**
 * Bölüm 1: misafire onay mesajı KENDİ diline çevrilerek gönderilmeli. Çeviri +
 * WhatsApp gönderimi tek bir job'da birleştirildi (ikisi de dış API çağrısı,
 * ikisini de worker'da arka planda yapmak API isteğini bloklamaz).
 */
export interface GuestNotificationJobData {
  toPhone: string;
  targetLang: string; // "TR" ise çeviri atlanır
  textTr: string; // Türkçe orijinal metin
}

let guestNotificationQueue: Queue<GuestNotificationJobData> | null = null;

export function getGuestNotificationQueue(): Queue<GuestNotificationJobData> {
  if (guestNotificationQueue) return guestNotificationQueue;
  guestNotificationQueue = new Queue<GuestNotificationJobData>("guest-notifications", {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: { count: 200 },
      removeOnFail: { count: 500 },
    },
  });
  return guestNotificationQueue;
}

export async function enqueueGuestNotification(data: GuestNotificationJobData): Promise<void> {
  try {
    await getGuestNotificationQueue().add("notify", data);
  } catch (err) {
    console.error("Misafir bildirimi kuyruğa eklenemedi:", err);
  }
}
