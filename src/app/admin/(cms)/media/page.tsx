import { prisma } from "@/lib/db";
import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { IconUpload } from "@/components/admin/cms/icons";

export const dynamic = "force-dynamic";

export default async function MediaAdminPage() {
  const items = await prisma.mediaItem.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <>
      <div className="ev-cms-topbar">
        <div>
          <h1 className="ev-h1">Medya Kütüphanesi</h1>
          <p>Logolar, sayfa görselleri ve banner'lar için tüm medya dosyalarınız.</p>
        </div>
        <Link className="ev-btn ev-btn--icon" href="/admin/media/upload">
          <IconUpload /> Dosya Yükle
        </Link>
      </div>

      {items.length === 0 && <div className="ev-empty">Henüz medya yok. "Dosya Yükle" ile ilk görselinizi ekleyin.</div>}

      <div className="ev-media-grid">
        {items.map((m) => (
          <div key={m.id} className="ev-media-card">
            <div className="ev-media-thumb">
              {m.mime?.startsWith("image") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt={m.alt || m.filename} />
              ) : (
                <div style={{ fontSize: 12, padding: 12, textAlign: "center" }}>{m.filename}</div>
              )}
            </div>
            <div className="ev-media-body">
              <div className="ev-media-name" title={m.filename}>{m.filename}</div>
              <div className="ev-media-actions">
                <a className="ev-btn ev-btn--ghost ev-btn--sm" href={m.url} target="_blank" rel="noreferrer">Aç</a>
                <DeleteButton url={`/api/admin/media/${m.id}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
