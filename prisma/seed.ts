import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Çalıştırma: npm run db:seed
 * Giriş sayfalarını test edebilmek için gereken minimum veri.
 */
async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminName =
    process.env.ADMIN_NAME?.trim() || "Operasyon Yöneticisi";
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD;

  if (!adminEmail || !/^\S+@\S+\.\S+$/.test(adminEmail)) {
    throw new Error(
      "ADMIN_EMAIL geçerli bir e-posta adresi olmalı."
    );
  }

  if (!adminPassword || adminPassword.length < 12) {
    throw new Error(
      "ADMIN_DEFAULT_PASSWORD tanımlı olmalı ve en az 12 karakter içermeli."
    );
  }

  const staffPassword = process.env.STAFF_DEFAULT_PASSWORD;
  if (!staffPassword || staffPassword.length < 12) {
    throw new Error(
      "STAFF_DEFAULT_PASSWORD tanımlı olmalı ve en az 12 karakter içermeli."
    );
  }

  const adminPasswordHash = await hash(adminPassword, 12);
  const staffPasswordHash = await hash(staffPassword, 12);

  await prisma.user.upsert({
    where: {
      email: adminEmail,
    },
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
    },
  });

  const drivers = [
    {
      id: "seed-d1",
      name: "Emre Yıldız",
      phone: "+905551110001",
    },
    {
      id: "seed-d2",
      name: "Caner Demir",
      phone: "+905551110002",
    },
    {
      id: "seed-d3",
      name: "Hakan Su",
      phone: "+905551110003",
    },
  ];

  for (const d of drivers) {
    await prisma.user.upsert({
      where: {
        phone: d.phone,
      },
      update: {
        active: true,
      },
      create: {
        role: "DRIVER",
        name: d.name,
        phone: d.phone,
        passwordHash: staffPasswordHash,
      },
    });
  }

  const greeters = [
    {
      name: "Aylin Kaya",
      phone: "+905551110011",
    },
    {
      name: "Deniz Aksoy",
      phone: "+905551110012",
    },
  ];

  for (const g of greeters) {
    await prisma.user.upsert({
      where: {
        phone: g.phone,
      },
      update: {
        active: true,
      },
      create: {
        role: "GREETER",
        name: g.name,
        phone: g.phone,
        passwordHash: staffPasswordHash,
      },
    });
  }

  const driver1 = await prisma.user.findUnique({
    where: {
      phone: drivers[0].phone,
    },
  });

  const driver2 = await prisma.user.findUnique({
    where: {
      phone: drivers[1].phone,
    },
  });

  const driver3 = await prisma.user.findUnique({
    where: {
      phone: drivers[2].phone,
    },
  });

  await prisma.vehicle.upsert({
    where: {
      plate: "07 EVT 12",
    },
    update: {},
    create: {
      plate: "07 EVT 12",
      model: "Mercedes Vito",
      size: "SMALL",
      driverId: driver1!.id,
    },
  });

  await prisma.vehicle.upsert({
    where: {
      plate: "07 EVT 34",
    },
    update: {},
    create: {
      plate: "07 EVT 34",
      model: "VW Transporter",
      size: "SMALL",
      driverId: driver2!.id,
    },
  });

  await prisma.vehicle.upsert({
    where: {
      plate: "07 EVT 56",
    },
    update: {},
    create: {
      plate: "07 EVT 56",
      model: "Mercedes Sprinter",
      size: "LARGE",
      driverId: driver3!.id,
    },
  });

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
    { regionName: "Bodrum Merkez", km: 420, basePriceSmall: 80, basePriceLarge: 105 },
    { regionName: "Çeşme", km: 520, basePriceSmall: 95, basePriceLarge: 120 },
    { regionName: "Kapadokya", km: 540, basePriceSmall: 95, basePriceLarge: 125 },
    { regionName: "Trabzon Merkez", km: 900, basePriceSmall: 120, basePriceLarge: 155 },
    { regionName: "Kayseri Merkez", km: 620, basePriceSmall: 105, basePriceLarge: 135 },
    { regionName: "Nevşehir Kapadokya", km: 560, basePriceSmall: 100, basePriceLarge: 130 },
    { regionName: "Ağrı Dağı", km: 1150, basePriceSmall: 145, basePriceLarge: 185 },
    { regionName: "Van Merkez", km: 1120, basePriceSmall: 140, basePriceLarge: 180 },
  ];

  for (const r of regions) {
    const existing = await prisma.pricingRule.findFirst({
      where: {
        regionName: r.regionName,
      },
    });

    if (!existing) {
      await prisma.pricingRule.create({
        data: r,
      });
    }
  }

  const payoutDefaults = [
    {
      vehicleSize: "SMALL" as const,
      suggestedDriverFee: 500,
      suggestedGreeterFee: 200,
    },
    {
      vehicleSize: "LARGE" as const,
      suggestedDriverFee: 700,
      suggestedGreeterFee: null,
    },
  ];

  for (const p of payoutDefaults) {
    const existing = await prisma.payoutRule.findFirst({
      where: {
        vehicleSize: p.vehicleSize,
      },
    });

    if (!existing) {
      await prisma.payoutRule.create({
        data: p,
      });
    }
  }

  console.log("✓ Seed tamamlandı. Mevcut hesapların şifreleri değiştirilmedi.");
  console.log(`Admin hesabı: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
