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
    },
    create: {
      email: adminEmail,
      name: "Operasyon Yöneticisi",
      passwordHash: passwordHash,
      role: "ADMIN",
      active: true,
    },
  });

  console.log("Admin şifresi başarıyla yenilendi:", user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());