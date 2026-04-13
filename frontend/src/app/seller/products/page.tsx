export default function SellerProductsPage() {
  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-3xl font-bold">Listings Manager</h1>
        <button className="bg-[var(--etsy-orange)] text-white px-4 py-2 rounded-md font-medium">Add Listing</button>
      </div>
      <div className="rounded-lg border bg-card p-8 min-h-[40vh] flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Data table or grid of shop products</p>
      </div>
    </div>
  );
}
