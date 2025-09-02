/**
 * Secure in-memory authentication store
 * Replaces localStorage/sessionStorage for sensitive auth tokens
 */

interface AuthData {
  token?: string;
  refreshToken?: string;
  user?: any;
  expiresAt?: number;
  lastActivity?: number;
}

class InMemoryAuthStore {
  private authData: AuthData = {};
  private broadcastChannel: BroadcastChannel | null = null;
  private idleTimer: NodeJS.Timeout | null = null;
  private sessionTimer: NodeJS.Timeout | null = null;
  
  // Configuration
  private readonly IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes
  private readonly SESSION_TTL = 12 * 60 * 60 * 1000; // 12 hours
  private readonly ACTIVITY_CHECK_INTERVAL = 60 * 1000; // Check every minute
  
  constructor() {
    this.initBroadcastChannel();
    this.initActivityListeners();
    this.initSessionManagement();
  }
  
  private initBroadcastChannel() {
    try {
      this.broadcastChannel = new BroadcastChannel('auth_channel');
      
      this.broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'logout') {
          this.clear();
          window.location.href = '/';
        }
        if (event.data.type === 'auth_update') {
          this.authData = event.data.authData;
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported');
    }
  }
  
  private initActivityListeners() {
    // Track user activity
    const updateActivity = () => {
      this.authData.lastActivity = Date.now();
      this.resetIdleTimer();
    };
    
    // Listen for user activity
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });
    
    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Optional: Could clear sensitive data when tab is hidden
        // For now, just stop the idle timer
        if (this.idleTimer) {
          clearTimeout(this.idleTimer);
        }
      } else {
        // Resume idle timer when tab becomes visible
        this.resetIdleTimer();
        this.checkSessionValidity();
      }
    });
    
    // Clear on tab close
    window.addEventListener('beforeunload', () => {
      // Note: In production, tokens should be cleared
      // For development, we might want to preserve them
      if (process.env.NODE_ENV === 'production') {
        this.clear();
      }
    });
  }
  
  private initSessionManagement() {
    // Check session validity every minute
    setInterval(() => {
      this.checkSessionValidity();
    }, this.ACTIVITY_CHECK_INTERVAL);
  }
  
  private resetIdleTimer() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
    
    this.idleTimer = setTimeout(() => {
      this.lockScreen();
    }, this.IDLE_TIMEOUT);
  }
  
  private resetSessionTimer() {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
    
    this.sessionTimer = setTimeout(() => {
      this.forceReauth();
    }, this.SESSION_TTL);
  }
  
  private checkSessionValidity() {
    const now = Date.now();
    
    // Check if session has expired
    if (this.authData.expiresAt && now > this.authData.expiresAt) {
      this.forceReauth();
      return;
    }
    
    // Check idle timeout
    if (this.authData.lastActivity) {
      const idleTime = now - this.authData.lastActivity;
      if (idleTime > this.IDLE_TIMEOUT) {
        this.lockScreen();
      }
    }
  }
  
  private lockScreen() {
    // Dispatch event for UI to show lock screen
    window.dispatchEvent(new CustomEvent('auth:locked', {
      detail: { reason: 'idle_timeout' }
    }));
  }
  
  private forceReauth() {
    this.clear();
    // Dispatch event for UI to redirect to login
    window.dispatchEvent(new CustomEvent('auth:expired', {
      detail: { reason: 'session_expired' }
    }));
    window.location.href = '/';
  }
  
  // Public methods
  setAuth(token: string, refreshToken?: string, user?: any) {
    const now = Date.now();
    this.authData = {
      token,
      refreshToken,
      user,
      expiresAt: now + this.SESSION_TTL,
      lastActivity: now
    };
    
    // Reset timers
    this.resetIdleTimer();
    this.resetSessionTimer();
    
    // Broadcast to other tabs
    this.broadcastChannel?.postMessage({
      type: 'auth_update',
      authData: this.authData
    });
  }
  
  getToken(): string | undefined {
    this.checkSessionValidity();
    return this.authData.token;
  }
  
  getRefreshToken(): string | undefined {
    return this.authData.refreshToken;
  }
  
  getUser(): any {
    return this.authData.user;
  }
  
  isAuthenticated(): boolean {
    return !!this.authData.token && !this.isExpired();
  }
  
  isExpired(): boolean {
    if (!this.authData.expiresAt) return true;
    return Date.now() > this.authData.expiresAt;
  }
  
  clear() {
    this.authData = {};
    
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
  }
  
  logout() {
    this.clear();
    
    // Broadcast logout to other tabs
    this.broadcastChannel?.postMessage({
      type: 'logout'
    });
  }
  
  // Utility to clear all browser storage (for settings)
  clearAllStorage() {
    // Clear localStorage
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
    
    // Clear sessionStorage
    try {
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear sessionStorage:', e);
    }
    
    // Clear IndexedDB
    if ('indexedDB' in window) {
      indexedDB.databases().then(databases => {
        databases.forEach(db => {
          if (db.name) {
            indexedDB.deleteDatabase(db.name);
          }
        });
      }).catch(e => {
        console.warn('Could not clear IndexedDB:', e);
      });
    }
    
    // Clear cookies (client-accessible ones)
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }
}

// Export singleton instance
export const authStore = new InMemoryAuthStore();