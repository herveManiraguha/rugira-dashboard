import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/MockAuthContext';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { handleRedirectCallback } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const returnUrl = await handleRedirectCallback();
        setStatus('success');
        
        // Small delay to show success state
        setTimeout(() => {
          setLocation(returnUrl);
        }, 1000);
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setError(error.message || 'Authentication failed');
      }
    };

    handleCallback();
  }, [handleRedirectCallback, setLocation]);

  const handleRetry = () => {
    setLocation('/login');
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-[#E10600] rounded-2xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Completing Sign In
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Processing your authentication...
            </p>
            
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-[#E10600] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#1B7A46] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-[#E10600] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </>
        );

      case 'success':
        return (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-[#1B7A46] rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Sign In Successful!
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Redirecting you to the overview...
            </p>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#1B7A46] to-[#E10600] h-2 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
            </div>
          </>
        );

      case 'error':
        return (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Authentication Failed
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              There was an issue completing your sign in.
            </p>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
            
            <div className="space-y-3">
              <Button 
                onClick={handleRetry}
                className="w-full bg-[#E10600] hover:bg-[#C10500] text-white"
              >
                Try Again
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setLocation('/')}
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}