export default function SellerDashboardPage() {
  return (
    <div className="py-8">
      <h1 className="font-heading text-3xl font-bold mb-6">Shop Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-lg border bg-card p-6">Total Sales stat</div>
        <div className="rounded-lg border bg-card p-6">Active Products stat</div>
        <div className="rounded-lg border bg-card p-6">Pending Orders stat</div>
      </div>
      <div className="rounded-lg border bg-card p-8 min-h-[30vh] flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Recent Activity Chart / Feed</p>
      </div>
    </div>
  );
}
