"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Loader2, 
  ChevronLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  CreditCard,
  ExternalLink,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { getOrderById, getOrderItems } from "@/lib/services/order.service";
import { getProductsByIds } from "@/lib/services/product.service";
import { addReviewAndUpdateProduct } from "@/lib/services/review.service";
import { getFilePreview } from "@/lib/services/storage.service";
import { useAuth } from "@/contexts/AuthContext";
import { ReviewModal } from "@/components/review/ReviewModal";
import { BUCKET_PRODUCT_IMAGES } from "@/lib/constants";
import { PriceTag } from "@/components/shared/PriceTag";
import { formatDate } from "@/lib/utils/formatters";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Order, OrderItem, Product } from "@/lib/types";
import { OrderStatus } from "@/lib/types";

const statusConfig: Record<string, { icon: any, label: string, color: string }> = {
  [OrderStatus.PENDING]: { icon: Calendar, label: "Order Placed", color: "text-blue-500 bg-blue-500/10" },
  [OrderStatus.CONFIRMED]: { icon: CheckCircle2, label: "Confirmed", color: "text-indigo-500 bg-indigo-500/10" },
  [OrderStatus.SHIPPED]: { icon: Truck, label: "Shipped", color: "text-purple-500 bg-purple-500/10" },
  [OrderStatus.DELIVERED]: { icon: Package, label: "Delivered", color: "text-green-500 bg-green-500/10" },
  [OrderStatus.CANCELLED]: { icon: ChevronLeft, label: "Cancelled", color: "text-red-500 bg-red-500/10" },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewItem, setReviewItem] = useState<{ productId: string, title: string } | null>(null);

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!user || !reviewItem) return;
    await addReviewAndUpdateProduct({
      productId: reviewItem.productId,
      buyerId: user.$id,
      reviewerName: user.name || "Anonymous",
      rating,
      comment
    });
  };

  useEffect(() => {
    async function fetchAllData() {
      if (!id) return;
      try {
        setLoading(true);
        // 1. Fetch Order
        const orderData = await getOrderById(id as string);
        setOrder(orderData);

        // 2. Fetch Order Items
        const itemsData = await getOrderItems(id as string);
        setItems(itemsData);

        // 3. Fetch Products for images/updated details
        const productIds = Array.from(new Set(itemsData.map(i => i.productId)));
        if (productIds.length > 0) {
          const productsData = await getProductsByIds(productIds);
          const productMap: Record<string, Product> = {};
          productsData.forEach(p => { productMap[p.$id] = p; });
          setProducts(productMap);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--etsy-orange)]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find the order details for this ID.</p>
        <Button asChild className="rounded-full">
          <Link href="/account/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const currentStatus = statusConfig[order.status] || statusConfig[OrderStatus.PENDING];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-3 mb-2 h-8 hover:bg-transparent">
            <Link href="/account/orders" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="mr-1 h-4 w-4" /> Back to Orders
            </Link>
          </Button>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Order Details</h1>
          <p className="text-muted-foreground font-mono uppercase tracking-wider text-sm">#{order.$id.toUpperCase()}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={cn("text-sm px-4 py-1 rounded-full capitalize", currentStatus.color)}>
            {currentStatus.label}
          </Badge>
          <p className="text-sm text-muted-foreground">Placed on {formatDate(order.$createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Items & Items Status */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-card/60 backdrop-blur-md">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-lg">Items in this Order</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {items.map((item) => {
                  const product = products[item.productId];
                  const previewUrl = product?.images?.[0] 
                    ? getFilePreview(BUCKET_PRODUCT_IMAGES, product.images[0], { width: 150, height: 150 })
                    : null;

                  return (
                    <div key={item.$id} className="p-6 flex gap-6">
                      <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                        {previewUrl ? (
                          <Image
                            src={previewUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <Link 
                            href={`/product/${product?.slug || item.productId}`}
                            className="font-bold text-lg hover:underline line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          <PriceTag price={item.price} className="font-bold text-lg whitespace-nowrap" />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <p>Quantity: {item.quantity}</p>
                          <Separator orientation="vertical" className="h-4" />
                          <p className="text-xs uppercase tracking-widest font-bold">Status: {item.status}</p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" asChild className="rounded-full h-8 px-4 text-xs font-bold">
                            <Link href={`/product/${product?.slug || item.productId}`}>
                              Buy again <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => setReviewItem({ productId: item.productId, title: item.title })}
                            className="rounded-full h-8 px-4 text-xs font-bold bg-muted/50"
                          >
                            Write a review
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Timeline (Mocked for premium feel) */}
          <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-card/60 backdrop-blur-md">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-lg">Shipment Progress</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-10">
              <div className="relative space-y-8">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-muted" />
                
                <div className="relative flex items-center gap-6">
                  <div className={cn(
                    "relative z-10 flex items-center justify-center h-10 w-10 rounded-full border-4 border-background shadow-sm",
                    order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED || order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                  )}>
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold">Order Placed</p>
                    <p className="text-sm text-muted-foreground">We've received your order and notified the sellers.</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{formatDate(order.$createdAt)}</p>
                  </div>
                </div>

                <div className="relative flex items-center gap-6">
                  <div className={cn(
                    "relative z-10 flex items-center justify-center h-10 w-10 rounded-full border-4 border-background shadow-sm",
                    order.status === OrderStatus.CONFIRMED || order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                  )}>
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold">Order Confirmed</p>
                    <p className="text-sm text-muted-foreground">Seller has confirmed availability and is preparing items.</p>
                  </div>
                </div>

                <div className="relative flex items-center gap-6">
                  <div className={cn(
                    "relative z-10 flex items-center justify-center h-10 w-10 rounded-full border-4 border-background shadow-sm",
                    order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                  )}>
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold">On the Way</p>
                    <p className="text-sm text-muted-foreground">Package is with our courier partner.</p>
                    {order.trackingNumber && <p className="text-xs font-mono mt-1">Tracking: {order.trackingNumber}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Details Summary */}
        <div className="space-y-8">
          {/* Shipping Address */}
          <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-card/60 backdrop-blur-md">
            <CardHeader className="bg-muted/20 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[var(--etsy-orange)]" /> Shipping
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 text-[10px]">Recipient Address</p>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{order.shippingAddress}</p>
                </div>
                {order.notes && (
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 text-[10px]">Instructions</p>
                    <p className="text-sm text-muted-foreground italic">&ldquo;{order.notes}&rdquo;</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-card/60 backdrop-blur-md">
            <CardHeader className="bg-muted/20 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[var(--etsy-orange)]" /> Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Method</span>
                  <Badge variant="outline" className="capitalize">{order.paymentMethod}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                  <span className={cn(
                    "text-sm font-bold capitalize",
                    order.paymentStatus === 'paid' ? "text-green-600" : "text-amber-600"
                  )}>
                    {order.paymentStatus}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Grand Total</span>
                  <PriceTag price={order.totalAmount} className="text-[var(--etsy-orange)]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Need Help? */}
          <div className="p-6 rounded-3xl bg-[var(--etsy-orange)]/5 border border-[var(--etsy-orange)]/10 text-center">
            <h3 className="font-bold mb-2">Need help with this order?</h3>
            <p className="text-xs text-muted-foreground mb-4">Questions about shipping, returns, or quality?</p>
            <Button variant="link" className="text-[var(--etsy-orange)] font-bold h-auto p-0 hover:no-underline">
              Contact Support <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {user && reviewItem && (
        <ReviewModal
          productId={reviewItem.productId}
          productTitle={reviewItem.title}
          buyerId={user.$id}
          reviewerName={user.name || "Anonymous"}
          isOpen={!!reviewItem}
          onOpenChange={(open) => !open && setReviewItem(null)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}
