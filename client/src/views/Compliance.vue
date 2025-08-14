<template>
  <div id="compliance-page">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-text-900 mb-2" data-testid="text-page-title">Compliance & Audit</h1>
      <p class="text-text-500" data-testid="text-page-description">Monitor compliance alerts and audit trail</p>
    </div>

    <!-- Alerts Inbox -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="card-rounded">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-text-900" data-testid="text-alerts-title">Active Alerts</h3>
        </div>
        <div class="max-h-80 overflow-y-auto">
          <div class="p-12 text-center text-text-500" data-testid="empty-alerts">
            <i class="fas fa-shield-alt text-2xl mb-2"></i>
            <p>No active compliance alerts</p>
            <p class="text-xs">All systems are compliant</p>
          </div>
        </div>
      </div>

      <!-- Recent Audit Events -->
      <div class="card-rounded">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-text-900" data-testid="text-audit-title">Recent Audit Events</h3>
        </div>
        <div class="max-h-80 overflow-y-auto">
          <div class="p-12 text-center text-text-500" data-testid="empty-audit">
            <i class="fas fa-clipboard-list text-2xl mb-2"></i>
            <p>No recent audit events</p>
            <p class="text-xs">Audit log will appear here</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Full Audit Log -->
    <div class="card-rounded">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-text-900" data-testid="text-audit-log-title">Complete Audit Log</h3>
          <button class="btn-secondary text-sm" data-testid="button-export-audit">
            <i class="fas fa-download mr-2"></i>
            Export CSV
          </button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <div class="p-12 text-center text-text-500" data-testid="empty-audit-log">
          <i class="fas fa-history text-2xl mb-2"></i>
          <p>No audit events recorded</p>
          <p class="text-xs">Logins, config changes, orders, and alerts will be logged here</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Compliance and audit functionality would be implemented here
</script>
