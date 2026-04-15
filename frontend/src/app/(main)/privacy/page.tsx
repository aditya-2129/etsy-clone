import { StaticInfoPage } from "@/components/shared/StaticInfoPage";
import { Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <StaticInfoPage 
      title="Privacy Policy" 
      subtitle="How we protect your personal information."
      icon={Lock}
    >
      <section className="space-y-6 text-sm md:text-base">
        <p>
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and share your personal information when you use Marketplace.
        </p>
        
        <h2 className="text-xl font-bold">Information We Collect</h2>
        <p>
          We collect information you provide to us, such as your name, email address, and shipping address when you create an account or make a purchase.
        </p>
        
        <h2 className="text-xl font-bold">How We Use Your Information</h2>
        <p>
          We use your information to provide and improve our services, process your transactions, and communicate with you about your orders.
        </p>

        <h2 className="text-xl font-bold">Data Security</h2>
        <p>
          We use industry-standard security measures to protect your personal information. Your payment information is encrypted and processed securely through our payment partners.
        </p>
      </section>
    </StaticInfoPage>
  );
}
