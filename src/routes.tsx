import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/Login";
import { NotFoundPage } from "./pages/NotFound";
import SignupPage from "./pages/Signup";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { Layout } from "./pages/Layout";
import HomePage from "./pages/Home";
import { AdminLayout } from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import CatalogPage from "./pages/Catalog";


const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <NotFoundPage />
  },
  {
    path: "/signup",
    element: <SignupPage />,
    errorElement: <NotFoundPage />
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        errorElement: <NotFoundPage />,
        children: [
          { index: true, element: <HomePage />},
          { path: 'catalog', element: <CatalogPage />},
          // { path: 'details/:id', element: <EmployeeDetailsPage />}
        ]
      },
    ]
  },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        errorElement: <NotFoundPage />,
        children: [
          { index: true, element: <AdminDashboard />},
          // { path: 'details/:id', element: <EmployeeDetailsPage />}
        ]
      },
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />
  },
]);

export default router;