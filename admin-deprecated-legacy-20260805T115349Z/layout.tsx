import AdminShell from '@/components/admin/AdminShell';

export const metadata = {
  title: 'Admin - Eurosian VIP Transfer',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
