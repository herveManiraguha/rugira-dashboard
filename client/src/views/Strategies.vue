<template>
  <div id="strategies-page">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-text-900 mb-2" data-testid="text-page-title">Trading Strategies</h1>
      <p class="text-text-500" data-testid="text-page-description">Manage strategy templates and parameter profiles</p>
    </div>

    <!-- Strategy Templates Gallery -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="card-rounded p-6" data-testid="card-strategy-arbitrage">
        <div class="flex items-center justify-between mb-4">
          <div class="feature-icon">
            <i class="fas fa-exchange-alt"></i>
          </div>
          <span class="text-xs bg-brand-green text-white px-2 py-1 rounded-full">Active</span>
        </div>
        <h3 class="text-xl font-bold text-text-900 mb-2" data-testid="text-strategy-title">Arbitrage</h3>
        <p class="text-text-500 mb-4" data-testid="text-strategy-description">
          Profit from price differences across exchanges by buying low on one exchange and selling high on another.
        </p>
        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-text-500">Default Min Spread:</span>
            <span class="text-text-900">0.5%</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-text-500">Max Position Size:</span>
            <span class="text-text-900">10%</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-text-500">Risk Level:</span>
            <span class="text-yellow-600">Medium</span>
          </div>
        </div>
        <div class="flex space-x-2">
          <button class="btn-primary flex-1" data-testid="button-edit-arbitrage">
            <i class="fas fa-edit mr-2"></i>
            Edit Parameters
          </button>
          <button class="btn-secondary" data-testid="button-use-arbitrage">
            Use Template
          </button>
        </div>
      </div>

      <div class="card-rounded p-6" data-testid="card-strategy-ma">
        <div class="flex items-center justify-between mb-4">
          <div class="feature-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <span class="text-xs bg-brand-green text-white px-2 py-1 rounded-full">Active</span>
        </div>
        <h3 class="text-xl font-bold text-text-900 mb-2" data-testid="text-strategy-title">Moving Average Crossover</h3>
        <p class="text-text-500 mb-4" data-testid="text-strategy-description">
          Generate buy/sell signals based on short-term and long-term moving average crossovers.
        </p>
        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-text-500">Short MA Period:</span>
            <span class="text-text-900">20</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-text-500">Long MA Period:</span>
            <span class="text-text-900">50</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-text-500">Risk Level:</span>
            <span class="text-brand-green">Low</span>
          </div>
        </div>
        <div class="flex space-x-2">
          <button class="btn-primary flex-1" data-testid="button-edit-ma">
            <i class="fas fa-edit mr-2"></i>
            Edit Parameters
          </button>
          <button class="btn-secondary" data-testid="button-use-ma">
            Use Template
          </button>
        </div>
      </div>
    </div>

    <!-- Parameter Profiles -->
    <div class="card-rounded">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-text-900" data-testid="text-profiles-title">Saved Parameter Profiles</h3>
          <button class="btn-secondary text-sm" data-testid="button-create-profile">
            <i class="fas fa-plus mr-2"></i>
            Create Profile
          </button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <div class="p-12 text-center text-text-500" data-testid="empty-profiles">
          <i class="fas fa-folder-open text-2xl mb-2"></i>
          <p>No parameter profiles saved yet</p>
          <p class="text-xs">Create a profile to save your custom strategy parameters</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Strategy management functionality would be implemented here
</script>
