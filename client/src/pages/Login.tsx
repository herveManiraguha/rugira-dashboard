import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import logoSvg from "@/assets/logo.svg";

export default function Login() {
  const [, setLocation] = useLocation();
  const { performDemoLogin, isAuthenticated, isDemoMode, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [nextPath, setNextPath] = useState('/overview');

  useEffect(() => {
    // Get the return path from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const next = urlParams.get('next');
    if (next) {
      setNextPath(decodeURIComponent(next));
    }
  }, []);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      setLocation(nextPath);
    }
  }, [isAuthenticated, nextPath, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!performDemoLogin) {
        throw new Error('Demo authentication system not initialized');
      }

      const success = await performDemoLogin(username, password);
      
      if (success) {
        // Add a small delay to ensure state is updated before redirect
        setTimeout(() => {
          setLocation(nextPath);
        }, 150);
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Okta login (skip form for non-demo mode)
  const handleOktaLogin = async () => {
    setIsLoading(true);
    try {
      await login(nextPath);
    } catch (error: any) {
      setError(error.message || 'Authentication failed. Please try again.');
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <Card className="shadow-lg sm:shadow-2xl">
          <CardHeader className="text-center space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Rugira Logo */}
            <div className="flex justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                <img src={logoSvg} alt="Rugira" className="w-14 h-14 sm:w-16 sm:h-16" />
              </div>
            </div>
            
            <div>
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
                Demo Mode - Trading Dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm sm:text-base font-medium">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  data-testid="input-username"
                  className="h-11 sm:h-12 text-base border border-gray-300 dark:border-gray-600 focus:border-[#E10600] focus:ring-1 focus:ring-[#E10600]" // Larger touch targets with borders
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    data-testid="input-password"
                    className="pr-12 h-11 sm:h-12 text-base border border-gray-300 dark:border-gray-600 focus:border-[#E10600] focus:ring-1 focus:ring-[#E10600]" // Larger touch targets with borders
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center min-w-[44px] min-h-[44px] justify-center" // 44px minimum touch target
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#E10600] hover:bg-[#C10500] text-white h-11 sm:h-12 text-base font-semibold"
                disabled={isLoading}
                data-testid="button-submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 text-center p-6 sm:p-8 pt-4">
            <div className="flex items-center justify-center text-xs sm:text-sm text-gray-500">
              <a 
                href="https://rugira.ch" 
                className="hover:text-[#E10600] transition-colors duration-200 min-h-[44px] flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit www.rugira.ch
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}