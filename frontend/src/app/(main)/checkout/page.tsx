export default function CheckoutPage() {
  return (
    <div className="py-8">
      <h1 className="font-heading text-3xl font-bold mb-6 text-center">Secure Checkout</h1>
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping & Payment</h2>
          <p className="text-muted-foreground text-sm text-center py-12">Checkout form steps</p>
        </div>
        <div className="rounded-lg border bg-card p-6 bg-muted/20">
          <h2 className="text-xl font-semibold mb-4">Order Review</h2>
          <p className="text-muted-foreground text-sm text-center py-12">Order items summary</p>
        </div>
      </div>
    </div>
  );
}
