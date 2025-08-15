import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for session-based auth
});

// Global auth token getter (set by AuthContext)
let getAuthToken: (() => string | null) | null = null;

export const setAuthTokenGetter = (getter: () => string | null) => {
  getAuthToken = getter;
};

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Add Bearer token if available
    if (getAuthToken) {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Log API requests (mask sensitive data)
    if (config.url && !config.url.includes('/auth/')) {
      console.debug(`API ${config.method?.toUpperCase()}: ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.warn('Unauthorized access detected');
      
      // Trigger auth refresh or redirect to login
      if (getAuthToken) {
        // Try to get a fresh token
        const token = getAuthToken();
        if (!token) {
          // No token available, redirect to login
          window.location.href = '/login?next=' + encodeURIComponent(window.location.pathname);
        }
      }
    }
    
    // Handle CORS errors
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - check CORS configuration');
    }
    
    return Promise.reject(error);
  }
);

export default api;