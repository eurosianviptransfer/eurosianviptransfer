import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SettingForm } from "@/components/admin/cms/SettingForm";

export const dynamic = "force-dynamic";

export default async function EditSettingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.siteSetting.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <>
      <div className="ev-cms-breadcrumb">
        <Link href="/admin/settings">Ayarlar</Link> / {item.key}
      </div>
      <div className="ev-cms-topbar">
        <div>
          <h1 className="ev-h1">Ayarı Düzenle</h1>
          <p><code>{item.key}</code> · {item.locale ?? "global"}</p>
        </div>
      </div>
      <SettingForm initial={{ id: item.id, key: item.key, locale: item.locale, value: item.value }} />
    </>
  );
}
