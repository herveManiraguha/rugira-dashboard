import React, { useState } from "react";
import { useBotsStore } from "../../stores";

export default function CreateBotModal() {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createBot } = useBotsStore();

  const [form, setForm] = useState({
    name: '',
    exchange: '',
    tradingPair: '',
    strategy: '',
    maxPositionSize: 10,
    stopLoss: 5
  });

  const openModal = () => {
    setShowModal(true);
    resetForm();
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      name: '',
      exchange: '',
      tradingPair: '',
      strategy: '',
      maxPositionSize: 10,
      stopLoss: 5
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      await createBot({
        name: form.name,
        exchange: form.exchange,
        tradingPair: form.tradingPair,
        strategy: form.strategy,
        riskPolicy: {
          maxPositionSize: form.maxPositionSize,
          stopLoss: form.stopLoss
        },
        status: 'stopped'
      });
      
      closeModal();
    } catch (error) {
      console.error('Failed to create bot:', error);
      alert('Failed to create bot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Global event listener for opening modal
  React.useEffect(() => {
    const handleOpenModal = () => openModal();
    window.addEventListener('openCreateBotModal', handleOpenModal);
    return () => window.removeEventListener('openCreateBotModal', handleOpenModal);
  }, []);

  if (!showModal) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      data-testid="modal-create-bot"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-900" data-testid="text-modal-title">
              Create Trading Bot
            </h2>
            <button 
              className="text-text-500 hover:text-text-700"
              onClick={closeModal}
              data-testid="button-close-modal"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bot Configuration */}
            <div>
              <label className="block text-sm font-medium text-text-700 mb-2" data-testid="label-bot-name">
                Bot Name
              </label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-rugira px-3 py-2 focus:border-brand-red focus:ring-2 focus:ring-brand-red focus:ring-opacity-20" 
                placeholder="Enter bot name"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                data-testid="input-bot-name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-700 mb-2" data-testid="label-exchange">
                  Exchange
                </label>
                <select 
                  className="w-full border border-gray-300 rounded-rugira px-3 py-2 focus:border-brand-red"
                  value={form.exchange}
                  onChange={(e) => setForm({...form, exchange: e.target.value})}
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
                <label className="block text-sm font-medium text-text-700 mb-2" data-testid="label-trading-pair">
                  Trading Pair
                </label>
                <select 
                  className="w-full border border-gray-300 rounded-rugira px-3 py-2 focus:border-brand-red"
                  value={form.tradingPair}
                  onChange={(e) => setForm({...form, tradingPair: e.target.value})}
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

            {/* Strategy Selection */}
            <div>
              <label className="block text-sm font-medium text-text-700 mb-3" data-testid="label-strategy">
                Strategy Template
              </label>
              <div className="grid grid-cols-1 gap-3">
                <label 
                  className={`flex items-center p-3 border border-gray-200 rounded-rugira cursor-pointer hover:border-brand-red ${form.strategy === 'arbitrage' ? 'border-brand-red' : ''}`}
                  data-testid="option-strategy-arbitrage"
                >
                  <input 
                    type="radio" 
                    name="strategy" 
                    value="arbitrage"
                    className="text-brand-red focus:ring-brand-red"
                    checked={form.strategy === 'arbitrage'}
                    onChange={(e) => setForm({...form, strategy: e.target.value})}
                  />
                  <div className="ml-3">
                    <div className="font-medium text-text-900">Arbitrage</div>
                    <div className="text-sm text-text-500">Profit from price differences across exchanges</div>
                  </div>
                </label>
                <label 
                  className={`flex items-center p-3 border border-gray-200 rounded-rugira cursor-pointer hover:border-brand-red ${form.strategy === 'ma_crossover' ? 'border-brand-red' : ''}`}
                  data-testid="option-strategy-ma"
                >
                  <input 
                    type="radio" 
                    name="strategy" 
                    value="ma_crossover"
                    className="text-brand-red focus:ring-brand-red"
                    checked={form.strategy === 'ma_crossover'}
                    onChange={(e) => setForm({...form, strategy: e.target.value})}
                  />
                  <div className="ml-3">
                    <div className="font-medium text-text-900">Moving Average Crossover</div>
                    <div className="text-sm text-text-500">Trade based on moving average signals</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Risk Policy */}
            <div>
              <label className="block text-sm font-medium text-text-700 mb-3" data-testid="label-risk-policy">
                Risk Policy
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-500 mb-1" data-testid="label-max-position">
                    Max Position Size (%)
                  </label>
                  <input 
                    type="number" 
                    className="w-full border border-gray-300 rounded-rugira px-3 py-2 focus:border-brand-red"
                    value={form.maxPositionSize}
                    onChange={(e) => setForm({...form, maxPositionSize: Number(e.target.value)})}
                    data-testid="input-max-position"
                    min="1" 
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-500 mb-1" data-testid="label-stop-loss">
                    Stop Loss (%)
                  </label>
                  <input 
                    type="number" 
                    className="w-full border border-gray-300 rounded-rugira px-3 py-2 focus:border-brand-red"
                    value={form.stopLoss}
                    onChange={(e) => setForm({...form, stopLoss: Number(e.target.value)})}
                    data-testid="input-stop-loss"
                    min="1" 
                    max="50"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={closeModal}
                data-testid="button-cancel"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting}
                data-testid="button-create"
              >
                {isSubmitting ? 'Creating...' : 'Create Bot'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}