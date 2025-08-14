<template>
  <div id="reports-page">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-text-900 mb-2" data-testid="text-page-title">Performance Reports</h1>
      <p class="text-text-500" data-testid="text-page-description">Analyze your trading performance and operational metrics</p>
    </div>

    <!-- Report Type Selector -->
    <div class="flex space-x-4 mb-6">
      <button 
        class="px-4 py-2 rounded-rugira text-sm font-medium"
        :class="selectedReport === 'performance' ? 'bg-brand-red text-white' : 'bg-gray-200 text-text-700'"
        @click="selectedReport = 'performance'"
        data-testid="button-performance-report"
      >
        Performance Report
      </button>
      <button 
        class="px-4 py-2 rounded-rugira text-sm font-medium"
        :class="selectedReport === 'operational' ? 'bg-brand-red text-white' : 'bg-gray-200 text-text-700'"
        @click="selectedReport = 'operational'"
        data-testid="button-operational-report"
      >
        Operational Report
      </button>
    </div>

    <!-- Performance Report -->
    <div v-if="selectedReport === 'performance'" class="space-y-6">
      <div class="card-rounded">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-text-900" data-testid="text-performance-title">Performance Metrics</h3>
            <button class="btn-secondary text-sm" data-testid="button-export-performance">
              <i class="fas fa-download mr-2"></i>
              Export CSV
            </button>
          </div>
        </div>
        <div class="p-12 text-center text-text-500" data-testid="empty-performance">
          <i class="fas fa-chart-pie text-2xl mb-2"></i>
          <p>No performance data available</p>
          <p class="text-xs">ROI, Sharpe ratio, max drawdown, and win rate will be displayed here</p>
        </div>
      </div>
    </div>

    <!-- Operational Report -->
    <div v-if="selectedReport === 'operational'" class="space-y-6">
      <div class="card-rounded">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-text-900" data-testid="text-operational-title">Operational Metrics</h3>
            <button class="btn-secondary text-sm" data-testid="button-export-operational">
              <i class="fas fa-download mr-2"></i>
              Export CSV
            </button>
          </div>
        </div>
        <div class="p-12 text-center text-text-500" data-testid="empty-operational">
          <i class="fas fa-tachometer-alt text-2xl mb-2"></i>
          <p>No operational data available</p>
          <p class="text-xs">Order success rate, latency p95, and error rates will be displayed here</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedReport = ref('performance')
</script>
