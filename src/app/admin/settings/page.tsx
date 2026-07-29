import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage() {
  const session = await requireAdminSession();
  if (!session) return <div className="ev-page">Admin girişi gerekli.</div>;

  const items = await prisma.siteSetting.findMany({ orderBy: { key: "asc" }, take: 200 });

  return (
    <main className="ev-page ev-page--wide">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Site Ayarları</h1>
        <Link className="ev-btn" href="/admin/settings/new">Yeni ayar</Link>
      </div>

      <div style={{ marginTop: 12 }}>
        {items.length === 0 && <div className="ev-empty">Henüz ayar yok.</div>}
        {items.map((it) => (
          <div key={it.id} className="ev-card ev-card-row" style={{ justifyContent: "space-between" }}>
            <div>
              <b>{it.key}</b> · {it.locale ?? 'global'}
              <div style={{ fontSize: 13, marginTop: 6 }}>{JSON.stringify(it.value)}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link className="ev-btn ev-btn--ghost" href={`/admin/settings/${it.id}`}>Düzenle</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
