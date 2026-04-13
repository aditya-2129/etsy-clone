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
 * @returns The user document, or null if not found
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const acc = await getCurrentAccount();
    if (!acc) return null;

    const user = await getUserByUserId(acc.$id);
    return user;
  } catch {
    return null;
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
