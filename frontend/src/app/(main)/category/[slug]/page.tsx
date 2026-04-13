export default function CategoryPage() {
  return (
    <div className="py-8">
      <h1 className="font-heading text-3xl font-bold mb-6">Category Name</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 rounded-lg border bg-card p-4">
          Filters placeholder
        </div>
        <div className="md:col-span-3 rounded-lg border bg-card p-8 flex items-center justify-center min-h-[40vh]">
          <p className="text-muted-foreground">Category product grid</p>
        </div>
      </div>
    </div>
  );
}
