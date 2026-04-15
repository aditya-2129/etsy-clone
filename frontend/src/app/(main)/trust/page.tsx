import { StaticInfoPage } from "@/components/shared/StaticInfoPage";
import { ShieldAlert } from "lucide-react";

export default function TrustPage() {
  return (
    <StaticInfoPage 
      title="Trust & Safety" 
      subtitle="Your security is our top priority."
      icon={ShieldAlert}
    >
      <section className="space-y-6">
        <p>
          We work hard to ensure that Marketplace remains a safe and secure place for everyone. Here are some of the ways we protect our community:
        </p>
        
        <h2 className="text-xl font-bold">Secure Transactions</h2>
        <p>
          We use industry-leading encryption to protect your payment details. We also have a Purchase Protection program to help you if something goes wrong with an order.
        </p>
        
        <h2 className="text-xl font-bold">Fraud Prevention</h2>
        <p>
          Our team uses advanced technology and manual reviews to identify and prevent fraudulent activity on our platform.
        </p>

        <h2 className="text-xl font-bold">Reporting Issues</h2>
        <p>
          If you see something that violates our policies or seems suspicious, you can report it to us directly. We investigate all reports promptly.
        </p>
      </section>
    </StaticInfoPage>
  );
}
