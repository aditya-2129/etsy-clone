"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ShoppingBag, Calendar, Share2, Info, Star } from "lucide-react";
import { getFilePreview } from "@/lib/services/storage.service";
import { BUCKET_SHOP_ASSETS } from "@/lib/constants";
import type { Shop } from "@/lib/types";
import { RatingStars } from "@/components/shared/RatingStars";
import { cn } from "@/lib/utils";

interface ShopHeaderProps {
  shop: Shop;
}

export function ShopHeader({ shop }: ShopHeaderProps) {
  const bannerUrl = shop.banner
    ? getFilePreview(BUCKET_SHOP_ASSETS, shop.banner, { width: 1500, height: 400 })
    : null;

  const logoUrl = shop.logo
    ? getFilePreview(BUCKET_SHOP_ASSETS, shop.logo, { width: 300, height: 300 })
    : null;

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="relative">
      {/* Banner Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-48 md:h-80 w-full overflow-hidden rounded-3xl bg-muted shadow-inner group"
      >
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt={`${shop.name} banner`}
            fill
            priority
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--etsy-orange)]/10 via-orange-100 to-amber-50 dark:from-orange-900/20 dark:via-zinc-900 dark:to-zinc-800 flex items-center justify-center">
             <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
             <ShoppingBag className="h-16 w-16 text-[var(--etsy-orange)]/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 pointer-events-none" />
        
        {/* Share Button Overlay */}
        <button className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 hidden md:flex">
          <Share2 className="h-4 w-4" />
        </button>
      </motion.div>

      {/* Profile & Info Bar */}
      <div className="relative px-4 md:px-10 -mt-10 md:-mt-14 flex flex-col md:flex-row gap-6 items-start md:items-end">
        {/* Logo with Animation */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className="relative h-28 w-28 md:h-40 md:w-40 rounded-[2rem] md:rounded-[3rem] bg-card border-[6px] border-background shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden ring-1 ring-border/50 group"
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={shop.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[var(--etsy-orange)] to-orange-600 flex items-center justify-center text-white text-5xl font-extrabold tracking-tighter shadow-inner">
              {shop.name.charAt(0)}
            </div>
          )}
        </motion.div>

        {/* Shop Main Title & Actions */}
        <div className="flex-1 pb-2 flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
          <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground/90 uppercase">
                  {shop.name}
                </h1>
                {shop.isApproved && (
                  <div className="bg-blue-500 text-white p-1 rounded-full shadow-sm" title="Verified Shop">
                    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                {shop.description || "Welcome to our unique marketplace shop."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--etsy-orange)]/5 text-[var(--etsy-orange)] ring-1 ring-[var(--etsy-orange)]/20">
                <RatingStars rating={shop.rating} size="xs" />
                <span>{shop.rating}</span>
                <span className="text-[10px] opacity-60">(Reviews)</span>
              </div>
              {shop.location && (
                <div className="flex items-center gap-1.5 text-muted-foreground/80">
                  <MapPin className="h-4 w-4 text-[var(--etsy-orange)]" />
                  <span>{shop.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-muted-foreground/80">
                <Calendar className="h-4 w-4" />
                <span>Established {new Date(shop.$createdAt).getFullYear()}</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            {...fadeIn} 
            transition={{ delay: 0.4 }} 
            className="flex gap-3 w-full md:w-auto"
          >
            <button className="flex-1 md:flex-none px-8 py-3.5 rounded-2xl bg-foreground text-background font-bold text-sm shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all active:scale-95">
              Follow Shop
            </button>
            <button className="p-3.5 rounded-2xl border border-border bg-card/50 backdrop-blur-md font-bold text-sm hover:bg-accent transition-all active:scale-95 group" title="Shop Info">
              <Info className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <motion.div 
        {...fadeIn}
        transition={{ delay: 0.5 }}
        className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border border-border/40 p-2 md:p-3 rounded-[2rem] bg-muted/20 backdrop-blur-xl"
      >
        {[
          { label: "Sales", value: shop.totalSales, icon: ShoppingBag },
          { label: "Rating", value: shop.rating, icon: Star },
          { label: "Response", value: "24h", icon: Info },
          { label: "On Time", value: "100%", icon: Calendar },
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-4 bg-card/60 rounded-2xl p-4 md:p-6 shadow-sm border border-border/30 hover:bg-card transition-colors">
             <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-[var(--etsy-orange)]/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-[var(--etsy-orange)]" />
             </div>
             <div>
                <p className="text-xl md:text-2xl font-black tracking-tight">{stat.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
             </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
