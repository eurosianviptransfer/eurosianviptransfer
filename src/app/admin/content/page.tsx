import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";
import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function ContentAdminPage() {
  const session = await requireAdminSession();
  if (!session) return <div className="ev-page">Admin girişi gerekli.</div>;

  const items = await prisma.contentEntry.findMany({ orderBy: { sortOrder: "asc" }, take: 200 });

  return (
    <main className="ev-page ev-page--wide">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>İçerikler</h1>
        <Link className="ev-btn" href="/admin/content/new">Yeni içerik</Link>
      </div>

      <div style={{ marginTop: 12 }}>
        {items.length === 0 && <div className="ev-empty">Henüz içerik yok.</div>}
        {items.map((it) => (
          <div key={it.id} className="ev-card ev-card-row" style={{ justifyContent: "space-between" }}>
            <div>
              <b>{it.key}</b> · {it.locale} · <span style={{ color: "var(--text-muted)" }}>{it.type}</span>
              <div style={{ fontSize: 13, marginTop: 6 }}>{it.title}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Link className="ev-btn ev-btn--ghost" href={`/admin/content/${it.id}`}>Düzenle</Link>
              <DeleteButton url={`/api/admin/content/${it.id}`} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
