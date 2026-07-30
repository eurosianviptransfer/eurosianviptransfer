import HomePageClient from "@/components/home/HomePageClient";
import { getSiteLogoUrl } from "@/lib/cms/read";

// Revalidate periodically so logo/settings changes made in /admin show up
// without needing a full redeploy.
export const revalidate = 300;

export default async function HomePage() {
  const logoUrl = await getSiteLogoUrl();
  return <HomePageClient logoUrl={logoUrl} />;
}
