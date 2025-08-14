<template>
  <div id="exchanges-page">
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-3xl font-bold text-text-900 mb-2" data-testid="text-page-title">Exchange Connections</h1>
          <p class="text-text-500" data-testid="text-page-description">Manage your exchange API connections and credentials</p>
        </div>
        <button class="btn-primary" data-testid="button-add-connection">
          <i class="fas fa-plus mr-2"></i>
          Add Connection
        </button>
      </div>
    </div>

    <!-- Exchange Connections List -->
    <div class="card-rounded">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-text-900" data-testid="text-connections-title">Active Connections</h3>
      </div>
      <div class="overflow-x-auto">
        <div class="p-12 text-center text-text-500" data-testid="empty-connections">
          <i class="fas fa-plug text-2xl mb-2"></i>
          <p>No exchange connections configured</p>
          <p class="text-xs">Add your first exchange connection to start trading</p>
          <div class="mt-4 text-xs text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-rugira p-3 max-w-md mx-auto">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            Remember: Only use trade-only API keys for security
          </div>
        </div>
      </div>
    </div>

    <!-- Paper vs Live Badge Info -->
    <div class="mt-6 p-4 bg-bg-rose border border-brand-red border-opacity-20 rounded-rugira" data-testid="info-trading-mode">
      <div class="flex items-center space-x-2">
        <i class="fas fa-info-circle text-brand-red"></i>
        <span class="font-medium text-text-900">Trading Mode Information</span>
      </div>
      <p class="text-sm text-text-700 mt-2">
        Your current environment is set to <strong>LIVE</strong> trading. All API connections will execute real trades with actual funds.
        Ensure your risk management settings are properly configured.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Exchange connection management functionality would be implemented here
</script>
