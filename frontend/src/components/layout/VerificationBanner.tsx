"use client";

import { AlertCircle, Loader2, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function VerificationBanner() {
  const { user, isVerified, resendVerification } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Don't show if verified, not logged in, or manually dismissed
  if (!user || isVerified || !isVisible) return null;

  const handleResend = async () => {
    setIsSending(true);
    try {
      await resendVerification();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-[var(--etsy-orange)]/10 border-b border-[var(--etsy-orange)]/20 px-4 py-2">
      <div className="mx-auto max-w-[var(--max-width)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-[var(--etsy-orange)] shrink-0" />
          <p className="text-sm text-foreground">
            <span className="font-medium">Please verify your email</span>
            <span className="hidden sm:inline text-muted-foreground ml-2">
              Check your inbox ({user.email}) to unlock all features.
            </span>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="link" 
            size="sm" 
            disabled={isSending}
            onClick={handleResend}
            className="text-[var(--etsy-orange)] h-auto p-0 font-medium px-2"
          >
            {isSending ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : "Resend"}
          </Button>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Dismiss banner"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
