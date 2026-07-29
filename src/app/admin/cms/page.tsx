import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CmsIndex() {
  const session = await requireAdminSession();
  if (!session) return <div className="ev-page">Admin girişi gerekli.</div>;

  const counts = await Promise.all([
    prisma.contentEntry.count(),
    prisma.mediaItem.count(),
    prisma.siteSetting.count(),
  ]);

  return (
    <main className="ev-page ev-page--wide">
      <h1>CMS Yönetimi</h1>
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <Link className="ev-card" href="/admin/content">
          <h3>İçerikler</h3>
          <div>{counts[0]} öğe</div>
        </Link>
        <Link className="ev-card" href="/admin/media">
          <h3>Medya</h3>
          <div>{counts[1]} dosya</div>
        </Link>
        <Link className="ev-card" href="/admin/settings">
          <h3>Ayarlar</h3>
          <div>{counts[2]} ayar</div>
        </Link>
      </div>
    </main>
  );
}
