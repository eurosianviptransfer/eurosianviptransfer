import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOtp, normalizePhone } from "@/lib/auth/otp";
import { getOtpStore } from "@/lib/auth/otp-store";
import { enqueueWhatsAppMessage } from "@/lib/queue/queues";

const requests = new Map<string, { count: number; resetAt: number }>();

/**
 * POST /api/auth/otp/request
 * Body: { phone }
 * Şoför/karşılamacı giriş ekranında "Kod Gönder" butonuna basınca çağrılır.
 * Kayıtlı olmayan bir numara için de aynı genel mesaj döner (numara enumeration
 * riskini azaltmak için) — ama OTP sadece gerçek kullanıcıya gönderilir.
 * Gönderim kuyruğa alınır: worker sağlıklıysa saniyeler içinde iletilir, ama
 * Twilio API'si yavaşsa bile bu istek (ve dolayısıyla "Kod Gönder" butonu) beklemez.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.phone !== "string" || !body.phone.trim()) return NextResponse.json({ error: "phone gerekli." }, { status: 400 });

  const phone = normalizePhone(body.phone);
  const now = Date.now();
  const current = requests.get(phone);
  if (current && current.resetAt > now && current.count >= 3) {
    return NextResponse.json({ error: "Çok fazla kod isteği. Lütfen daha sonra tekrar deneyin." }, { status: 429 });
  }
  requests.set(phone, current && current.resetAt > now ? { count: current.count + 1, resetAt: current.resetAt } : { count: 1, resetAt: now + 60_000 });
  const user = await prisma.user.findUnique({ where: { phone } });

  let devCode: string | undefined;
  if (user && ["DRIVER", "GREETER"].includes(user.role) && user.active) {
    const record = generateOtp(phone);
    await getOtpStore().set(phone, record);

    await enqueueWhatsAppMessage({
      toPhone: phone,
      templateName: "otp_code",
      variables: { code: record.code },
    });

    // Twilio/Redis kurulmadan yerel test için: TWILIO_ACCOUNT_SID tanımlı değilse
    // (yani gerçek gönderim zaten çalışmayacaksa) kodu terminale de yazdır.
    // Prodüksiyonda TWILIO_ACCOUNT_SID her zaman tanımlı olacağı için bu satır
    // asla canlı ortamda tetiklenmez.
    if (!process.env.TWILIO_ACCOUNT_SID) {
      devCode = record.code;
      console.log(`[DEV] ${phone} için OTP kodu: ${record.code}`);
    }
  }

  // Numara kayıtlı değilse de aynı yanıt — bilgi sızdırmamak için.
  return NextResponse.json({
    message: "Numaranız kayıtlıysa bir doğrulama kodu gönderildi.",
    ...(process.env.NODE_ENV !== "production" && devCode ? { devCode } : {}),
  });
}
