import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function ContentListPage() {
  let entries = [] as Array<{ id: string; key: string; locale: string; title: string }>;
  let error: string | null = null;
  try {
    entries = await prisma.contentEntry.findMany({ orderBy: { updatedAt: "desc" }, take: 200 });
  } catch (e: any) {
    error = e?.message ?? String(e);
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4">Content</h1>
        <Link href="/admin/content/new" className="btn btn-primary">New content</Link>
      </div>

      {error && (
        <div className="alert alert-warning">Database unavailable: showing empty list. ({error})</div>
      )}

      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Key</th>
                <th>Locale</th>
                <th>Title</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4">No entries</td>
                </tr>
              )}

              {entries.map((e) => (
                <tr key={e.id}>
                  <td>{e.key}</td>
                  <td>{e.locale}</td>
                  <td>{e.title}</td>
                  <td className="text-end">
                    <Link href={`/admin/content/${e.id}`} className="btn btn-sm btn-outline-secondary me-2">Edit</Link>
                    <button className="btn btn-sm btn-outline-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
