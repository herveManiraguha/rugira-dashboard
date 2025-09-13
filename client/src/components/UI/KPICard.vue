<template>
  <div class="kpi-card" data-testid="card-kpi">
    <div class="flex items-center justify-between mb-3">
      <div class="feature-icon">
        <i :class="iconClass"></i>
      </div>
      <span 
        class="text-xs font-medium"
        :class="changeClass"
        data-testid="text-kpi-change"
      >
        {{ formattedChange }}
      </span>
    </div>
    <h3 class="text-sm font-medium text-text-500 mb-1" data-testid="text-kpi-label">
      {{ label }}
    </h3>
    <p class="text-2xl font-bold text-text-900" data-testid="text-kpi-value">
      {{ formattedValue }}
    </p>
    <div class="mt-2 text-xs text-text-500" data-testid="text-kpi-comparison">
      {{ comparison }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  value: number | string
  change?: number
  comparison: string
  icon: string
  type?: 'currency' | 'percentage' | 'number' | 'time'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'number'
})

const iconClass = computed(() => `fas fa-${props.icon}`)

const formattedValue = computed(() => {
  if (typeof props.value === 'string') return props.value
  
  switch (props.type) {
    case 'currency':
      return new Intl.NumberFormat('de-CH', {
        style: 'currency',
        currency: 'CHF'
      }).format(props.value as number)
    case 'percentage':
      return `${props.value}%`
    case 'time':
      return `${props.value}ms`
    default:
      return props.value.toString()
  }
})

const formattedChange = computed(() => {
  if (props.change === undefined) return ''
  const sign = props.change >= 0 ? '+' : ''
  return props.type === 'percentage' ? `${sign}${props.change}%` : `${sign}${props.change}`
})

const changeClass = computed(() => {
  if (props.change === undefined) return 'text-text-500'
  return props.change >= 0 ? 'text-brand-green' : 'text-brand-red'
})
</script>
