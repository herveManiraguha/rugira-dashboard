<template>
  <div id="admin-page">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-text-900 mb-2" data-testid="text-page-title">Administration</h1>
      <p class="text-text-500" data-testid="text-page-description">Manage users, settings, and system configuration</p>
    </div>

    <!-- Admin Tabs -->
    <div class="flex space-x-4 mb-6">
      <button 
        v-for="tab in tabs"
        :key="tab.value"
        class="px-4 py-2 rounded-rugira text-sm font-medium"
        :class="selectedTab === tab.value ? 'bg-brand-red text-white' : 'bg-gray-200 text-text-700'"
        @click="selectedTab = tab.value"
        :data-testid="`button-tab-${tab.value}`"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Users & Roles -->
    <div v-if="selectedTab === 'users'" class="card-rounded">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-text-900" data-testid="text-users-title">Users & Roles</h3>
          <button class="btn-secondary text-sm" data-testid="button-invite-user">
            <i class="fas fa-user-plus mr-2"></i>
            Invite User
          </button>
        </div>
      </div>
      <div class="p-12 text-center text-text-500" data-testid="empty-users">
        <i class="fas fa-users text-2xl mb-2"></i>
        <p>No users configured</p>
        <p class="text-xs">Invite users and assign Admin/Trader/ReadOnly roles</p>
      </div>
    </div>

    <!-- Branding -->
    <div v-if="selectedTab === 'branding'" class="card-rounded">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-text-900" data-testid="text-branding-title">Branding Settings</h3>
      </div>
      <div class="p-6">
        <div class="space-y-4 max-w-md">
          <div>
            <label class="block text-sm font-medium text-text-700 mb-2" data-testid="label-company-name">
              Company Name
            </label>
            <input 
              type="text" 
              class="w-full border border-gray-300 rounded-rugira px-3 py-2 focus:border-brand-red"
              placeholder="Your Company Name"
              data-testid="input-company-name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-text-700 mb-2" data-testid="label-logo">
              Logo Upload
            </label>
            <input 
              type="file" 
              accept="image/*"
              class="w-full border border-gray-300 rounded-rugira px-3 py-2 focus:border-brand-red"
              data-testid="input-logo"
            />
          </div>
          <button class="btn-primary" data-testid="button-save-branding">
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- Notifications -->
    <div v-if="selectedTab === 'notifications'" class="card-rounded">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-text-900" data-testid="text-notifications-title">Notification Settings</h3>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium text-text-900">Email Notifications</h4>
              <p class="text-sm text-text-500">Receive alerts via email</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" data-testid="toggle-email">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-red peer-focus:ring-opacity-25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium text-text-900">Webhook Notifications</h4>
              <p class="text-sm text-text-500">Send alerts to webhook URL</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" data-testid="toggle-webhook">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-red peer-focus:ring-opacity-25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Feature Flags -->
    <div v-if="selectedTab === 'features'" class="card-rounded">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-text-900" data-testid="text-features-title">Feature Flags & Kill Switch</h3>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div class="p-4 bg-bg-rose border border-brand-red border-opacity-20 rounded-rugira">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium text-text-900">Global Kill Switch</h4>
                <p class="text-sm text-text-500">Emergency stop for all trading operations</p>
              </div>
              <button 
                class="btn-secondary border-2 border-brand-red text-brand-red font-semibold"
                disabled
                data-testid="button-kill-switch-placeholder"
              >
                <i class="fas fa-stop-circle mr-2"></i>
                Kill Switch (API Required)
              </button>
            </div>
          </div>
          <div class="text-sm text-text-500">
            <p>Feature flags and kill switch controls will be available when API integration is complete.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedTab = ref('users')
const tabs = [
  { label: 'Users & Roles', value: 'users' },
  { label: 'Branding', value: 'branding' },
  { label: 'Notifications', value: 'notifications' },
  { label: 'Feature Flags', value: 'features' }
]
</script>
