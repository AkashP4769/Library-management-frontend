import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/Login";
import { NotFoundPage } from "./pages/NotFound";
import SignupPage from "./pages/Signup";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import Layout from "./pages/employee/Layout";
import HomePage from "./pages/employee/Home";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CatalogPage from "./pages/employee/Catalog";
import ShelvesPage from "./pages/employee/Shelves";
import BookPage from "./pages/employee/BookPage";
import ProfilePage from "./pages/Profile";
import MyReads from "./pages/employee/MyReads";
import AuditPage from "./pages/admin/Audit";
import InventoryPage from "./pages/admin/Inventory";
import TrackPage from "./pages/admin/Track";
import SettingsPage from "./pages/Settings";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        errorElement: <NotFoundPage />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "home", element: <HomePage /> },
          { path: "catalog", element: <CatalogPage /> },
          { path: "catalog/books/:id", element: <BookPage /> },
          { path: "shelves", element: <ShelvesPage /> },
          { path: "my-reads", element: <MyReads /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
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
          { path: 'track', element: <TrackPage />},
          { path: 'inventory', element: <InventoryPage />},
          { path: 'audit', element: <AuditPage />},
          { path: 'profile', element: <ProfilePage />},
          { path: 'settings', element: <SettingsPage />},
        ]
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
