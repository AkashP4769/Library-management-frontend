import { Navigate, Outlet } from "react-router";
import { clearAuth, hasAuthTokens } from "@/lib/auth";

export function ProtectedRoute() {
  if (!hasAuthTokens()) {
    clearAuth();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
