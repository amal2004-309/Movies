import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import type { AuthChangeCallback } from "../types/auth";
import { auth } from "./firebaseService";

function readableAuthError(error: unknown): string {
  if (error instanceof Error) {
    const code =
      "code" in error && typeof error.code === "string" ? error.code : null;

    switch (code) {
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/missing-password":
        return "Password is required.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/user-not-found":
      case "auth/invalid-credential":
        return "Invalid email or password.";
      case "auth/wrong-password":
        return "Invalid email or password.";
      case "auth/operation-not-allowed":
        return "Sign-in operation is not allowed.";
      case "auth/requires-recent-login":
        return "Please sign in again before continuing.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection and try again.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/unauthorized-domain":
        return "This domain is not authorized for sign-in.";
      default:
        return error.message || "Something went wrong.";
    }
  }

  return "Something went wrong.";
}

function trimCredentials(email: string, password: string) {
  const cleanedEmail = email.trim();
  const cleanedPassword = password;

  if (cleanedEmail.length === 0) {
    throw new Error("Email is required.");
  }

  if (cleanedPassword.length === 0) {
    throw new Error("Password is required.");
  }

  return { cleanedEmail, cleanedPassword };
}

export async function registerUser(
  email: string,
  password: string,
): Promise<User> {
  const { cleanedEmail, cleanedPassword } = trimCredentials(email, password);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      cleanedEmail,
      cleanedPassword,
    );

    return userCredential.user;
  } catch (error) {
    throw new Error(readableAuthError(error));
  }
}

export async function loginUser(
  email: string,
  password: string,
): Promise<User> {
  const { cleanedEmail, cleanedPassword } = trimCredentials(email, password);

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      cleanedEmail,
      cleanedPassword,
    );

    return userCredential.user;
  } catch (error) {
    throw new Error(readableAuthError(error));
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(readableAuthError(error));
  }
}

export function subscribeToAuthChanges(
  callback: AuthChangeCallback,
): () => void {
  if (typeof callback !== "function") {
    return () => {};
  }

  const unsubscribe = onAuthStateChanged(auth, callback);

  return unsubscribe;
}
