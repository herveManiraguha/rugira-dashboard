// Mock data for Rugira Trading Dashboard
// This provides realistic trading data for demonstration purposes

export interface MockBot {
  id: string;
  name: string;
  strategy: string;
  status: 'running' | 'stopped' | 'paused' | 'error';
  exchange: string;
  tradingPair: string;
  balance: number;
  pnl: number;
  pnlPercent: number;
  dailyPnl: number;
  totalTrades: number;
  winRate: number;
  lastTrade: string;
  riskLevel: 'low' | 'medium' | 'high';
  maxDrawdown: number;
  sharpeRatio: number;
  createdAt: string;
}

export interface MockTrade {
  id: string;
  botId: string;
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  value: number;
  fee: number;
  pnl: number;
  timestamp: string;
  status: 'filled' | 'partial' | 'cancelled';
}

export interface MockStrategy {
  id: string;
  name: string;
  description: string;
  type: 'arbitrage' | 'grid' | 'momentum' | 'mean_reversion' | 'scalping';
  risk: 'low' | 'medium' | 'high';
  minCapital: number;
  maxDrawdown: number;
  expectedReturn: number;
  timeframe: string;
  parameters: Record<string, any>;
  backtestResults?: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
  };
}

export interface MockExchange {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  apiKey: string;
  balance: Record<string, number>;
  tradingPairs: string[];
  fees: {
    maker: number;
    taker: number;
  };
  lastPing: string;
  volume24h: number;
}

export interface MockMarketData {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

// Mock Bots Data
export const mockBots: MockBot[] = [
  {
    id: '1',
    name: 'BTC Arbitrage Pro',
    strategy: 'Cross-Exchange Arbitrage',
    status: 'running',
    exchange: 'Binance',
    tradingPair: 'BTC-USDT',
    balance: 125000,
    pnl: 12500.75,
    pnlPercent: 11.11,
    dailyPnl: 850.25,
    totalTrades: 1247,
    winRate: 73.2,
    lastTrade: new Date(Date.now() - 300000).toISOString(),
    riskLevel: 'medium',
    maxDrawdown: -8.5,
    sharpeRatio: 1.85,
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString()
  },
  {
    id: '2',
    name: 'ETH Grid Trader',
    strategy: 'Grid Trading',
    status: 'running',
    exchange: 'Coinbase Pro',
    tradingPair: 'ETH-USD',
    balance: 89500,
    pnl: -2150.50,
    pnlPercent: -2.35,
    dailyPnl: -120.75,
    totalTrades: 892,
    winRate: 68.9,
    lastTrade: new Date(Date.now() - 900000).toISOString(),
    riskLevel: 'low',
    maxDrawdown: -12.3,
    sharpeRatio: 1.42,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
  },
  {
    id: '3',
    name: 'Momentum Scanner',
    strategy: 'Momentum Breakout',
    status: 'paused',
    exchange: 'Kraken',
    tradingPair: 'ADA-EUR',
    balance: 45000,
    pnl: 3850.25,
    pnlPercent: 9.33,
    dailyPnl: 0,
    totalTrades: 324,
    winRate: 71.6,
    lastTrade: new Date(Date.now() - 3600000 * 6).toISOString(),
    riskLevel: 'high',
    maxDrawdown: -15.2,
    sharpeRatio: 2.1,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
  },
  {
    id: '4',
    name: 'Stable Scalper',
    strategy: 'High-Frequency Scalping',
    status: 'error',
    exchange: 'Binance',
    tradingPair: 'SOL-USDT',
    balance: 67800,
    pnl: 8950.80,
    pnlPercent: 15.21,
    dailyPnl: -45.20,
    totalTrades: 2156,
    winRate: 69.4,
    lastTrade: new Date(Date.now() - 3600000 * 2).toISOString(),
    riskLevel: 'high',
    maxDrawdown: -18.7,
    sharpeRatio: 1.67,
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString()
  },
  {
    id: '5',
    name: 'MATIC Mean Reversion',
    strategy: 'Mean Reversion',
    status: 'stopped',
    exchange: 'Coinbase Pro',
    tradingPair: 'MATIC-USD',
    balance: 32000,
    pnl: 1850.45,
    pnlPercent: 6.14,
    dailyPnl: 0,
    totalTrades: 456,
    winRate: 74.8,
    lastTrade: new Date(Date.now() - 86400000).toISOString(),
    riskLevel: 'low',
    maxDrawdown: -9.1,
    sharpeRatio: 1.93,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  }
];

// Mock Recent Trades
export const mockTrades: MockTrade[] = [
  {
    id: '1',
    botId: '1',
    symbol: 'BTC-USDT',
    side: 'buy',
    amount: 0.145,
    price: 43250.50,
    value: 6271.32,
    fee: 6.27,
    pnl: 185.45,
    timestamp: new Date(Date.now() - 300000).toISOString(),
    status: 'filled'
  },
  {
    id: '2',
    botId: '2',
    symbol: 'ETH-USD',
    side: 'sell',
    amount: 2.5,
    price: 2685.75,
    value: 6714.38,
    fee: 6.71,
    pnl: -45.20,
    timestamp: new Date(Date.now() - 600000).toISOString(),
    status: 'filled'
  },
  {
    id: '3',
    botId: '1',
    symbol: 'BTC-USDT',
    side: 'sell',
    amount: 0.145,
    price: 43420.25,
    value: 6295.94,
    fee: 6.30,
    pnl: 185.45,
    timestamp: new Date(Date.now() - 900000).toISOString(),
    status: 'filled'
  },
  {
    id: '4',
    botId: '4',
    symbol: 'SOL-USDT',
    side: 'buy',
    amount: 50,
    price: 98.45,
    value: 4922.50,
    fee: 4.92,
    pnl: 125.80,
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    status: 'filled'
  }
];

// Mock Strategies
export const mockStrategies: MockStrategy[] = [
  {
    id: '1',
    name: 'Cross-Exchange Arbitrage',
    description: 'Identifies price differences between exchanges and executes profitable arbitrage trades',
    type: 'arbitrage',
    risk: 'medium',
    minCapital: 50000,
    maxDrawdown: 8,
    expectedReturn: 12,
    timeframe: '1-5 minutes',
    parameters: {
      minSpread: 0.5,
      maxSlippage: 0.2,
      exchanges: ['binance', 'coinbase', 'kraken'],
      maxPositionSize: 0.1
    },
    backtestResults: {
      totalReturn: 24.7,
      sharpeRatio: 1.85,
      maxDrawdown: -8.5,
      winRate: 73.2
    }
  },
  {
    id: '2',
    name: 'Grid Trading Strategy',
    description: 'Places buy and sell orders at predetermined intervals around current market price',
    type: 'grid',
    risk: 'low',
    minCapital: 25000,
    maxDrawdown: 12,
    expectedReturn: 8,
    timeframe: '15 minutes - 4 hours',
    parameters: {
      gridSpacing: 1.5,
      numberOfGrids: 10,
      gridSize: 0.02,
      profitTarget: 2.0
    },
    backtestResults: {
      totalReturn: 15.3,
      sharpeRatio: 1.42,
      maxDrawdown: -12.3,
      winRate: 68.9
    }
  },
  {
    id: '3',
    name: 'Momentum Breakout',
    description: 'Detects and trades momentum breakouts using technical indicators',
    type: 'momentum',
    risk: 'high',
    minCapital: 35000,
    maxDrawdown: 20,
    expectedReturn: 25,
    timeframe: '5-30 minutes',
    parameters: {
      rsiPeriod: 14,
      rsiOverbought: 70,
      rsiOversold: 30,
      volumeThreshold: 1.5,
      stopLoss: 2.0,
      takeProfit: 4.0
    },
    backtestResults: {
      totalReturn: 31.2,
      sharpeRatio: 2.1,
      maxDrawdown: -15.2,
      winRate: 71.6
    }
  }
];

// Mock Exchanges
export const mockExchanges: MockExchange[] = [
  {
    id: '1',
    name: 'Binance',
    status: 'connected',
    apiKey: 'binance_****_****_*6f8',
    balance: {
      'USDT': 125000.50,
      'BTC': 2.45678,
      'ETH': 15.234,
      'BNB': 450.67
    },
    tradingPairs: ['BTC-USDT', 'ETH-USDT', 'SOL-USDT', 'ADA-USDT', 'MATIC-USDT'],
    fees: {
      maker: 0.1,
      taker: 0.1
    },
    lastPing: new Date(Date.now() - 5000).toISOString(),
    volume24h: 2850000000
  },
  {
    id: '2',
    name: 'Coinbase Pro',
    status: 'connected',
    apiKey: 'coinbase_****_****_*9a2',
    balance: {
      'USD': 89500.25,
      'BTC': 1.23456,
      'ETH': 8.567,
      'MATIC': 12500.0
    },
    tradingPairs: ['BTC-USD', 'ETH-USD', 'SOL-USD', 'MATIC-USD'],
    fees: {
      maker: 0.5,
      taker: 0.5
    },
    lastPing: new Date(Date.now() - 8000).toISOString(),
    volume24h: 1250000000
  },
  {
    id: '3',
    name: 'Kraken',
    status: 'disconnected',
    apiKey: 'kraken_****_****_*3c1',
    balance: {
      'EUR': 45000.00,
      'BTC': 0.89234,
      'ADA': 15000.0
    },
    tradingPairs: ['BTC-EUR', 'ETH-EUR', 'ADA-EUR'],
    fees: {
      maker: 0.16,
      taker: 0.26
    },
    lastPing: new Date(Date.now() - 300000).toISOString(),
    volume24h: 850000000
  }
];

// Mock Market Data
export const mockMarketData: MockMarketData[] = [
  {
    symbol: 'BTC-USDT',
    price: 43285.75,
    change24h: 1250.80,
    changePercent24h: 2.98,
    volume24h: 2850000000,
    high24h: 43850.25,
    low24h: 41950.10
  },
  {
    symbol: 'ETH-USD',
    price: 2689.45,
    change24h: -85.30,
    changePercent24h: -3.07,
    volume24h: 1650000000,
    high24h: 2795.80,
    low24h: 2650.25
  },
  {
    symbol: 'SOL-USDT',
    price: 98.67,
    change24h: 4.25,
    changePercent24h: 4.50,
    volume24h: 485000000,
    high24h: 102.15,
    low24h: 94.20
  },
  {
    symbol: 'ADA-EUR',
    price: 0.485,
    change24h: 0.015,
    changePercent24h: 3.19,
    volume24h: 125000000,
    high24h: 0.495,
    low24h: 0.465
  },
  {
    symbol: 'MATIC-USD',
    price: 0.865,
    change24h: -0.025,
    changePercent24h: -2.81,
    volume24h: 95000000,
    high24h: 0.920,
    low24h: 0.845
  }
];

// Mock Performance Data for Charts
export const mockPerformanceData = {
  equity: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    value: 100000 + Math.random() * 20000 - 10000 + i * 500
  })),
  pnl: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
    value: Math.random() * 2000 - 1000
  })),
  trades: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: Math.floor(Math.random() * 20) + 5
  }))
};

// Risk Management Data
export const mockRiskData = {
  portfolioRisk: 65,
  maxDrawdown: -12.5,
  sharpeRatio: 1.67,
  sortino: 2.15,
  var95: -8500,
  expectedShortfall: -12000,
  exposureByAsset: [
    { asset: 'BTC', exposure: 45.2, value: 135000 },
    { asset: 'ETH', exposure: 28.5, value: 85000 },
    { asset: 'SOL', exposure: 15.8, value: 47000 },
    { asset: 'Others', exposure: 10.5, value: 31500 }
  ]
};

// Compliance Data
export const mockComplianceData = {
  riskLimits: [
    { metric: 'Max Position Size', current: 45, limit: 50, status: 'ok' },
    { metric: 'Daily Loss Limit', current: 2.5, limit: 5.0, status: 'ok' },
    { metric: 'Leverage Ratio', current: 1.8, limit: 2.0, status: 'warning' },
    { metric: 'Concentration Risk', current: 35, limit: 40, status: 'ok' }
  ],
  auditTrail: [
    {
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      action: 'Position Limit Check',
      user: 'System',
      result: 'Passed',
      details: 'BTC position within 50% limit'
    },
    {
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      action: 'Risk Override',
      user: 'Admin User',
      result: 'Approved',
      details: 'Temporary leverage increase to 2.5x'
    }
  ]
};