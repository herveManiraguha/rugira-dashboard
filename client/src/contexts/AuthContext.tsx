import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserManager, WebStorageStateStore, User } from 'oidc-client-ts';
import { setAuthTokenGetter } from '@/services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (returnPath?: string) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
  handleRedirectCallback: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// OIDC Configuration
const getOidcConfig = () => {
  const issuer = import.meta.env.VITE_AUTH_ISSUER;
  const clientId = import.meta.env.VITE_AUTH_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH_AUDIENCE;
  const redirectUri = import.meta.env.VITE_AUTH_REDIRECT_URI || `${window.location.origin}/auth/callback`;
  const postLogoutRedirectUri = import.meta.env.VITE_AUTH_POST_LOGOUT_REDIRECT_URI || 'https://rugira.ch';

  if (!issuer || !clientId) {
    throw new Error('Missing required auth environment variables: VITE_AUTH_ISSUER and VITE_AUTH_CLIENT_ID');
  }

  return {
    authority: issuer,
    client_id: clientId,
    redirect_uri: redirectUri,
    post_logout_redirect_uri: postLogoutRedirectUri,
    response_type: 'code',
    scope: audience ? `openid profile email ${audience}` : 'openid profile email',
    audience: audience || undefined,
    automaticSilentRenew: true,
    silent_redirect_uri: `${window.location.origin}/silent-renew.html`,
    includeIdTokenInSilentRenew: true,
    userStore: new WebStorageStateStore({ store: window.sessionStorage }), // Keep tokens in sessionStorage, not localStorage
    revokeTokensOnSignout: true,
    loadUserInfo: true,
  };
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [userManager, setUserManager] = useState<UserManager | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const config = getOidcConfig();
      const manager = new UserManager(config);
      setUserManager(manager);

      // Set up API client auth token getter
      setAuthTokenGetter(() => user?.access_token || null);

      // Set up event handlers
      manager.events.addUserLoaded((user: User) => {
        setUser(user);
        setIsAuthenticated(true);
        setIsLoading(false);
      });

      manager.events.addUserUnloaded(() => {
        setUser(null);
        setIsAuthenticated(false);
      });

      manager.events.addAccessTokenExpiring(() => {
        console.log('Access token expiring, attempting silent renewal...');
      });

      manager.events.addAccessTokenExpired(() => {
        console.log('Access token expired');
        setUser(null);
        setIsAuthenticated(false);
      });

      manager.events.addSilentRenewError((error) => {
        console.error('Silent renewal error:', error);
        // Redirect to login if silent renewal fails
        manager.signinRedirect();
      });

      // Check if user is already authenticated
      manager.getUser().then((user) => {
        if (user && !user.expired) {
          setUser(user);
          setIsAuthenticated(true);
        }
        setIsLoading(false);
      }).catch((error) => {
        console.error('Error getting user:', error);
        setIsLoading(false);
      });

    } catch (error) {
      console.error('Auth configuration error:', error);
      setIsLoading(false);
    }
  }, [user]);

  const login = async (returnPath?: string) => {
    if (!userManager) throw new Error('UserManager not initialized');
    
    const state = returnPath ? { returnUrl: returnPath } : undefined;
    await userManager.signinRedirect({ state });
  };

  const logout = async () => {
    if (!userManager) throw new Error('UserManager not initialized');
    
    await userManager.signoutRedirect();
  };

  const getAccessToken = () => {
    return user?.access_token || null;
  };

  const handleRedirectCallback = async () => {
    if (!userManager) throw new Error('UserManager not initialized');
    
    try {
      const user = await userManager.signinRedirectCallback();
      setUser(user);
      setIsAuthenticated(true);
      
      // Return the intended URL from state
      const state = user.state as { returnUrl?: string } | undefined;
      return state?.returnUrl || '/overview';
    } catch (error) {
      console.error('Redirect callback error:', error);
      throw error;
    }
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}