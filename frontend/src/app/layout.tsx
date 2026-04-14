import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-primary",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Handmade Marketplace",
  description: "Find handmade, vintage, and custom goods from independent sellers.",
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
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            style={{ top: '80px', right: '0px' }} 
          />
        </AuthProvider>
      </body>
    </html>
  );
}
