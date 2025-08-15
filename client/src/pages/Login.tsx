import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface LoginProps {
  params?: {
    next?: string;
  };
}

export default function Login({ params }: LoginProps) {
  const { login, isLoading } = useAuth();

  useEffect(() => {
    const nextPath = new URLSearchParams(window.location.search).get('next') || params?.next;
    login(nextPath || undefined).catch((error) => {
      console.error('Login failed:', error);
    });
  }, [login, params?.next]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {/* Rugira Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#E10600] rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-[#E10600] rounded-full"></div>
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Rugira Trading Dashboard
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Redirecting you to secure login...
          </p>
          
          {/* Loading Spinner */}
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#E10600]" />
            <span className="text-gray-600 dark:text-gray-300">
              {isLoading ? 'Preparing authentication...' : 'Redirecting...'}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#E10600] to-[#1B7A46] h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}