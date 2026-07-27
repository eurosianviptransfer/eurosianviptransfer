import { getServerSession } from "next-auth";
import { authOptions } from "./config";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "ADMIN") return null;
  return session;
}
