import { prisma } from "@/lib/db";

export default async function SettingsPage() {
  let settings: any = null;
  let error: string | null = null;
  try {
    settings = await prisma.siteSetting.findFirst();
  } catch (e: any) {
    error = e?.message ?? String(e);
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4">Settings</h1>
      </div>

      {error && <div className="alert alert-warning">Settings unavailable: {error}</div>}

      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Site title</label>
            <input className="form-control" defaultValue={settings?.siteTitle ?? "Eurosian VIP Transfer"} />
          </div>

          <div className="mb-3">
            <label className="form-label">Logo URL</label>
            <input className="form-control" defaultValue={settings?.logoUrl ?? "/public/logo.png"} />
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
