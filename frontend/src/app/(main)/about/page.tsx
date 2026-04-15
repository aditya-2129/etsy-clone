import { StaticInfoPage } from "@/components/shared/StaticInfoPage";
import { Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <StaticInfoPage 
      title="About Marketplace" 
      subtitle="We're a global commerce platform for creative goods."
      icon={Sparkles}
    >
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Our Mission</h2>
        <p>
          Marketplace is the global marketplace for unique and creative goods. It&apos;s home to a universe of special, extraordinary items, from unique handcrafted pieces to vintage treasures.
        </p>
        <p>
          In a time of increasing automation, it&apos;s our mission to keep human connection at the heart of commerce. That&apos;s why we built a place where creativity lives and thrives because it&apos;s powered by people. 
        </p>
        
        <h2 className="text-2xl font-bold pt-4">How it works</h2>
        <p>
          Our platform connects people looking for unique goods with independent sellers around the world. When you shop on Marketplace, you&apos;re supporting small businesses and independent creators directly.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Unique everything:</strong> We have millions of one-of-a-kind items.</li>
          <li><strong>Independent sellers:</strong> Buy directly from someone who put their heart into what they made.</li>
          <li><strong>Secure shopping:</strong> We use industry-leading technology to protect your transactions.</li>
        </ul>
      </section>
    </StaticInfoPage>
  );
}
