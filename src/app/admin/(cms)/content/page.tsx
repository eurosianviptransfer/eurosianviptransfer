import { prisma } from "@/lib/db";
import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { IconPlus } from "@/components/admin/cms/icons";
import { CONTENT_TYPE_LABELS } from "@/lib/cms/constants";

export const dynamic = "force-dynamic";

export default async function ContentAdminPage() {
  const items = await prisma.contentEntry.findMany({ orderBy: { sortOrder: "asc" }, take: 200 });

  return (
    <>
      <div className="ev-cms-topbar">
        <div>
          <h1 className="ev-h1">Sayfalar &amp; Statik Metinler</h1>
          <p>Site içindeki tüm sayfa metinlerini, banner ve bölüm içeriklerini tek yerden yönetin.</p>
        </div>
        <Link className="ev-btn ev-btn--icon" href="/admin/content/new">
          <IconPlus /> Yeni İçerik
        </Link>
      </div>

      <div className="ev-cms-list">
        {items.length === 0 && <div className="ev-empty">Henüz içerik yok. "Yeni İçerik" ile ilk sayfanızı ekleyin.</div>}
        {items.map((it) => (
          <div key={it.id} className="ev-cms-item">
            <div className="ev-cms-item-main">
              <span className="ev-cms-item-title">{it.title || it.key}</span>
              <span className="ev-cms-item-meta">
                <span className="ev-badge ev-badge--blue">{CONTENT_TYPE_LABELS[it.type] ?? it.type}</span>
                <span className="ev-badge ev-badge--teal">{it.locale}</span>
                <span className={`ev-badge ${it.published ? "ev-badge--teal" : "ev-badge--rose"}`}>
                  {it.published ? "Yayında" : "Taslak"}
                </span>
                <code>{it.key}</code>
              </span>
              {it.body && <span className="ev-cms-item-desc">{it.body.replace(/\s+/g, " ").slice(0, 140)}</span>}
            </div>
            <div className="ev-cms-item-actions">
              <Link className="ev-btn ev-btn--ghost ev-btn--sm" href={`/admin/content/${it.id}`}>Düzenle</Link>
              <DeleteButton url={`/api/admin/content/${it.id}`} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
