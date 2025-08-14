<template>
  <div id="overview-page">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-text-900 mb-2" data-testid="text-page-title">Trading Overview</h1>
      <p class="text-text-500" data-testid="text-page-description">Monitor your trading performance and bot activity</p>
      <div class="text-sm text-text-500 mt-2">
        <span class="live-pulse">●</span> Live data • Last updated: 
        <span data-testid="text-last-update-time">{{ formatCurrentTime() }}</span>
      </div>
    </div>

    <!-- KPI Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard
        label="Total P/L (24h)"
        :value="4247.32"
        :change="12.5"
        comparison="vs. yesterday"
        icon="chart-line"
        type="currency"
        data-testid="kpi-pnl"
      />
      <KPICard
        label="Active Bots"
        :value="botsStore.activeBotCount"
        comparison="All systems operational"
        icon="robot"
        type="number"
        data-testid="kpi-active-bots"
      />
      <KPICard
        label="Order Success Rate"
        :value="98.7"
        comparison="247/250 orders filled"
        icon="check-circle"
        type="percentage"
        data-testid="kpi-success-rate"
      />
      <KPICard
        label="P95 Latency"
        :value="125"
        comparison="Within SLA targets"
        icon="tachometer-alt"
        type="time"
        data-testid="kpi-latency"
      />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <EquityChart />
      <DrawdownChart />
    </div>

    <!-- Live Activity Feed -->
    <div class="card-rounded">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-text-900" data-testid="text-feed-title">Live Activity Feed</h3>
          <div class="flex items-center space-x-2 text-sm text-text-500">
            <span class="live-pulse">●</span>
            <span data-testid="text-auto-refresh">Auto-refreshing</span>
          </div>
        </div>
      </div>
      <div class="max-h-96 overflow-y-auto">
        <div 
          v-if="activityStore.isLoading" 
          class="px-6 py-12 text-center text-text-500"
          data-testid="loading-activities"
        >
          <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
          <p>Loading activities...</p>
        </div>
        <div 
          v-else-if="activityStore.activities.length === 0" 
          class="px-6 py-12 text-center text-text-500"
          data-testid="empty-activities"
        >
          <i class="fas fa-inbox text-2xl mb-2"></i>
          <p>No recent activities</p>
        </div>
        <div 
          v-for="(activity, index) in activityStore.activities" 
          :key="index"
          class="table-row px-6 py-3 border-b border-gray-100 last:border-b-0"
          :data-testid="`activity-${index}`"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <StatusIndicator :status="activity.type" />
              <div>
                <p class="text-sm font-medium text-text-900" data-testid="text-activity-message">
                  {{ activity.message }}
                </p>
                <p class="text-xs text-text-500" data-testid="text-activity-details">
                  {{ activity.details }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p 
                class="text-sm font-medium"
                :class="activity.pnl >= 0 ? 'text-brand-green' : 'text-brand-red'"
                data-testid="text-activity-pnl"
              >
                {{ formatPnL(activity.pnl) }}
              </p>
              <p class="text-xs text-text-500" data-testid="text-activity-timestamp">
                {{ formatTimestamp(activity.timestamp) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useBotsStore, useKPIStore, useActivityStore } from '../stores'
import KPICard from '../components/UI/KPICard.vue'
import StatusIndicator from '../components/UI/StatusIndicator.vue'
import EquityChart from '../components/Charts/EquityChart.vue'
import DrawdownChart from '../components/Charts/DrawdownChart.vue'

const botsStore = useBotsStore()
const kpiStore = useKPIStore()
const activityStore = useActivityStore()

const currentTime = ref(new Date())

onMounted(() => {
  // Fetch initial data
  botsStore.fetchBots()
  kpiStore.fetchKPIs()
  activityStore.fetchActivities()
  
  // Update current time every 5 seconds
  setInterval(() => {
    currentTime.value = new Date()
  }, 5000)
})

const formatCurrentTime = () => {
  return currentTime.value.toLocaleTimeString('en-US', { 
    timeZone: 'UTC', 
    hour12: false 
  }) + ' UTC'
}

const formatPnL = (pnl: number) => {
  if (pnl === 0) return '$0.00'
  const sign = pnl >= 0 ? '+' : ''
  return `${sign}$${Math.abs(pnl).toFixed(2)}`
}

const formatTimestamp = (timestamp: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - timestamp.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`
  return `${Math.floor(diffMinutes / 60)} hours ago`
}
</script>
