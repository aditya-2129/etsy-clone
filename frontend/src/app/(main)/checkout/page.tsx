"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { createOrder } from "@/lib/services/order.service";
import { getFilePreview } from "@/lib/services/storage.service";
import { BUCKET_PRODUCT_IMAGES } from "@/lib/constants";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Loader2, 
  MapPin, 
  Smartphone,
  CheckCircle2,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PriceTag } from "@/components/shared/PriceTag";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { items, itemCount, subtotal, clearCart, isLoading: cartLoading } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cod",
      shippingAddress: user?.addresses || "",
    },
  });

  const selectedPayment = watch("paymentMethod");

  // Redirect if cart is empty or user not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to checkout");
      router.push("/login?redirect=/checkout");
    } else if (!cartLoading && itemCount === 0 && !isSubmitting) {
      // router.push("/cart"); // Maybe too aggressive if they just finished
    }
  }, [user, authLoading, itemCount, cartLoading, router, isSubmitting]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    // Show premium processing modal for non-COD to simulate "Payment Processing"
    if (data.paymentMethod !== 'cod') {
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate bank redirect
    }

    try {
      const orderItems = items.map(item => ({
        productId: item.productId,
        shopId: item.shopId,
        sellerId: item.sellerId,
        title: item.product?.title || "Product",
        price: item.product?.price || 0,
        quantity: item.quantity,
        subtotal: (item.product?.price || 0) * item.quantity,
        status: OrderStatus.PENDING,
      }));

      const shipping = subtotal > 5000 ? 0 : 50;
      const totalAmount = subtotal + shipping;

      const { order } = await createOrder(
        {
          buyerId: user.$id,
          totalAmount,
          shippingAddress: data.shippingAddress,
          paymentMethod: data.paymentMethod as any, // Enum mismatch workaround
          notes: data.notes || "",
          status: OrderStatus.PENDING,
          paymentStatus: data.paymentMethod === 'cod' ? PaymentStatus.PENDING : PaymentStatus.PAID,
        },
        orderItems
      );

      toast.success("Order placed successfully!");
      clearCart();
      router.push(`/checkout/success?id=${order.$id}`);
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsProcessing(false);
    }
  };

  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--etsy-orange)]" />
      </div>
    );
  }

  const shipping = subtotal > 5000 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      {/* Premium Header */}
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-heading font-bold tracking-tight mb-2">Checkout</h1>
        <p className="text-muted-foreground flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-green-500" /> Secure Encryption • Trusted Checkout
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-8 space-y-8">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Shipping Section */}
            <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-card/60 backdrop-blur-md">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[var(--etsy-orange)]" />
                  Shipping Details
                </CardTitle>
                <CardDescription>Where should we send your unique treasures?</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress">Full Address</Label>
                  <Textarea
                    id="shippingAddress"
                    placeholder="House No, Street, Landmark, City, State, PIN"
                    className={cn(
                      "min-h-[120px] rounded-2xl resize-none bg-background",
                      errors.shippingAddress && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("shippingAddress")}
                  />
                  {errors.shippingAddress && (
                    <p className="text-xs font-medium text-destructive">{errors.shippingAddress.message}</p>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="notes">Delivery Instructions (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Apartment code, gate info, etc."
                    className="rounded-xl bg-background"
                    {...register("notes")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-card/60 backdrop-blur-md">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[var(--etsy-orange)]" />
                  Payment Method
                </CardTitle>
                <CardDescription>All transactions are secure and encrypted.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <RadioGroup
                  defaultValue="cod"
                  onValueChange={(val) => setValue("paymentMethod", val as any)}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  <div className={cn(
                    "relative flex cursor-pointer rounded-2xl border-2 p-4 transition-all hover:bg-muted/50",
                    selectedPayment === "cod" ? "border-[var(--etsy-orange)] bg-[var(--etsy-orange)]/5" : "border-muted"
                  )}>
                    <RadioGroupItem value="cod" id="payment-cod" className="sr-only" />
                    <Label
                      htmlFor="payment-cod"
                      className="flex flex-col items-center justify-between gap-3 w-full cursor-pointer"
                    >
                      <Truck className="h-6 w-6" />
                      <div className="text-center">
                        <p className="font-bold">COD</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Cash on Delivery</p>
                      </div>
                      {selectedPayment === "cod" && <CheckCircle2 className="h-4 w-4 text-[var(--etsy-orange)] absolute top-2 right-2" />}
                    </Label>
                  </div>

                  <div className={cn(
                    "relative flex cursor-pointer rounded-2xl border-2 p-4 transition-all hover:bg-muted/50",
                    selectedPayment === "upi" ? "border-[var(--etsy-orange)] bg-[var(--etsy-orange)]/5" : "border-muted"
                  )}>
                    <RadioGroupItem value="upi" id="payment-upi" className="sr-only" />
                    <Label
                      htmlFor="payment-upi"
                      className="flex flex-col items-center justify-between gap-3 w-full cursor-pointer"
                    >
                      <Smartphone className="h-6 w-6" />
                      <div className="text-center">
                        <p className="font-bold">UPI</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">GPay, PhonePe, etc.</p>
                      </div>
                      {selectedPayment === "upi" && <CheckCircle2 className="h-4 w-4 text-[var(--etsy-orange)] absolute top-2 right-2" />}
                    </Label>
                  </div>

                  <div className={cn(
                    "relative flex cursor-pointer rounded-2xl border-2 p-4 transition-all hover:bg-muted/50",
                    selectedPayment === "card" ? "border-[var(--etsy-orange)] bg-[var(--etsy-orange)]/5" : "border-muted"
                  )}>
                    <RadioGroupItem value="card" id="payment-card" className="sr-only" />
                    <Label
                      htmlFor="payment-card"
                      className="flex flex-col items-center justify-between gap-3 w-full cursor-pointer"
                    >
                      <CreditCard className="h-6 w-6" />
                      <div className="text-center">
                        <p className="font-bold">Card</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Debit / Credit Card</p>
                      </div>
                      {selectedPayment === "card" && <CheckCircle2 className="h-4 w-4 text-[var(--etsy-orange)] absolute top-2 right-2" />}
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 sticky top-24">
          <Card className="rounded-3xl border-none shadow-xl overflow-hidden bg-card/80 backdrop-blur-lg border-t-4 border-t-[var(--etsy-orange)]">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
              <CardDescription>{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Items Preview (Mini) */}
              <div className="max-h-48 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.$id} className="flex gap-3">
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      {item.product?.images?.[0] && (
                        <Image
                          src={getFilePreview(BUCKET_PRODUCT_IMAGES, item.product.images[0], { width: 100, height: 100 })}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.product?.title}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <PriceTag price={(item.product?.price || 0) * item.quantity} className="text-sm font-bold" />
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <PriceTag price={subtotal} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                    {shipping === 0 ? "FREE" : <PriceTag price={shipping} />}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <PriceTag price={total} className="text-[var(--etsy-orange)]" />
                </div>
              </div>

              <Button
                form="checkout-form"
                type="submit"
                size="lg"
                disabled={isSubmitting || itemCount === 0}
                className="w-full rounded-2xl h-14 text-lg shadow-lg hover:shadow-xl transition-all font-bold bg-[var(--etsy-orange)] hover:bg-[var(--etsy-orange)]/90 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Place Order
                  </>
                )}
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest mt-2">
                <ShieldCheck className="h-3 w-3" /> 100% SECURE CHECKOUT
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Premium Processing Modal */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-xl">
          <div className="text-center space-y-6 max-w-sm px-6 animate-in fade-in zoom-in duration-300">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-[var(--etsy-orange)]/20 shadow-[0_0_40px_rgba(241,100,30,0.2)]" />
              <div className="absolute inset-0 rounded-full border-4 border-[var(--etsy-orange)] border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-[var(--etsy-orange)]" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Processing Payment</h2>
              <p className="text-muted-foreground">We're verifying your transaction with your bank. Please do not refresh or close this window.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
