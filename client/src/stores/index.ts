import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Bot, KPI, ActivityFeed, NotificationCount } from '../types'
import { api } from '../services/api'

export const useApiStore = defineStore('api', () => {
  const isConnected = ref(false)
  const lastUpdate = ref<Date | null>(null)
  
  const connectionStatus = computed(() => isConnected.value ? 'connected' : 'disconnected')
  const connectionClass = computed(() => isConnected.value ? 'status-online' : 'status-error')
  
  const checkConnection = async () => {
    try {
      await api.get('/health')
      isConnected.value = true
      lastUpdate.value = new Date()
    } catch (error) {
      isConnected.value = false
      console.error('API connection failed:', error)
    }
  }
  
  return {
    isConnected,
    lastUpdate,
    connectionStatus,
    connectionClass,
    checkConnection
  }
})

export const useBotsStore = defineStore('bots', () => {
  const bots = ref<Bot[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const activeBots = computed(() => bots.value.filter(bot => bot.status === 'running'))
  const botCount = computed(() => bots.value.length)
  const activeBotCount = computed(() => activeBots.value.length)
  
  const fetchBots = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get('/bots')
      bots.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch bots'
      console.error('Error fetching bots:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const startBot = async (botId: string) => {
    try {
      await api.post(`/bots/${botId}/start`)
      await fetchBots() // Refresh data
    } catch (err) {
      error.value = 'Failed to start bot'
      console.error('Error starting bot:', err)
    }
  }
  
  const stopBot = async (botId: string) => {
    try {
      await api.post(`/bots/${botId}/stop`)
      await fetchBots() // Refresh data
    } catch (err) {
      error.value = 'Failed to stop bot'
      console.error('Error stopping bot:', err)
    }
  }
  
  const createBot = async (botData: Partial<Bot>) => {
    try {
      await api.post('/bots', botData)
      await fetchBots() // Refresh data
    } catch (err) {
      error.value = 'Failed to create bot'
      console.error('Error creating bot:', err)
      throw err
    }
  }
  
  return {
    bots,
    isLoading,
    error,
    activeBots,
    botCount,
    activeBotCount,
    fetchBots,
    startBot,
    stopBot,
    createBot
  }
})

export const useKPIStore = defineStore('kpi', () => {
  const kpis = ref<KPI[]>([])
  const isLoading = ref(false)
  
  const fetchKPIs = async () => {
    isLoading.value = true
    try {
      const response = await api.get('/kpis')
      kpis.value = response.data
    } catch (err) {
      console.error('Error fetching KPIs:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    kpis,
    isLoading,
    fetchKPIs
  }
})

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<ActivityFeed[]>([])
  const isLoading = ref(false)
  
  const fetchActivities = async () => {
    isLoading.value = true
    try {
      const response = await api.get('/activities')
      activities.value = response.data
    } catch (err) {
      console.error('Error fetching activities:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const addActivity = (activity: ActivityFeed) => {
    activities.value.unshift(activity)
    // Keep only last 50 activities
    if (activities.value.length > 50) {
      activities.value = activities.value.slice(0, 50)
    }
  }
  
  return {
    activities,
    isLoading,
    fetchActivities,
    addActivity
  }
})

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

export const useNotificationStore = defineStore('notifications', () => {
  const count = ref(8)
  const notifications = ref<Notification[]>([
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
      message: 'Beta Grid bot has achieved +15% profit target on ETH/USDT pair. Total profit: $2,347.89',
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
    }
  ])
  
  const incrementCount = () => {
    count.value++
  }
  
  const resetCount = () => {
    count.value = 0
  }
  
  const markAsRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification && !notification.read) {
      notification.read = true
      count.value = Math.max(0, count.value - 1)
    }
  }
  
  const markAllAsRead = () => {
    notifications.value.forEach(n => n.read = true)
    count.value = 0
  }
  
  return {
    count,
    notifications,
    incrementCount,
    resetCount,
    markAsRead,
    markAllAsRead
  }
})
