<template>
  <div 
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    data-testid="modal-create-bot"
  >
    <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-text-900" data-testid="text-modal-title">Create Trading Bot</h2>
          <button 
            class="text-text-500 hover:text-text-700"
            @click="closeModal"
            data-testid="button-close-modal"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Bot Configuration -->
          <div>
            <label class="block text-sm font-medium text-text-700 mb-2" data-testid="label-bot-name">
              Bot Name
            </label>
            <input 
              type="text" 
              class="w-full border border-gray-300 rounded-rugira px-3 py-2 focus:border-brand-red focus:ring-2 focus:ring-brand-red focus:ring-opacity-20" 
              placeholder="Enter bot name"
              v-model="form.name"
              data-testid="input-bot-name"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text-700 mb-2" data-testid="label-exchange">
                Exchange
              </label>
              <select 
                class="w-full border border-gray-300 rounded-rugira px-3 py-2 focus:border-brand-red"
                v-model="form.exchange"
                data-testid="select-exchange"
                required
              >
                <option value="">Select Exchange</option>
                <option value="binance">Binance</option>
                <option value="coinbase">Coinbase</option>
                <option value="kraken">Kraken</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-text-700 mb-2" data-testid="label-trading-pair">
                Trading Pair
              </label>
              <select 
                class="w-full border border-gray-300 rounded-rugira px-3 py-2 focus:border-brand-red"
                v-model="form.tradingPair"
                data-testid="select-trading-pair"
                required
              >
                <option value="">Select Pair</option>
                <option value="BTC-USDT">BTC-USDT</option>
                <option value="ETH-USDT">ETH-USDT</option>
                <option value="SOL-USDT">SOL-USDT</option>
              </select>
            </div>
          </div>

          <!-- Strategy Selection -->
          <div>
            <label class="block text-sm font-medium text-text-700 mb-3" data-testid="label-strategy">
              Strategy Template
            </label>
            <div class="grid grid-cols-1 gap-3">
              <label 
                class="flex items-center p-3 border border-gray-200 rounded-rugira cursor-pointer hover:border-brand-red"
                :class="{ 'border-brand-red': form.strategy === 'arbitrage' }"
                data-testid="option-strategy-arbitrage"
              >
                <input 
                  type="radio" 
                  name="strategy" 
                  value="arbitrage"
                  class="text-brand-red focus:ring-brand-red"
                  v-model="form.strategy"
                />
                <div class="ml-3">
                  <div class="font-medium text-text-900">Arbitrage</div>
                  <div class="text-sm text-text-500">Profit from price differences across exchanges</div>
                </div>
              </label>
              <label 
                class="flex items-center p-3 border border-gray-200 rounded-rugira cursor-pointer hover:border-brand-red"
                :class="{ 'border-brand-red': form.strategy === 'ma_crossover' }"
                data-testid="option-strategy-ma"
              >
                <input 
                  type="radio" 
                  name="strategy" 
                  value="ma_crossover"
                  class="text-brand-red focus:ring-brand-red"
                  v-model="form.strategy"
                />
                <div class="ml-3">
                  <div class="font-medium text-text-900">Moving Average Crossover</div>
                  <div class="text-sm text-text-500">Trade based on moving average signals</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Risk Policy -->
          <div>
            <label class="block text-sm font-medium text-text-700 mb-3" data-testid="label-risk-policy">
              Risk Policy
            </label>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-text-500 mb-1" data-testid="label-max-position">
                  Max Position Size (%)
                </label>
                <input 
                  type="number" 
                  class="w-full border border-gray-300 rounded-rugira px-3 py-2 focus:border-brand-red"
                  v-model.number="form.maxPositionSize"
                  data-testid="input-max-position"
                  min="1" 
                  max="100"
                />
              </div>
              <div>
                <label class="block text-xs text-text-500 mb-1" data-testid="label-stop-loss">
                  Stop Loss (%)
                </label>
                <input 
                  type="number" 
                  class="w-full border border-gray-300 rounded-rugira px-3 py-2 focus:border-brand-red"
                  v-model.number="form.stopLoss"
                  data-testid="input-stop-loss"
                  min="1" 
                  max="50"
                />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button 
              type="button" 
              class="btn-secondary"
              @click="closeModal"
              data-testid="button-cancel"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="isSubmitting"
              data-testid="button-create"
            >
              <span v-if="isSubmitting">Creating...</span>
              <span v-else>Create Bot</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useBotsStore } from '../../stores'

const botsStore = useBotsStore()

const showModal = ref(false)
const isSubmitting = ref(false)

const form = reactive({
  name: '',
  exchange: '',
  tradingPair: '',
  strategy: '',
  maxPositionSize: 10,
  stopLoss: 5
})

const openModal = () => {
  showModal.value = true
  resetForm()
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  form.name = ''
  form.exchange = ''
  form.tradingPair = ''
  form.strategy = ''
  form.maxPositionSize = 10
  form.stopLoss = 5
}

const handleSubmit = async () => {
  if (isSubmitting.value) return
  
  try {
    isSubmitting.value = true
    
    await botsStore.createBot({
      name: form.name,
      exchange: form.exchange,
      tradingPair: form.tradingPair,
      strategy: form.strategy,
      riskPolicy: {
        maxPositionSize: form.maxPositionSize,
        stopLoss: form.stopLoss
      },
      status: 'stopped'
    })
    
    closeModal()
  } catch (error) {
    console.error('Failed to create bot:', error)
    alert('Failed to create bot. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Global event listener for opening modal
window.addEventListener('openCreateBotModal', openModal)

// Expose methods for parent components
defineExpose({
  openModal,
  closeModal
})
</script>
