<template>
  <header class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Tenant Switcher -->
      <div class="flex items-center space-x-4">
        <select 
          class="border border-gray-300 rounded-rugira px-3 py-2 text-sm bg-white focus:border-brand-red focus:ring-2 focus:ring-brand-red focus:ring-opacity-20"
          data-testid="select-tenant"
        >
          <option>Acme Trading LLC</option>
          <option>Demo Account</option>
        </select>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-green text-white">
          <StatusIndicator status="online" class="mr-1" />
          LIVE
        </span>
      </div>

      <!-- Top Bar Actions -->
      <div class="flex items-center space-x-4">
        <!-- Notifications -->
        <button 
          class="relative p-2 text-text-500 hover:text-brand-red transition-colors" 
          @click="showNotifications"
          data-testid="button-notifications"
        >
          <i class="fas fa-bell text-lg"></i>
          <span 
            v-if="notificationStore.count > 0"
            class="absolute -top-1 -right-1 bg-brand-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            data-testid="text-notification-count"
          >
            {{ notificationStore.count }}
          </span>
        </button>

        <!-- Kill Switch -->
        <button 
          class="btn-secondary text-xs px-3 py-1.5 border-2 border-brand-red"
          @click="emergencyStop"
          data-testid="button-kill-switch"
          :disabled="!apiStore.isConnected"
        >
          <i class="fas fa-stop-circle mr-1"></i>
          Kill Switch
        </button>

        <!-- User Menu -->
        <div class="relative">
          <button 
            class="flex items-center space-x-2 text-sm"
            @click="toggleUserMenu"
            data-testid="button-user-menu"
          >
            <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <i class="fas fa-user text-text-500"></i>
            </div>
            <span data-testid="text-user-name">{{ currentUser.name }}</span>
            <i class="fas fa-chevron-down text-xs"></i>
          </button>
          
          <!-- User dropdown would go here -->
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNotificationStore, useApiStore } from '../../stores'
import StatusIndicator from '../UI/StatusIndicator.vue'

const notificationStore = useNotificationStore()
const apiStore = useApiStore()

const currentUser = ref({ name: 'John Trader' })
const showUserMenu = ref(false)

const showNotifications = () => {
  // Implement notification panel
  notificationStore.resetCount()
}

const emergencyStop = () => {
  if (!confirm('Are you sure you want to activate the emergency stop? This will halt all trading operations.')) {
    return
  }
  
  // Call emergency stop API
  alert('Emergency stop activated. All bots have been halted.')
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}
</script>
