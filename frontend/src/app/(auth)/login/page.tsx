export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold">Sign In</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome back to the Marketplace
          </p>
        </div>
        {/* Placeholder for Login Form */}
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <p className="text-center text-sm text-muted-foreground">Login Form goes here</p>
        </div>
      </div>
    </div>
  );
}
