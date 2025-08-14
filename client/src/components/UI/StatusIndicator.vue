<template>
  <span 
    class="status-indicator"
    :class="statusClass"
    data-testid="status-indicator"
  ></span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: 'online' | 'warning' | 'error' | 'offline' | 'connected' | 'disconnected'
}

const props = defineProps<Props>()

const statusClass = computed(() => {
  switch (props.status) {
    case 'online':
    case 'connected':
      return 'status-online'
    case 'warning':
      return 'status-warning'
    case 'error':
    case 'offline':
    case 'disconnected':
      return 'status-error'
    default:
      return 'status-error'
  }
})
</script>
