-- PostgreSQL requires a newly added enum value to be committed before it can
-- be used by a later table default. Keep this migration intentionally small.
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'PENDING';
