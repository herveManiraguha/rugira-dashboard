import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/MockAuthContext';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  // Always call useEffect at the top level, but conditionally execute logic inside
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Only redirect if we're not already on the login page
      if (!location.startsWith('/login')) {
        const encodedPath = encodeURIComponent(location);
        setLocation(`/login?next=${encodedPath}`);
      }
    }
  }, [isAuthenticated, isLoading, location, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-[#E10600] rounded-2xl flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#E10600] rounded-full"></div>
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Loading Dashboard
            </h2>
            
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#E10600]" />
              <span className="text-gray-600 dark:text-gray-300">
                Checking authentication...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Return null while the redirect is happening
    return null;
  }

  return <>{children}</>;
}