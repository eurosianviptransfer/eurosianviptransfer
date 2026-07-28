import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";
import { normalizePhone } from "@/lib/auth/otp";

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let password = "EVT-";
  for (let i = 0; i < 6; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function GET() {
  try {
    const [vehicles, drivers, greeters] = await Promise.all([
      prisma.vehicle.findMany({ include: { driver: true } }),
      prisma.user.findMany({ where: { role: "DRIVER", active: true } }),
      prisma.user.findMany({ where: { role: "GREETER", active: true } }),
    ]);

    return NextResponse.json({ vehicles, drivers, greeters });
  } catch (error) {
    console.error("Fleet GET error:", error);
    return NextResponse.json({ error: "Filo verileri alınamadı." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.type === "vehicle") {
      const { plate, model, size, driverId, supplierName } = body;
      if (!plate || !model || !size) {
        return NextResponse.json({ error: "Plaka, model ve araç boyutu zorunludur." }, { status: 400 });
      }

      const vehicle = await prisma.vehicle.create({
        data: {
          plate: plate.trim().toUpperCase(),
          model: model.trim(),
          size,
          driverId: driverId || null,
          supplierName: supplierName?.trim() || null,
        },
      });

      return NextResponse.json({ success: true, vehicle });
    }

    // Karşılamacı veya Şoför ekleme
    if (body.type === "user" || body.role === "GREETER" || body.role === "DRIVER") {
      const name = body.name;
      const phone = body.phone;
      const supplierName = body.supplierName;
      const vehicle = body.vehicle;
      const role = body.role === "GREETER" ? "GREETER" : "DRIVER";

      if (!name || !phone) {
        return NextResponse.json({ error: "Ad Soyad ve Telefon numarası zorunludur." }, { status: 400 });
      }

      const cleanPhone = normalizePhone(phone);

      const existing = await prisma.user.findUnique({ where: { phone: cleanPhone } });
      if (existing) {
        return NextResponse.json({ error: "Bu telefon numarası zaten kayıtlı." }, { status: 400 });
      }

      const generatedPassword = generateTempPassword();
      const passwordHash = await hash(generatedPassword, 12);

      const user = await prisma.user.create({
        data: {
          name: name.trim(),
          phone: cleanPhone,
          role,
          supplierName: supplierName?.trim() || null,
          passwordHash,
          active: true,
        },
      });

      if (role === "DRIVER" && vehicle && vehicle.plate) {
        await prisma.vehicle.create({
          data: {
            plate: vehicle.plate.trim().toUpperCase(),
            model: vehicle.model.trim(),
            size: vehicle.size,
            driverId: user.id,
            supplierName: supplierName?.trim() || null,
          },
        });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
        generatedPassword,
      });
    }

    return NextResponse.json({ error: "Geçersiz işlem tipi." }, { status: 400 });
  } catch (error: any) {
    console.error("Fleet POST error:", error);
    return NextResponse.json({ error: error.message || "İşlem sırasında bir hata oluştu." }, { status: 500 });
  }
}