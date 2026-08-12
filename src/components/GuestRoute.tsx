import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { RouteGuardProps } from "../types/routing";

export function GuestRoute({ children }: RouteGuardProps) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <p>Loading authentication...</p>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
