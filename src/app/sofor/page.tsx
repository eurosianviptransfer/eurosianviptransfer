import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { OperationsDashboard, type OperationsJob } from "@/components/operations/OperationsDashboard";
import { OnlineTracker } from "@/components/OnlineTracker";
import { ProfileSettingsCard } from "@/components/profile/ProfileSettingsCard";

export const dynamic = "force-dynamic";

export default async function DriverPage() {
  const session = await getServerSession(authOptions);
  const driverId = session?.user.id;
  if (!driverId) return null;
  const jobs = await prisma.booking.findMany({
    where: { driverId },
    include: { greeter: { select: { name: true } }, vehicle: { select: { plate: true } } },
    orderBy: { scheduledAt: "asc" },
    take: 250,
  });

  const serializedJobs: OperationsJob[] = jobs.map((job) => ({
    id: job.id,
    code: job.code,
    guestName: job.guestName,
    destinationText: job.destinationText,
    regionName: job.regionName,
    flightNumber: job.flightNumber,
    scheduledAt: job.scheduledAt.toISOString(),
    status: job.status,
    vehicleSize: job.vehicleSize,
    greeter: job.greeter,
    vehicle: job.vehicle,
  }));

  return (
    <>
      {/* Şoför sisteme girdiğinde admin paneline aktiflik sinyali gönderir */}
      <OnlineTracker currentUserId={driverId} />
      
      <OperationsDashboard role="DRIVER" name={session?.user?.name || "Şoför"} jobs={serializedJobs} />
      <ProfileSettingsCard />
    </>
  );
}