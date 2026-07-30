import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ContentForm } from "@/components/admin/cms/ContentForm";

export const dynamic = "force-dynamic";

export default async function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.contentEntry.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <>
      <div className="ev-cms-breadcrumb">
        <Link href="/admin/content">İçerikler</Link> / {item.title || item.key}
      </div>
      <div className="ev-cms-topbar">
        <div>
          <h1 className="ev-h1">İçeriği Düzenle</h1>
          <p>
            <code>{item.key}</code> · {item.locale}
          </p>
        </div>
      </div>
      <ContentForm
        initial={{
          id: item.id,
          key: item.key,
          locale: item.locale,
          type: item.type,
          title: item.title,
          body: item.body,
          slug: item.slug,
          published: item.published,
          sortOrder: item.sortOrder,
        }}
      />
    </>
  );
}
