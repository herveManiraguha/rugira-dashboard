import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Grid3X3,
  ArrowRightLeft,
  DollarSign,
  Zap,
  GitBranchPlus,
  Activity,
  Target,
  Loader2,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BotCreationData) => void;
}

interface BotCreationData {
  name: string;
  exchange: string;
  tradingPair: string;
  strategy: string;
  maxPositionSize: number;
  stopLoss: number;
}

const strategies = [
  {
    id: 'grid_trading',
    name: 'Grid Trading',
    description: 'Automated buy/sell orders in a price range',
    icon: <Grid3X3 className="w-5 h-5 text-blue-500" />,
    difficulty: 'Intermediate',
    timeframe: '1h-1d'
  },
  {
    id: 'arbitrage',
    name: 'Arbitrage',
    description: 'Profit from price differences across exchanges',
    icon: <ArrowRightLeft className="w-5 h-5 text-green-500" />,
    difficulty: 'Advanced',
    timeframe: '1-5m'
  },
  {
    id: 'dca',
    name: 'Dollar Cost Averaging',
    description: 'Buy fixed amounts at regular intervals',
    icon: <DollarSign className="w-5 h-5 text-indigo-500" />,
    difficulty: 'Beginner',
    timeframe: '1d-1w'
  },
  {
    id: 'momentum',
    name: 'Momentum Trading',
    description: 'Follow strong price movements and trends',
    icon: <Zap className="w-5 h-5 text-purple-500" />,
    difficulty: 'Advanced',
    timeframe: '5m-1h'
  },
  {
    id: 'ma_crossover',
    name: 'Moving Average Crossover',
    description: 'Trade based on moving average signals',
    icon: <GitBranchPlus className="w-5 h-5 text-orange-500" />,
    difficulty: 'Intermediate',
    timeframe: '15m-4h'
  },
  {
    id: 'mean_reversion',
    name: 'Mean Reversion',
    description: 'Buy low and sell high around average price',
    icon: <Activity className="w-5 h-5 text-pink-500" />,
    difficulty: 'Intermediate',
    timeframe: '30m-2h'
  }
];

const exchanges = [
  { id: 'binance', name: 'Binance' },
  { id: 'coinbase', name: 'Coinbase Pro' },
  { id: 'kraken', name: 'Kraken' },
  { id: 'bybit', name: 'Bybit' },
  { id: 'okx', name: 'OKX' },
  { id: 'kucoin', name: 'KuCoin' }
];

const tradingPairs = [
  'BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'ADA/USDT', 'MATIC/USDT',
  'LINK/USDT', 'DOT/USDT', 'UNI/USDT', 'AVAX/USDT', 'LTC/USDT'
];

export default function CreateBotModal({ isOpen, onClose, onSubmit }: CreateBotModalProps) {
  const [name, setName] = useState('');
  const [exchange, setExchange] = useState('');
  const [tradingPair, setTradingPair] = useState('');
  const [strategy, setStrategy] = useState('');
  const [maxPositionSize, setMaxPositionSize] = useState(10);
  const [stopLoss, setStopLoss] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setExchange('');
    setTradingPair('');
    setStrategy('');
    setMaxPositionSize(10);
    setStopLoss(5);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!name || !exchange || !tradingPair || !strategy) return;

    setIsSubmitting(true);
    try {
      const data: BotCreationData = {
        name,
        exchange,
        tradingPair,
        strategy,
        maxPositionSize,
        stopLoss
      };

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSubmit(data);
      handleClose();
    } catch (error) {
      console.error('Error creating bot:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = name && exchange && tradingPair && strategy;
  const selectedStrategy = strategies.find(s => s.id === strategy);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>Create Trading Bot</span>
          </DialogTitle>
          <DialogDescription>
            Configure a new automated trading bot with your preferred strategy and risk parameters.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="bot-name">Bot Name</Label>
                <Input
                  id="bot-name"
                  placeholder="e.g., Alpha Grid Bot"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="input-bot-name"
                />
              </div>

              <div>
                <Label htmlFor="exchange">Exchange</Label>
                <Select value={exchange} onValueChange={setExchange}>
                  <SelectTrigger data-testid="select-exchange">
                    <SelectValue placeholder="Select an exchange" />
                  </SelectTrigger>
                  <SelectContent>
                    {exchanges.map((ex) => (
                      <SelectItem key={ex.id} value={ex.id}>
                        {ex.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="trading-pair">Trading Pair</Label>
                <Select value={tradingPair} onValueChange={setTradingPair}>
                  <SelectTrigger data-testid="select-trading-pair">
                    <SelectValue placeholder="Select a trading pair" />
                  </SelectTrigger>
                  <SelectContent>
                    {tradingPairs.map((pair) => (
                      <SelectItem key={pair} value={pair}>
                        {pair}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="max-position">Max Position Size (%)</Label>
                <Input
                  id="max-position"
                  type="number"
                  min="1"
                  max="100"
                  value={maxPositionSize}
                  onChange={(e) => setMaxPositionSize(Number(e.target.value))}
                  data-testid="input-max-position"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Percentage of portfolio to use for this bot
                </p>
              </div>

              <div>
                <Label htmlFor="stop-loss">Stop Loss (%)</Label>
                <Input
                  id="stop-loss"
                  type="number"
                  min="1"
                  max="50"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                  data-testid="input-stop-loss"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum loss before auto-stop
                </p>
              </div>

              {selectedStrategy && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center space-x-2 text-blue-900">
                      <Target className="w-4 h-4" />
                      <span>Selected Strategy</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center space-x-2 mb-2">
                      {selectedStrategy.icon}
                      <span className="font-medium text-sm">{selectedStrategy.name}</span>
                      <Badge className={getDifficultyColor(selectedStrategy.difficulty)}>
                        {selectedStrategy.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-blue-700 mb-2">{selectedStrategy.description}</p>
                    <div className="text-xs text-blue-600">
                      <strong>Timeframe:</strong> {selectedStrategy.timeframe}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Strategy Selection */}
          <div>
            <Label className="text-base font-medium mb-4 block">Trading Strategy</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {strategies.map((strat) => (
                <Card 
                  key={strat.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    strategy === strat.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                  )}
                  onClick={() => setStrategy(strat.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {strat.icon}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm truncate">{strat.name}</h4>
                          <Badge className={getDifficultyColor(strat.difficulty)} variant="outline">
                            {strat.difficulty}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 leading-tight mb-2">{strat.description}</p>
                        <div className="text-xs text-gray-500">
                          <strong>Timeframe:</strong> {strat.timeframe}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Settings className="w-4 h-4" />
            <span>Bot will be created in stopped state</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              data-testid="button-create-bot"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Bot...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 mr-2" />
                  Create Bot
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}