import AdminShell from '@/components/admin/AdminShell';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin - Eurosian VIP Transfer (Revamp)',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || role !== 'SUPER_ADMIN') {
    // Redirect to signin (assumes /giris is sign-in) or show 403
    redirect('/giris');
  }

  return <AdminShell>{children}</AdminShell>;
}
