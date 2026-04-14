import AdminShell from "@/components/layout/AdminShell";
import RoleGuard from "@/components/layout/RoleGuard";
import { UserRole } from "@/lib/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN]}>
      <AdminShell>{children}</AdminShell>
    </RoleGuard>
  );
}
