-- Payment retry/idempotency tables. The PENDING enum value was committed by
-- the preceding migration before this default is used.
ALTER TABLE "Booking"
ADD COLUMN "idempotencyKey" TEXT;

CREATE UNIQUE INDEX "Booking_idempotencyKey_key"
ON "Booking"("idempotencyKey");

CREATE TABLE "PaymentAttempt" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerReference" TEXT,
    "checkoutUrl" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentAttempt_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PaymentAttempt_providerReference_key"
ON "PaymentAttempt"("providerReference");

CREATE INDEX "PaymentAttempt_bookingId_createdAt_idx"
ON "PaymentAttempt"("bookingId", "createdAt");

ALTER TABLE "PaymentAttempt"
ADD CONSTRAINT "PaymentAttempt_bookingId_fkey"
FOREIGN KEY ("bookingId") REFERENCES "Booking"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
