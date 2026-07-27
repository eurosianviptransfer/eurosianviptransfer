import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { hash } from "bcryptjs";
import { requireAdminSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { seal, unseal } from "@/lib/security/sealed";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession(); if (!session) return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });
  const { id } = await params; const body = await req.json().catch(() => ({})); const action = body.action;
  const application = await prisma.driverApplication.findUnique({ where: { id } }); if (!application) return NextResponse.json({ error: "Başvuru bulunamadı." }, { status: 404 });
  if (application.status !== "PENDING") return NextResponse.json({ error: "Bu başvuru zaten sonuçlandırılmış." }, { status: 409 });
  if (action === "reject") {
    const rejectionReason = typeof body.rejectionReason === "string" ? body.rejectionReason.trim().slice(0, 500) : "Başvuru kriterleri karşılanmadı.";
    const updated = await prisma.driverApplication.update({ where: { id }, data: { status: "REJECTED", rejectionReason } });
    return NextResponse.json({ application: updated });
  }
  if (action !== "approve") return NextResponse.json({ error: "Geçersiz işlem." }, { status: 400 });
  const password = randomBytes(6).toString("base64url").slice(0, 10);
  const passwordHash = await hash(password, 12);
  try {
    const result = await prisma.$transaction(async tx => {
      const existingPhone = await tx.user.findUnique({ where: { phone: application.phone } });
      const existingPlate = await tx.vehicle.findUnique({ where: { plate: application.vehiclePlate } });
      if (existingPhone || existingPlate) throw new Error("DUPLICATE");
      const user = await tx.user.create({ data: { role: "DRIVER", name: application.fullName, phone: application.phone, email: application.email, passwordHash, active: true } });
      await tx.vehicle.create({ data: { plate: application.vehiclePlate, model: application.vehicleModel, size: application.vehicleSize, driverId: user.id, hasChildSeat: application.features.some(item => item.toLocaleLowerCase("tr-TR").includes("çocuk")) } });
      const message = `Merhaba ${application.fullName},\n\nEurosian VIP Transfer şoför başvurunuz onaylandı.\n\nGiriş: ${application.phone}\nŞifre: ${password}\nPanel: ${process.env.NEXTAUTH_URL ?? "site adresiniz"}/sofor/giris\n\nLütfen giriş yaptıktan sonra bilgilerinizi kontrol edin.`;
      return tx.driverApplication.update({ where: { id }, data: { status: "APPROVED", approvedAt: new Date(), approvedUserId: user.id, whatsappMessage: seal(message) } });
    });
    return NextResponse.json({ application: { ...result, whatsappMessage: result.whatsappMessage ? unseal(result.whatsappMessage) : null }, temporaryPassword: password });
  } catch (error) { if ((error as Error).message === "DUPLICATE") return NextResponse.json({ error: "Telefon veya plaka zaten aktif bir kayda bağlı." }, { status: 409 }); throw error; }
}
