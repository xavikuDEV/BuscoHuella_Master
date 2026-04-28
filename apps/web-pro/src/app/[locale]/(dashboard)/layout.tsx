// apps/web-pro/src/app/[locale]/(dashboard)/layout.tsx
// Zona Operativa: Todos los paneles privados.
// El AdminLayout (Sidebar) vive aquí y envuelve a todos los paneles de abajo.
import AdminLayout from "@/components/dashboard/layouts/AdminLayout";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
