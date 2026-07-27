import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/auth/otp";

// GET /api/fleet — atama ekranında dropdown'ları doldurmak için araç + şoför + karşılamacı listesi
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const [vehicles, greeters] = await Promise.all([
    prisma.vehicle.findMany({ where: { active: true }, include: { driver: true } }),
    prisma.user.findMany({ where: { role: "GREETER", active: true } }),
  ]);

  return NextResponse.json({ vehicles, greeters });
}

function actorId(session: any) {
  return typeof session?.user?.id === "string" ? session.user.id : null;
}

function vehicleSnapshot(vehicle: any) {
  return { id: vehicle.id, plate: vehicle.plate, model: vehicle.model, size: vehicle.size, active: vehicle.active, driverId: vehicle.driverId, supplierName: vehicle.supplierName };
}

function userSnapshot(user: any) {
  return { id: user.id, role: user.role, name: user.name, phone: user.phone, active: user.active, supplierName: user.supplierName };
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || !["vehicle", "user"].includes(body.type)) return NextResponse.json({ error: "Geçersiz kayıt tipi." }, { status: 400 });

  try {
    if (body.type === "vehicle") {
      const plate = String(body.plate ?? "").trim().toUpperCase();
      const model = String(body.model ?? "").trim();
      const size = body.size === "LARGE" ? "LARGE" : "SMALL";
      const driverId = typeof body.driverId === "string" && body.driverId ? body.driverId : null;
      const supplierName = String(body.supplierName ?? "").trim() || null;
      if (!plate || !model) return NextResponse.json({ error: "Plaka ve model zorunlu." }, { status: 400 });
      if (driverId) {
        const driver = await prisma.user.findUnique({ where: { id: driverId }, select: { role: true, active: true } });
        if (!driver || driver.role !== "DRIVER" || !driver.active) return NextResponse.json({ error: "Yalnızca aktif şoför atanabilir." }, { status: 400 });
      }
      const vehicle = await prisma.vehicle.create({ data: { plate, model, size, driverId, supplierName }, include: { driver: true } });
      await prisma.assetAuditLog.create({ data: { entityType: "VEHICLE", entityId: vehicle.id, action: "CREATED", afterData: vehicleSnapshot(vehicle), actorUserId: actorId(session) } });
      return NextResponse.json({ vehicle }, { status: 201 });
    }

    const role = body.role === "GREETER" ? "GREETER" : "DRIVER";
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim() ? normalizePhone(String(body.phone)) : null;
    const supplierName = String(body.supplierName ?? "").trim() || null;
    if (!name || !phone) return NextResponse.json({ error: "Ad soyad ve telefon zorunlu." }, { status: 400 });
    const vehicleInput = body.vehicle && typeof body.vehicle === "object" ? body.vehicle : null;
    if (vehicleInput && role !== "DRIVER") return NextResponse.json({ error: "Araç yalnızca şoföre bağlanabilir." }, { status: 400 });
    const plate = vehicleInput ? String(vehicleInput.plate ?? "").trim().toUpperCase() : "";
    if (vehicleInput && !plate) return NextResponse.json({ error: "Araç plakası zorunlu." }, { status: 400 });
    const vehicleSize = vehicleInput?.size === "LARGE" ? "LARGE" : "SMALL";
    const vehicleModel = String(vehicleInput?.model ?? "").trim() || "Belirtilmedi";

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data: { role, name, phone, supplierName } });
      let vehicle = null;
      if (vehicleInput) {
        vehicle = await tx.vehicle.create({ data: { plate, model: vehicleModel, size: vehicleSize, driverId: user.id, supplierName } });
        await tx.assetAuditLog.create({ data: { entityType: "VEHICLE", entityId: vehicle.id, action: "CREATED", afterData: vehicleSnapshot(vehicle), actorUserId: actorId(session) } });
      }
      await tx.assetAuditLog.create({ data: { entityType: "USER", entityId: user.id, action: "CREATED", afterData: userSnapshot(user), actorUserId: actorId(session) } });
      return { user, vehicle };
    });
    const { passwordHash: _passwordHash, ...safeUser } = result.user;
    return NextResponse.json({ user: safeUser, vehicle: result.vehicle }, { status: 201 });
  } catch (error: any) {
    console.error("Fleet oluşturma hatası:", error);
    if (error?.code === "P2002") return NextResponse.json({ error: "Bu plaka veya telefon zaten kullanılıyor." }, { status: 409 });
    return NextResponse.json({ error: "Kayıt oluşturulamadı." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.id !== "string" || !["vehicle", "user"].includes(body.type)) {
    return NextResponse.json({ error: "Geçersiz güncelleme." }, { status: 400 });
  }

  try {
    if (body.type === "vehicle") {
      const data = {
        plate: String(body.plate ?? "").trim().toUpperCase(),
        model: String(body.model ?? "").trim(),
        size: body.size === "LARGE" ? "LARGE" : "SMALL",
        active: Boolean(body.active),
        driverId: typeof body.driverId === "string" && body.driverId ? body.driverId : null,
        supplierName: String(body.supplierName ?? "").trim() || null,
      } as const;
      if (!data.plate || !data.model) return NextResponse.json({ error: "Plaka ve model zorunlu." }, { status: 400 });
      if (data.driverId) {
        const driver = await prisma.user.findUnique({ where: { id: data.driverId }, select: { role: true, active: true } });
        if (!driver || driver.role !== "DRIVER" || !driver.active) return NextResponse.json({ error: "Yalnızca aktif şoför atanabilir." }, { status: 400 });
      }
      const previous = await prisma.vehicle.findUnique({ where: { id: body.id }, include: { driver: true } });
      if (!previous) return NextResponse.json({ error: "Araç bulunamadı." }, { status: 404 });
      const vehicle = await prisma.vehicle.update({ where: { id: body.id }, data, include: { driver: true } });
      await prisma.assetAuditLog.create({ data: { entityType: "VEHICLE", entityId: vehicle.id, action: previous.active === vehicle.active ? "UPDATED" : vehicle.active ? "ACTIVATED" : "DEACTIVATED", beforeData: vehicleSnapshot(previous), afterData: vehicleSnapshot(vehicle), actorUserId: actorId(session) } });
      return NextResponse.json({ vehicle });
    }

    const current = await prisma.user.findUnique({ where: { id: body.id }, select: { role: true } });
    if (!current || !["DRIVER", "GREETER"].includes(current.role)) {
      return NextResponse.json({ error: "Personel bulunamadı." }, { status: 404 });
    }
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim() ? normalizePhone(String(body.phone)) : null;
    const supplierName = String(body.supplierName ?? "").trim() || null;
    if (!name) return NextResponse.json({ error: "Ad soyad zorunlu." }, { status: 400 });
    const previous = await prisma.user.findUnique({ where: { id: body.id } });
    if (!previous) return NextResponse.json({ error: "Personel bulunamadı." }, { status: 404 });
    const user = await prisma.user.update({ where: { id: body.id }, data: { name, phone, active: Boolean(body.active), supplierName, passwordHash: null } });
    await prisma.assetAuditLog.create({ data: { entityType: "USER", entityId: user.id, action: previous.active === user.active ? "UPDATED" : user.active ? "ACTIVATED" : "DEACTIVATED", beforeData: userSnapshot(previous), afterData: userSnapshot(user), actorUserId: actorId(session) } });
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Fleet güncelleme hatası:", error);
    if (error?.code === "P2002") return NextResponse.json({ error: "Bu plaka veya telefon zaten kullanılıyor." }, { status: 409 });
    return NextResponse.json({ error: "Güncelleme yapılamadı." }, { status: 500 });
  }
}
