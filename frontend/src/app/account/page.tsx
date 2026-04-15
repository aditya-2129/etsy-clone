import Link from "next/link";
import { Package, Heart, Settings, Headset, MapPin, UserSquare2 } from "lucide-react";

const accountLinks = [
  {
    title: "Orders",
    description: "View and track your purchases",
    icon: Package,
    href: "/account/orders",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    title: "Wishlist",
    description: "Products you've saved for later",
    icon: Heart,
    href: "/account/wishlist",
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  },
  {
    title: "Profile Settings",
    description: "Update your personal information",
    icon: UserSquare2,
    href: "/account/settings",
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
  {
    title: "Shipping Addresses",
    description: "Manage your delivery locations",
    icon: MapPin,
    href: "/account/settings", // Temporarily same as settings or add specific anchor
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    title: "Help Center",
    description: "Get support and find answers",
    icon: Headset,
    href: "/help",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
];

export default function AccountLandingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-heading text-4xl font-bold tracking-tight mb-2">My Account</h1>
        <p className="text-muted-foreground text-lg">
          Manage your orders, wishlist, and profile settings in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {accountLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="group block p-6 rounded-2xl border bg-card hover:bg-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${link.color} transition-transform group-hover:scale-110`}>
                <link.icon size={28} />
              </div>
              <div>
                <h2 className="font-semibold text-xl mb-1 group-hover:text-primary transition-colors">
                  {link.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {link.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

