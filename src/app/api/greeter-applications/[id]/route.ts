import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { hash } from "bcryptjs";
import { requireAdminSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { seal, unseal } from "@/lib/security/sealed";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession(); if (!session) return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });
  const { id } = await params; const body = await req.json().catch(() => ({})); const action = body.action;
  const application = await prisma.greeterApplication.findUnique({ where: { id } }); if (!application) return NextResponse.json({ error: "Başvuru bulunamadı." }, { status: 404 });
  if (application.status !== "PENDING") return NextResponse.json({ error: "Bu başvuru zaten sonuçlandırılmış." }, { status: 409 });
  if (action === "reject") {
    const rejectionReason = typeof body.rejectionReason === "string" ? body.rejectionReason.trim().slice(0, 500) : "Başvuru kriterleri karşılanmadı.";
    const updated = await prisma.greeterApplication.update({ where: { id }, data: { status: "REJECTED", rejectionReason } });
    return NextResponse.json({ application: updated });
  }
  if (action !== "approve") return NextResponse.json({ error: "Geçersiz işlem." }, { status: 400 });
  const password = randomBytes(6).toString("base64url").slice(0, 10);
  const passwordHash = await hash(password, 12);
  try {
    const result = await prisma.$transaction(async tx => {
      const existingPhone = await tx.user.findUnique({ where: { phone: application.phone } });
      if (existingPhone) throw new Error("DUPLICATE");
      const user = await tx.user.create({ data: { role: "GREETER", name: application.fullName, phone: application.phone, email: application.email, passwordHash, active: true } });
      const message = `Merhaba ${application.fullName},\n\nEurosian VIP Transfer karşılamacı başvurunuz onaylandı.\n\nGiriş: ${application.phone}\nŞifre: ${password}\nPanel: ${process.env.NEXTAUTH_URL ?? "site adresiniz"}/karsilamaci/giris\n\nLütfen giriş yaptıktan sonra bilgilerinizi kontrol edin.`;
      return tx.greeterApplication.update({ where: { id }, data: { status: "APPROVED", approvedAt: new Date(), approvedUserId: user.id, whatsappMessage: seal(message) } });
    });
    return NextResponse.json({ application: { ...result, whatsappMessage: result.whatsappMessage ? unseal(result.whatsappMessage) : null }, temporaryPassword: password });
  } catch (error) { if ((error as Error).message === "DUPLICATE") return NextResponse.json({ error: "Telefon zaten aktif bir kayda bağlı." }, { status: 409 }); throw error; }
}
