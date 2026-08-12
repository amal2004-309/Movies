import {
  loginUser,
  logoutUser,
  registerUser,
} from "../../services/authService";
import type { User } from "firebase/auth";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function validateCredentials(email: string, password: string): void {
  if (email.length === 0) {
    throw new Error("Email is required.");
  }

  if (password.length === 0) {
    throw new Error("Password is required.");
  }

  if (password.length < 6) {
    throw new Error("Password must contain at least six characters.");
  }
}

export async function register(
  email: string,
  password: string,
): Promise<User> {
  const normalizedEmail = normalizeEmail(email);

  validateCredentials(normalizedEmail, password);

  return registerUser(normalizedEmail, password);
}

export async function login(
  email: string,
  password: string,
): Promise<User> {
  const normalizedEmail = normalizeEmail(email);

  validateCredentials(normalizedEmail, password);

  return loginUser(normalizedEmail, password);
}

export async function logout(): Promise<void> {
  return logoutUser();
}
