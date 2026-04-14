import MarketplaceShell from "@/components/layout/MarketplaceShell";
import RoleGuard from "@/components/layout/RoleGuard";
import { UserRole } from "@/lib/types";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MarketplaceShell>
      <RoleGuard allowedRoles={[UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN]}>
        {children}
      </RoleGuard>
    </MarketplaceShell>
  );
}
