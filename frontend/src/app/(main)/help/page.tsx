import { StaticInfoPage } from "@/components/shared/StaticInfoPage";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
  return (
    <StaticInfoPage 
      title="Help Center" 
      subtitle="Find answers to common questions or get in touch."
      icon={HelpCircle}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Popular Topics</h2>
          <ul className="space-y-2 text-sm md:text-base">
            <li><button className="text-[var(--etsy-orange)] hover:underline">How do I track my order?</button></li>
            <li><button className="text-[var(--etsy-orange)] hover:underline">How do I contact a seller?</button></li>
            <li><button className="text-[var(--etsy-orange)] hover:underline">What is the return policy?</button></li>
            <li><button className="text-[var(--etsy-orange)] hover:underline">How do I leave a review?</button></li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">Contact Us</h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help 24/7.
          </p>
          <Button className="rounded-full bg-[var(--etsy-orange)] hover:bg-[var(--etsy-orange-hover)] text-white">
            Contact Support
          </Button>
        </section>
      </div>
    </StaticInfoPage>
  );
}
