import { prisma } from "@/lib/db";

export default async function UsersPage() {
  let users: Array<{ id: string; name: string; email: string; role: string }> = [];
  let error: string | null = null;
  try {
    const rawUsers = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
    users = rawUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email ?? "",
      role: user.role,
    }));
  } catch (e: any) {
    error = e?.message ?? String(e);
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4">Users</h1>
      </div>

      {error && <div className="alert alert-warning">Users unavailable: {error}</div>}

      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4">No users</td>
                </tr>
              )}
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-secondary me-2">Edit</button>
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
