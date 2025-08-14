<template>
  <div id="bots-page">
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-3xl font-bold text-text-900 mb-2" data-testid="text-page-title">Trading Bots</h1>
          <p class="text-text-500" data-testid="text-page-description">Manage and monitor your automated trading strategies</p>
        </div>
        <button 
          class="btn-primary"
          @click="openCreateBotModal"
          data-testid="button-create-bot"
        >
          <i class="fas fa-plus mr-2"></i>
          Create Bot
        </button>
      </div>

      <!-- Filters -->
      <div class="flex items-center space-x-4 mb-6">
        <select 
          class="border border-gray-300 rounded-rugira px-3 py-2 text-sm bg-white focus:border-brand-red"
          v-model="filters.exchange"
          data-testid="select-filter-exchange"
        >
          <option value="">All Exchanges</option>
          <option value="binance">Binance</option>
          <option value="coinbase">Coinbase</option>
          <option value="kraken">Kraken</option>
        </select>
        <select 
          class="border border-gray-300 rounded-rugira px-3 py-2 text-sm bg-white focus:border-brand-red"
          v-model="filters.status"
          data-testid="select-filter-status"
        >
          <option value="">All Status</option>
          <option value="running">Running</option>
          <option value="stopped">Stopped</option>
          <option value="error">Error</option>
        </select>
        <select 
          class="border border-gray-300 rounded-rugira px-3 py-2 text-sm bg-white focus:border-brand-red"
          v-model="filters.strategy"
          data-testid="select-filter-strategy"
        >
          <option value="">All Strategies</option>
          <option value="arbitrage">Arbitrage</option>
          <option value="ma_crossover">MA Crossover</option>
        </select>
      </div>
    </div>

    <!-- Bots Table -->
    <div class="card-rounded overflow-hidden">
      <div v-if="botsStore.isLoading" class="p-12 text-center" data-testid="loading-bots">
        <i class="fas fa-spinner fa-spin text-2xl text-text-500 mb-2"></i>
        <p class="text-text-500">Loading bots...</p>
      </div>
      <div v-else-if="botsStore.error" class="p-12 text-center" data-testid="error-bots">
        <i class="fas fa-exclamation-triangle text-2xl text-brand-red mb-2"></i>
        <p class="text-brand-red">{{ botsStore.error }}</p>
        <button class="btn-secondary mt-4" @click="botsStore.fetchBots()">
          Try Again
        </button>
      </div>
      <div v-else-if="filteredBots.length === 0" class="p-12 text-center" data-testid="empty-bots">
        <i class="fas fa-robot text-2xl text-text-500 mb-2"></i>
        <p class="text-text-500">No bots found matching your criteria</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-bg-1 border-b border-gray-200">
            <tr>
              <th class="text-left py-3 px-6 text-sm font-semibold text-text-700" data-testid="header-name">Bot Name</th>
              <th class="text-left py-3 px-6 text-sm font-semibold text-text-700" data-testid="header-exchange">Exchange</th>
              <th class="text-left py-3 px-6 text-sm font-semibold text-text-700" data-testid="header-pair">Trading Pair</th>
              <th class="text-left py-3 px-6 text-sm font-semibold text-text-700" data-testid="header-strategy">Strategy</th>
              <th class="text-left py-3 px-6 text-sm font-semibold text-text-700" data-testid="header-status">Status</th>
              <th class="text-left py-3 px-6 text-sm font-semibold text-text-700" data-testid="header-pnl">P/L (24h)</th>
              <th class="text-left py-3 px-6 text-sm font-semibold text-text-700" data-testid="header-heartbeat">Last Heartbeat</th>
              <th class="text-left py-3 px-6 text-sm font-semibold text-text-700" data-testid="header-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="bot in filteredBots" 
              :key="bot.id"
              class="table-row border-b border-gray-100 last:border-b-0"
              :data-testid="`row-bot-${bot.id}`"
            >
              <td class="py-4 px-6">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-brand-red bg-opacity-10 rounded-lg flex items-center justify-center">
                    <i class="fas fa-robot text-brand-red"></i>
                  </div>
                  <span class="font-medium text-text-900" data-testid="text-bot-name">{{ bot.name }}</span>
                </div>
              </td>
              <td class="py-4 px-6 text-text-700" data-testid="text-bot-exchange">{{ bot.exchange }}</td>
              <td class="py-4 px-6 text-text-700" data-testid="text-bot-pair">{{ bot.tradingPair }}</td>
              <td class="py-4 px-6 text-text-700" data-testid="text-bot-strategy">{{ formatStrategy(bot.strategy) }}</td>
              <td class="py-4 px-6">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(bot.status)"
                  data-testid="text-bot-status"
                >
                  <StatusIndicator :status="bot.status" class="mr-1" />
                  {{ formatStatus(bot.status) }}
                </span>
              </td>
              <td class="py-4 px-6">
                <span 
                  class="font-semibold"
                  :class="bot.pnl24h >= 0 ? 'text-brand-green' : 'text-brand-red'"
                  data-testid="text-bot-pnl"
                >
                  {{ formatPnL(bot.pnl24h) }}
                </span>
              </td>
              <td class="py-4 px-6 text-text-500 text-sm" data-testid="text-bot-heartbeat">
                {{ formatHeartbeat(bot.lastHeartbeat) }}
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center space-x-2">
                  <button 
                    v-if="bot.status === 'running'"
                    class="text-brand-red hover:bg-brand-red hover:text-white px-2 py-1 rounded text-sm transition-colors"
                    @click="handleStopBot(bot.id)"
                    data-testid="button-stop-bot"
                  >
                    <i class="fas fa-stop"></i>
                  </button>
                  <button 
                    v-else
                    class="text-brand-green hover:bg-brand-green hover:text-white px-2 py-1 rounded text-sm transition-colors"
                    @click="handleStartBot(bot.id)"
                    data-testid="button-start-bot"
                  >
                    <i class="fas fa-play"></i>
                  </button>
                  <button 
                    class="text-text-500 hover:bg-gray-100 px-2 py-1 rounded text-sm transition-colors"
                    @click="handleViewBot(bot.id)"
                    data-testid="button-view-bot"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, reactive } from 'vue'
import { useBotsStore } from '../stores'
import StatusIndicator from '../components/UI/StatusIndicator.vue'
import type { Bot } from '../types'

const botsStore = useBotsStore()

const filters = reactive({
  exchange: '',
  status: '',
  strategy: ''
})

const filteredBots = computed(() => {
  return botsStore.bots.filter(bot => {
    if (filters.exchange && bot.exchange !== filters.exchange) return false
    if (filters.status && bot.status !== filters.status) return false
    if (filters.strategy && bot.strategy !== filters.strategy) return false
    return true
  })
})

onMounted(() => {
  botsStore.fetchBots()
})

const openCreateBotModal = () => {
  window.dispatchEvent(new Event('openCreateBotModal'))
}

const handleStartBot = async (botId: string) => {
  if (!confirm('Are you sure you want to start this bot?')) return
  await botsStore.startBot(botId)
}

const handleStopBot = async (botId: string) => {
  if (!confirm('Are you sure you want to stop this bot?')) return
  await botsStore.stopBot(botId)
}

const handleViewBot = (botId: string) => {
  // Navigate to bot details view
  console.log('View bot:', botId)
}

const formatStrategy = (strategy: string) => {
  const strategies: Record<string, string> = {
    'arbitrage': 'Arbitrage',
    'ma_crossover': 'MA Crossover'
  }
  return strategies[strategy] || strategy
}

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'running':
      return 'bg-brand-green text-white'
    case 'stopped':
      return 'bg-gray-200 text-text-700'
    case 'error':
      return 'bg-brand-red text-white'
    default:
      return 'bg-gray-200 text-text-700'
  }
}

const formatPnL = (pnl: number) => {
  if (pnl === 0) return '$0.00'
  const sign = pnl >= 0 ? '+' : ''
  return `${sign}$${Math.abs(pnl).toFixed(2)}`
}

const formatHeartbeat = (heartbeat: Date | null) => {
  if (!heartbeat) return '--'
  const now = new Date()
  const diffMs = now.getTime() - heartbeat.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  
  if (diffSeconds < 60) return `${diffSeconds} seconds ago`
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`
  return `${Math.floor(diffSeconds / 3600)} hours ago`
}
</script>
