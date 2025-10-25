<template>
  <aside class="w-64 bg-white border-r border-gray-200 fixed h-full z-30 overflow-y-auto">
    <!-- Brand Header -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center">
          <i class="fas fa-chart-line text-white text-sm"></i>
        </div>
        <div>
          <h2 class="text-lg font-bold text-text-900">Rugira</h2>
          <p class="text-xs text-text-500">Trading Dashboard</p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="p-4">
      <ul class="space-y-2">
        <!-- Overview -->
        <li>
          <router-link
            to="/"
            class="nav-item flex items-center space-x-3 px-3 py-2 text-sm"
            :class="{ 'active': $route.name === 'overview' }"
            data-testid="nav-overview"
          >
            <i class="fas fa-chart-area w-5"></i>
            <span>Overview</span>
          </router-link>
        </li>

        <!-- Build Group -->
        <li class="pt-4">
          <div class="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Build
          </div>
        </li>
        <li>
          <router-link
            to="/exchanges"
            class="nav-item flex items-center space-x-3 px-3 py-2 text-sm"
            :class="{ 'active': $route.name === 'exchanges' }"
            data-testid="nav-exchanges"
          >
            <i class="fas fa-building w-5"></i>
            <span>Exchanges</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/strategies"
            class="nav-item flex items-center space-x-3 px-3 py-2 text-sm"
            :class="{ 'active': $route.name === 'strategies' }"
            data-testid="nav-strategies"
          >
            <i class="fas fa-brain w-5"></i>
            <span>Strategies</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/backtesting"
            class="nav-item flex items-center space-x-3 px-3 py-2 text-sm"
            :class="{ 'active': $route.name === 'backtesting' }"
            data-testid="nav-backtesting"
          >
            <i class="fas fa-flask w-5"></i>
            <span>Backtesting</span>
          </router-link>
        </li>

        <!-- Run Group -->
        <li class="pt-4">
          <div class="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Run
          </div>
        </li>
        <li>
          <router-link
            to="/bots"
            class="nav-item flex items-center space-x-3 px-3 py-2 text-sm"
            :class="{ 'active': $route.name === 'bots' }"
            data-testid="nav-bots"
          >
            <i class="fas fa-robot w-5"></i>
            <span>Trading</span>
            <span 
              v-if="activeBotCount > 0" 
              class="ml-auto bg-brand-red text-white text-xs px-2 py-0.5 rounded-full"
              data-testid="text-active-bot-count"
            >
              {{ activeBotCount }}
            </span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/monitoring"
            class="nav-item flex items-center space-x-3 px-3 py-2 text-sm"
            :class="{ 'active': $route.name === 'monitoring' }"
            data-testid="nav-monitoring"
          >
            <i class="fas fa-eye w-5"></i>
            <span>Monitoring</span>
          </router-link>
        </li>

        <!-- Govern Group -->
        <li class="pt-4">
          <div class="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Govern
          </div>
        </li>
        <li>
          <router-link
            to="/reports"
            class="nav-item flex items-center space-x-3 px-3 py-2 text-sm"
            :class="{ 'active': $route.name === 'reports' }"
            data-testid="nav-reports"
          >
            <i class="fas fa-chart-bar w-5"></i>
            <span>Reports</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/compliance"
            class="nav-item flex items-center space-x-3 px-3 py-2 text-sm"
            :class="{ 'active': $route.name === 'compliance' }"
            data-testid="nav-compliance"
          >
            <i class="fas fa-shield-alt w-5"></i>
            <span>Compliance</span>
            <span 
              v-if="complianceAlerts > 0"
              class="ml-auto bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full"
              data-testid="text-compliance-alerts"
            >
              {{ complianceAlerts }}
            </span>
          </router-link>
        </li>

        <!-- System Group -->
        <li class="pt-4">
          <div class="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            System
          </div>
        </li>
        <li>
          <router-link
            to="/admin"
            class="nav-item flex items-center space-x-3 px-3 py-2 text-sm"
            :class="{ 'active': $route.name === 'admin' }"
            data-testid="nav-admin"
          >
            <i class="fas fa-cog w-5"></i>
            <span>Admin</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/help"
            class="nav-item flex items-center space-x-3 px-3 py-2 text-sm"
            :class="{ 'active': $route.name === 'help' }"
            data-testid="nav-help"
          >
            <i class="fas fa-question-circle w-5"></i>
            <span>Help</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Connection Status -->
    <div class="p-4 mt-auto border-t border-gray-200">
      <div class="flex items-center space-x-2 text-xs text-text-500">
        <StatusIndicator :status="apiStore.connectionStatus" />
        <span data-testid="text-api-status">
          API {{ apiStore.isConnected ? 'Connected' : 'Disconnected' }}
        </span>
      </div>
      <div v-if="apiStore.lastUpdate" class="text-xs text-text-500 mt-1" data-testid="text-last-update">
        Last update: {{ formatLastUpdate(apiStore.lastUpdate) }}
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBotsStore, useApiStore } from '../../stores'
import StatusIndicator from '../UI/StatusIndicator.vue'

const botsStore = useBotsStore()
const apiStore = useApiStore()

const activeBotCount = computed(() => botsStore.activeBotCount)
const complianceAlerts = computed(() => 2) // This would come from compliance store

const formatLastUpdate = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  
  if (diffSeconds < 60) return `${diffSeconds} seconds ago`
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`
  return `${Math.floor(diffSeconds / 3600)} hours ago`
}
</script>
