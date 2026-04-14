import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VerificationBanner from "@/components/layout/VerificationBanner";

/**
 * Shared shell for all marketplace (non-auth) pages.
 * Provides Navbar, padded main area, and Footer.
 */
export default function MarketplaceShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <VerificationBanner />
      <Navbar />
      <main className="flex-1 w-full max-w-[var(--max-width)] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
