export default function AccountLandingPage() {
  return (
    <div className="py-8">
      <h1 className="font-heading text-3xl font-bold mb-6">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-lg border bg-card p-6 flex flex-col items-center text-center">
          <p className="text-muted-foreground">Orders Link</p>
        </div>
        <div className="rounded-lg border bg-card p-6 flex flex-col items-center text-center">
          <p className="text-muted-foreground">Wishlist Link</p>
        </div>
        <div className="rounded-lg border bg-card p-6 flex flex-col items-center text-center">
          <p className="text-muted-foreground">Settings Link</p>
        </div>
      </div>
    </div>
  );
}
