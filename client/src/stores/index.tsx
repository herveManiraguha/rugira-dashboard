import { create } from 'zustand';
import type { Bot, KPI, ActivityFeed, NotificationCount } from '../types';
import { api } from '../services/api';

interface ApiState {
  isConnected: boolean;
  lastUpdate: Date | null;
  connectionStatus: string;
  connectionClass: string;
  checkConnection: () => Promise<void>;
}

export const useApiStore = create<ApiState>((set, get) => ({
  isConnected: false,
  lastUpdate: null,
  connectionStatus: 'disconnected',
  connectionClass: 'status-error',
  
  checkConnection: async () => {
    try {
      await api.get('/health');
      set({ 
        isConnected: true, 
        lastUpdate: new Date(),
        connectionStatus: 'connected',
        connectionClass: 'status-online'
      });
    } catch (error) {
      set({ 
        isConnected: false,
        connectionStatus: 'disconnected',
        connectionClass: 'status-error'
      });
      console.error('API connection failed:', error);
    }
  }
}));

interface BotsState {
  bots: Bot[];
  isLoading: boolean;
  error: string | null;
  activeBots: Bot[];
  botCount: number;
  activeBotCount: number;
  fetchBots: () => Promise<void>;
  startBot: (botId: string) => Promise<void>;
  stopBot: (botId: string) => Promise<void>;
  createBot: (botData: Partial<Bot>) => Promise<void>;
}

export const useBotsStore = create<BotsState>((set, get) => ({
  bots: [],
  isLoading: false,
  error: null,
  activeBots: [],
  botCount: 0,
  activeBotCount: 0,
  
  fetchBots: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/bots');
      const bots = response.data;
      const activeBots = bots.filter((bot: Bot) => bot.status === 'running');
      
      set({ 
        bots, 
        activeBots,
        botCount: bots.length,
        activeBotCount: activeBots.length,
        isLoading: false 
      });
    } catch (err) {
      set({ error: 'Failed to fetch bots', isLoading: false });
      console.error('Error fetching bots:', err);
    }
  },
  
  startBot: async (botId: string) => {
    try {
      await api.post(`/bots/${botId}/start`);
      await get().fetchBots(); // Refresh data
    } catch (err) {
      set({ error: 'Failed to start bot' });
      console.error('Error starting bot:', err);
    }
  },
  
  stopBot: async (botId: string) => {
    try {
      await api.post(`/bots/${botId}/stop`);
      await get().fetchBots(); // Refresh data
    } catch (err) {
      set({ error: 'Failed to stop bot' });
      console.error('Error stopping bot:', err);
    }
  },
  
  createBot: async (botData: Partial<Bot>) => {
    try {
      await api.post('/bots', botData);
      await get().fetchBots(); // Refresh data
    } catch (err) {
      set({ error: 'Failed to create bot' });
      console.error('Error creating bot:', err);
      throw err;
    }
  }
}));

interface KPIState {
  kpis: KPI[];
  isLoading: boolean;
  fetchKPIs: () => Promise<void>;
}

export const useKPIStore = create<KPIState>((set) => ({
  kpis: [],
  isLoading: false,
  
  fetchKPIs: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/kpis');
      set({ kpis: response.data, isLoading: false });
    } catch (err) {
      console.error('Error fetching KPIs:', err);
      set({ isLoading: false });
    }
  }
}));

interface ActivityState {
  activities: ActivityFeed[];
  isLoading: boolean;
  fetchActivities: () => Promise<void>;
  addActivity: (activity: ActivityFeed) => void;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  isLoading: false,
  
  fetchActivities: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/activities');
      set({ activities: response.data, isLoading: false });
    } catch (err) {
      console.error('Error fetching activities:', err);
      set({ isLoading: false });
    }
  },
  
  addActivity: (activity: ActivityFeed) => {
    const { activities } = get();
    const newActivities = [activity, ...activities];
    // Keep only last 50 activities
    if (newActivities.length > 50) {
      newActivities.splice(50);
    }
    set({ activities: newActivities });
  }
}));

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'trading' | 'system' | 'risk' | 'performance' | 'compliance';
  actionUrl?: string;
}

interface NotificationState {
  count: number;
  notifications: Notification[];
  incrementCount: () => void;
  resetCount: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  count: 8,
  notifications: [
    {
      id: '1',
      type: 'error',
      title: 'Bot Alpha Arbitrage Stopped',
      message: 'Bot encountered an error and has been automatically stopped. Error: Insufficient balance on Binance exchange.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      read: false,
      category: 'trading',
      actionUrl: '/bots'
    },
    {
      id: '2',
      type: 'warning',
      title: 'High Memory Usage Alert',
      message: 'System memory usage has reached 67%. Consider scaling resources to maintain optimal performance.',
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      read: false,
      category: 'system',
      actionUrl: '/monitoring'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Risk Threshold Exceeded',
      message: 'Portfolio drawdown has exceeded 5% threshold. Current drawdown: -6.2%. Review risk parameters.',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      read: false,
      category: 'risk',
      actionUrl: '/compliance'
    },
    {
      id: '4',
      type: 'success',
      title: 'New Profit Target Reached',
      message: 'Beta Grid bot has achieved +15% profit target on ETH/USDT pair. Total profit: CHF 2,347.89',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      read: false,
      category: 'trading',
      actionUrl: '/bots'
    },
    {
      id: '5',
      type: 'info',
      title: 'Market Data Connection Restored',
      message: 'Connection to Binance market data feed has been restored. All systems operating normally.',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      read: false,
      category: 'system'
    },
    {
      id: '6',
      type: 'warning',
      title: 'Exchange API Rate Limit',
      message: 'Approaching rate limit on Coinbase Pro API (85% of limit used). Consider optimizing request frequency.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      category: 'performance',
      actionUrl: '/exchanges'
    },
    {
      id: '7',
      type: 'success',
      title: 'Backtest Completed',
      message: 'Moving Average Crossover strategy backtest completed successfully. Total return: +24.7%',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read: false,
      category: 'performance',
      actionUrl: '/backtesting'
    },
    {
      id: '8',
      type: 'info',
      title: 'Compliance Report Generated',
      message: 'Monthly compliance report has been generated and is ready for review.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: false,
      category: 'compliance',
      actionUrl: '/compliance'
    },
    {
      id: '9',
      type: 'success',
      title: 'Strategy Deployed',
      message: 'Epsilon Scalping strategy has been successfully deployed and is now active on 3 exchanges.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      read: true,
      category: 'trading',
      actionUrl: '/strategies'
    },
    {
      id: '10',
      type: 'warning',
      title: 'Network Latency Alert',
      message: 'Average response time to exchanges has increased to 234ms. Monitor network performance.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      read: true,
      category: 'performance',
      actionUrl: '/monitoring'
    }
  ],
  
  incrementCount: () => set((state) => ({ count: state.count + 1 })),
  resetCount: () => set({ count: 0 }),
  
  markAsRead: (id: string) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ),
    count: Math.max(0, state.count - 1)
  })),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    count: 0
  }))
}));