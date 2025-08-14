<template>
  <div id="help-page">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-text-900 mb-2" data-testid="text-page-title">Help & Support</h1>
      <p class="text-text-500" data-testid="text-page-description">Access documentation, guides, and system status</p>
    </div>

    <!-- Quick Links -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <a 
        href="#" 
        target="_blank"
        class="card-rounded p-6 hover:shadow-lg transition-shadow block text-center"
        data-testid="link-user-guide"
      >
        <div class="feature-icon mx-auto mb-4">
          <i class="fas fa-book"></i>
        </div>
        <h3 class="text-lg font-semibold text-text-900 mb-2">User Guide</h3>
        <p class="text-sm text-text-500">Complete documentation for using the trading dashboard</p>
        <i class="fas fa-external-link-alt text-xs text-text-500 mt-2"></i>
      </a>

      <a 
        href="#" 
        target="_blank"
        class="card-rounded p-6 hover:shadow-lg transition-shadow block text-center"
        data-testid="link-api-docs"
      >
        <div class="feature-icon mx-auto mb-4">
          <i class="fas fa-code"></i>
        </div>
        <h3 class="text-lg font-semibold text-text-900 mb-2">API Documentation</h3>
        <p class="text-sm text-text-500">Technical reference for API endpoints and integration</p>
        <i class="fas fa-external-link-alt text-xs text-text-500 mt-2"></i>
      </a>

      <a 
        href="#" 
        target="_blank"
        class="card-rounded p-6 hover:shadow-lg transition-shadow block text-center"
        data-testid="link-system-status"
      >
        <div class="feature-icon mx-auto mb-4">
          <i class="fas fa-heartbeat"></i>
        </div>
        <h3 class="text-lg font-semibold text-text-900 mb-2">System Status</h3>
        <p class="text-sm text-text-500">Real-time status of all Rugira services and infrastructure</p>
        <i class="fas fa-external-link-alt text-xs text-text-500 mt-2"></i>
      </a>
    </div>

    <!-- FAQ Section -->
    <div class="card-rounded">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-text-900" data-testid="text-faq-title">Frequently Asked Questions</h3>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div class="border-b border-gray-100 pb-4" data-testid="faq-item-1">
            <h4 class="font-medium text-text-900 mb-2">How do I create my first trading bot?</h4>
            <p class="text-sm text-text-500">
              Navigate to the Bots page and click "Create Bot". Select your exchange, trading pair, and strategy template. 
              Configure your risk parameters and click "Create Bot" to get started.
            </p>
          </div>
          <div class="border-b border-gray-100 pb-4" data-testid="faq-item-2">
            <h4 class="font-medium text-text-900 mb-2">What is the Kill Switch and when should I use it?</h4>
            <p class="text-sm text-text-500">
              The Kill Switch immediately stops all trading operations across all bots. Use it in emergency situations 
              or when you need to halt trading due to market conditions or technical issues.
            </p>
          </div>
          <div class="border-b border-gray-100 pb-4" data-testid="faq-item-3">
            <h4 class="font-medium text-text-900 mb-2">How do I set up exchange API connections securely?</h4>
            <p class="text-sm text-text-500">
              Always create trade-only API keys on your exchange (never use withdrawal permissions). 
              Use IP whitelist restrictions when available and rotate your API keys regularly.
            </p>
          </div>
          <div data-testid="faq-item-4">
            <h4 class="font-medium text-text-900 mb-2">Can I backtest strategies before going live?</h4>
            <p class="text-sm text-text-500">
              Yes! Use the Backtesting section to test your strategies against historical data. 
              You can promote successful backtest configurations directly to live bots.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Help page functionality would be implemented here
</script>
