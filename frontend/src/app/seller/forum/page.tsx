import { StaticInfoPage } from "@/components/shared/StaticInfoPage";
import { MessageSquare } from "lucide-react";

export default function SellerForumPage() {
  return (
    <StaticInfoPage 
      title="Seller Forum" 
      subtitle="Connect with other sellers and share your experiences."
      icon={MessageSquare}
    >
      <section className="space-y-6">
        <p>
          The Marketplace Seller Forum is a place for independent creators to discuss business strategies, share tips, and support one another.
        </p>
        
        <h2 className="text-xl font-bold">Forum Guidelines</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Be respectful and supportive of your fellow sellers.</li>
          <li>Keep discussions relevant to selling on Marketplace.</li>
          <li>Do not share sensitive personal or financial information.</li>
          <li>Spam and self-promotion are not allowed.</li>
        </ul>
        
        <h2 className="text-xl font-bold pt-4 text-center">Coming Soon!</h2>
        <p className="text-center text-muted-foreground italic">
          We are currently rebuilding our forum experience. Stay tuned for a brand new way to connect with the community.
        </p>
      </section>
    </StaticInfoPage>
  );
}
