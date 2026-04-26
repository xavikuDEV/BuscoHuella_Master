// apps/web-pro/src/app/[locale]/dashboard/layout.tsx
import AdminLayout from "@/components/dashboard/layouts/AdminLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
