CREATE TYPE "DriverApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE "DriverApplication" (
    "id" TEXT NOT NULL,
    "applicationNo" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "licenseNumber" TEXT,
    "vehiclePlate" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "vehicleYear" INTEGER,
    "vehicleSize" "VehicleSize" NOT NULL,
    "passengerCapacity" INTEGER NOT NULL,
    "luggageCapacity" INTEGER,
    "features" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "imageUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "status" "DriverApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvedUserId" TEXT,
    "whatsappMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DriverApplication_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DriverApplication_applicationNo_key" ON "DriverApplication"("applicationNo");
CREATE UNIQUE INDEX "DriverApplication_approvedUserId_key" ON "DriverApplication"("approvedUserId");
CREATE INDEX "DriverApplication_phone_createdAt_idx" ON "DriverApplication"("phone", "createdAt");
CREATE INDEX "DriverApplication_status_createdAt_idx" ON "DriverApplication"("status", "createdAt");
CREATE INDEX "DriverApplication_vehiclePlate_idx" ON "DriverApplication"("vehiclePlate");
ALTER TABLE "DriverApplication" ADD CONSTRAINT "DriverApplication_approvedUserId_fkey" FOREIGN KEY ("approvedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT,
    "subjectUserId" TEXT NOT NULL,
    "raterRole" "Role",
    "raterName" TEXT,
    "raterPhone" TEXT,
    "score" INTEGER NOT NULL,
    "comment" TEXT,
    "category" TEXT NOT NULL DEFAULT 'SERVICE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Rating_subjectUserId_createdAt_idx" ON "Rating"("subjectUserId", "createdAt");
CREATE INDEX "Rating_bookingId_createdAt_idx" ON "Rating"("bookingId", "createdAt");
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_subjectUserId_fkey" FOREIGN KEY ("subjectUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
