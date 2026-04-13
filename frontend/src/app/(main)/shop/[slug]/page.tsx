export default function ShopPage() {
  return (
    <div className="py-8">
      {/* Shop Header */}
      <div className="h-48 rounded-t-lg bg-muted border-x border-t flex items-center justify-center">
        <p className="text-muted-foreground">Shop Banner</p>
      </div>
      <div className="border bg-card p-6 rounded-b-lg mb-8 flex items-center gap-6">
        <div className="h-24 w-24 rounded-full bg-muted border-4 border-background -mt-12"></div>
        <div>
          <h1 className="font-heading text-3xl font-bold">Shop Name</h1>
          <p className="text-muted-foreground">Shop location & rating</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-8 flex items-center justify-center min-h-[40vh]">
        <p className="text-muted-foreground">Shop's products grid</p>
      </div>
    </div>
  );
}
