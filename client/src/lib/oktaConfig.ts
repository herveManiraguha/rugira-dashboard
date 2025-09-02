import { UserManagerSettings } from 'oidc-client-ts';

// For now, use a simple check - will be demo mode initially
export const isDemoMode = true;

// Get base URL for redirects
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback for SSR or build time
  const isDev = import.meta.env.DEV;
  return isDev ? 'http://localhost:5000' : 'https://app.rugira.ch';
};

// Placeholder Okta config - will be replaced with server-side config when available
export const oktaConfig: UserManagerSettings = {
  authority: `https://dev-placeholder.okta.com`,
  client_id: 'placeholder-client-id',
  redirect_uri: `${getBaseUrl()}/auth/callback`,
  post_logout_redirect_uri: `${getBaseUrl()}/`,
  response_type: 'code',
  scope: 'openid profile email groups',
  loadUserInfo: true,
  automaticSilentRenew: true,
  silent_redirect_uri: `${getBaseUrl()}/auth/silent-callback`,
};

// Type definitions for Okta user profile with tenant roles
export interface OktaUserProfile {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  email: string;
  picture?: string;
  tenant_roles?: {
    [tenantId: string]: string[];
  };
  groups?: string[];
}

export interface ExtendedUser {
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
  tenant_roles?: {
    [tenantId: string]: string[];
  };
  current_tenant?: string;
}