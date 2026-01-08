import { createBrowserRouter } from "react-router-dom";
import Main from "./Layouts/Main/Main";
import Home from "./Layouts/Home/Home";

import AdminLayout from "./Layouts/Admin/AdminLayout";
import AdminLogin from "./pages/Admin/Auth/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminProtectedRoute from "./components/Admin/ProtectedRoute/AdminProtectedRoute";
import ManageUsers from "./pages/Admin/ManageUsers/ManageUsers";
import UserDetails from "./pages/Admin/ManageUsers/UserDetails";
import UserLogin from "./pages/Users/Auth/UserLogin";
import UserRegister from "./pages/Users/Auth/UserRegister";
import VerifyEmail from "./pages/Users/Auth/VerifyEmail";
import UserProfile from "./pages/Users/Profile/UserProfile";
import UserProtectedRoute from "./components/Users/ProtectedRoute/UserProtectedRoute";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: (
          <UserProtectedRoute>
            <UserProfile />
          </UserProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <UserLogin />,
  },
  {
    path: "/register",
    element: <UserRegister />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  // Admin Login
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <ManageUsers />,
      },
      {
        path: "users/:id",
        element: <UserDetails />,
      },
    ],
  },
]);
