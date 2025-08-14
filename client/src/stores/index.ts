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

export const useNotificationStore = defineStore('notifications', () => {
  const count = ref(0)
  const notifications = ref<any[]>([])
  
  const incrementCount = () => {
    count.value++
  }
  
  const resetCount = () => {
    count.value = 0
  }
  
  return {
    count,
    notifications,
    incrementCount,
    resetCount
  }
})
