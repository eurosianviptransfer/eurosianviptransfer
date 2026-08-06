import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";
import { normalizePhone } from "@/lib/auth/otp";
import { hash } from "bcryptjs";
import { randomBytes } from "node:crypto";
import { seal, unseal } from "@/lib/security/sealed";

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let password = "EVT-";
  for (let i = 0; i < 6; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// GET: Hem başvuruları hem de sistemdeki personelleri (User role: DRIVER/GREETER) döndürür
export async function GET(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });
  }

  try {
    let staffUsers: any[] = [];
    try {
      staffUsers = await prisma.user.findMany({
        where: {
          role: { in: ["DRIVER", "GREETER"] },
        },
        include: {
          vehicle: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (dbErr: any) {
      console.warn("User.findMany with deactivationReason failed, falling back to select query:", dbErr.message);
      // Fallback query selecting only explicit columns if deactivationReason is missing in DB schema cache
      const usersRaw = await prisma.user.findMany({
        where: {
          role: { in: ["DRIVER", "GREETER"] },
        },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          role: true,
          active: true,
          supplierName: true,
          createdAt: true,
          lastSeen: true,
          vehicle: {
            select: {
              id: true,
              plate: true,
              model: true,
              size: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      staffUsers = usersRaw.map((u) => ({ ...u, deactivationReason: null }));
    }

    const [driverApps, greeterApps] = await Promise.all([
      prisma.driverApplication.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.greeterApplication.findMany({
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Format applications into a unified list
    const applications = [
      ...driverApps.map((a) => ({
        id: a.id,
        appType: "DRIVER" as const,
        applicationNo: a.applicationNo,
        fullName: a.fullName,
        phone: a.phone,
        email: a.email,
        city: a.address || "Belirtilmedi",
        vehiclePlate: a.vehiclePlate,
        vehicleModel: a.vehicleModel,
        vehicleSize: a.vehicleSize,
        experienceYears: null,
        languages: a.features,
        notes: a.notes,
        status: a.status,
        rejectionReason: a.rejectionReason,
        createdAt: a.createdAt,
        approvedAt: a.approvedAt,
      })),
      ...greeterApps.map((g) => ({
        id: g.id,
        appType: "GREETER" as const,
        applicationNo: g.applicationNo,
        fullName: g.fullName,
        phone: g.phone,
        email: g.email,
        city: g.address || "Havalimanı",
        vehiclePlate: null,
        vehicleModel: null,
        vehicleSize: null,
        experienceYears: g.experienceYears,
        languages: g.languages,
        notes: g.notes,
        status: g.status,
        rejectionReason: g.rejectionReason,
        createdAt: g.createdAt,
        approvedAt: g.approvedAt,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      applications,
      staff: staffUsers.map((u) => ({
        id: u.id,
        name: u.name,
        phone: u.phone,
        email: u.email,
        role: u.role,
        active: u.active,
        deactivationReason: u.deactivationReason,
        supplierName: u.supplierName,
        createdAt: u.createdAt,
        lastSeen: u.lastSeen,
        vehicle: u.vehicle
          ? {
              id: u.vehicle.id,
              plate: u.vehicle.plate,
              model: u.vehicle.model,
              size: u.vehicle.size,
            }
          : null,
      })),
    });
  } catch (error: any) {
    console.error("GET /api/admin/personel error:", error);
    return NextResponse.json({ error: "Personel verileri alınamadı: " + error.message }, { status: 500 });
  }
}

// PATCH: Personel bilgisi güncelleme, Aktif/Pasif değiştirme (nedeniyle), Şifre Sıfırlama
export async function PATCH(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Kullanıcı ID gereklidir." }, { status: 400 });
    }

    let user: any = null;
    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          supplierName: true,
          currentSessionId: true,
        },
      });
    } catch (lookupErr: any) {
      console.warn("User lookup via findUnique failed, using raw query fallback:", lookupErr.message);
      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT "id", "name", "phone", "email", "supplierName", "currentSessionId" FROM "User" WHERE "id" = $1 LIMIT 1`,
        userId
      );
      user = rows[0] || null;
    }

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    // Action 1: Toggle Active Status (Aktif/Pasif yapma + Neden ekleme)
    if (action === "toggle-active") {
      const { active, deactivationReason } = body;
      if (typeof active !== "boolean") {
        return NextResponse.json({ error: "Aktiflik durumu belirtilmelidir." }, { status: 400 });
      }

      const reasonText = active ? null : (deactivationReason?.trim() || "Yönetici kararıyla pasife alınmıştır.");

      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            active,
            deactivationReason: reasonText,
            currentSessionId: active ? user.currentSessionId : null,
          },
        });
      } catch (patchErr: any) {
        console.warn("Standard user.update failed for toggle-active, using raw SQL fallback:", patchErr.message);
        await prisma.$executeRawUnsafe(
          `UPDATE "User" SET "active" = $1, "deactivationReason" = $2, "currentSessionId" = $3 WHERE "id" = $4`,
          active,
          reasonText,
          active ? user.currentSessionId : null,
          userId
        );
      }

      return NextResponse.json({
        success: true,
        message: active ? "Personel hesabı aktifleştirildi." : "Personel hesabı pasife alındı.",
        user: {
          id: userId,
          active,
          deactivationReason: reasonText,
        },
      });
    }

    // Action 2: Update User Info (İsim, Telefon, E-posta, Tedarikçi)
    if (action === "update-info") {
      const { name, phone, email, supplierName } = body;
      const cleanPhone = phone ? normalizePhone(phone) : user.phone;

      // Check phone duplication if changed
      if (cleanPhone && cleanPhone !== user.phone) {
        const existing = await prisma.user.findUnique({ where: { phone: cleanPhone } });
        if (existing) {
          return NextResponse.json({ error: "Bu telefon numarası başka bir kullanıcıya ait." }, { status: 409 });
        }
      }

      const finalName = name ? name.trim() : user.name;
      const finalEmail = email !== undefined ? (email ? email.trim().toLowerCase() : null) : user.email;
      const finalSupplier = supplierName !== undefined ? (supplierName ? supplierName.trim() : null) : user.supplierName;

      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            name: finalName,
            phone: cleanPhone,
            email: finalEmail,
            supplierName: finalSupplier,
          },
        });
      } catch (err: any) {
        console.warn("Standard update-info failed, using raw SQL fallback:", err.message);
        await prisma.$executeRawUnsafe(
          `UPDATE "User" SET "name" = $1, "phone" = $2, "email" = $3, "supplierName" = $4 WHERE "id" = $5`,
          finalName,
          cleanPhone,
          finalEmail,
          finalSupplier,
          userId
        );
      }

      return NextResponse.json({
        success: true,
        message: "Personel bilgileri güncellendi.",
        user: {
          id: userId,
          name: finalName,
          phone: cleanPhone,
          email: finalEmail,
          supplierName: finalSupplier,
        },
      });
    }

    // Action 3: Reset Password
    if (action === "reset-password") {
      const tempPassword = generateTempPassword();
      const passwordHash = await hash(tempPassword, 12);

      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            passwordHash,
            currentSessionId: null, // Force re-login
          },
        });
      } catch (passErr: any) {
        console.warn("Standard reset-password failed, trying raw SQL fallback:", passErr.message);
        await prisma.$executeRawUnsafe(
          `UPDATE "User" SET "passwordHash" = $1, "currentSessionId" = NULL WHERE "id" = $2`,
          passwordHash,
          userId
        );
      }

      return NextResponse.json({
        success: true,
        message: "Şifre başarıyla sıfırlandı.",
        tempPassword,
      });
    }

    return NextResponse.json({ error: "Geçersiz işlem parametresi." }, { status: 400 });
  } catch (error: any) {
    console.error("PATCH /api/admin/personel error:", error);
    return NextResponse.json({ error: "İşlem sırasında bir hata oluştu: " + (error.message || String(error)) }, { status: 500 });
  }
}
