import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function MediaAdminPage() {
  const session = await requireAdminSession();
  if (!session) return <div className="ev-page">Admin girişi gerekli.</div>;

  const items = await prisma.mediaItem.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <main className="ev-page ev-page--wide">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Medya Kütüphanesi</h1>
        <a className="ev-btn" href="/admin/media/upload">Yükle</a>
      </div>

      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
        {items.map((m) => (
          <div key={m.id} className="ev-card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ height: 120, background: '#f6f6f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {m.mime?.startsWith('image') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt={m.alt || m.filename} style={{ maxHeight: 120, maxWidth: '100%' }} />
              ) : (
                <div style={{ fontSize: 12 }}>{m.filename}</div>
              )}
            </div>
            <div style={{ fontSize: 13 }}>{m.filename}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <a className="ev-btn ev-btn--ghost" href={m.url} target="_blank">Aç</a>
            <DeleteButton url={`/api/admin/media/${m.id}`} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
