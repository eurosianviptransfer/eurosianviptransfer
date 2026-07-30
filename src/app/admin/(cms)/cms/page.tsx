import { prisma } from "@/lib/db";
import Link from "next/link";
import { IconMedia, IconPages, IconSettings } from "@/components/admin/cms/icons";
import { CONTENT_TYPE_LABELS, LOGO_SETTING_KEY } from "@/lib/cms/constants";

export const dynamic = "force-dynamic";

export default async function CmsIndex() {
  const [contentCount, mediaCount, settingCount, recentContent, recentMedia, logoSetting] = await Promise.all([
    prisma.contentEntry.count(),
    prisma.mediaItem.count(),
    prisma.siteSetting.count(),
    prisma.contentEntry.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    prisma.mediaItem.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.siteSetting.findFirst({ where: { key: LOGO_SETTING_KEY } }),
  ]);

  const logoUrl = (logoSetting?.value as { url?: string } | null)?.url;

  return (
    <>
      <div className="ev-cms-topbar">
        <div>
          <h1 className="ev-h1">CMS Genel Bakış</h1>
          <p>Sayfalar, statik metinler, medya ve site ayarlarını buradan yönetin.</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl || "/eurosianviptransferlogo.png"} alt="Site logosu" style={{ height: 40, borderRadius: 8, background: "#fff", padding: 4 }} />
      </div>

      <div className="ev-stat-grid">
        <Link href="/admin/content" className="ev-stat-card">
          <div className="ev-stat-card-icon" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
            <IconPages />
          </div>
          <strong>{contentCount}</strong>
          <span>Sayfa &amp; statik metin</span>
        </Link>
        <Link href="/admin/media" className="ev-stat-card">
          <div className="ev-stat-card-icon" style={{ background: "var(--teal-soft)", color: "var(--teal)" }}>
            <IconMedia />
          </div>
          <strong>{mediaCount}</strong>
          <span>Medya dosyası</span>
        </Link>
        <Link href="/admin/settings" className="ev-stat-card">
          <div className="ev-stat-card-icon" style={{ background: "var(--gold-soft)", color: "var(--gold)" }}>
            <IconSettings />
          </div>
          <strong>{settingCount}</strong>
          <span>Site ayarı</span>
        </Link>
        <Link href="/admin/content/new" className="ev-stat-card">
          <div className="ev-stat-card-icon" style={{ background: "var(--rose-soft)", color: "var(--rose)" }}>
            <IconPages />
          </div>
          <strong>+</strong>
          <span>Yeni içerik ekle</span>
        </Link>
      </div>

      <div className="ev-grid ev-grid--2">
        <div className="ev-card">
          <div className="ev-card-row">
            <h3 style={{ margin: 0 }}>Son güncellenen içerikler</h3>
            <Link className="ev-text-link" href="/admin/content">Tümünü gör</Link>
          </div>
          <div className="ev-cms-list" style={{ marginTop: 14 }}>
            {recentContent.length === 0 && <div className="ev-empty">Henüz içerik yok.</div>}
            {recentContent.map((it) => (
              <Link key={it.id} href={`/admin/content/${it.id}`} className="ev-cms-item" style={{ textDecoration: "none" }}>
                <div className="ev-cms-item-main">
                  <span className="ev-cms-item-title">{it.title || it.key}</span>
                  <span className="ev-cms-item-meta">
                    <span className="ev-badge ev-badge--blue">{CONTENT_TYPE_LABELS[it.type] ?? it.type}</span>
                    {it.locale} · {it.published ? "Yayında" : "Taslak"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="ev-card">
          <div className="ev-card-row">
            <h3 style={{ margin: 0 }}>Son yüklenen medya</h3>
            <Link className="ev-text-link" href="/admin/media">Tümünü gör</Link>
          </div>
          <div className="ev-media-grid" style={{ marginTop: 14 }}>
            {recentMedia.length === 0 && <div className="ev-empty">Henüz medya yok.</div>}
            {recentMedia.map((m) => (
              <div key={m.id} className="ev-media-card">
                <div className="ev-media-thumb">
                  {m.mime?.startsWith("image") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt={m.alt || m.filename} />
                  ) : (
                    <span style={{ fontSize: 12 }}>{m.filename}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
