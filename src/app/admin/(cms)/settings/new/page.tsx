import Link from "next/link";
import { SettingForm } from "@/components/admin/cms/SettingForm";

export const dynamic = "force-dynamic";

export default function NewSettingPage() {
  return (
    <>
      <div className="ev-cms-breadcrumb">
        <Link href="/admin/settings">Ayarlar</Link> / Yeni ayar
      </div>
      <div className="ev-cms-topbar">
        <div>
          <h1 className="ev-h1">Yeni Site Ayarı</h1>
          <p>Bir anahtar-değer ayarı ekleyin (örn. iletişim bilgisi, sosyal medya linki, banner metni).</p>
        </div>
      </div>
      <SettingForm />
    </>
  );
}
