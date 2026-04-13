import Link from "next/link";
import { Globe, ShieldCheck, TreePine } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-border bg-muted/40">
      <div className="mx-auto max-w-[var(--max-width)] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Shop Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-semibold text-lg">Shop</h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link href="/category/jewelry" className="hover:text-[var(--etsy-orange)] transition-colors">Jewelry & Accessories</Link></li>
              <li><Link href="/category/clothing" className="hover:text-[var(--etsy-orange)] transition-colors">Clothing & Shoes</Link></li>
              <li><Link href="/category/home" className="hover:text-[var(--etsy-orange)] transition-colors">Home & Living</Link></li>
              <li><Link href="/category/art" className="hover:text-[var(--etsy-orange)] transition-colors">Art & Collectibles</Link></li>
            </ul>
          </div>

          {/* Sell Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-semibold text-lg">Sell</h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link href="/seller/dashboard" className="hover:text-[var(--etsy-orange)] transition-colors">Sell on Marketplace</Link></li>
              <li><Link href="/seller/guide" className="hover:text-[var(--etsy-orange)] transition-colors">Seller Guide</Link></li>
              <li><Link href="/seller/forum" className="hover:text-[var(--etsy-orange)] transition-colors">Community Forum</Link></li>
              <li><Link href="/seller/affiliates" className="hover:text-[var(--etsy-orange)] transition-colors">Affiliates</Link></li>
            </ul>
          </div>

          {/* About Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-semibold text-lg">About</h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-[var(--etsy-orange)] transition-colors">Marketplace, Inc.</Link></li>
              <li><Link href="/policies" className="hover:text-[var(--etsy-orange)] transition-colors">Policies</Link></li>
              <li><Link href="/investors" className="hover:text-[var(--etsy-orange)] transition-colors">Investors</Link></li>
              <li><Link href="/careers" className="hover:text-[var(--etsy-orange)] transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Help Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-semibold text-lg">Help</h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-[var(--etsy-orange)] transition-colors">Help Center</Link></li>
              <li><Link href="/trust" className="hover:text-[var(--etsy-orange)] transition-colors">Trust & Safety</Link></li>
              <li><Link href="/privacy" className="hover:text-[var(--etsy-orange)] transition-colors">Privacy Settings</Link></li>
            </ul>
          </div>
        </div>

        {/* Value Props Row */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center md:justify-around py-8 border-y border-border text-center md:text-left">
          <div className="flex flex-col items-center gap-2 max-w-xs">
            <TreePine className="h-8 w-8 text-[var(--etsy-success)]" />
            <h4 className="font-semibold">Sustainable Delivery</h4>
            <p className="text-sm text-muted-foreground">Every purchase supports environmental initiatives.</p>
          </div>
          <div className="flex flex-col items-center gap-2 max-w-xs">
            <ShieldCheck className="h-8 w-8 text-[var(--etsy-orange)]" />
            <h4 className="font-semibold">Purchase Protection</h4>
            <p className="text-sm text-muted-foreground">Shop confidently with our guaranteed protection program.</p>
          </div>
          <div className="flex flex-col items-center gap-2 max-w-xs">
            <Globe className="h-8 w-8 text-primary" />
            <h4 className="font-semibold">Global Community</h4>
            <p className="text-sm text-muted-foreground">Connecting independent creators with buyers worldwide.</p>
          </div>
        </div>

        {/* Bottom Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-8 pt-4 text-xs text-muted-foreground gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-full border border-border">
              <Globe className="h-3 w-3" /> India | English (IN) | ₹ (INR)
            </span>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span>&copy; {new Date().getFullYear()} Marketplace, Inc.</span>
            <Link href="/terms" className="hover:underline">Terms of Use</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/interest-based-ads" className="hover:underline">Interest-based ads</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
