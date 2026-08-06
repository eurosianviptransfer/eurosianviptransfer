import { getServerSession } from "next-auth";
import { authOptions } from "./config";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session as any).error || session.user.role !== "ADMIN") return null;
  return session;
}

export async function requireDriverSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session as any).error || session.user.role !== "DRIVER") return null;
  return session;
}

export async function requireGreeterSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session as any).error || session.user.role !== "GREETER") return null;
  return session;
}
