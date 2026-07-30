import { prisma } from "@/lib/db";
import Link from "next/link";
import { IconPlus } from "@/components/admin/cms/icons";
import { LogoPicker } from "@/components/admin/cms/LogoPicker";
import { LOGO_SETTING_KEY } from "@/lib/cms/constants";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage() {
  const items = await prisma.siteSetting.findMany({ orderBy: { key: "asc" }, take: 200 });
  const logoSetting = items.find((it) => it.key === LOGO_SETTING_KEY);
  const otherItems = items.filter((it) => it.key !== LOGO_SETTING_KEY);
  const logoUrl = (logoSetting?.value as { url?: string } | null)?.url ?? null;

  return (
    <>
      <div className="ev-cms-topbar">
        <div>
          <h1 className="ev-h1">Site Ayarları</h1>
          <p>Marka, iletişim bilgileri ve diğer genel site ayarlarını yönetin.</p>
        </div>
        <Link className="ev-btn ev-btn--icon" href="/admin/settings/new">
          <IconPlus /> Yeni Ayar
        </Link>
      </div>

      <LogoPicker currentUrl={logoUrl} settingKey={LOGO_SETTING_KEY} />

      <div className="ev-cms-list">
        {otherItems.length === 0 && <div className="ev-empty">Henüz başka bir ayar yok.</div>}
        {otherItems.map((it) => (
          <div key={it.id} className="ev-cms-item">
            <div className="ev-cms-item-main">
              <span className="ev-cms-item-title">{it.key}</span>
              <span className="ev-cms-item-meta">
                <span className="ev-badge ev-badge--blue">{it.locale ?? "global"}</span>
              </span>
              <span className="ev-cms-item-desc">{JSON.stringify(it.value)}</span>
            </div>
            <div className="ev-cms-item-actions">
              <Link className="ev-btn ev-btn--ghost ev-btn--sm" href={`/admin/settings/${it.id}`}>Düzenle</Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
