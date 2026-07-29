import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/auth/otp";
import { checkRateLimit } from "@/lib/security/request-controls";

function publicApplication(application: any) {
  return { applicationNo: application.applicationNo, fullName: application.fullName, phone: application.phone, email: application.email, status: application.status, rejectionReason: application.rejectionReason, updatedAt: application.updatedAt };
}

export async function POST(req: NextRequest) {
  try {
    const rate = await checkRateLimit(`greeter-application:${req.headers.get("x-forwarded-for") ?? "unknown"}`, 5, 3600);
    if (!rate.allowed) return NextResponse.json({ error: "Çok fazla başvuru denemesi. Lütfen daha sonra tekrar deneyin." }, { status: 429 });

    const body = await req.json().catch(() => null);
    if (!body || typeof body.fullName !== "string" || typeof body.phone !== "string") return NextResponse.json({ error: "Ad ve telefon zorunludur." }, { status: 400 });

    const phone = normalizePhone(body.phone);
    const experienceYears = body.experienceYears == null ? null : Number(body.experienceYears);

    if (!phone) return NextResponse.json({ error: "Telefon geçersiz." }, { status: 400 });

    const images: string[] = Array.isArray(body.imageUrls) ? body.imageUrls.filter((item: unknown): item is string => typeof item === "string").slice(0, 3) : [];

    const duplicate = await prisma.greeterApplication.findFirst({ where: { phone, status: { in: ["PENDING", "APPROVED"] } } });
    const existingUser = await prisma.user.findFirst({ where: { phone } });
    if (duplicate || existingUser) return NextResponse.json({ error: "Bu telefon ile aktif bir başvuru/kayıt zaten bulunuyor." }, { status: 409 });

    const application = await prisma.greeterApplication.create({ data: { applicationNo: `EVT-KAR-${String(Math.floor(1000 + Math.random() * 9000))}`, fullName: body.fullName.trim().slice(0, 120), phone, email: typeof body.email === "string" ? body.email.trim().slice(0, 160) || null : null, address: typeof body.address === "string" ? body.address.trim().slice(0, 300) || null : null, experienceYears, languages: Array.isArray(body.languages) ? body.languages.filter((item: unknown): item is string => typeof item === "string").slice(0, 10) : [], imageUrls: images, notes: typeof body.notes === "string" ? body.notes.trim().slice(0, 1000) || null : null } });

    return NextResponse.json({ application: publicApplication(application) }, { status: 201 });
  } catch (err) {
    console.error("/api/greeter-applications POST error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Sunucu hatası: " + message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const applicationNo = req.nextUrl.searchParams.get("applicationNo")?.trim();
    const phone = req.nextUrl.searchParams.get("phone");
    if (!applicationNo || !phone) return NextResponse.json({ error: "Başvuru numarası ve telefon zorunludur." }, { status: 400 });
    const application = await prisma.greeterApplication.findFirst({ where: { applicationNo, phone: normalizePhone(phone) } });
    if (!application) return NextResponse.json({ error: "Başvuru bulunamadı. Bilgilerinizi kontrol edin." }, { status: 404 });
    return NextResponse.json({ application: publicApplication(application) });
  } catch (err) {
    console.error("/api/greeter-applications GET error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Sunucu hatası: " + message }, { status: 500 });
  }
}
