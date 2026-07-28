import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { compare, hash } from "bcryptjs";
import { normalizeProfileUpdate } from "@/lib/profile";

function getSessionUserId(session: unknown): string | undefined {
  if (!session || typeof session !== "object") return undefined;

  const safeSession = session as { user?: unknown };
  const user = safeSession.user;
  if (!user || typeof user !== "object") return undefined;

  const safeUser = user as { id?: unknown };
  const userId = safeUser.id;

  if (typeof userId === "string") return userId;
  if (typeof userId === "number") return String(userId);
  return undefined;
}

function isImageDataUrl(value: string) {
  return /^data:image\/(png|jpeg|jpg|webp);base64,/.test(value);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const sessionUserId = getSessionUserId(session);
  if (!sessionUserId) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  const userId = sessionUserId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      supplierName: true,
      profileImageUrl: true,
      preferredTheme: true,
      preferredLocale: true,
      bio: true,
    },
  });

  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUserId = getSessionUserId(session);
  if (!sessionUserId) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  const userId = sessionUserId;
  const body = await req.json().catch(() => ({}));
  const normalized = normalizeProfileUpdate(body as Record<string, unknown>);

  if (Object.keys(normalized).length === 0) {
    return NextResponse.json({ error: "Güncellenecek alan yok." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });

  const wantsPasswordChange = Boolean(normalized.newPassword);

  if (wantsPasswordChange) {
    if (!normalized.currentPassword || !normalized.newPassword) {
      return NextResponse.json({ error: "Şifre güncellemek için hem mevcut hem yeni şifre gerekli." }, { status: 400 });
    }

    if (!user.passwordHash) {
      return NextResponse.json({ error: "Bu hesapta şifre atanmadı." }, { status: 400 });
    }

    const valid = await compare(normalized.currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Mevcut şifre yanlış." }, { status: 400 });
    }
  }

  const updateData: Record<string, unknown> = { ...normalized };
  if (wantsPasswordChange && normalized.newPassword) {
    updateData.passwordHash = await hash(normalized.newPassword, 12);
  }

  if (typeof normalized.profileImageData === "string") {
    if (!isImageDataUrl(normalized.profileImageData)) {
      return NextResponse.json({ error: "Geçersiz profil resmi formatı." }, { status: 400 });
    }

    const buffer = Buffer.from(normalized.profileImageData.split(",")[1] ?? "", "base64");
    if (!buffer.length) {
      return NextResponse.json({ error: "Profil resmi boş olamaz." }, { status: 400 });
    }

    const safeName = `${userId}-${Date.now()}.png`;
    const filePath = `${process.cwd()}/public/uploads/profiles/${safeName}`;
    await import("fs/promises").then(({ mkdir, writeFile }) => mkdir(`${process.cwd()}/public/uploads/profiles`, { recursive: true }).then(() => writeFile(filePath, buffer)));
    updateData.profileImageUrl = `/uploads/profiles/${safeName}`;
  }

  delete updateData.currentPassword;
  delete updateData.newPassword;
  delete updateData.profileImageData;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      supplierName: true,
      profileImageUrl: true,
      preferredTheme: true,
      preferredLocale: true,
      bio: true,
    },
  });

  return NextResponse.json(updatedUser);
}
