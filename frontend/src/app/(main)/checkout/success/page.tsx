"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  Package, 
  ArrowRight, 
  ShoppingBag,
  ExternalLink,
  Loader2,
  Calendar,
  CreditCard,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderById } from "@/lib/services/order.service";
import { PriceTag } from "@/components/shared/PriceTag";
import { formatDate } from "@/lib/utils/formatters";
import type { Order } from "@/lib/types";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--etsy-orange)]" />
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find the order you're looking for.</p>
        <Button asChild className="rounded-full">
          <Link href="/explore">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Success Header */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
          <div className="relative flex items-center justify-center h-24 w-24 bg-green-500 text-white rounded-full mx-auto shadow-xl shadow-green-500/20">
            <CheckCircle2 className="h-14 w-14" />
          </div>
        </div>
        <h1 className="text-4xl font-heading font-bold mb-4">Woot! Order Confirmed</h1>
        <p className="text-xl text-muted-foreground">
          Thanks for supporting independent creators. We've sent a confirmation to your email.
        </p>
      </div>

      {/* Order Info Card */}
      <Card className="rounded-3xl border-none shadow-xl overflow-hidden mb-8 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
        <CardHeader className="bg-muted/30 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Order ID</p>
              <p className="text-lg font-mono font-bold">#{orderId.toUpperCase()}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild className="rounded-full bg-background/50">
                <Link href={`/account/orders/${orderId}`}>
                  View Details <ExternalLink className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="h-10 w-10 bg-[var(--etsy-orange)]/10 text-[var(--etsy-orange)] rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Date</p>
                <p className="font-medium">{order ? formatDate(order.$createdAt) : "Today"}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-10 w-10 bg-[var(--etsy-orange)]/10 text-[var(--etsy-orange)] rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Payment</p>
                <p className="font-medium capitalize">{order?.paymentMethod || "Pending"} • {order?.paymentStatus || "Processing"}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-10 w-10 bg-[var(--etsy-orange)]/10 text-[var(--etsy-orange)] rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total</p>
                <PriceTag price={order?.totalAmount || 0} className="text-xl font-bold" />
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-2xl p-6 border border-muted flex items-start gap-4">
            <Package className="h-6 w-6 text-[var(--etsy-orange)] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-1">What happens next?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The sellers have been notified and will start preparing your items. You'll receive updates as each shipment is dispatched. Most items arrive within 3-5 business days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-500">
        <Button asChild size="lg" className="w-full sm:w-auto rounded-2xl h-14 px-8 text-lg font-bold bg-[var(--etsy-orange)] hover:bg-[var(--etsy-orange)]/90 text-white shadow-lg hover:shadow-xl transition-all">
          <Link href="/explore">
            Continue Shopping <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-2xl h-14 px-8 text-lg font-bold">
          <Link href="/account/orders">
            Order History
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--etsy-orange)]" />
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
