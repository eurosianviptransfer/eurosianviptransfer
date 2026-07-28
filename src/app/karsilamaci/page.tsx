import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { OperationsDashboard, type OperationsJob } from "@/components/operations/OperationsDashboard";
import { OnlineTracker } from "@/components/OnlineTracker";
import { ProfileSettingsCard } from "@/components/profile/ProfileSettingsCard";

export const dynamic = "force-dynamic";

export default async function GreeterPage() {
  const session = await getServerSession(authOptions);
  const greeterId = session?.user.id;
  if (!greeterId) return null;
  
  const jobs = await prisma.booking.findMany({
    where: { greeterId },
    include: { driver: { select: { name: true } }, vehicle: { select: { plate: true } } },
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
    driver: job.driver,
    vehicle: job.vehicle,
  }));

  return (
    <>
      {/* Arka planda 30 saniyede bir admin paneline aktiflik sinyali gönderir */}
      <OnlineTracker currentUserId={greeterId} />
      
      <OperationsDashboard role="GREETER" name={session?.user?.name || "Karşılamacı"} jobs={serializedJobs} />
      <ProfileSettingsCard />
    </>
  );
}