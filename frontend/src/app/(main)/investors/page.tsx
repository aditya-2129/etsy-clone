import { StaticInfoPage } from "@/components/shared/StaticInfoPage";
import { TrendingUp } from "lucide-react";

export default function InvestorsPage() {
  return (
    <StaticInfoPage 
      title="Investors" 
      subtitle="Financial performance and investor relations."
      icon={TrendingUp}
    >
      <section className="space-y-6">
        <p>
          Marketplace is committed to transparency and providing our investors with the information they need to make informed decisions.
        </p>
        
        <h2 className="text-xl font-bold">Financial Reports</h2>
        <p>
          Access our latest quarterly and annual financial reports, as well as our investor presentations and SEC filings.
        </p>
        
        <h2 className="text-xl font-bold">Stock Information</h2>
        <p>
          View real-time stock quotes, historical performance data, and dividend information for Marketplace, Inc. (MTKP).
        </p>
      </section>
    </StaticInfoPage>
  );
}
