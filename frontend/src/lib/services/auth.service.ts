import { account, ID } from "@/lib/appwrite";
import { createUserDocument, getUserByUserId } from "./user.service";
import type { User, CreateUserInput } from "@/lib/types";
import { UserRole } from "@/lib/types";
import type { Models } from "appwrite";

// =============================================================================
// Auth Service — Handles Appwrite Account operations
// =============================================================================

/**
 * Registers a new user account and creates a corresponding user document.
 * Also sends a verification email automatically.
 * @returns The created user document
 */
export async function register(
  email: string,
  password: string,
  name: string
): Promise<User> {
  try {
    // Create the Appwrite account
    const newAccount: Models.User<Models.Preferences> = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    // Create a session so the user is logged in immediately
    await account.createEmailPasswordSession(email, password);

    // Create the user document in our database
    const userInput: CreateUserInput = {
      userId: newAccount.$id,
      name,
      email,
      role: UserRole.BUYER,
    };

    const userDoc = await createUserDocument(userInput);

    // Send verification email (non-blocking — don't fail registration if this fails)
    sendVerificationEmail().catch(() => {
      // Silently fail — user can resend from their profile
    });

    return userDoc;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}

/**
 * Logs in with email and password.
 * @returns The session object
 */
export async function login(
  email: string,
  password: string
): Promise<Models.Session> {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

/**
 * Logs out the current user by deleting the active session.
 */
export async function logout(): Promise<void> {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}

/**
 * Gets the currently logged-in Appwrite account.
 * @returns The account object, or null if not logged in
 */
export async function getCurrentAccount(): Promise<Models.User<Models.Preferences> | null> {
  try {
    const acc = await account.get();
    return acc;
  } catch {
    return null;
  }
}

/**
 * Gets the current user's database document (profile).
 * If the account exists but no user document is found (e.g., first Google login),
 * it automatically creates the user document.
 * @returns The user document, or null if not logged in
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const acc = await getCurrentAccount();
    if (!acc) return null;

    try {
      const user = await getUserByUserId(acc.$id);
      return user;
    } catch {
      // User document doesn't exist yet (first OAuth login)
      // Auto-create it from the Appwrite account info
      const userInput: CreateUserInput = {
        userId: acc.$id,
        name: acc.name || acc.email.split("@")[0],
        email: acc.email,
        role: UserRole.BUYER,
      };

      const newUser = await createUserDocument(userInput);
      return newUser;
    }
  } catch {
    return null;
  }
}

/**
 * Checks if the current user's email is verified.
 */
export async function isEmailVerified(): Promise<boolean> {
  const acc = await getCurrentAccount();
  return acc?.emailVerification ?? false;
}

/**
 * Sends a verification email to the current user.
 * The email contains a link that redirects to /verify with userId and secret params.
 */
export async function sendVerificationEmail(): Promise<void> {
  try {
    const callbackUrl = `${window.location.origin}/verify`;
    await account.createVerification(callbackUrl);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw error;
  }
}

/**
 * Confirms email verification using the userId and secret from the callback URL.
 */
export async function confirmVerification(
  userId: string,
  secret: string
): Promise<void> {
  try {
    await account.updateVerification(userId, secret);
  } catch (error) {
    console.error("Email verification failed:", error);
    throw error;
  }
}

/**
 * Initiates Google OAuth2 login.
 * Redirects the user to Google's consent screen.
 */
export function loginWithGoogle(): void {
  account.createOAuth2Session(
    "google" as never,
    `${window.location.origin}/`,
    `${window.location.origin}/login`
  );
}

