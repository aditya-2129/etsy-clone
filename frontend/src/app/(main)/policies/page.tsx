import { StaticInfoPage } from "@/components/shared/StaticInfoPage";
import { ShieldCheck } from "lucide-react";

export default function PoliciesPage() {
  return (
    <StaticInfoPage 
      title="Our Policies" 
      subtitle="The rules of the road for our community."
      icon={ShieldCheck}
    >
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Marketplace Standards</h2>
        <p>
          To keep our marketplace safe and trustworthy, we have a set of policies that all members must follow. These policies help ensure a positive experience for both buyers and sellers.
        </p>
        
        <h3 className="text-xl font-bold">For Buyers</h3>
        <p>
          Buyers are expected to read item descriptions carefully, provide accurate shipping information, and communicate respectfully with sellers.
        </p>
        
        <h3 className="text-xl font-bold">For Sellers</h3>
        <p>
          Sellers must provide accurate descriptions of their items, honor their shipping and processing times, and provide excellent customer service. Handmade items must be made by the seller.
        </p>

        <h3 className="text-xl font-bold text-[var(--etsy-orange)]">Intellectual Property</h3>
        <p>
          We take intellectual property rights seriously. We do not allow the sale of counterfeit items or items that infringe on the copyrights or trademarks of others.
        </p>
      </section>
    </StaticInfoPage>
  );
}
