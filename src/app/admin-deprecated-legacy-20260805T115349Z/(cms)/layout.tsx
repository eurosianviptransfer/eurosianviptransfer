import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdminSession } from "@/lib/auth/guards";
import { ThemeToggle } from "@/components/admin/ThemeToggle";
import { CmsNav } from "@/components/admin/cms/CmsNav";
import { getSiteLogoUrl } from "@/lib/cms/read";

export const dynamic = "force-dynamic";

export default async function CmsLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminSession();
  if (!session) {
    return (
      <main className="ev-page">
        <div className="ev-card">Admin girişi gerekli. Lütfen <Link href="/admin/giris">giriş yapın</Link>.</div>
      </main>
    );
  }

  const logoUrl = await getSiteLogoUrl();

  return (
    <div className="ev-cms-shell">
      <aside className="ev-cms-sidebar">
        <div className="ev-cms-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt="Eurosian VIP Transfer" />
          <div>
            <strong>CMS Paneli</strong>
            <span>İçerik Yönetimi</span>
          </div>
        </div>
        <CmsNav />
        <ThemeToggle />
      </aside>
      <main className="ev-cms-main">{children}</main>
    </div>
  );
}
