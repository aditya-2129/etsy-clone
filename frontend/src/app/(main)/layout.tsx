import MarketplaceShell from "@/components/layout/MarketplaceShell";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarketplaceShell>{children}</MarketplaceShell>;
}
