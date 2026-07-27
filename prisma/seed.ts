import { PrismaClient, VehicleSize, DriverApplicationStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Çalıştırma: npm run db:seed veya npx prisma db seed
 * Giriş sayfaları, başvuru ve değerlendirme testleri için gereken seed verisi.
 */
async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || "admin@eurosian.com";
  const adminName = process.env.ADMIN_NAME?.trim() || "Operasyon Yöneticisi";
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "AdminPass123456!";

  const staffPassword = process.env.STAFF_DEFAULT_PASSWORD || "StaffPass123456!";

  if (adminPassword.length < 12 || staffPassword.length < 12) {
    throw new Error("Şifreler en az 12 karakter olmalıdır.");
  }

  const adminPasswordHash = await hash(adminPassword, 12);
  const staffPasswordHash = await hash(staffPassword, 12);

  // 1. Şirket Oluşturma (Tedarikçi Örneği)
  const company = await prisma.company.upsert({
    where: { name: "Eurosian Filo A.Ş." },
    update: {},
    create: {
      name: "Eurosian Filo A.Ş.",
      contactName: "Ahmet Yılmaz",
      phone: "+905550000000",
      email: "filo@eurosian.com",
    },
  });

  // 2. Admin Kullanıcısı
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      active: true,
      role: "ADMIN",
    },
    create: {
      role: "ADMIN",
      name: adminName,
      email: adminEmail,
      passwordHash: adminPasswordHash,
      companyId: company.id,
    },
  });

  // 3. Sürücüler
  const drivers = [
    { name: "Emre Yıldız", phone: "+905551110001" },
    { name: "Caner Demir", phone: "+905551110002" },
    { name: "Hakan Su", phone: "+905551110003" },
  ];

  const createdDrivers = [];
  for (const d of drivers) {
    const driver = await prisma.user.upsert({
      where: { phone: d.phone },
      update: { active: true },
      create: {
        role: "DRIVER",
        name: d.name,
        phone: d.phone,
        passwordHash: staffPasswordHash,
        companyId: company.id,
      },
    });
    createdDrivers.push(driver);
  }

  // 4. Karşılamacılar (Greeters)
  const greeters = [
    { name: "Aylin Kaya", phone: "+905551110011" },
    { name: "Deniz Aksoy", phone: "+905551110012" },
  ];

  for (const g of greeters) {
    await prisma.user.upsert({
      where: { phone: g.phone },
      update: { active: true },
      create: {
        role: "GREETER",
        name: g.name,
        phone: g.phone,
        passwordHash: staffPasswordHash,
      },
    });
  }

  // 5. Araçlar
  const vehicles = [
    { plate: "07 EVT 12", model: "Mercedes Vito", size: VehicleSize.SMALL, driverId: createdDrivers[0].id },
    { plate: "07 EVT 34", model: "VW Transporter", size: VehicleSize.SMALL, driverId: createdDrivers[1].id },
    { plate: "07 EVT 56", model: "Mercedes Sprinter", size: VehicleSize.LARGE, driverId: createdDrivers[2].id },
  ];

  for (const v of vehicles) {
    await prisma.vehicle.upsert({
      where: { plate: v.plate },
      update: { driverId: v.driverId },
      create: {
        plate: v.plate,
        model: v.model,
        size: v.size,
        driverId: v.driverId,
        companyId: company.id,
      },
    });
  }

  // 6. Fiyatlandırma Kuralları (PricingRules)
  const regions = [
    { regionName: "Lara", km: 15, basePriceSmall: 25, basePriceLarge: 40 },
    { regionName: "Antalya Merkez", km: 12, basePriceSmall: 25, basePriceLarge: 40 },
    { regionName: "Belek", km: 35, basePriceSmall: 40, basePriceLarge: 55 },
    { regionName: "Kemer", km: 61, basePriceSmall: 60, basePriceLarge: 75 },
    { regionName: "Side", km: 66, basePriceSmall: 65, basePriceLarge: 80 },
    { regionName: "Alanya", km: 125, basePriceSmall: 110, basePriceLarge: 125 },
    { regionName: "İstanbul Avrupa Yakası", km: 720, basePriceSmall: 95, basePriceLarge: 125 },
    { regionName: "İstanbul Anadolu Yakası", km: 735, basePriceSmall: 95, basePriceLarge: 125 },
    { regionName: "Ankara Merkez", km: 480, basePriceSmall: 85, basePriceLarge: 110 },
    { regionName: "İzmir Merkez", km: 470, basePriceSmall: 85, basePriceLarge: 110 },
  ];

  for (const r of regions) {
    const existing = await prisma.pricingRule.findFirst({
      where: { regionName: r.regionName },
    });

    if (!existing) {
      await prisma.pricingRule.create({ data: r });
    }
  }

  // 7. Hakediş Kuralları (PayoutRules)
  const payoutDefaults = [
    { vehicleSize: VehicleSize.SMALL, suggestedDriverFee: 500, suggestedGreeterFee: 200 },
    { vehicleSize: VehicleSize.LARGE, suggestedDriverFee: 700, suggestedGreeterFee: null },
  ];

  for (const p of payoutDefaults) {
    const existing = await prisma.payoutRule.findFirst({
      where: { vehicleSize: p.vehicleSize },
    });

    if (!existing) {
      await prisma.payoutRule.create({ data: p });
    }
  }

  // 8. Sürücü Başvurusu Örneği (DriverApplication)
  await prisma.driverApplication.upsert({
    where: { applicationNo: "APP-2026-001" },
    update: {},
    create: {
      applicationNo: "APP-2026-001",
      fullName: "Mehmet Öztürk",
      phone: "+905559998877",
      email: "mehmet@example.com",
      vehiclePlate: "07 BSK 99",
      vehicleModel: "Mercedes Vito Extra Long",
      vehicleYear: 2023,
      vehicleSize: VehicleSize.SMALL,
      passengerCapacity: 8,
      status: DriverApplicationStatus.PENDING,
    },
  });

  // 9. Puanlama & Yorum Örneği (Rating)
  const firstDriver = createdDrivers[0];
  if (firstDriver) {
    const existingRating = await prisma.rating.findFirst({
      where: { subjectUserId: firstDriver.id },
    });

    if (!existingRating) {
      await prisma.rating.create({
        data: {
          subjectUserId: firstDriver.id,
          raterName: "John Doe",
          raterPhone: "+447700900007",
          score: 5,
          comment: "Harika bir karşılama ve konforlu bir yolculuktu. Teşekkürler!",
          category: "SERVICE",
        },
      });
    }
  }

  console.log("✓ Seed başarıyla tamamlandı.");
  console.log(`- Admin Hesabı: ${adminEmail}`);
  console.log(`- Eklenen Sürücü Sayısı: ${drivers.length}`);
  console.log(`- Eklenen Araç Sayısı: ${vehicles.length}`);
}

main()
  .catch((e) => {
    console.error("Seed hatası:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());