import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authStore } from '@/lib/authStore';

interface User {
  id: string;
  email: string;
  name: string;
  profile: {
    name: string;
    email: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
  };
  access_token: string;
  expired: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (returnPath?: string) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
  handleRedirectCallback: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user data
const MOCK_USER: User = {
  id: 'mock-user-123',
  email: 'hanz.mueller@rugira.ch',
  name: 'Hanz Mueller',
  profile: {
    name: 'Hanz Mueller',
    email: 'hanz.mueller@rugira.ch',
    given_name: 'Hanz',
    family_name: 'Mueller',
    picture: 'https://www.gravatar.com/avatar/placeholder?d=mp&s=200'
  },
  access_token: 'mock-jwt-token-' + Date.now(),
  expired: false
};

// Mock credentials
const MOCK_CREDENTIALS = {
  username: 'hanz.mueller',
  password: 'Hanz1234!'
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session in memory store
    const storedUser = authStore.getUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    
    // Listen for auth events
    const handleLocked = () => {
      // Show lock screen UI
      window.location.href = '/lock';
    };
    
    const handleExpired = () => {
      setUser(null);
      setIsAuthenticated(false);
    };
    
    window.addEventListener('auth:locked', handleLocked);
    window.addEventListener('auth:expired', handleExpired);
    
    // Add a small delay to ensure state is properly updated before components check
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    // Cleanup
    return () => {
      window.removeEventListener('auth:locked', handleLocked);
      window.removeEventListener('auth:expired', handleExpired);
    };
  }, []); // Empty dependency array to run only on mount

  // Remove the setAuthTokenGetter call since we're using session-based auth
  // Authentication is now handled via session cookies

  const login = async (returnPath?: string) => {
    setIsLoading(true);
    
    // Store the return path for after callback
    if (returnPath) {
      sessionStorage.setItem('rugira_return_path', returnPath);
    }
    
    // Redirect to login page (this will show the login form)
    window.location.href = '/login' + (returnPath ? `?next=${encodeURIComponent(returnPath)}` : '');
  };

  const performLogin = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username === MOCK_CREDENTIALS.username && password === MOCK_CREDENTIALS.password) {
      const authenticatedUser = { ...MOCK_USER, access_token: 'mock-jwt-token-' + Date.now() };
      setUser(authenticatedUser);
      setIsAuthenticated(true);
      
      // Store in memory store instead of sessionStorage
      authStore.setAuth(authenticatedUser.access_token, undefined, authenticatedUser);
      
      return true;
    }
    
    return false;
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear memory store and broadcast logout
    authStore.logout();
    
    // Clear session storage items  
    sessionStorage.removeItem('rugira_return_path');
    
    // Redirect to main site
    window.location.href = 'https://rugira.ch';
  };

  const getAccessToken = () => {
    return user?.access_token || null;
  };

  const handleRedirectCallback = async (): Promise<string> => {
    // Get return path from session storage
    const returnPath = sessionStorage.getItem('rugira_return_path') || '/overview';
    sessionStorage.removeItem('rugira_return_path');
    
    return returnPath;
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    getAccessToken,
    handleRedirectCallback,
  };

  // Extend context with mock login function for internal use
  const extendedValue = {
    ...value,
    performLogin, // This will be used by the Login component
  };

  return (
    <AuthContext.Provider value={extendedValue as any}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType & { performLogin?: (username: string, password: string) => Promise<boolean> } {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context as any;
}