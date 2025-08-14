<template>
  <div id="monitoring-page">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-text-900 mb-2" data-testid="text-page-title">System Monitoring</h1>
      <p class="text-text-500" data-testid="text-page-description">Monitor system health and performance metrics</p>
    </div>

    <!-- Health Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card-rounded p-6 text-center" data-testid="card-api-health">
        <StatusIndicator status="online" class="mx-auto mb-3" />
        <h3 class="text-lg font-semibold text-text-900 mb-1">API Services</h3>
        <p class="text-sm text-brand-green">Operational</p>
      </div>
      <div class="card-rounded p-6 text-center" data-testid="card-orchestrator-health">
        <StatusIndicator status="online" class="mx-auto mb-3" />
        <h3 class="text-lg font-semibold text-text-900 mb-1">Orchestrator</h3>
        <p class="text-sm text-brand-green">Operational</p>
      </div>
      <div class="card-rounded p-6 text-center" data-testid="card-database-health">
        <StatusIndicator status="online" class="mx-auto mb-3" />
        <h3 class="text-lg font-semibold text-text-900 mb-1">Database</h3>
        <p class="text-sm text-brand-green">Operational</p>
      </div>
    </div>

    <!-- Alerts Snapshot -->
    <div class="card-rounded mb-8">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-text-900" data-testid="text-alerts-title">System Alerts</h3>
      </div>
      <div class="p-12 text-center text-text-500" data-testid="empty-alerts">
        <i class="fas fa-bell text-2xl mb-2"></i>
        <p>No system alerts</p>
        <p class="text-xs">Latency SLO breaches and error spikes will appear here</p>
      </div>
    </div>

    <!-- Log Search -->
    <div class="card-rounded">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-text-900" data-testid="text-logs-title">System Logs</h3>
          <div class="flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Filter by request ID..."
              class="border border-gray-300 rounded-rugira px-3 py-1 text-sm focus:border-brand-red"
              data-testid="input-log-filter"
            />
            <button class="btn-secondary text-sm" data-testid="button-search-logs">
              <i class="fas fa-search mr-1"></i>
              Search
            </button>
          </div>
        </div>
      </div>
      <div class="p-12 text-center text-text-500" data-testid="empty-logs">
        <i class="fas fa-file-alt text-2xl mb-2"></i>
        <p>No logs available</p>
        <p class="text-xs">System logs will be displayed here when available</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusIndicator from '../components/UI/StatusIndicator.vue'
</script>
