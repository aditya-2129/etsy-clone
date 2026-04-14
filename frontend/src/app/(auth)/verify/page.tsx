"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { confirmVerification } from "@/lib/services/auth.service";
import { Button } from "@/components/ui/button";

type VerifyStatus = "loading" | "success" | "error";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerifyStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    if (!userId || !secret) {
      setStatus("error");
      setErrorMessage("Invalid verification link. Missing parameters.");
      return;
    }

    confirmVerification(userId, secret)
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Verification failed. The link may have expired."
        );
      });
  }, [searchParams]);

  return (
    <div className="space-y-6 text-center">
      {status === "loading" && (
        <>
          <Loader2 className="h-16 w-16 animate-spin text-[var(--etsy-orange)] mx-auto" />
          <h1 className="font-heading text-2xl font-bold">Verifying your email...</h1>
          <p className="text-sm text-muted-foreground">
            Please wait while we confirm your email address.
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="h-16 w-16 text-[var(--etsy-success)] mx-auto" />
          <h1 className="font-heading text-2xl font-bold">Email Verified!</h1>
          <p className="text-sm text-muted-foreground">
            Your email has been verified successfully. You&apos;re all set!
          </p>
          <Button asChild className="bg-[var(--etsy-orange)] hover:bg-[var(--etsy-orange-hover)] text-white">
            <Link href="/">Start Shopping</Link>
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="h-16 w-16 text-[var(--etsy-error)] mx-auto" />
          <h1 className="font-heading text-2xl font-bold">Verification Failed</h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {errorMessage}
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-[var(--etsy-orange)] hover:bg-[var(--etsy-orange-hover)] text-white">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
