"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  register as registerService,
  login as loginService,
  logout as logoutService,
  getCurrentUser,
  loginWithGoogle,
  isEmailVerified as checkEmailVerified,
  sendVerificationEmail,
} from "@/lib/services/auth.service";
import { upgradeToSeller } from "@/lib/services/user.service";
import type { User } from "@/lib/types";

// =============================================================================
// Context Type
// =============================================================================

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isVerified: boolean;
  isSuspended: boolean;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginGoogle: () => void;
  logout: () => Promise<void>;
  becomeSeller: () => Promise<void>;
  refreshUser: () => Promise<void>;
  resendVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =============================================================================
// Provider
// =============================================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const router = useRouter();

  /** Fetch the current user on mount */
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        // Check if user is suspended — auto-logout if so
        if (currentUser.isSuspended) {
          setIsSuspended(true);
          await logoutService();
          setUser(null);
          toast.error(
            "Your account has been suspended. Please contact support."
          );
          router.push("/login");
          return;
        }

        setIsSuspended(false);
        const verified = await checkEmailVerified();
        setIsVerified(verified);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  /** Register a new account */
  const register = async (email: string, password: string, name: string) => {
    try {
      const newUser = await registerService(email, password, name);
      setUser(newUser);
      setIsVerified(false);
      toast.success("Welcome! Check your email to verify your account. 📧");
      router.push("/");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Registration failed";

      if (message.includes("already")) {
        toast.error("An account with this email already exists.");
      } else {
        toast.error("Unable to create account. Please try again.");
      }
      throw error;
    }
  };

  /** Login with email/password */
  const login = async (email: string, password: string) => {
    try {
      await loginService(email, password);
      
      // Refresh user and get the result
      const currentUser = await getCurrentUser();
      
      if (currentUser?.isSuspended) {
        setIsSuspended(true);
        await logoutService();
        setUser(null);
        toast.error("Your account has been suspended. Please contact support.");
        router.push("/login");
        return;
      }

      setUser(currentUser);
      setIsSuspended(false);
      
      if (currentUser) {
        const verified = await checkEmailVerified();
        setIsVerified(verified);
      }

      toast.success("Welcome back!");
      router.push("/");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Login failed";

      if (message.includes("Invalid credentials") || message.includes("401")) {
        toast.error("Invalid email or password.");
      } else {
        toast.error("Unable to sign in. Please try again.");
      }
      throw error;
    }
  };

  /** Login with Google OAuth */
  const loginGoogle = () => {
    loginWithGoogle();
  };

  /** Logout */
  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
      toast.info("You've been signed out.");
      router.push("/");
    } catch {
      toast.error("Unable to sign out. Please try again.");
    }
  };

  /** Upgrade current user to seller role */
  const becomeSeller = async () => {
    if (!user) return;

    try {
      const updated = await upgradeToSeller(user.$id);
      setUser(updated);
      toast.success("You're now a seller! 🏪");
      router.push("/seller/dashboard");
    } catch {
      toast.error("Unable to upgrade account. Please try again.");
    }
  };

  /** Resend email verification */
  const resendVerification = async () => {
    try {
      await sendVerificationEmail();
      toast.success("Verification email sent! Check your inbox. 📧");
    } catch {
      toast.error("Unable to send verification email. Please try again later.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isVerified,
        isSuspended,
        register,
        login,
        loginGoogle,
        logout,
        becomeSeller,
        refreshUser,
        resendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
