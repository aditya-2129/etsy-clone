import { StaticInfoPage } from "@/components/shared/StaticInfoPage";
import { Users } from "lucide-react";

export default function AffiliatesPage() {
  return (
    <StaticInfoPage 
      title="Affiliate Program" 
      subtitle="Earn commissions by sharing your favorite Marketplace finds."
      icon={Users}
    >
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Partner with Us</h2>
        <p>
          Our Affiliate Program allows you to earn commissions by referring new buyers to Marketplace. It&apos;s a great way to earn extra income while supporting independent creators.
        </p>
        
        <h3 className="text-xl font-bold">How it Works</h3>
        <ol className="list-decimal pl-6 space-y-2 text-sm md:text-base">
          <li><strong>Apply:</strong> Fill out our simple application form to join the program.</li>
          <li><strong>Share:</strong> Use your unique affiliate links to share items on your blog, social media, or website.</li>
          <li><strong>Earn:</strong> Receive a commission for every qualifying purchase made through your links.</li>
        </ol>
        
        <h3 className="text-xl font-bold pt-4">Benefits</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm md:text-base">
          <li>Competitive commission rates on all qualifying sales.</li>
          <li>Access to a wide range of promotional materials and tools.</li>
          <li>Monthly payouts and dedicated support.</li>
        </ul>
      </section>
    </StaticInfoPage>
  );
}
