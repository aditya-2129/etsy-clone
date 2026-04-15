import { StaticInfoPage } from "@/components/shared/StaticInfoPage";
import { Briefcase } from "lucide-react";

export default function CareersPage() {
  return (
    <StaticInfoPage 
      title="Careers" 
      subtitle="Join our team and help build the future of commerce."
      icon={Briefcase}
    >
      <section className="space-y-6">
        <p>
          Marketplace is a mission-driven company that values creativity, collaboration, and community. We&apos;re always looking for talented individuals to join our team.
        </p>
        
        <h2 className="text-xl font-bold">Why Work at Marketplace?</h2>
        <p>
          We offer a dynamic and inclusive work environment where you can make a real impact. You&apos;ll work with a passionate team of experts to solve complex problems and build products that millions of people love.
        </p>
        
        <h2 className="text-xl font-bold">Current Openings</h2>
        <p className="text-muted-foreground italic">
          There are currently no open positions. Please check back later!
        </p>
      </section>
    </StaticInfoPage>
  );
}
