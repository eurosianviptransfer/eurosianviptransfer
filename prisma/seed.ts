// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@eurosianviptransfer.com";
  const rawPassword = "Eurosian2026!";
  
  // Şifreyi 12 round bcrypt ile hash'liyoruz
  const passwordHash = await hash(rawPassword, 12);

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: passwordHash,
      active: true,
      role: "ADMIN",
      name: "Operasyon Yöneticisi",
    },
    create: {
      email: adminEmail,
      name: "Operasyon Yöneticisi",
      passwordHash: passwordHash,
      role: "ADMIN",
      active: true,
    },
  });

  console.log("Admin hazır:", user.email);

  // Örnek Media öğesi (gerçek upload sonrası URL değiştirilebilir)
  let logo = await prisma.mediaItem.findFirst({ where: { filename: "logo-main.png" } });
  if (logo) {
    logo = await prisma.mediaItem.update({
      where: { id: logo.id },
      data: {
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v000000/logo-main.png",
        uploadedById: user.id,
      },
    });
  } else {
    logo = await prisma.mediaItem.create({
      data: {
        filename: "logo-main.png",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v000000/logo-main.png",
        mime: "image/png",
        alt: "Eurosian VIP Transfer logo",
        uploadedById: user.id,
      },
    });
  }

  // Site ayarları — logo ve ana dili (nullable locale için upsert yerine find+create/update kullanıyoruz)
  let logoSetting = await prisma.siteSetting.findFirst({ where: { key: "site.logo", locale: null } });
  if (logoSetting) {
    await prisma.siteSetting.update({ where: { id: logoSetting.id }, data: { value: { url: logo.url }, updatedById: user.id } });
  } else {
    await prisma.siteSetting.create({ data: { key: "site.logo", locale: null, value: { url: logo.url }, updatedById: user.id } });
  }

  let defaultLocaleSetting = await prisma.siteSetting.findFirst({ where: { key: "site.defaultLocale", locale: null } });
  if (defaultLocaleSetting) {
    await prisma.siteSetting.update({ where: { id: defaultLocaleSetting.id }, data: { value: { locale: "tr" }, updatedById: user.id } });
  } else {
    await prisma.siteSetting.create({ data: { key: "site.defaultLocale", locale: null, value: { locale: "tr" }, updatedById: user.id } });
  }

  // Örnek içerik — ana sayfa başlığı ve lead (TR + EN)
  await prisma.contentEntry.upsert({
    where: { key_locale: { key: "home.hero.title", locale: "tr" } },
    update: { title: "Antalya'ya ziyaretiniz\nprofesyonel bir karşılama ile başlar.", body: "Premium transfer ve karşılama hizmetleriyle Antalya'ya konforlu varışlar.", published: true, updatedById: user.id },
    create: { key: "home.hero.title", locale: "tr", type: "HERO", title: "Antalya'ya ziyaretiniz\nprofesyonel bir karşılama ile başlar.", body: "Premium transfer ve karşılama hizmetleriyle Antalya'ya konforlu varışlar.", published: true, updatedById: user.id },
  });

  await prisma.contentEntry.upsert({
    where: { key_locale: { key: "home.hero.title", locale: "en" } },
    update: { title: "Your visit to Antalya\nstarts with a professional welcome.", body: "Arrive in comfort with premium transfers and professional meet-and-greet services.", published: true, updatedById: user.id },
    create: { key: "home.hero.title", locale: "en", type: "HERO", title: "Your visit to Antalya\nstarts with a professional welcome.", body: "Arrive in comfort with premium transfers and professional meet-and-greet services.", published: true, updatedById: user.id },
  });

  // Örnek: admin panel labels (TR) — ayrıca src/lib/admin-copy.ts ile eşleşir; seed sadece site content örneği olarak eklenir.
  await prisma.contentEntry.upsert({
    where: { key_locale: { key: "admin.hero.headline", locale: "tr" } },
    update: { title: "Operasyon akışınızı daha net yönetin", published: true, updatedById: user.id },
    create: { key: "admin.hero.headline", locale: "tr", type: "PAGE", title: "Operasyon akışınızı daha net yönetin", body: "Canlı durumlar, raporlar ve ekip takibi tek bir deneyimde birleşti.", published: true, updatedById: user.id },
  });

  await prisma.contentEntry.upsert({
    where: { key_locale: { key: "admin.hero.headline", locale: "en" } },
    update: { title: "Run your workflow with clarity", published: true, updatedById: user.id },
    create: { key: "admin.hero.headline", locale: "en", type: "PAGE", title: "Run your workflow with clarity", body: "Live statuses, reports and team coordination now live in one focused experience.", published: true, updatedById: user.id },
  });

  console.log("Seed: örnek içerikler ve medya eklendi (DB bağlantısı gerekir).");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());