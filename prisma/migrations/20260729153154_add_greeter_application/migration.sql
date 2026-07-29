-- CreateTable
CREATE TABLE "GreeterApplication" (
    "id" TEXT NOT NULL,
    "applicationNo" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "experienceYears" INTEGER,
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "status" "DriverApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvedUserId" TEXT,
    "whatsappMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GreeterApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GreeterApplication_applicationNo_key" ON "GreeterApplication"("applicationNo");

-- CreateIndex
CREATE UNIQUE INDEX "GreeterApplication_approvedUserId_key" ON "GreeterApplication"("approvedUserId");

-- CreateIndex
CREATE INDEX "GreeterApplication_phone_createdAt_idx" ON "GreeterApplication"("phone", "createdAt");

-- CreateIndex
CREATE INDEX "GreeterApplication_status_createdAt_idx" ON "GreeterApplication"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "GreeterApplication" ADD CONSTRAINT "GreeterApplication_approvedUserId_fkey" FOREIGN KEY ("approvedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
