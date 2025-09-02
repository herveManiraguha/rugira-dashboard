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
    // Skip Okta initialization in demo mode
    if (isDemoMode) {
      return initDemoAuth();
    }
    
    try {
      // In real implementation, fetch Okta config from server
      const oktaConfig = {
        authority: `https://dev-placeholder.okta.com`,
        client_id: 'placeholder-client-id',
        redirect_uri: `${window.location.origin}/auth/callback`,
        post_logout_redirect_uri: `${window.location.origin}/`,
        response_type: 'code',
        scope: 'openid profile email groups',
        loadUserInfo: true,
        automaticSilentRenew: true,
        silent_redirect_uri: `${window.location.origin}/auth/silent-callback`,
      };
      
      const manager = new UserManager(oktaConfig);
      setUserManager(manager);

      // Check for existing session
      const oidcUser = await manager.getUser();
      if (oidcUser && !oidcUser.expired) {
        const extendedUser = mapOidcUserToExtended(oidcUser);
        setUser(extendedUser);
        setIsAuthenticated(true);
        setCurrentTenant(extendedUser.current_tenant || Object.keys(extendedUser.tenant_roles || {})[0] || null);
        authStore.setAuth(oidcUser.access_token, oidcUser.refresh_token, extendedUser);
      }

      // Handle token events
      manager.events.addUserLoaded((user: OidcUser) => {
        const extendedUser = mapOidcUserToExtended(user);
        setUser(extendedUser);
        setIsAuthenticated(true);
        authStore.setAuth(user.access_token, user.refresh_token, extendedUser);
      });

      manager.events.addUserUnloaded(() => {
        setUser(null);
        setIsAuthenticated(false);
        setCurrentTenant(null);
        authStore.clear();
      });

      manager.events.addAccessTokenExpired(() => {
        setUser(null);
        setIsAuthenticated(false);
        setCurrentTenant(null);
        authStore.clear();
      });

    } catch (error) {
      console.error('Failed to initialize Okta auth:', error);
    }
    
    setupAuthEventListeners();
    setIsLoading(false);
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
    
    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
      const authenticatedUser = { 
        ...MOCK_USER, 
        access_token: 'demo-jwt-token-' + Date.now() 
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