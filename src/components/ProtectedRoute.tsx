import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { RouteGuardProps } from "../types/routing";

export function ProtectedRoute({ children }: RouteGuardProps) {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <p>Loading authentication...</p>;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}
