import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { siteUrl } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const itemListElement = items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, ...(item.href ? { item: `${siteUrl()}${item.href}` } : {}) }));
  return <><JsonLd value={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement }} /><nav aria-label="Breadcrumb" className="ev-muted" style={{ marginBottom: 18, fontSize: 13 }}>{items.map((item, index) => <span key={`${item.label}-${index}`}>{index > 0 && " / "}{item.href ? <Link href={item.href}>{item.label}</Link> : item.label}</span>)}</nav></>;
}
