// API Service for all dashboard features
import { apiRequest } from '@/lib/queryClient';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// Generic fetch function with error handling
async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}

// Generic post function
async function postAPI<T>(endpoint: string, data?: any): Promise<T> {
  const response = await apiRequest('POST', `${API_BASE}${endpoint}`, data);
  return response.json();
}

// Generic patch function  
async function patchAPI<T>(endpoint: string, data: any): Promise<T> {
  const response = await apiRequest('PATCH', `${API_BASE}${endpoint}`, data);
  return response.json();
}

// Bot APIs
export const botAPI = {
  getAll: () => fetchAPI<any[]>('/api/v2/bots'),
  getById: (id: string) => fetchAPI<any>(`/api/v2/bots/${id}`),
  start: (id: string) => postAPI<any>(`/api/bots/${id}/start`),
  stop: (id: string) => postAPI<any>(`/api/bots/${id}/stop`),
  create: (data: any) => postAPI<any>('/api/bots', data),
};

// Exchange APIs
export const exchangeAPI = {
  getAll: () => fetchAPI<any[]>('/api/exchanges'),
  getById: (id: string) => fetchAPI<any>(`/api/exchanges/${id}`),
  connect: (data: any) => postAPI<any>('/api/exchanges', data),
  disconnect: (id: string) => postAPI<any>(`/api/exchanges/${id}/disconnect`),
};

// Strategy APIs
export const strategyAPI = {
  getAll: () => fetchAPI<any[]>('/api/strategies'),
  getById: (id: string) => fetchAPI<any>(`/api/strategies/${id}`),
  create: (data: any) => postAPI<any>('/api/strategies', data),
  update: (id: string, data: any) => patchAPI<any>(`/api/strategies/${id}`, data),
};

// Backtest APIs
export const backtestAPI = {
  getAll: () => fetchAPI<any[]>('/api/backtests'),
  create: (data: any) => postAPI<any>('/api/backtests', data),
  getResults: (id: string) => fetchAPI<any>(`/api/backtests/${id}/results`),
};

// Monitoring APIs
export const monitoringAPI = {
  getAlerts: () => fetchAPI<any[]>('/api/monitoring/alerts'),
  getMetrics: () => fetchAPI<any>('/api/monitoring/metrics'),
  acknowledgeAlert: (id: string) => patchAPI<any>(`/api/monitoring/alerts/${id}`, { acknowledged: true }),
};

// Compliance APIs
export const complianceAPI = {
  getReports: () => fetchAPI<any[]>('/api/compliance/reports'),
  getViolations: () => fetchAPI<any[]>('/api/compliance/violations'),
  generateReport: (type: string) => postAPI<any>('/api/compliance/reports', { type }),
};

// Portfolio APIs
export const portfolioAPI = {
  getOverview: () => fetchAPI<any>('/api/portfolio'),
  getPositions: () => fetchAPI<any[]>('/api/portfolio/positions'),
  getPerformance: () => fetchAPI<any>('/api/portfolio/performance'),
};

// Market APIs
export const marketAPI = {
  getOverview: () => fetchAPI<any>('/api/market'),
  getPrices: () => fetchAPI<any>('/api/market/prices'),
  getTrends: () => fetchAPI<any>('/api/market/trends'),
};

// User APIs
export const userAPI = {
  getProfile: () => fetchAPI<any>('/api/user/profile'),
  updateProfile: (data: any) => patchAPI<any>('/api/user/profile', data),
  getSessions: () => fetchAPI<any[]>('/api/user/sessions'),
};

// Admin APIs
export const adminAPI = {
  getStats: () => fetchAPI<any>('/api/admin/stats'),
  getUsers: () => fetchAPI<any[]>('/api/admin/users'),
  getLogs: () => fetchAPI<any[]>('/api/admin/logs'),
  getSystemHealth: () => fetchAPI<any>('/api/admin/system/health'),
};

// Settings APIs
export const settingsAPI = {
  getAll: () => fetchAPI<any>('/api/settings'),
  update: (data: any) => patchAPI<any>('/api/settings', data),
};

// Reports APIs
export const reportsAPI = {
  getByType: (type: string) => fetchAPI<any>(`/api/reports/${type}`),
  generate: (type: string, params: any) => postAPI<any>('/api/reports/generate', { type, ...params }),
};

// Help APIs
export const helpAPI = {
  getArticles: () => fetchAPI<any[]>('/api/help/articles'),
  getFAQs: () => fetchAPI<any[]>('/api/help/faqs'),
};

// Overview API
export const overviewAPI = {
  getDashboard: () => fetchAPI<any>('/api/overview'),
};

// Kill Switch APIs
export const killSwitchAPI = {
  getStatus: () => fetchAPI<any>('/api/admin/kill-switch/status'),
  engage: (data: any) => postAPI<any>('/api/admin/kill-switch/engage', data),
  clear: (note?: string) => postAPI<any>('/api/admin/kill-switch/clear', { note }),
};

// KPI APIs
export const kpiAPI = {
  getAll: () => fetchAPI<any[]>('/api/kpis'),
};

// Activity APIs
export const activityAPI = {
  getAll: () => fetchAPI<any[]>('/api/activities'),
};