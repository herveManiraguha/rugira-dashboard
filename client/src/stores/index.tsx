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

interface NotificationState {
  count: number;
  notifications: any[];
  incrementCount: () => void;
  resetCount: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  count: 0,
  notifications: [],
  
  incrementCount: () => set((state) => ({ count: state.count + 1 })),
  resetCount: () => set({ count: 0 })
}));