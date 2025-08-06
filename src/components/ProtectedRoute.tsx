import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "patient" | "admin";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 mb-4"></div>
        <p className="text-sm">Loading, please wait...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    const roleRedirects: Record<string, string> = {
      admin: "/admin",
      patient: "/dashboard",
    };

    const redirectPath = roleRedirects[user.role] || "/";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
