import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/auth/otp";
import { checkRateLimit, getClientIp } from "@/lib/security/request-controls";
import { isAllowedVehicleImageUrl } from "@/lib/providers/storage/r2";

function publicApplication(application: any) { return { applicationNo: application.applicationNo, fullName: application.fullName, vehiclePlate: application.vehiclePlate, vehicleModel: application.vehicleModel, status: application.status, rejectionReason: application.rejectionReason, updatedAt: application.updatedAt }; }

export async function POST(req: NextRequest) {
  try {
    const rate = await checkRateLimit(`driver-application:${getClientIp(req.headers)}`, 5, 3600);
    if (!rate.allowed) return NextResponse.json({ error: "Çok fazla başvuru denemesi. Lütfen daha sonra tekrar deneyin." }, { status: 429 });
    const body = await req.json().catch(() => null);
    if (!body || typeof body.fullName !== "string" || typeof body.phone !== "string" || typeof body.vehiclePlate !== "string" || typeof body.vehicleModel !== "string") return NextResponse.json({ error: "Ad, telefon, plaka ve araç modeli zorunludur." }, { status: 400 });
    const phone = normalizePhone(body.phone);
    const passengerCapacity = Number(body.passengerCapacity); const vehicleYear = body.vehicleYear == null ? null : Number(body.vehicleYear); const luggageCapacity = body.luggageCapacity == null ? null : Number(body.luggageCapacity);
    if (!phone || !Number.isInteger(passengerCapacity) || passengerCapacity < 1 || passengerCapacity > 100 || (vehicleYear !== null && (vehicleYear < 1980 || vehicleYear > new Date().getFullYear() + 1))) return NextResponse.json({ error: "Telefon, yolcu kapasitesi veya model yılı geçersiz." }, { status: 400 });
    const images: string[] = Array.isArray(body.imageUrls) ? body.imageUrls.filter((item: unknown): item is string => typeof item === "string" && isAllowedVehicleImageUrl(item)).slice(0, 3) : [];
    const plate = body.vehiclePlate.trim().toUpperCase();

    // Check duplicates / existing users
    const duplicate = await prisma.driverApplication.findFirst({ where: { OR: [{ phone }, { vehiclePlate: plate }], status: { in: ["PENDING", "APPROVED"] } } });
    const existingUser = await prisma.user.findFirst({ where: { OR: [{ phone }, { vehicle: { plate } }] } });
    if (duplicate || existingUser) return NextResponse.json({ error: "Bu telefon veya plaka ile aktif bir başvuru/kayıt zaten bulunuyor." }, { status: 409 });

    const application = await prisma.driverApplication.create({ data: { applicationNo: `EVT-SOF-${String(Math.floor(1000 + Math.random() * 9000))}`, fullName: body.fullName.trim().slice(0, 120), phone, email: typeof body.email === "string" ? body.email.trim().slice(0, 160) || null : null, address: typeof body.address === "string" ? body.address.trim().slice(0, 300) || null : null, licenseNumber: typeof body.licenseNumber === "string" ? body.licenseNumber.trim().slice(0, 80) || null : null, vehiclePlate: plate, vehicleModel: body.vehicleModel.trim().slice(0, 120), vehicleYear, vehicleSize: body.vehicleSize === "LARGE" ? "LARGE" : "SMALL", passengerCapacity, luggageCapacity, features: Array.isArray(body.features) ? body.features.filter((item: unknown): item is string => typeof item === "string").slice(0, 20) : [], imageUrls: images, notes: typeof body.notes === "string" ? body.notes.trim().slice(0, 1000) || null : null } });
    return NextResponse.json({ application: publicApplication(application) }, { status: 201 });
  } catch (err) {
    console.error("/api/driver-applications POST error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Sunucu hatası: " + message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const applicationNo = req.nextUrl.searchParams.get("applicationNo")?.trim(); const phone = req.nextUrl.searchParams.get("phone");
    if (!applicationNo || !phone) return NextResponse.json({ error: "Başvuru numarası ve telefon zorunludur." }, { status: 400 });
    const application = await prisma.driverApplication.findFirst({ where: { applicationNo, phone: normalizePhone(phone) } });
    if (!application) return NextResponse.json({ error: "Başvuru bulunamadı. Bilgilerinizi kontrol edin." }, { status: 404 });
    return NextResponse.json({ application: publicApplication(application) });
  } catch (err) {
    console.error("/api/driver-applications GET error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Sunucu hatası: " + message }, { status: 500 });
  }
}
