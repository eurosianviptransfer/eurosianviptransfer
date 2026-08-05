import { prisma } from "@/lib/db";

export default async function UsersPage() {
  let users: Array<{ id: string; name: string; email: string; role: string }> = [];
  let error: string | null = null;

  try {
    const rawUsers = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
    users = rawUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email ?? "(no email)",
      role: user.role,
    }));
  } catch (e: any) {
    error = e?.message ?? String(e);
  }

  return (
    <div>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h4 mb-1">Users</h1>
          <p className="text-muted mb-0">Manage platform users and review the latest sign-ups.</p>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-secondary btn-sm">Invite User</button>
          <button type="button" className="btn btn-primary btn-sm">Create User</button>
        </div>
      </div>

      {error && <div className="alert alert-warning">Users unavailable: {error}</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="mb-3 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
            <div>
              <h5 className="mb-1">Active users</h5>
              <p className="text-muted mb-0">{users.length} users loaded.</p>
            </div>
            <div className="input-group" style={{ maxWidth: 300 }}>
              <span className="input-group-text bg-white border-end-0">🔎</span>
              <input type="search" className="form-control border-start-0" placeholder="Filter users" disabled />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-muted">
                      No users available.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className="badge bg-secondary text-uppercase small">{u.role}</span>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-secondary me-2">Edit</button>
                        <button className="btn btn-sm btn-outline-danger">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
