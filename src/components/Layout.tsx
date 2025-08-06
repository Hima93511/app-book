import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, LogOut, Calendar } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg shadow">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                {/* MediBook clearly visible */}
                <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
                  MediBook
                </h1>
                <p className="text-sm text-blue-100">
                  Healthcare Scheduling
                </p>
              </div>
            </div>

            {/* User Info */}
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-lg px-3 py-1 text-white">
                  <User className="h-4 w-4 text-blue-100" />
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs bg-white text-blue-700 px-2 py-1 rounded-full capitalize">
                    {user.role}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="gap-2 bg-white text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h2>
          <div className="h-1 w-16 bg-blue-600 rounded mt-2"></div>
        </div>
        {children}
      </main>
    </div>
  );
};
