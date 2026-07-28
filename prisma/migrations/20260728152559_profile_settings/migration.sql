-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "lastSeen" TIMESTAMP(3),
ADD COLUMN     "preferredLocale" TEXT DEFAULT 'tr',
ADD COLUMN     "preferredTheme" TEXT DEFAULT 'dark',
ADD COLUMN     "profileImageUrl" TEXT;
