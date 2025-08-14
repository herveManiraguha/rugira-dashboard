<template>
  <div class="card-rounded p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-text-900" data-testid="text-chart-title">Drawdown Analysis</h3>
      <span class="text-sm text-text-500" data-testid="text-max-drawdown">Max: {{ maxDrawdown }}%</span>
    </div>
    <div class="h-64 bg-bg-1 rounded-rugira flex items-center justify-center text-text-500" data-testid="chart-placeholder">
      <div class="text-center">
        <i class="fas fa-chart-line text-4xl mb-2"></i>
        <p>Drawdown chart</p>
        <p class="text-xs">Chart.js integration needed</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const maxDrawdown = ref(-2.1)

// TODO: Implement Chart.js integration
// This would typically use Chart.js or another charting library
// to display the actual drawdown data
</script>
