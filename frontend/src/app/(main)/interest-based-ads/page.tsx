import { StaticInfoPage } from "@/components/shared/StaticInfoPage";
import { Megaphone } from "lucide-react";

export default function InterestAdsPage() {
  return (
    <StaticInfoPage 
      title="Interest-Based Ads" 
      subtitle="How we personalize your advertising experience."
      icon={Megaphone}
    >
      <section className="space-y-6">
        <p>
          We use information about your activity on Marketplace and across the web to show you ads that are more relevant to your interests.
        </p>
        
        <h2 className="text-xl font-bold">What are Interest-Based Ads?</h2>
        <p>
          Interest-based ads (also known as personalized or targeted ads) are based on information collected from your browsing behavior, such as the items you view, search for, or purchase on Marketplace.
        </p>
        
        <h2 className="text-xl font-bold">Your Choices</h2>
        <p>
          You can opt-out of receiving interest-based ads from us at any time by adjusting your privacy settings in your account.
        </p>
      </section>
    </StaticInfoPage>
  );
}
