export default function ProductDetailPage() {
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="aspect-square rounded-lg border bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Product Image Gallery</p>
        </div>
        
        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="font-heading text-3xl font-bold">Product Title</h1>
          <p className="text-2xl font-semibold text-[var(--etsy-orange)]">₹1,999.00</p>
          <div className="rounded-lg border bg-card p-6">
            <p className="text-muted-foreground">Add to cart form</p>
          </div>
          <div className="prose">
            <p>Product description goes here.</p>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-16 pt-8 border-t">
        <h2 className="font-heading text-2xl font-bold mb-6">Reviews</h2>
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          Review list
        </div>
      </div>
    </div>
  );
}
