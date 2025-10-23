<template>
  <div id="strategies-page">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-text-900 mb-2" data-testid="text-page-title">Trading Strategies</h1>
      <p class="text-text-500" data-testid="text-page-description">Manage strategy templates and parameter profiles</p>
    </div>

    <!-- Strategy Templates Gallery -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div
        v-for="strategy in strategies"
        :key="strategy.id"
        class="card-rounded p-6"
        :data-testid="`card-strategy-${strategy.slug}`"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="feature-icon">
            <i :class="getIconClass(strategy)"></i>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <span
              v-if="strategy.tags.includes('AI')"
              class="text-xs bg-purple-600 text-white px-2 py-1 rounded-full"
            >
              AI
            </span>
            <span
              v-if="strategy.tags.includes('Overlay')"
              class="text-xs bg-slate-600 text-white px-2 py-1 rounded-full"
            >
              Overlay
            </span>
            <span class="text-xs bg-brand-green text-white px-2 py-1 rounded-full">
              {{ getStatusLabel(strategy) }}
            </span>
          </div>
        </div>
        <h3 class="text-xl font-bold text-text-900 mb-2" data-testid="text-strategy-title">
          {{ strategy.name }}
        </h3>
        <p class="text-text-500 mb-4 leading-relaxed" data-testid="text-strategy-description">
          {{ strategy.description }}
        </p>
        <div class="space-y-2 mb-4 text-sm">
          <div class="flex justify-between">
            <span class="text-text-500">Timeframe:</span>
            <span class="text-text-900">{{ strategy.timeframe }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-500">Risk Level:</span>
            <span class="text-text-900">{{ getRiskLabel(strategy) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-500">Market Conditions:</span>
            <span class="text-text-900">
              {{ strategy.marketConditions.map(capitalize).join(', ') }}
            </span>
          </div>
          <div>
            <span class="text-text-500 block">Best for:</span>
            <span class="text-text-900">{{ strategy.bestFor }}</span>
          </div>
        </div>
        <div class="space-y-3 mb-4 text-sm">
          <div>
            <span class="font-semibold text-brand-green block">Advantages</span>
            <ul class="mt-1 space-y-1 text-text-600">
              <li
                v-for="(advantage, index) in strategy.advantages"
                :key="`adv-${strategy.id}-${index}`"
                class="flex items-start gap-2"
              >
                <span class="text-brand-green">•</span>
                <span>{{ advantage }}</span>
              </li>
            </ul>
          </div>
          <div>
            <span class="font-semibold text-brand-red block">Considerations</span>
            <ul class="mt-1 space-y-1 text-text-600">
              <li
                v-for="(consideration, index) in strategy.considerations"
                :key="`con-${strategy.id}-${index}`"
                class="flex items-start gap-2"
              >
                <span class="text-brand-red">•</span>
                <span>{{ consideration }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="flex space-x-2">
          <button class="btn-primary flex-1" type="button">
            <i class="fas fa-edit mr-2"></i>
            Edit Parameters
          </button>
          <button class="btn-secondary" type="button">
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
import { mockStrategies, type MockStrategy } from '@shared/mockData';

const strategies = mockStrategies;

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const getRiskLabel = (strategy: MockStrategy) =>
  strategy.riskLabel ?? `${capitalize(strategy.risk)} Risk`;

const getStatusLabel = (strategy: MockStrategy) => capitalize(strategy.status);

const getIconClass = (strategy: MockStrategy) => {
  if (strategy.tags.includes('AI')) {
    return 'fas fa-robot';
  }
  if (strategy.tags.includes('Overlay')) {
    return 'fas fa-layer-group';
  }
  switch (strategy.type) {
    case 'arbitrage':
      return 'fas fa-exchange-alt';
    case 'grid':
      return 'fas fa-border-all';
    case 'momentum':
      return 'fas fa-bolt';
    case 'mean-reversion':
      return 'fas fa-wave-square';
    case 'dca':
      return 'fas fa-calendar-alt';
    case 'trend':
    case 'trend-following':
      return 'fas fa-chart-line';
    case 'market-making':
      return 'fas fa-sliders-h';
    case 'pairs':
      return 'fas fa-link';
    case 'breakout':
      return 'fas fa-bullseye';
    case 'scalping':
      return 'fas fa-stopwatch';
    case 'swing':
      return 'fas fa-sync-alt';
    default:
      return 'fas fa-chart-line';
  }
};
</script>
