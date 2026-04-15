import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: 'swap',
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Etsy Clone | Unique & Creative Marketplace",
  description: "Shop for unique items from independent creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, outfit.variable, "font-sans", geist.variable)}
    >
      <body className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
              <Toaster 
                position="top-right" 
                richColors 
                style={{ top: '80px', right: '0px' }} 
              />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
