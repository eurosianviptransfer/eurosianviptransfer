import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ContentListPage() {
  let entries: Array<{
    id: string;
    key: string;
    locale: string;
    title: string;
    slug?: string | null;
    published?: boolean | null;
    type?: string | null;
  }> = [];

  let error: string | null = null;

  try {
    const raw = await prisma.contentEntry.findMany({
      orderBy: { updatedAt: "desc" },
      take: 200,
    });

    // Normalize results so title is always a string (DB may have title: string | null)
    entries = raw.map((e) => ({
      id: e.id,
      key: e.key,
      locale: e.locale,
      title: e.title ?? "Başlıksız içerik",
      slug: e.slug ?? null,
      published: e.published ?? false,
      type: String(e.type ?? "PAGE"),
    }));
  } catch (e: any) {
    error = e?.message ?? String(e);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>İçerikler</h1>
          <p className="ev-muted">CMS sayfa ve içerik öğelerini buradan yönetin.</p>
        </div>
        <Link className="ev-btn" href="/admin/content/new">Yeni içerik</Link>
      </div>

      {error && (
        <div className="alert alert-warning">Database unavailable: showing empty list. ({error})</div>
      )}

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {entries.length === 0 && <div className="ev-empty">Henüz içerik yok.</div>}
        {entries.map((it) => (
          <div key={it.id} className="ev-card ev-card-row" style={{ justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <strong>{it.key}</strong>
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{it.locale}</span>
                <span style={{ color: it.published ? "#5fe2b1" : "#ffb3b3", fontSize: 12 }}>
                  {it.published ? "Yayınlandı" : "Taslak"}
                </span>
              </div>
              <div style={{ fontSize: 13, marginTop: 6, color: "var(--text-muted)" }}>{it.title}</div>
              {it.slug && <div style={{ fontSize: 12, marginTop: 4, color: "var(--text-faint)" }}>Slug: {it.slug}</div>}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link className="ev-btn ev-btn--ghost" href={`/admin/content/${it.id}`}>Düzenle</Link>
              <form action={`/api/admin/content/${it.id}`} method="post" style={{ display: "inline" }}>
                <input type="hidden" name="_method" value="DELETE" />
                <button type="submit" className="ev-btn ev-btn--danger">Sil</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}