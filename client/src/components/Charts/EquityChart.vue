<template>
  <div class="card-rounded p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-text-900" data-testid="text-chart-title">Equity Curve</h3>
      <div class="flex space-x-2">
        <button 
          v-for="period in periods"
          :key="period.value"
          class="text-xs px-3 py-1 rounded-rugira"
          :class="selectedPeriod === period.value ? 'bg-brand-red text-white' : 'text-text-500 hover:bg-gray-100'"
          @click="selectedPeriod = period.value"
          :data-testid="`button-period-${period.value}`"
        >
          {{ period.label }}
        </button>
      </div>
    </div>
    <div class="h-64 bg-bg-1 rounded-rugira flex items-center justify-center text-text-500" data-testid="chart-placeholder">
      <div class="text-center">
        <i class="fas fa-chart-area text-4xl mb-2"></i>
        <p>Equity curve chart</p>
        <p class="text-xs">Chart.js integration needed</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedPeriod = ref('1D')
const periods = [
  { label: '1D', value: '1D' },
  { label: '7D', value: '7D' },
  { label: '30D', value: '30D' }
]

// TODO: Implement Chart.js integration
// This would typically use Chart.js or another charting library
// to display the actual equity curve data
</script>
