import { StaticInfoPage } from "@/components/shared/StaticInfoPage";
import { BookOpen } from "lucide-react";

export default function SellerGuidePage() {
  return (
    <StaticInfoPage 
      title="Seller Guide" 
      subtitle="Everything you need to know about selling on Marketplace."
      icon={BookOpen}
    >
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Getting Started</h2>
        <p>
          Welcome to the Marketplace seller community! This guide will help you set up your shop, list your first products, and start making sales.
        </p>
        
        <h3 className="text-xl font-bold">1. Set Up Your Shop</h3>
        <p>
          Choose a unique shop name, upload a banner and logo, and fill out your shop policies. A complete shop profile builds trust with buyers.
        </p>
        
        <h3 className="text-xl font-bold">2. Create Great Listings</h3>
        <p>
          Use high-quality photos, write detailed and accurate descriptions, and use relevant keywords in your titles and tags to help buyers find your items.
        </p>

        <h3 className="text-xl font-bold">3. Shipping & Fulfillment</h3>
        <p>
          Ensure you ship items within your stated processing times. Use tracking whenever possible and communicate with your buyers throughout the process.
        </p>

        <div className="bg-[var(--etsy-orange)]/5 border border-[var(--etsy-orange)]/20 p-6 rounded-2xl mt-8">
          <h4 className="font-bold text-[var(--etsy-orange)] mb-2">Pro Tip</h4>
          <p className="text-sm">
            Providing excellent customer service often leads to positive reviews, which helps boost your shop&apos;s visibility in search results.
          </p>
        </div>
      </section>
    </StaticInfoPage>
  );
}
