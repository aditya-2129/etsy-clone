import { StaticInfoPage } from "@/components/shared/StaticInfoPage";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <StaticInfoPage 
      title="Terms of Use" 
      subtitle="The legal agreement between you and Marketplace."
      icon={FileText}
    >
      <section className="space-y-6">
        <p>
          By using Marketplace, you agree to these Terms of Use. Please read them carefully.
        </p>
        
        <h2 className="text-xl font-bold">Acceptance of Terms</h2>
        <p>
          These terms guide your use of our platform. If you do not agree to these terms, you may not use our services.
        </p>
        
        <h2 className="text-xl font-bold">User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account and password. You must be at least 18 years old to create an account.
        </p>

        <h2 className="text-xl font-bold">Prohibited Conduct</h2>
        <p>
          You may not use our services for any illegal purpose or to violate any laws in your jurisdiction.
        </p>
      </section>
    </StaticInfoPage>
  );
}
