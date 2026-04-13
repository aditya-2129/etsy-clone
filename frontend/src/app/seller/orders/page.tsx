export default function SellerOrdersPage() {
  return (
    <div className="py-8">
      <h1 className="font-heading text-3xl font-bold mb-6">Manage Orders</h1>
      <div className="rounded-lg border bg-card p-8 min-h-[40vh] flex flex-col items-center justify-center">
        <p className="text-muted-foreground">List of incoming orders with fulfillment status toggles</p>
      </div>
    </div>
  );
}
