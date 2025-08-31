import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Create a flexible API client that can work with both mock and real APIs
class ApiClient {
  private mockInstance: AxiosInstance;
  private realInstance: AxiosInstance;
  private environment: 'Demo' | 'Paper' | 'Live' = 'Demo';

  constructor() {
    // Mock instance for Demo mode (uses existing mock endpoints)
    this.mockInstance = axios.create({
      baseURL: '',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Real instance for Paper/Live modes
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    this.realInstance = axios.create({
      baseURL: apiBaseUrl,
      withCredentials: true, // Always send cookies for session-based auth
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add response interceptors for error handling
    this.setupInterceptors(this.mockInstance);
    this.setupInterceptors(this.realInstance);
  }

  private setupInterceptors(instance: AxiosInstance) {
    // Response interceptor for handling errors
    instance.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setEnvironment(env: 'Demo' | 'Paper' | 'Live') {
    this.environment = env;
  }

  private get client(): AxiosInstance {
    return this.environment === 'Demo' ? this.mockInstance : this.realInstance;
  }

  // Auth endpoints
  async login(username: string, password: string) {
    if (this.environment === 'Demo') {
      // Use existing mock login
      return this.mockInstance.post('/api/auth/mock-login', { username, password });
    }
    return this.realInstance.post('/auth/login', { username, password });
  }

  async logout() {
    if (this.environment === 'Demo') {
      return this.mockInstance.post('/api/auth/mock-logout');
    }
    return this.realInstance.post('/auth/logout');
  }

  async getSession() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/auth/mock-session');
    }
    return this.realInstance.get('/auth/session');
  }

  async refreshSession() {
    if (this.environment === 'Demo') {
      return this.mockInstance.post('/api/auth/mock-refresh');
    }
    return this.realInstance.post('/auth/refresh');
  }

  // Bots endpoints
  async getBots() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/bots');
    }
    return this.realInstance.get('/bots');
  }

  async getBot(id: string) {
    if (this.environment === 'Demo') {
      return this.mockInstance.get(`/api/bots/${id}`);
    }
    return this.realInstance.get(`/bots/${id}`);
  }

  async createBot(data: any) {
    if (this.environment === 'Demo') {
      return this.mockInstance.post('/api/bots', data);
    }
    return this.realInstance.post('/bots', data);
  }

  async updateBot(id: string, data: any) {
    if (this.environment === 'Demo') {
      return this.mockInstance.put(`/api/bots/${id}`, data);
    }
    return this.realInstance.put(`/bots/${id}`, data);
  }

  async deleteBot(id: string) {
    if (this.environment === 'Demo') {
      return this.mockInstance.delete(`/api/bots/${id}`);
    }
    return this.realInstance.delete(`/bots/${id}`);
  }

  async startBot(id: string) {
    if (this.environment === 'Demo') {
      return this.mockInstance.post(`/api/bots/${id}/start`);
    }
    return this.realInstance.post(`/bots/${id}/start`);
  }

  async stopBot(id: string) {
    if (this.environment === 'Demo') {
      return this.mockInstance.post(`/api/bots/${id}/stop`);
    }
    return this.realInstance.post(`/bots/${id}/stop`);
  }

  async pauseBot(id: string) {
    if (this.environment === 'Demo') {
      return this.mockInstance.post(`/api/bots/${id}/pause`);
    }
    return this.realInstance.post(`/bots/${id}/pause`);
  }

  async getBotStatus(id: string) {
    if (this.environment === 'Demo') {
      return this.mockInstance.get(`/api/bots/${id}/status`);
    }
    return this.realInstance.get(`/bots/${id}/status`);
  }

  async getBotLogs(id: string) {
    if (this.environment === 'Demo') {
      return this.mockInstance.get(`/api/bots/${id}/logs`);
    }
    return this.realInstance.get(`/bots/${id}/logs`);
  }

  // Venues endpoints (formerly exchanges)
  async getVenues() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/exchanges'); // Keep old endpoint for demo
    }
    return this.realInstance.get('/venues');
  }

  async getVenue(id: string) {
    if (this.environment === 'Demo') {
      return this.mockInstance.get(`/api/exchanges/${id}`);
    }
    return this.realInstance.get(`/venues/${id}`);
  }

  async connectVenue(data: any) {
    if (this.environment === 'Demo') {
      return this.mockInstance.post('/api/exchanges/connect', data);
    }
    return this.realInstance.post('/venues/connect', data);
  }

  async disconnectVenue(id: string) {
    if (this.environment === 'Demo') {
      return this.mockInstance.delete(`/api/exchanges/${id}`);
    }
    return this.realInstance.delete(`/venues/${id}`);
  }

  async syncVenue(id: string) {
    if (this.environment === 'Demo') {
      return this.mockInstance.post(`/api/exchanges/${id}/sync`);
    }
    return this.realInstance.post(`/venues/${id}/sync`);
  }

  async getVenueBalance(id: string) {
    if (this.environment === 'Demo') {
      return this.mockInstance.get(`/api/exchanges/${id}/balance`);
    }
    return this.realInstance.get(`/venues/${id}/balance`);
  }

  async getVenueInstruments(id: string) {
    if (this.environment === 'Demo') {
      return this.mockInstance.get(`/api/exchanges/${id}/instruments`);
    }
    return this.realInstance.get(`/venues/${id}/instruments`);
  }

  async sendTestOrder(venueId: string, data: any) {
    if (this.environment === 'Demo') {
      return this.mockInstance.post(`/api/exchanges/${venueId}/test-order`, data);
    }
    return this.realInstance.post(`/venues/${venueId}/test-order`, data);
  }

  // Portfolio endpoints
  async getPortfolio() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/portfolio');
    }
    return this.realInstance.get('/portfolio');
  }

  async getPortfolioPositions() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/portfolio/positions');
    }
    return this.realInstance.get('/portfolio/positions');
  }

  async getPortfolioHistory() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/portfolio/history');
    }
    return this.realInstance.get('/portfolio/history');
  }

  async getPortfolioAllocation() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/portfolio/allocation');
    }
    return this.realInstance.get('/portfolio/allocation');
  }

  async getPortfolioRisk() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/portfolio/risk');
    }
    return this.realInstance.get('/portfolio/risk');
  }

  // Overview endpoints
  async getOverviewStats() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/overview/stats');
    }
    return this.realInstance.get('/overview/stats');
  }

  async getOverviewMetrics() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/overview/metrics');
    }
    return this.realInstance.get('/overview/metrics');
  }

  async getOverviewActivity() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/overview/activity');
    }
    return this.realInstance.get('/overview/activity');
  }

  // Monitoring endpoints
  async getAlerts() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/monitoring/alerts');
    }
    return this.realInstance.get('/monitoring/alerts');
  }

  async acknowledgeAlert(id: string) {
    if (this.environment === 'Demo') {
      return this.mockInstance.put(`/api/monitoring/alerts/${id}/acknowledge`);
    }
    return this.realInstance.put(`/monitoring/alerts/${id}/acknowledge`);
  }

  async getMetrics() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/monitoring/metrics');
    }
    return this.realInstance.get('/monitoring/metrics');
  }

  async getHealth() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/monitoring/health');
    }
    return this.realInstance.get('/monitoring/health');
  }

  // Compliance endpoints
  async getComplianceViolations() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/compliance/violations');
    }
    return this.realInstance.get('/compliance/violations');
  }

  async getComplianceReports() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/compliance/reports');
    }
    return this.realInstance.get('/compliance/reports');
  }

  async resolveViolation(id: string, data: any) {
    if (this.environment === 'Demo') {
      return this.mockInstance.put(`/api/compliance/violations/${id}/resolve`, data);
    }
    return this.realInstance.put(`/compliance/violations/${id}/resolve`, data);
  }

  async getAuditLog() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/compliance/audit-log');
    }
    return this.realInstance.get('/compliance/audit-log');
  }

  async runReconciliation() {
    if (this.environment === 'Demo') {
      return this.mockInstance.post('/api/compliance/reconciliation');
    }
    return this.realInstance.post('/compliance/reconciliation');
  }

  // Kill Switch endpoints
  async getKillSwitchStatus() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/killswitch/status');
    }
    return this.realInstance.get('/killswitch/status');
  }

  async activateKillSwitch() {
    if (this.environment === 'Demo') {
      return this.mockInstance.post('/api/killswitch/activate');
    }
    return this.realInstance.post('/killswitch/activate');
  }

  async deactivateKillSwitch() {
    if (this.environment === 'Demo') {
      return this.mockInstance.post('/api/killswitch/deactivate');
    }
    return this.realInstance.post('/killswitch/deactivate');
  }

  async getKillSwitchHistory() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/killswitch/history');
    }
    return this.realInstance.get('/killswitch/history');
  }

  // Backtesting endpoints
  async getBacktests() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/strategies/backtests');
    }
    return this.realInstance.get('/backtests');
  }

  async createBacktest(data: any) {
    if (this.environment === 'Demo') {
      return this.mockInstance.post('/api/strategies/backtest', data);
    }
    return this.realInstance.post('/backtests', data);
  }

  async getBacktest(id: string) {
    if (this.environment === 'Demo') {
      return this.mockInstance.get(`/api/strategies/backtest/${id}`);
    }
    return this.realInstance.get(`/backtests/${id}`);
  }

  async compareBacktests(ids: string[]) {
    if (this.environment === 'Demo') {
      return this.mockInstance.post('/api/strategies/compare', { ids });
    }
    return this.realInstance.post('/backtests/compare', { ids });
  }

  // Reports endpoints
  async getReports() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/reports');
    }
    return this.realInstance.get('/reports');
  }

  async generateReport(type: string, params: any) {
    if (this.environment === 'Demo') {
      return this.mockInstance.post('/api/reports/generate', { type, ...params });
    }
    return this.realInstance.post('/reports/generate', { type, ...params });
  }

  // Settings endpoints
  async getUserSettings() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/settings/user');
    }
    return this.realInstance.get('/settings/user');
  }

  async updateUserSettings(data: any) {
    if (this.environment === 'Demo') {
      return this.mockInstance.put('/api/settings/user', data);
    }
    return this.realInstance.put('/settings/user', data);
  }

  async getTradingSettings() {
    if (this.environment === 'Demo') {
      return this.mockInstance.get('/api/settings/trading');
    }
    return this.realInstance.get('/settings/trading');
  }

  async updateTradingSettings(data: any) {
    if (this.environment === 'Demo') {
      return this.mockInstance.put('/api/settings/trading', data);
    }
    return this.realInstance.put('/settings/trading', data);
  }

  // Generic request method for custom endpoints
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<T>(config);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export for use in components
export default apiClient;