import { PrismaClient } from "@prisma/client";

// Next.js dev modunda hot-reload'da çoklu bağlantı açılmasın diye global singleton.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
