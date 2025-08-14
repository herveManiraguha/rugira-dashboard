<template>
  <div id="backtesting-page">
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-3xl font-bold text-text-900 mb-2" data-testid="text-page-title">Backtesting</h1>
          <p class="text-text-500" data-testid="text-page-description">Test your strategies against historical data</p>
        </div>
        <button class="btn-primary" data-testid="button-new-backtest">
          <i class="fas fa-play mr-2"></i>
          New Backtest
        </button>
      </div>
    </div>

    <!-- Backtest Results -->
    <div class="card-rounded">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-text-900" data-testid="text-results-title">Backtest Results</h3>
      </div>
      <div class="overflow-x-auto">
        <div class="p-12 text-center text-text-500" data-testid="empty-backtests">
          <i class="fas fa-flask text-2xl mb-2"></i>
          <p>No backtest results yet</p>
          <p class="text-xs">Run your first backtest to see results here</p>
          <button class="btn-primary mt-4" data-testid="button-start-backtest">
            <i class="fas fa-play mr-2"></i>
            Start Your First Backtest
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Backtesting functionality would be implemented here
</script>
