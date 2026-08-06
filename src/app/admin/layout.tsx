import React from "react";
import { AdminLayout } from "@/components/admin/nextadmin/AdminLayout";

export const metadata = {
  title: "Eurosia VIP Transfer - Admin Suite",
  description: "Eurosia VIP Transfer Yönetim ve CMS Paneli",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
