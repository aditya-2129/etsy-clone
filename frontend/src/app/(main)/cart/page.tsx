export default function CartPage() {
  return (
    <div className="py-8">
      <h1 className="font-heading text-3xl font-bold mb-6">Your Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 rounded-lg border bg-card p-8 space-y-4">
          <p className="text-center text-muted-foreground">Cart items list</p>
        </div>
        <div className="md:col-span-1 rounded-lg border bg-card p-6 h-fit sticky top-24">
          <h2 className="font-heading text-xl font-bold mb-4">Order Summary</h2>
          <p className="text-center text-muted-foreground py-8">Checkout summary block</p>
        </div>
      </div>
    </div>
  );
}
