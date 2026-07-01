import { Navigate, Outlet } from "react-router";
import { clearAuth, hasAuthTokens, userRole } from "@/lib/auth";
import { useGetUserDetailsQuery } from "@/api-service/login/login.api";

export function ProtectedRoute() {
  if (!hasAuthTokens()) {
    clearAuth();
    return <Navigate to="/login" replace />;
  }

  if (!userRole() || userRole() !== "employee") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function AdminProtectedRoute() {
  if (!hasAuthTokens()) {
    clearAuth();
    console.log("No auth tokens found. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  if (!userRole() || userRole() !== "admin") {
    console.log("User role is not admin. Redirecting to login.", {
      role: userRole(),
    });
    return <Navigate to="/login" replace />;
  }

  console.log(
    "User is authenticated and has admin role. Rendering admin routes.",
  );
  return <Outlet />;
}
