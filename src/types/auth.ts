import type { User } from "firebase/auth";
import type { ReactNode } from "react";

export type AuthMode = "login" | "register";

export type AuthChangeCallback = (user: User | null) => void;

export interface AuthContextValue {
  user: User | null;
  authLoading: boolean;
  logout: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}
