import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserManager, User as OidcUser } from 'oidc-client-ts';
import { isDemoMode, ExtendedUser, OktaUserProfile } from '@/lib/oktaConfig';
import { authStore } from '@/lib/authStore';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: ExtendedUser | null;
  isDemoMode: boolean;
  currentTenant: string | null;
  tenantRoles: string[];
  login: (returnPath?: string) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
  handleRedirectCallback: () => Promise<string>;
  switchTenant: (tenantId: string) => void;
  performDemoLogin?: (username: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock data for demo mode
const MOCK_USER: ExtendedUser = {
  id: 'demo-user-123',
  email: 'hanz.mueller@rugira.ch',
  name: 'Hanz Mueller',
  profile: {
    name: 'Hanz Mueller',
    email: 'hanz.mueller@rugira.ch',
    given_name: 'Hanz',
    family_name: 'Mueller',
    picture: 'https://www.gravatar.com/avatar/placeholder?d=mp&s=200'
  },
  access_token: 'demo-jwt-token-' + Date.now(),
  expired: false,
  tenant_roles: {
    'rugira-prod': ['admin', 'trader'],
    'rugira-test': ['trader'],
    'client-alpha': ['viewer']
  },
  current_tenant: 'rugira-prod'
};

const DEMO_CREDENTIALS = {
  username: 'hanz.mueller',
  password: 'Hanz1234!'
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTenant, setCurrentTenant] = useState<string | null>(null);
  const [userManager, setUserManager] = useState<UserManager | null>(null);

  // Initialize based on mode
  useEffect(() => {
    if (isDemoMode) {
      initDemoAuth();
    } else {
      initOktaAuth();
    }
  }, []);

  const initDemoAuth = async () => {
    // Check for existing demo session
    const storedUser = authStore.getUser();
    if (storedUser && storedUser.id?.startsWith('demo-')) {
      setUser(storedUser);
      setIsAuthenticated(true);
      setCurrentTenant(storedUser.current_tenant || 'rugira-prod');
    }
    
    setupAuthEventListeners();
    setIsLoading(false);
  };

  const initOktaAuth = async () => {
    // Always use demo mode for demonstration
    return initDemoAuth();
  };

  const setupAuthEventListeners = () => {
    const handleLocked = () => {
      setUser(null);
      setIsAuthenticated(false);
      setCurrentTenant(null);
      authStore.clear();
      window.location.href = '/';
    };
    
    const handleExpired = () => {
      setUser(null);
      setIsAuthenticated(false);
      setCurrentTenant(null);
      authStore.clear();
      window.location.href = '/';
    };
    
    window.addEventListener('auth:locked', handleLocked);
    window.addEventListener('auth:expired', handleExpired);
    
    return () => {
      window.removeEventListener('auth:locked', handleLocked);
      window.removeEventListener('auth:expired', handleExpired);
    };
  };

  const mapOidcUserToExtended = (oidcUser: OidcUser): ExtendedUser => {
    const profile = oidcUser.profile as OktaUserProfile;
    
    return {
      id: profile.sub,
      email: profile.email,
      name: profile.name,
      profile: {
        name: profile.name,
        email: profile.email,
        given_name: profile.given_name,
        family_name: profile.family_name,
        picture: profile.picture
      },
      access_token: oidcUser.access_token,
      expired: oidcUser.expired || false,
      tenant_roles: profile.tenant_roles || {},
      current_tenant: profile.tenant_roles ? Object.keys(profile.tenant_roles)[0] : undefined
    };
  };

  const login = async (returnPath?: string) => {
    setIsLoading(true);
    
    if (returnPath) {
      sessionStorage.setItem('rugira_return_path', returnPath);
    }
    
    if (isDemoMode) {
      window.location.href = '/login' + (returnPath ? `?next=${encodeURIComponent(returnPath)}` : '');
    } else if (userManager) {
      try {
        await userManager.signinRedirect({
          state: returnPath || '/overview'
        });
      } catch (error) {
        console.error('Login failed:', error);
        setIsLoading(false);
      }
    }
  };

  const performDemoLogin = async (username: string, password: string): Promise<boolean> => {
    if (!isDemoMode) return false;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Import demo users dynamically
    const { demoUsers } = await import('@/lib/demoUsers');
    
    // Find matching user
    const demoUser = demoUsers.find(u => u.username === username && u.password === password);
    
    if (demoUser) {
      const authenticatedUser: ExtendedUser = {
        id: `demo-${username}`,
        email: demoUser.email,
        name: demoUser.name,
        profile: {
          name: demoUser.name,
          email: demoUser.email,
          given_name: demoUser.name.split(' ')[0],
          family_name: demoUser.name.split(' ')[1] || '',
          picture: 'https://www.gravatar.com/avatar/placeholder?d=mp&s=200'
        },
        access_token: 'demo-jwt-token-' + Date.now(),
        expired: false,
        tenant_roles: demoUser.tenantRoles,
        current_tenant: Object.keys(demoUser.tenantRoles)[0] || 'rugira-prod'
      };
      
      setUser(authenticatedUser);
      setIsAuthenticated(true);
      setCurrentTenant(authenticatedUser.current_tenant || 'rugira-prod');
      authStore.setAuth(authenticatedUser.access_token, undefined, authenticatedUser);
      
      return true;
    }
    
    return false;
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentTenant(null);
    authStore.logout();
    
    sessionStorage.removeItem('rugira_return_path');
    
    if (isDemoMode) {
      window.location.href = 'https://rugira.ch';
    } else if (userManager) {
      try {
        await userManager.signoutRedirect();
      } catch (error) {
        console.error('Logout failed:', error);
        window.location.href = 'https://rugira.ch';
      }
    }
  };

  const getAccessToken = () => {
    return user?.access_token || null;
  };

  const handleRedirectCallback = async (): Promise<string> => {
    if (isDemoMode) {
      const returnPath = sessionStorage.getItem('rugira_return_path') || '/overview';
      sessionStorage.removeItem('rugira_return_path');
      return returnPath;
    }
    
    if (userManager) {
      try {
        const user = await userManager.signinRedirectCallback();
        const returnPath = typeof user.state === 'string' ? user.state : '/overview';
        return returnPath;
      } catch (error) {
        console.error('Redirect callback failed:', error);
        return '/overview';
      }
    }
    
    return '/overview';
  };

  const switchTenant = (tenantId: string) => {
    if (user && user.tenant_roles && user.tenant_roles[tenantId]) {
      const updatedUser = { ...user, current_tenant: tenantId };
      setUser(updatedUser);
      setCurrentTenant(tenantId);
      authStore.setAuth(user.access_token, undefined, updatedUser);
    }
  };

  // Compute tenant roles for current tenant
  const tenantRoles = user?.tenant_roles?.[currentTenant || ''] || [];

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    isDemoMode,
    currentTenant,
    tenantRoles,
    login,
    logout,
    getAccessToken,
    handleRedirectCallback,
    switchTenant,
    performDemoLogin: isDemoMode ? performDemoLogin : undefined,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}