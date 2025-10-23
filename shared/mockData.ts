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

export type StrategyStatus = 'available' | 'popular' | 'advanced';
export type StrategyComplexity = 'beginner' | 'intermediate' | 'advanced';
export type StrategyMarketCondition = 'trending' | 'ranging' | 'volatile' | 'any';
export type StrategyRiskLevel = 'low' | 'medium' | 'high';

export interface MockStrategy {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: string;
  status: StrategyStatus;
  complexity: StrategyComplexity;
  marketConditions: StrategyMarketCondition[];
  tags: string[];
  risk: StrategyRiskLevel;
  riskLabel?: string;
  timeframe: string;
  bestFor: string;
  advantages: string[];
  considerations: string[];
  overlay?: boolean;
  minCapital?: number;
  maxDrawdown?: number;
  expectedReturn?: number;
  parameters?: Record<string, any>;
  performance?: {
    winRate: number;
    avgReturn: number;
    sharpeRatio: number;
  };
  backtestResults?: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
  };
  version?: string;
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

export type TransactionSource = 'rugira_bot' | 'manual_sync' | 'imported_csv';
export type TransactionType =
  | 'trade'
  | 'transfer_in'
  | 'transfer_out'
  | 'staking_reward'
  | 'interest'
  | 'fee'
  | 'airdrop';
export type TradeSide = 'buy' | 'sell';

export interface MockVenueTransaction {
  id: string;
  venue: string;
  baseAsset: string;
  quoteAsset: string;
  type: TransactionType;
  side?: TradeSide;
  quantity: number;
  price?: number;
  grossValue: number;
  feeAmount: number;
  feeAsset: string;
  netValue: number;
  realizedPnl?: number;
  orderId?: string;
  externalRef?: string;
  source: TransactionSource;
  initiatedBy: 'bot' | 'manual' | 'external';
  strategyId?: string;
  botId?: string;
  venueAccountId: string;
  walletAddress?: string;
  tradePair?: string;
  venueTimestamp: string;
  settledAt: string;
  createdAt: string;
  updatedAt: string;
  quoteConversion?: {
    currency: string;
    rate: number;
    value: number;
  };
  taxLotRef?: string;
  notes?: string;
}

export interface MockVenueBalanceSnapshot {
  id: string;
  venue: string;
  venueAccountId: string;
  asset: string;
  total: number;
  available: number;
  locked: number;
  valueInBase: number;
  baseCurrency: string;
  capturedAt: string;
}

export interface MockFxRate {
  id: string;
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  capturedAt: string;
  source: string;
}

export interface MockMarketPrice {
  id: string;
  venue: string;
  symbol: string;
  price: number;
  currency: string;
  capturedAt: string;
  source: string;
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

// Mock Strategies (central catalog)
export const mockStrategies: MockStrategy[] = [
  {
    id: 'strategy-grid-trading',
    slug: 'grid_trading',
    name: 'Grid Trading',
    description: 'Places buy and sell orders at regular intervals above and below current price',
    type: 'grid',
    status: 'popular',
    complexity: 'beginner',
    marketConditions: ['ranging'],
    tags: [],
    risk: 'low',
    timeframe: '15m - 1h',
    bestFor: 'Stable coins and low-volatility periods',
    advantages: [
      'Works well in sideways markets',
      'Consistent profits',
      'Automatic profit taking'
    ],
    considerations: [
      'Vulnerable to strong trends',
      'Requires ranging markets'
    ],
    minCapital: 25000,
    maxDrawdown: 12,
    expectedReturn: 8,
    parameters: {
      gridSpacing: 1.5,
      numberOfGrids: 10,
      gridSize: 0.02,
      profitTarget: 2.0
    },
    performance: {
      winRate: 68.5,
      avgReturn: 2.3,
      sharpeRatio: 1.45
    },
    backtestResults: {
      totalReturn: 15.3,
      sharpeRatio: 1.42,
      maxDrawdown: -12.3,
      winRate: 68.9
    },
    version: 'v2.4'
  },
  {
    id: 'strategy-dca',
    slug: 'dca',
    name: 'DCA (Dollar Cost Averaging)',
    description: 'Invests fixed amount at regular intervals regardless of price',
    type: 'dca',
    status: 'popular',
    complexity: 'beginner',
    marketConditions: ['any'],
    tags: [],
    risk: 'low',
    timeframe: '1d - 1w',
    bestFor: 'Long-term investors and volatile markets',
    advantages: [
      'Reduces average cost',
      'Simple to implement',
      'Reduces timing risk'
    ],
    considerations: [
      'No profit in sideways markets',
      'Requires long-term commitment'
    ],
    minCapital: 1000,
    maxDrawdown: 18,
    expectedReturn: 6,
    parameters: {
      interval: 'daily',
      orderSize: 'fixed',
      rebalance: false
    },
    performance: {
      winRate: 72.1,
      avgReturn: 0.8,
      sharpeRatio: 1.05
    },
    backtestResults: {
      totalReturn: 7.8,
      sharpeRatio: 1.08,
      maxDrawdown: -9.5,
      winRate: 66.4
    },
    version: 'v1.7'
  },
  {
    id: 'strategy-arbitrage-trading',
    slug: 'arbitrage',
    name: 'Arbitrage Trading',
    description: 'Exploits price differences between different exchanges or trading pairs',
    type: 'arbitrage',
    status: 'advanced',
    complexity: 'advanced',
    marketConditions: ['any'],
    tags: [],
    risk: 'low',
    timeframe: '1s - 5m',
    bestFor: 'High-frequency traders with substantial capital',
    advantages: [
      'Low risk',
      'Market neutral',
      'Quick profits'
    ],
    considerations: [
      'Requires high capital',
      'Opportunities are rare',
      'Complex execution'
    ],
    minCapital: 50000,
    maxDrawdown: 8,
    expectedReturn: 12,
    parameters: {
      exchanges: ['binance', 'coinbase', 'kraken'],
      maxLatencyMs: 200,
      capitalAllocation: 0.2
    },
    performance: {
      winRate: 94.2,
      avgReturn: 0.5,
      sharpeRatio: 2.3
    },
    backtestResults: {
      totalReturn: 6.0,
      sharpeRatio: 2.1,
      maxDrawdown: -4.3,
      winRate: 92.4
    },
    version: 'v3.2'
  },
  {
    id: 'strategy-market-making',
    slug: 'market_making',
    name: 'Market Making',
    description: 'Provides liquidity by continuously quoting buy and sell orders around mid-price to capture the spread.',
    type: 'market-making',
    status: 'available',
    complexity: 'advanced',
    marketConditions: ['any'],
    tags: [],
    risk: 'medium',
    timeframe: '1m - 1h',
    bestFor: 'Liquid venues with consistent order flow',
    advantages: [
      'Earns spread on both sides of the book',
      'Supports stable market liquidity',
      'Highly configurable quoting behavior'
    ],
    considerations: [
      'Requires careful inventory management',
      'Exposed to sudden price jumps',
      'Needs low-latency infrastructure'
    ],
    minCapital: 60000,
    maxDrawdown: 15,
    expectedReturn: 16,
    parameters: {
      quoteSpacingBps: 8,
      inventoryTarget: 0,
      refreshIntervalMs: 750
    },
    performance: {
      winRate: 71.4,
      avgReturn: 1.2,
      sharpeRatio: 1.89
    },
    backtestResults: {
      totalReturn: 13.5,
      sharpeRatio: 1.62,
      maxDrawdown: -9.8,
      winRate: 70.1
    },
    version: 'v2.5'
  },
  {
    id: 'strategy-momentum-trading',
    slug: 'momentum',
    name: 'Momentum Trading',
    description: 'Follows price trends and momentum indicators to enter positions',
    type: 'momentum',
    status: 'popular',
    complexity: 'intermediate',
    marketConditions: ['trending'],
    tags: [],
    risk: 'high',
    timeframe: '15m - 4h',
    bestFor: 'Trending markets and news-driven movements',
    advantages: [
      'High profit potential',
      'Captures strong moves',
      'Clear signals'
    ],
    considerations: [
      'High risk',
      'Frequent false signals',
      'Requires discipline'
    ],
    minCapital: 35000,
    maxDrawdown: 20,
    expectedReturn: 25,
    parameters: {
      indicators: ['RSI', 'MACD', 'Volume'],
      stopLoss: 2.0,
      takeProfit: 4.0
    },
    performance: {
      winRate: 58.9,
      avgReturn: 3.2,
      sharpeRatio: 1.67
    },
    backtestResults: {
      totalReturn: 31.2,
      sharpeRatio: 2.1,
      maxDrawdown: -15.2,
      winRate: 71.6
    },
    version: 'v2.1'
  },
  {
    id: 'strategy-mean-reversion',
    slug: 'mean_reversion',
    name: 'Mean Reversion',
    description: 'Trades based on the assumption that prices return to their historical average',
    type: 'mean-reversion',
    status: 'available',
    complexity: 'intermediate',
    marketConditions: ['ranging'],
    tags: [],
    risk: 'medium',
    timeframe: '1h - 1d',
    bestFor: 'Established cryptocurrencies with predictable patterns',
    advantages: [
      'Works in range-bound markets',
      'Statistical edge',
      'Clear entry/exit'
    ],
    considerations: [
      'Fails in trending markets',
      'Complex calculations'
    ],
    minCapital: 20000,
    maxDrawdown: 18,
    expectedReturn: 14,
    parameters: {
      lookbackPeriod: 20,
      deviationThreshold: 1.5,
      stopLoss: 1.8
    },
    performance: {
      winRate: 64.3,
      avgReturn: 2.1,
      sharpeRatio: 1.52
    },
    backtestResults: {
      totalReturn: 18.9,
      sharpeRatio: 1.56,
      maxDrawdown: -11.7,
      winRate: 69.1
    },
    version: 'v1.9'
  },
  {
    id: 'strategy-ma-crossover',
    slug: 'ma_crossover',
    name: 'Moving Average Crossover',
    description: 'Generates buy/sell signals when short-term and long-term moving averages cross to confirm trend direction.',
    type: 'trend',
    status: 'available',
    complexity: 'intermediate',
    marketConditions: ['trending'],
    tags: [],
    risk: 'low',
    timeframe: '15m - 4h',
    bestFor: 'Swing traders looking for rule-based signals',
    advantages: [
      'Simple, rules-based entries',
      'Filters out minor noise',
      'Works across timeframes'
    ],
    considerations: [
      'Lags during rapid reversals',
      'Whipsaws in choppy markets',
      'Needs complementary risk controls'
    ],
    minCapital: 15000,
    maxDrawdown: 14,
    expectedReturn: 12,
    parameters: {
      shortMAPeriod: 20,
      longMAPeriod: 50,
      confirmationIndicator: 'RSI'
    },
    performance: {
      winRate: 62.3,
      avgReturn: 1.8,
      sharpeRatio: 1.12
    },
    backtestResults: {
      totalReturn: 14.4,
      sharpeRatio: 1.25,
      maxDrawdown: -9.9,
      winRate: 64.8
    },
    version: 'v2.2'
  },
  {
    id: 'strategy-scalping',
    slug: 'scalping',
    name: 'Scalping',
    description: 'Makes numerous small profits from tiny price movements throughout the day',
    type: 'scalping',
    status: 'advanced',
    complexity: 'advanced',
    marketConditions: ['volatile'],
    tags: [],
    risk: 'high',
    timeframe: '1m - 15m',
    bestFor: 'Experienced traders with low-latency connections',
    advantages: [
      'Many opportunities',
      'Quick profits',
      'Limited exposure'
    ],
    considerations: [
      'High transaction costs',
      'Requires constant monitoring',
      'Stressful'
    ],
    minCapital: 45000,
    maxDrawdown: 25,
    expectedReturn: 28,
    parameters: {
      tradeDurationSeconds: 120,
      maxSimultaneousPositions: 5,
      executionMode: 'low-latency'
    },
    performance: {
      winRate: 54.1,
      avgReturn: 1.5,
      sharpeRatio: 1.28
    },
    backtestResults: {
      totalReturn: 22.4,
      sharpeRatio: 1.34,
      maxDrawdown: -18.6,
      winRate: 58.2
    },
    version: 'v3.1'
  },
  {
    id: 'strategy-swing-trading',
    slug: 'swing_trading',
    name: 'Swing Trading',
    description: 'Captures price swings over several days to weeks using technical analysis',
    type: 'swing',
    status: 'popular',
    complexity: 'intermediate',
    marketConditions: ['trending'],
    tags: [],
    risk: 'medium',
    timeframe: '4h - 1w',
    bestFor: 'Part-time traders and medium-term opportunities',
    advantages: [
      'Less time intensive',
      'Good risk-reward',
      'Flexible timing'
    ],
    considerations: [
      'Overnight risk',
      'Requires patience',
      'Market gaps'
    ],
    minCapital: 30000,
    maxDrawdown: 22,
    expectedReturn: 18,
    parameters: {
      holdingPeriodDays: 5,
      indicators: ['EMA', 'ATR'],
      stopLoss: 3.5
    },
    performance: {
      winRate: 60.7,
      avgReturn: 2.6,
      sharpeRatio: 1.49
    },
    backtestResults: {
      totalReturn: 21.5,
      sharpeRatio: 1.38,
      maxDrawdown: -13.8,
      winRate: 63.2
    },
    version: 'v2.0'
  },
  {
    id: 'strategy-breakout-trading',
    slug: 'breakout',
    name: 'Breakout Trading',
    description: 'Enters trades when price breaks through significant support or resistance levels',
    type: 'breakout',
    status: 'available',
    complexity: 'intermediate',
    marketConditions: ['volatile'],
    tags: [],
    risk: 'high',
    timeframe: '15m - 4h',
    bestFor: 'Volatile crypto markets and key technical levels',
    advantages: [
      'Catches big moves early',
      'Clear entry signals',
      'High profit potential'
    ],
    considerations: [
      'Many false breakouts',
      'Requires quick execution',
      'High risk'
    ],
    minCapital: 28000,
    maxDrawdown: 24,
    expectedReturn: 20,
    parameters: {
      breakoutThreshold: 1.8,
      retestConfirmation: true,
      stopLoss: 2.5
    },
    performance: {
      winRate: 57.4,
      avgReturn: 2.9,
      sharpeRatio: 1.41
    },
    backtestResults: {
      totalReturn: 24.2,
      sharpeRatio: 1.47,
      maxDrawdown: -16.9,
      winRate: 59.8
    },
    version: 'v2.6'
  },
  {
    id: 'strategy-pairs-trading',
    slug: 'pairs_trading',
    name: 'Pairs Trading',
    description: 'Trades correlation between two related cryptocurrencies',
    type: 'pairs',
    status: 'advanced',
    complexity: 'advanced',
    marketConditions: ['any'],
    tags: [],
    risk: 'medium',
    timeframe: '1h - 1d',
    bestFor: 'Sophisticated traders with strong analytical skills',
    advantages: [
      'Market neutral',
      'Statistical advantage',
      'Reduced market risk'
    ],
    considerations: [
      'Complex analysis',
      'Correlations can break',
      'Limited pairs'
    ],
    minCapital: 40000,
    maxDrawdown: 19,
    expectedReturn: 16,
    parameters: {
      correlationLookback: 30,
      hedgeRatio: 0.85,
      divergenceThreshold: 2.0
    },
    performance: {
      winRate: 61.8,
      avgReturn: 1.7,
      sharpeRatio: 1.33
    },
    backtestResults: {
      totalReturn: 17.9,
      sharpeRatio: 1.4,
      maxDrawdown: -12.6,
      winRate: 65.1
    },
    version: 'v1.6'
  },
  {
    id: 'strategy-trend-following',
    slug: 'trend_following',
    name: 'Trend Following',
    description: 'Follows established trends using moving averages and trend indicators',
    type: 'trend-following',
    status: 'popular',
    complexity: 'beginner',
    marketConditions: ['trending'],
    tags: [],
    risk: 'medium',
    timeframe: '1d - 1w',
    bestFor: 'Long-term trending cryptocurrencies like Bitcoin and Ethereum',
    advantages: [
      'Simple concept',
      'Catches big moves',
      'Clear rules'
    ],
    considerations: [
      'Late entries',
      'Whipsaws in choppy markets',
      'Requires trending markets'
    ],
    minCapital: 20000,
    maxDrawdown: 17,
    expectedReturn: 14,
    parameters: {
      longMA: 50,
      shortMA: 20,
      trailingStop: 4.0
    },
    performance: {
      winRate: 63.9,
      avgReturn: 1.9,
      sharpeRatio: 1.44
    },
    backtestResults: {
      totalReturn: 16.5,
      sharpeRatio: 1.36,
      maxDrawdown: -10.8,
      winRate: 67.7
    },
    version: 'v1.8'
  },
  {
    id: 'strategy-ai-trend-classifier',
    slug: 'ai_trend_classifier',
    name: 'AI Trend Classifier',
    description: 'Uses deep learning on price and order-book features to score short-term trends (up/down/flat) and trigger entries with a confidence signal.',
    type: 'ai-trend',
    status: 'available',
    complexity: 'intermediate',
    marketConditions: ['trending'],
    tags: ['AI'],
    risk: 'medium',
    timeframe: '15m - 4h',
    bestFor: 'Trending crypto pairs with healthy liquidity',
    advantages: [
      'Fewer false starts than simple moving averages',
      'Adapts to changing microstructure',
      'Clear confidence score on each signal'
    ],
    considerations: [
      'Needs periodic re-training to avoid drift',
      'Can lag during disorderly markets'
    ],
    minCapital: 32000,
    maxDrawdown: 16,
    expectedReturn: 22,
    parameters: {
      modelType: 'transformer',
      retrainCadenceDays: 14,
      confidenceThreshold: 0.62
    },
    performance: {
      winRate: 66.4,
      avgReturn: 2.7,
      sharpeRatio: 1.71
    },
    backtestResults: {
      totalReturn: 27.8,
      sharpeRatio: 1.75,
      maxDrawdown: -13.4,
      winRate: 68.5
    },
    version: 'v1.3'
  },
  {
    id: 'strategy-regime-detection-ensemble',
    slug: 'regime_detection_ensemble',
    name: 'Regime Detection (Ensemble)',
    description: 'Labels live market regimes (Range, Trend, Panic) and routes orders to the appropriate playbook (e.g., grid in range, momentum in trend, risk-off in panic).',
    type: 'ai-regime',
    status: 'advanced',
    complexity: 'intermediate',
    marketConditions: ['ranging', 'trending'],
    tags: ['AI'],
    risk: 'medium',
    timeframe: '1h - 1d',
    bestFor: 'Established cryptocurrencies with regime shifts',
    advantages: [
      'Reduces strategy mismatch across regimes',
      'Smoother transitions around regime changes',
      'Pairs well with most strategies'
    ],
    considerations: [
      'Occasional mislabels during fast flips',
      'Needs a short lookback to stabilize'
    ],
    minCapital: 36000,
    maxDrawdown: 15,
    expectedReturn: 18,
    parameters: {
      ensembleMembers: 5,
      lookbackHours: 24,
      regimeLabels: ['range', 'trend', 'panic']
    },
    performance: {
      winRate: 65.1,
      avgReturn: 2.1,
      sharpeRatio: 1.62
    },
    backtestResults: {
      totalReturn: 21.4,
      sharpeRatio: 1.68,
      maxDrawdown: -12.1,
      winRate: 67.9
    },
    version: 'v1.0'
  },
  {
    id: 'strategy-sentiment-event-driven',
    slug: 'sentiment_event_driven',
    name: 'Sentiment / Event-Driven',
    description: 'Uses news/social NLP plus funding/liquidations to detect sentiment shocks and directional bursts; follows or avoids events with tight risk caps.',
    type: 'ai-sentiment',
    status: 'advanced',
    complexity: 'advanced',
    marketConditions: ['volatile'],
    tags: ['AI'],
    risk: 'high',
    timeframe: '5m - 1h',
    bestFor: 'Top-cap perps around macro/crypto news windows',
    advantages: [
      'Captures news-driven moves',
      'Avoids trading blindly into event risk',
      'Fast, clearly triggered signals'
    ],
    considerations: [
      'Requires a third-party news/social feed',
      'Higher variance around major events'
    ],
    minCapital: 42000,
    maxDrawdown: 27,
    expectedReturn: 30,
    parameters: {
      dataSources: ['news', 'social', 'funding'],
      cooldownMinutes: 45,
      sentimentThreshold: 0.7
    },
    performance: {
      winRate: 55.6,
      avgReturn: 3.5,
      sharpeRatio: 1.58
    },
    backtestResults: {
      totalReturn: 34.6,
      sharpeRatio: 1.61,
      maxDrawdown: -19.5,
      winRate: 58.3
    },
    version: 'v1.2'
  },
  {
    id: 'strategy-volatility-forecaster',
    slug: 'volatility_forecaster_overlay',
    name: 'Volatility Forecaster (Overlay)',
    description: 'Predicts near-term volatility to size positions and set adaptive stops/take-profits; used as an overlay on top of any entry strategy.',
    type: 'ai-volatility-overlay',
    status: 'available',
    complexity: 'intermediate',
    marketConditions: ['any'],
    tags: ['AI', 'Overlay'],
    risk: 'medium',
    riskLabel: 'Low-Medium Risk',
    timeframe: 'Any',
    bestFor: 'All strategies seeking steadier risk',
    advantages: [
      'Smoother equity curve across regimes',
      'Stops/TP adapt to expected volatility',
      'Works with any base strategy'
    ],
    considerations: [
      'Overlay only - does not create entries',
      'Forecasts can degrade in regime shifts'
    ],
    overlay: true,
    parameters: {
      forecastHorizonMinutes: 30,
      percentileTarget: 0.75,
      integration: 'position-sizing'
    },
    version: 'v1.0'
  },
  {
    id: 'strategy-rl-execution-policy',
    slug: 'rl_execution_policy_overlay',
    name: 'RL Execution Policy (Overlay)',
    description: 'Reinforcement-learning policy that chooses between limit/market/iceberg and re-quotes to reduce slippage and fees for existing signals.',
    type: 'ai-rl-execution',
    status: 'advanced',
    complexity: 'advanced',
    marketConditions: ['any'],
    tags: ['AI', 'Overlay'],
    risk: 'high',
    riskLabel: 'Medium-High Risk',
    timeframe: '1m - 15m',
    bestFor: 'Low-latency strategies on liquid venues',
    advantages: [
      'Better fills and lower costs',
      'Learns venue microstructure behavior',
      'Strong with momentum/scalping entries'
    ],
    considerations: [
      'Training is data-intensive',
      'Can overfit to one venue if not monitored'
    ],
    overlay: true,
    parameters: {
      actionSpace: ['limit', 'market', 'iceberg'],
      retrainCadenceHours: 6,
      rewardSignal: 'implementation-shortfall'
    },
    version: 'v1.1'
  },
  {
    id: 'strategy-anomaly-guard',
    slug: 'anomaly_guard_overlay',
    name: 'Anomaly Guard (Overlay)',
    description: 'Detects abnormal order-book/liquidation patterns (e.g., spoofing, cascades) and enforces risk-off or tighter limits as a defensive layer.',
    type: 'ai-anomaly-guard',
    status: 'available',
    complexity: 'beginner',
    marketConditions: ['any'],
    tags: ['AI', 'Overlay'],
    risk: 'low',
    timeframe: 'Any',
    bestFor: 'All strategies as a safety overlay',
    advantages: [
      'Cuts tail losses during disorderly moves',
      'Independent safety layer for any strategy',
      'Lightweight to run'
    ],
    considerations: [
      'Defensive only - no entries',
      'May occasionally sideline good trades'
    ],
    overlay: true,
    parameters: {
      detectionWindowSeconds: 30,
      anomalyScoreThreshold: 0.8,
      responseMode: 'risk-off'
    },
    version: 'v1.0'
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

// --- Tax reporting mock data ---

export const mockVenueTransactions: MockVenueTransaction[] = [
  {
    id: 'txn-2023-0001',
    venue: 'Kraken',
    baseAsset: 'SOL',
    quoteAsset: 'USD',
    type: 'trade',
    side: 'buy',
    quantity: 250,
    price: 20,
    grossValue: 5000,
    feeAmount: 7.5,
    feeAsset: 'USD',
    netValue: 5007.5,
    realizedPnl: 0,
    orderId: 'kr-102938',
    externalRef: 'kraken:102938',
    source: 'manual_sync',
    initiatedBy: 'external',
    venueAccountId: 'kraken-primary',
    tradePair: 'SOL/USD',
    venueTimestamp: '2023-03-15T10:05:00Z',
    settledAt: '2023-03-15T10:05:05Z',
    createdAt: '2023-03-15T10:30:00Z',
    updatedAt: '2023-03-15T10:30:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.92,
      value: 4606.9
    },
    taxLotRef: 'lot-sol-2023-01',
    notes: 'Initial SOL accumulation from manual discretionary trade.'
  },
  {
    id: 'txn-2023-0002',
    venue: 'Kraken',
    baseAsset: 'SOL',
    quoteAsset: 'USD',
    type: 'trade',
    side: 'sell',
    quantity: 120,
    price: 26,
    grossValue: 3120,
    feeAmount: 4.68,
    feeAsset: 'USD',
    netValue: 3115.32,
    realizedPnl: 665.32,
    orderId: 'kr-118844',
    externalRef: 'kraken:118844',
    source: 'manual_sync',
    initiatedBy: 'external',
    venueAccountId: 'kraken-primary',
    tradePair: 'SOL/USD',
    venueTimestamp: '2023-06-22T15:40:00Z',
    settledAt: '2023-06-22T15:40:07Z',
    createdAt: '2023-06-22T16:10:00Z',
    updatedAt: '2023-06-22T16:10:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.91,
      value: 2834.94
    },
    taxLotRef: 'lot-sol-2023-01',
    notes: 'Partial disposal of SOL position following rally to $26.'
  },
  {
    id: 'txn-2023-0003',
    venue: 'OKX',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    type: 'transfer_in',
    quantity: 0.4,
    price: 27500,
    grossValue: 11000,
    feeAmount: 0,
    feeAsset: 'USDT',
    netValue: 11000,
    realizedPnl: 0,
    externalRef: 'multi-sig:okx-2023-08',
    source: 'imported_csv',
    initiatedBy: 'manual',
    venueAccountId: 'okx-desk',
    walletAddress: '0x43eF98cd91aFd5B8B2',
    tradePair: 'BTC/USDT',
    venueTimestamp: '2023-08-05T09:20:00Z',
    settledAt: '2023-08-05T09:35:00Z',
    createdAt: '2023-08-05T09:35:15Z',
    updatedAt: '2023-08-05T09:35:15Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.9,
      value: 9900
    },
    taxLotRef: 'lot-btc-transfer-2023-01',
    notes: 'Desk transferred BTC into OKX for liquidity provisioning.'
  },
  {
    id: 'txn-2023-0004',
    venue: 'BX Digital',
    baseAsset: 'CHF',
    quoteAsset: 'CHF',
    type: 'interest',
    quantity: 0,
    price: 1,
    grossValue: 420,
    feeAmount: 0,
    feeAsset: 'CHF',
    netValue: 420,
    realizedPnl: 420,
    externalRef: 'bxd-yield:2023-10',
    source: 'rugira_bot',
    initiatedBy: 'bot',
    strategyId: 'strategy-anomaly_guard_overlay',
    botId: 'bot-6',
    venueAccountId: 'bxd-income',
    tradePair: 'CHF/CHF',
    venueTimestamp: '2023-10-19T19:00:00Z',
    settledAt: '2023-10-19T19:05:00Z',
    createdAt: '2023-10-19T19:05:20Z',
    updatedAt: '2023-10-19T19:05:20Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 1,
      value: 420
    },
    taxLotRef: 'income-2023-bxd',
    notes: 'Monthly income distributed by BX Digital tokenized fund.'
  },
  {
    id: 'txn-2023-0005',
    venue: 'Taurus TDX',
    baseAsset: 'ETH',
    quoteAsset: 'CHF',
    type: 'airdrop',
    quantity: 3,
    price: 1600,
    grossValue: 4800,
    feeAmount: 0,
    feeAsset: 'CHF',
    netValue: 4800,
    realizedPnl: 4800,
    externalRef: 'taurus:airdrop:merge',
    source: 'manual_sync',
    initiatedBy: 'external',
    venueAccountId: 'taurus-primary',
    tradePair: 'ETH/CHF',
    venueTimestamp: '2023-12-01T12:30:00Z',
    settledAt: '2023-12-01T12:30:00Z',
    createdAt: '2023-12-01T13:00:00Z',
    updatedAt: '2023-12-01T13:00:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 1,
      value: 4800
    },
    taxLotRef: 'income-2023-taurus',
    notes: 'Airdropped ETH from staking derivative migration.'
  },
  {
    id: 'txn-2023-0006',
    venue: 'Bybit',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    type: 'trade',
    side: 'buy',
    quantity: 0.25,
    price: 29000,
    grossValue: 7250,
    feeAmount: 10.87,
    feeAsset: 'USDT',
    netValue: 7260.87,
    realizedPnl: 0,
    orderId: 'byb-2023-btc',
    externalRef: 'bybit:2023:btcaccum',
    source: 'imported_csv',
    initiatedBy: 'manual',
    venueAccountId: 'bybit-primary',
    tradePair: 'BTC/USDT',
    venueTimestamp: '2023-11-12T06:35:00Z',
    settledAt: '2023-11-12T06:35:08Z',
    createdAt: '2023-11-12T06:50:00Z',
    updatedAt: '2023-11-12T06:50:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.91,
      value: 6607.39
    },
    taxLotRef: 'lot-btc-2023-bybit',
    notes: 'Bybit accumulation executed manually outside Rugira.'
  },
  {
    id: 'txn-2023-0007',
    venue: 'Securitize',
    baseAsset: 'USDC',
    quoteAsset: 'CHF',
    type: 'interest',
    quantity: 0,
    price: 1,
    grossValue: 280,
    feeAmount: 0,
    feeAsset: 'CHF',
    netValue: 280,
    realizedPnl: 280,
    externalRef: 'securitize:income:2023-12',
    source: 'manual_sync',
    initiatedBy: 'manual',
    venueAccountId: 'securitize-yield',
    tradePair: 'USDC/CHF',
    venueTimestamp: '2023-12-20T21:00:00Z',
    settledAt: '2023-12-20T21:05:00Z',
    createdAt: '2023-12-20T21:05:45Z',
    updatedAt: '2023-12-20T21:05:45Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 1,
      value: 280
    },
    taxLotRef: 'income-2023-securitize',
    notes: 'Year-end distribution from Securitize tokenized fund.'
  },
  {
    id: 'txn-2023-0008',
    venue: 'Binance',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    type: 'trade',
    side: 'sell',
    quantity: 0.18,
    price: 30500,
    grossValue: 5490,
    feeAmount: 8.24,
    feeAsset: 'USDT',
    netValue: 5481.76,
    realizedPnl: 721.76,
    orderId: 'bn-2023-sell-1',
    externalRef: 'binance:2023:sell-1',
    source: 'manual_sync',
    initiatedBy: 'external',
    venueAccountId: 'binance-primary',
    tradePair: 'BTC/USDT',
    venueTimestamp: '2023-12-18T11:47:00Z',
    settledAt: '2023-12-18T11:47:05Z',
    createdAt: '2023-12-18T12:05:00Z',
    updatedAt: '2023-12-18T12:05:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.92,
      value: 5046.02
    },
    taxLotRef: 'lot-btc-transfer-2023-01',
    notes: 'Closed part of BTC position before year end.'
  },
  {
    id: 'txn-2023-0009',
    venue: 'OKX',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    type: 'trade',
    side: 'sell',
    quantity: 0.12,
    price: 29200,
    grossValue: 3504,
    feeAmount: 5.26,
    feeAsset: 'USDT',
    netValue: 3498.74,
    realizedPnl: 438.74,
    externalRef: 'okx:2023:sell-btc',
    source: 'imported_csv',
    initiatedBy: 'manual',
    venueAccountId: 'okx-desk',
    tradePair: 'BTC/USDT',
    venueTimestamp: '2023-12-28T09:05:00Z',
    settledAt: '2023-12-28T09:05:00Z',
    createdAt: '2023-12-28T09:20:00Z',
    updatedAt: '2023-12-28T09:20:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.91,
      value: 3189.85
    },
    taxLotRef: 'lot-btc-transfer-2023-01',
    notes: 'Desk trimmed BTC inventory for treasury balancing.'
  },
  {
    id: 'txn-2023-0010',
    venue: 'Bybit',
    baseAsset: 'ARB',
    quoteAsset: 'USDT',
    type: 'staking_reward',
    quantity: 95,
    price: 1.05,
    grossValue: 99.75,
    feeAmount: 0,
    feeAsset: 'USDT',
    netValue: 99.75,
    realizedPnl: 99.75,
    externalRef: 'bybit:staking:2023',
    source: 'rugira_bot',
    initiatedBy: 'bot',
    strategyId: 'strategy-grid_trading',
    botId: 'bot-3',
    venueAccountId: 'bybit-primary',
    tradePair: 'ARB/USDT',
    venueTimestamp: '2023-11-30T07:00:00Z',
    settledAt: '2023-11-30T07:02:00Z',
    createdAt: '2023-11-30T07:05:00Z',
    updatedAt: '2023-11-30T07:05:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.9,
      value: 89.78
    },
    taxLotRef: 'income-2023-bybit',
    notes: 'Monthly ARB staking reward credited on Bybit.'
  },
  {
    id: 'txn-2023-0011',
    venue: 'SDX',
    baseAsset: 'DOT',
    quoteAsset: 'CHF',
    type: 'staking_reward',
    quantity: 16,
    price: 6.6,
    grossValue: 105.6,
    feeAmount: 0.16,
    feeAsset: 'DOT',
    netValue: 105.44,
    realizedPnl: 105.44,
    externalRef: 'sdx:reward:2023-11',
    source: 'rugira_bot',
    initiatedBy: 'bot',
    strategyId: 'strategy-volatility_forecaster_overlay',
    botId: 'bot-4',
    venueAccountId: 'sdx-yield',
    tradePair: 'DOT/CHF',
    venueTimestamp: '2023-11-15T18:00:00Z',
    settledAt: '2023-11-15T18:05:00Z',
    createdAt: '2023-11-15T18:05:10Z',
    updatedAt: '2023-11-15T18:05:10Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 1,
      value: 105.44
    },
    taxLotRef: 'income-2023-sdx',
    notes: 'SDX staking reward prior to year-end reporting.'
  },
  {
    id: 'txn-2023-0012',
    venue: 'Kraken',
    baseAsset: 'SOL',
    quoteAsset: 'USD',
    type: 'trade',
    side: 'sell',
    quantity: 40,
    price: 25,
    grossValue: 1000,
    feeAmount: 1.5,
    feeAsset: 'USD',
    netValue: 998.5,
    realizedPnl: 198.5,
    orderId: 'kr-2023-sol-sell2',
    externalRef: 'kraken:2023:solsell2',
    source: 'manual_sync',
    initiatedBy: 'external',
    venueAccountId: 'kraken-primary',
    tradePair: 'SOL/USD',
    venueTimestamp: '2023-12-29T20:12:00Z',
    settledAt: '2023-12-29T20:12:03Z',
    createdAt: '2023-12-29T20:30:00Z',
    updatedAt: '2023-12-29T20:30:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.91,
      value: 908.63
    },
    taxLotRef: 'lot-sol-2023-01',
    notes: 'Last-minute SOL trim before fiscal close.'
  },
  {
    id: 'txn-2024-0001',
    venue: 'Coinbase',
    baseAsset: 'ETH',
    quoteAsset: 'USD',
    type: 'trade',
    side: 'buy',
    quantity: 2.5,
    price: 2100,
    grossValue: 5250,
    feeAmount: 10.5,
    feeAsset: 'USD',
    netValue: 5260.5,
    realizedPnl: 0,
    orderId: 'cb-2024-eth-buy',
    externalRef: 'coinbase:2024:ethbuy',
    source: 'rugira_bot',
    initiatedBy: 'bot',
    strategyId: 'strategy-ai_trend_classifier',
    botId: 'bot-7',
    venueAccountId: 'coinbase-primary',
    tradePair: 'ETH/USD',
    venueTimestamp: '2024-01-07T09:45:00Z',
    settledAt: '2024-01-07T09:45:03Z',
    createdAt: '2024-01-07T09:50:00Z',
    updatedAt: '2024-01-07T09:50:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.9,
      value: 4860.45
    },
    taxLotRef: 'lot-eth-2024-bot',
    notes: 'Bot-driven ETH accumulation as part of trend strategy.'
  },
  {
    id: 'txn-2024-0002',
    venue: 'Coinbase',
    baseAsset: 'ETH',
    quoteAsset: 'USD',
    type: 'trade',
    side: 'sell',
    quantity: 1.4,
    price: 2850,
    grossValue: 3990,
    feeAmount: 7.98,
    feeAsset: 'USD',
    netValue: 3982.02,
    realizedPnl: 877.02,
    orderId: 'cb-2024-eth-sell',
    externalRef: 'coinbase:2024:ethsell',
    source: 'manual_sync',
    initiatedBy: 'external',
    venueAccountId: 'coinbase-primary',
    tradePair: 'ETH/USD',
    venueTimestamp: '2024-05-14T18:20:00Z',
    settledAt: '2024-05-14T18:20:03Z',
    createdAt: '2024-05-14T18:45:00Z',
    updatedAt: '2024-05-14T18:45:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.91,
      value: 3623.64
    },
    taxLotRef: 'lot-eth-2024-bot',
    notes: 'Partial take-profit on ETH rallying above $2800.'
  },
  {
    id: 'txn-2024-0003',
    venue: 'KuCoin',
    baseAsset: 'ATOM',
    quoteAsset: 'USDT',
    type: 'staking_reward',
    quantity: 22,
    price: 11.5,
    grossValue: 253,
    feeAmount: 0.23,
    feeAsset: 'ATOM',
    netValue: 252.77,
    realizedPnl: 252.77,
    externalRef: 'kucoin:staking:2024-07',
    source: 'rugira_bot',
    initiatedBy: 'bot',
    strategyId: 'strategy-grid-trading',
    botId: 'bot-5',
    venueAccountId: 'kucoin-yield',
    tradePair: 'ATOM/USDT',
    venueTimestamp: '2024-07-01T12:00:00Z',
    settledAt: '2024-07-01T12:03:00Z',
    createdAt: '2024-07-01T12:03:30Z',
    updatedAt: '2024-07-01T12:03:30Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.9,
      value: 227.49
    },
    taxLotRef: 'income-2024-kucoin',
    notes: 'Monthly ATOM staking yield from KuCoin validator pool.'
  },
  {
    id: 'txn-2024-0004',
    venue: 'Binance',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    type: 'transfer_out',
    quantity: 0.3,
    price: 31000,
    grossValue: 9300,
    feeAmount: 15,
    feeAsset: 'USDT',
    netValue: 9285,
    realizedPnl: 0,
    orderId: 'bn-withdraw-2024-09',
    externalRef: 'binance:withdraw:2024-09',
    source: 'imported_csv',
    initiatedBy: 'manual',
    venueAccountId: 'binance-primary',
    walletAddress: 'bc1qtransfer2024',
    tradePair: 'BTC/USDT',
    venueTimestamp: '2024-09-18T07:55:00Z',
    settledAt: '2024-09-18T08:10:00Z',
    createdAt: '2024-09-18T08:10:30Z',
    updatedAt: '2024-09-18T08:10:30Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.92,
      value: 8542.2
    },
    notes: 'BTC moved to institutional custodian wallet for safekeeping.'
  },
  {
    id: 'txn-2024-0005',
    venue: 'Franklin',
    baseAsset: 'USDC',
    quoteAsset: 'CHF',
    type: 'interest',
    quantity: 0,
    price: 1,
    grossValue: 365,
    feeAmount: 0,
    feeAsset: 'CHF',
    netValue: 365,
    realizedPnl: 365,
    externalRef: 'franklin:income:2024Q4',
    source: 'manual_sync',
    initiatedBy: 'external',
    venueAccountId: 'franklin-income',
    tradePair: 'USDC/CHF',
    venueTimestamp: '2024-11-05T16:00:00Z',
    settledAt: '2024-11-05T16:01:00Z',
    createdAt: '2024-11-05T16:05:00Z',
    updatedAt: '2024-11-05T16:05:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 1,
      value: 365
    },
    taxLotRef: 'income-2024-franklin',
    notes: 'Quarterly distribution from Franklin BENJI tokenized fund.'
  },
  {
    id: 'txn-2024-0006',
    venue: 'Kraken',
    baseAsset: 'SOL',
    quoteAsset: 'USD',
    type: 'trade',
    side: 'buy',
    quantity: 180,
    price: 28,
    grossValue: 5040,
    feeAmount: 7.56,
    feeAsset: 'USD',
    netValue: 5047.56,
    realizedPnl: 0,
    orderId: 'kr-2024-sol-buy',
    externalRef: 'kraken:2024:solbuy',
    source: 'rugira_bot',
    initiatedBy: 'bot',
    strategyId: 'strategy-regime_detection_ensemble',
    botId: 'bot-8',
    venueAccountId: 'kraken-primary',
    tradePair: 'SOL/USD',
    venueTimestamp: '2024-08-09T13:25:00Z',
    settledAt: '2024-08-09T13:25:05Z',
    createdAt: '2024-08-09T13:40:00Z',
    updatedAt: '2024-08-09T13:40:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.92,
      value: 4643.76
    },
    taxLotRef: 'lot-sol-2024-bot',
    notes: 'Kraken SOL accumulation from regime detection strategy.'
  },
  {
    id: 'txn-2024-0007',
    venue: 'Taurus TDX',
    baseAsset: 'ETH',
    quoteAsset: 'CHF',
    type: 'trade',
    side: 'sell',
    quantity: 1.5,
    price: 2450,
    grossValue: 3675,
    feeAmount: 3.67,
    feeAsset: 'CHF',
    netValue: 3671.33,
    realizedPnl: 890.33,
    externalRef: 'taurus:sell:2024',
    source: 'imported_csv',
    initiatedBy: 'manual',
    venueAccountId: 'taurus-primary',
    tradePair: 'ETH/CHF',
    venueTimestamp: '2024-10-11T10:12:00Z',
    settledAt: '2024-10-11T10:12:00Z',
    createdAt: '2024-10-11T10:30:00Z',
    updatedAt: '2024-10-11T10:30:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 1,
      value: 3671.33
    },
    taxLotRef: 'lot-eth-taurus-2023',
    notes: 'Realized gain booked after ETH appreciation on Taurus.'
  },
  {
    id: 'txn-2024-0008',
    venue: 'Binance',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    type: 'trade',
    side: 'sell',
    quantity: 0.22,
    price: 33500,
    grossValue: 7370,
    feeAmount: 11.05,
    feeAsset: 'USDT',
    netValue: 7358.95,
    realizedPnl: 1138.95,
    orderId: 'bn-2024-sell',
    externalRef: 'binance:2024:sell',
    source: 'rugira_bot',
    initiatedBy: 'bot',
    strategyId: 'strategy-ai_trend_classifier',
    botId: 'bot-7',
    venueAccountId: 'binance-primary',
    tradePair: 'BTC/USDT',
    venueTimestamp: '2024-11-12T09:14:00Z',
    settledAt: '2024-11-12T09:14:05Z',
    createdAt: '2024-11-12T09:25:00Z',
    updatedAt: '2024-11-12T09:25:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.93,
      value: 6843.82
    },
    taxLotRef: 'lot-btc-2024-grid',
    notes: 'Trend classifier bot took profit at $33.5k.'
  },
  {
    id: 'txn-2024-0009',
    venue: 'KuCoin',
    baseAsset: 'ATOM',
    quoteAsset: 'USDT',
    type: 'trade',
    side: 'sell',
    quantity: 110,
    price: 12.4,
    grossValue: 1364,
    feeAmount: 1.36,
    feeAsset: 'USDT',
    netValue: 1362.64,
    realizedPnl: 298.64,
    orderId: 'kucoin-2024-atom-sell',
    externalRef: 'kucoin:2024:atomsell',
    source: 'rugira_bot',
    initiatedBy: 'bot',
    strategyId: 'strategy-grid-trading',
    botId: 'bot-5',
    venueAccountId: 'kucoin-yield',
    tradePair: 'ATOM/USDT',
    venueTimestamp: '2024-09-03T04:12:00Z',
    settledAt: '2024-09-03T04:12:00Z',
    createdAt: '2024-09-03T04:25:00Z',
    updatedAt: '2024-09-03T04:25:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.92,
      value: 1254.63
    },
    taxLotRef: 'lot-atom-2024-grid',
    notes: 'Grid bot realized ATOM profits on KuCoin.'
  },
  {
    id: 'txn-2024-0010',
    venue: 'BX Digital',
    baseAsset: 'CHF',
    quoteAsset: 'CHF',
    type: 'interest',
    quantity: 0,
    price: 1,
    grossValue: 390,
    feeAmount: 0,
    feeAsset: 'CHF',
    netValue: 390,
    realizedPnl: 390,
    externalRef: 'bxd:income:2024-05',
    source: 'manual_sync',
    initiatedBy: 'manual',
    venueAccountId: 'bxd-income',
    tradePair: 'CHF/CHF',
    venueTimestamp: '2024-05-02T18:00:00Z',
    settledAt: '2024-05-02T18:05:00Z',
    createdAt: '2024-05-02T18:10:00Z',
    updatedAt: '2024-05-02T18:10:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 1,
      value: 390
    },
    taxLotRef: 'income-2024-bxd',
    notes: 'Monthly BX Digital income distribution.'
  },
  {
    id: 'txn-2024-0011',
    venue: 'Taurus TDX',
    baseAsset: 'ETH',
    quoteAsset: 'CHF',
    type: 'airdrop',
    quantity: 2,
    price: 2380,
    grossValue: 4760,
    feeAmount: 0,
    feeAsset: 'CHF',
    netValue: 4760,
    realizedPnl: 4760,
    externalRef: 'taurus:airdrop:2024',
    source: 'manual_sync',
    initiatedBy: 'external',
    venueAccountId: 'taurus-primary',
    tradePair: 'ETH/CHF',
    venueTimestamp: '2024-03-12T12:00:00Z',
    settledAt: '2024-03-12T12:00:00Z',
    createdAt: '2024-03-12T12:30:00Z',
    updatedAt: '2024-03-12T12:30:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 1,
      value: 4760
    },
    taxLotRef: 'income-2024-taurus',
    notes: 'Token merge reward credited to Taurus account.'
  },
  {
    id: 'txn-2024-0012',
    venue: 'SDX',
    baseAsset: 'DOT',
    quoteAsset: 'CHF',
    type: 'trade',
    side: 'sell',
    quantity: 140,
    price: 7.2,
    grossValue: 1008,
    feeAmount: 1,
    feeAsset: 'CHF',
    netValue: 1007,
    realizedPnl: 215,
    externalRef: 'sdx:sell:2024',
    source: 'manual_sync',
    initiatedBy: 'external',
    venueAccountId: 'sdx-yield',
    tradePair: 'DOT/CHF',
    venueTimestamp: '2024-12-04T10:05:00Z',
    settledAt: '2024-12-04T10:05:00Z',
    createdAt: '2024-12-04T10:30:00Z',
    updatedAt: '2024-12-04T10:30:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 1,
      value: 1007
    },
    taxLotRef: 'lot-dot-2023-sdx',
    notes: 'Realized DOT gains to rebalance SDX staking account.'
  },
  {
    id: 'txn-2025-0001',
    venue: 'Binance',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    type: 'trade',
    side: 'buy',
    quantity: 0.5,
    price: 42000,
    grossValue: 21000,
    feeAmount: 31.5,
    feeAsset: 'USDT',
    netValue: 21031.5,
    realizedPnl: 0,
    orderId: 'bn-2025-buy',
    externalRef: 'binance:92837465',
    source: 'rugira_bot',
    initiatedBy: 'bot',
    strategyId: 'strategy-arbitrage-trading',
    botId: 'bot-1',
    venueAccountId: 'binance-primary',
    tradePair: 'BTC/USDT',
    venueTimestamp: '2025-01-05T10:15:00Z',
    settledAt: '2025-01-05T10:15:02Z',
    createdAt: '2025-01-05T10:15:05Z',
    updatedAt: '2025-01-05T10:15:05Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.88,
      value: 18507.72
    },
    taxLotRef: 'lot-btc-2025-01',
    notes: 'Filled via Rugira arbitrage bot at Binance.'
  },
  {
    id: 'txn-2025-0002',
    venue: 'Binance',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    type: 'trade',
    side: 'sell',
    quantity: 0.3,
    price: 45500,
    grossValue: 13650,
    feeAmount: 20.47,
    feeAsset: 'USDT',
    netValue: 13629.53,
    realizedPnl: 1250.53,
    orderId: 'bn-2025-sell',
    externalRef: 'binance:2025:sell',
    source: 'rugira_bot',
    initiatedBy: 'bot',
    strategyId: 'strategy-ai_trend_classifier',
    botId: 'bot-2',
    venueAccountId: 'binance-primary',
    tradePair: 'BTC/USDT',
    venueTimestamp: '2025-02-14T11:22:00Z',
    settledAt: '2025-02-14T11:22:03Z',
    createdAt: '2025-02-14T11:35:00Z',
    updatedAt: '2025-02-14T11:35:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.87,
      value: 11857.69
    },
    taxLotRef: 'lot-btc-2025-01',
    notes: 'Partial exit from BTC arbitrage position at $45.5k.'
  },
  {
    id: 'txn-2025-0003',
    venue: 'SDX',
    baseAsset: 'DOT',
    quoteAsset: 'CHF',
    type: 'staking_reward',
    quantity: 18,
    price: 6.9,
    grossValue: 124.2,
    feeAmount: 0.18,
    feeAsset: 'DOT',
    netValue: 123.9,
    realizedPnl: 123.9,
    externalRef: 'sdx:reward:2025-03',
    source: 'rugira_bot',
    initiatedBy: 'bot',
    strategyId: 'strategy-volatility_forecaster_overlay',
    botId: 'bot-4',
    venueAccountId: 'sdx-yield',
    tradePair: 'DOT/CHF',
    venueTimestamp: '2025-03-20T18:00:00Z',
    settledAt: '2025-03-20T18:05:00Z',
    createdAt: '2025-03-20T18:05:15Z',
    updatedAt: '2025-03-20T18:05:15Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 1,
      value: 123.9
    },
    taxLotRef: 'income-2025-sdx',
    notes: 'Weekly DOT staking reward compounded automatically.'
  },
  {
    id: 'txn-2025-0004',
    venue: 'Securitize',
    baseAsset: 'USDC',
    quoteAsset: 'CHF',
    type: 'interest',
    quantity: 0,
    price: 1,
    grossValue: 410,
    feeAmount: 0,
    feeAsset: 'CHF',
    netValue: 410,
    realizedPnl: 410,
    externalRef: 'securitize:income:2025-04',
    source: 'manual_sync',
    initiatedBy: 'manual',
    venueAccountId: 'securitize-yield',
    tradePair: 'USDC/CHF',
    venueTimestamp: '2025-04-02T21:00:00Z',
    settledAt: '2025-04-02T21:05:00Z',
    createdAt: '2025-04-02T21:06:00Z',
    updatedAt: '2025-04-02T21:06:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 1,
      value: 410
    },
    taxLotRef: 'income-2025-securitize',
    notes: 'Monthly income from Securitize issuer platform.'
  },
  {
    id: 'txn-2025-0005',
    venue: 'Bybit',
    baseAsset: 'ARB',
    quoteAsset: 'USDT',
    type: 'airdrop',
    quantity: 180,
    price: 1.85,
    grossValue: 333,
    feeAmount: 0,
    feeAsset: 'USDT',
    netValue: 333,
    realizedPnl: 333,
    externalRef: 'bybit:airdrop:arb',
    source: 'imported_csv',
    initiatedBy: 'external',
    venueAccountId: 'bybit-primary',
    tradePair: 'ARB/USDT',
    venueTimestamp: '2025-05-18T07:45:00Z',
    settledAt: '2025-05-18T07:45:00Z',
    createdAt: '2025-05-18T08:00:00Z',
    updatedAt: '2025-05-18T08:00:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.87,
      value: 289.71
    },
    taxLotRef: 'income-2025-bybit',
    notes: 'Marketing airdrop from Bybit ecosystem programme.'
  },
  {
    id: 'txn-2025-0006',
    venue: 'Kraken',
    baseAsset: 'SOL',
    quoteAsset: 'USD',
    type: 'trade',
    side: 'sell',
    quantity: 90,
    price: 34,
    grossValue: 3060,
    feeAmount: 4.59,
    feeAsset: 'USD',
    netValue: 3055.41,
    realizedPnl: 612.41,
    orderId: 'kr-2025-sol-sell',
    externalRef: 'kraken:2025:solsell',
    source: 'rugira_bot',
    initiatedBy: 'bot',
    strategyId: 'strategy-regime_detection_ensemble',
    botId: 'bot-8',
    venueAccountId: 'kraken-primary',
    tradePair: 'SOL/USD',
    venueTimestamp: '2025-04-28T14:18:00Z',
    settledAt: '2025-04-28T14:18:06Z',
    createdAt: '2025-04-28T14:35:00Z',
    updatedAt: '2025-04-28T14:35:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.89,
      value: 2719.31
    },
    taxLotRef: 'lot-sol-2024-bot',
    notes: 'Regime strategy trimming SOL exposure at $34.'
  },
  {
    id: 'txn-2025-0007',
    venue: 'Franklin',
    baseAsset: 'USDC',
    quoteAsset: 'CHF',
    type: 'interest',
    quantity: 0,
    price: 1,
    grossValue: 410,
    feeAmount: 0,
    feeAsset: 'CHF',
    netValue: 410,
    realizedPnl: 410,
    externalRef: 'franklin:income:2025Q2',
    source: 'manual_sync',
    initiatedBy: 'external',
    venueAccountId: 'franklin-income',
    tradePair: 'USDC/CHF',
    venueTimestamp: '2025-06-10T15:15:00Z',
    settledAt: '2025-06-10T15:15:30Z',
    createdAt: '2025-06-10T15:20:00Z',
    updatedAt: '2025-06-10T15:20:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 1,
      value: 410
    },
    taxLotRef: 'income-2025-franklin',
    notes: 'Quarterly BENJI token income in 2025.'
  },
  {
    id: 'txn-2025-0008',
    venue: 'Coinbase',
    baseAsset: 'ETH',
    quoteAsset: 'USD',
    type: 'trade',
    side: 'sell',
    quantity: 1.1,
    price: 3050,
    grossValue: 3355,
    feeAmount: 6.71,
    feeAsset: 'USD',
    netValue: 3348.29,
    realizedPnl: 845.29,
    orderId: 'cb-2025-eth-sell',
    externalRef: 'coinbase:2025:ethsell',
    source: 'rugira_bot',
    initiatedBy: 'bot',
    strategyId: 'strategy-ai_trend_classifier',
    botId: 'bot-7',
    venueAccountId: 'coinbase-primary',
    tradePair: 'ETH/USD',
    venueTimestamp: '2025-06-05T09:20:00Z',
    settledAt: '2025-06-05T09:20:03Z',
    createdAt: '2025-06-05T09:25:00Z',
    updatedAt: '2025-06-05T09:25:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.9,
      value: 3013.46
    },
    taxLotRef: 'lot-eth-2024-bot',
    notes: 'Coinbase bot exited ETH swing position at $3,050.'
  },
  {
    id: 'txn-2025-0009',
    venue: 'Securitize',
    baseAsset: 'USDC',
    quoteAsset: 'CHF',
    type: 'interest',
    quantity: 0,
    price: 1,
    grossValue: 420,
    feeAmount: 0,
    feeAsset: 'CHF',
    netValue: 420,
    realizedPnl: 420,
    externalRef: 'securitize:income:2025-07',
    source: 'manual_sync',
    initiatedBy: 'manual',
    venueAccountId: 'securitize-yield',
    tradePair: 'USDC/CHF',
    venueTimestamp: '2025-07-15T21:00:00Z',
    settledAt: '2025-07-15T21:05:00Z',
    createdAt: '2025-07-15T21:05:45Z',
    updatedAt: '2025-07-15T21:05:45Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 1,
      value: 420
    },
    taxLotRef: 'income-2025-securitize',
    notes: 'Mid-year Securitize BENJI distribution.'
  },
  {
    id: 'txn-2025-0010',
    venue: 'Bybit',
    baseAsset: 'ARB',
    quoteAsset: 'USDT',
    type: 'trade',
    side: 'sell',
    quantity: 140,
    price: 1.95,
    grossValue: 273,
    feeAmount: 0.27,
    feeAsset: 'USDT',
    netValue: 272.73,
    realizedPnl: 112.73,
    orderId: 'bybit-2025-arb-sell',
    externalRef: 'bybit:2025:arbsell',
    source: 'imported_csv',
    initiatedBy: 'manual',
    venueAccountId: 'bybit-primary',
    tradePair: 'ARB/USDT',
    venueTimestamp: '2025-06-22T08:42:00Z',
    settledAt: '2025-06-22T08:42:00Z',
    createdAt: '2025-06-22T09:00:00Z',
    updatedAt: '2025-06-22T09:00:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.87,
      value: 237.27
    },
    taxLotRef: 'lot-arb-2023-bybit',
    notes: 'Sold ARB holdings accumulated via staking rewards.'
  },
  {
    id: 'txn-2025-0011',
    venue: 'SDX',
    baseAsset: 'DOT',
    quoteAsset: 'CHF',
    type: 'trade',
    side: 'sell',
    quantity: 180,
    price: 7.1,
    grossValue: 1278,
    feeAmount: 1.3,
    feeAsset: 'CHF',
    netValue: 1276.7,
    realizedPnl: 296.7,
    externalRef: 'sdx:sell:2025',
    source: 'manual_sync',
    initiatedBy: 'external',
    venueAccountId: 'sdx-yield',
    tradePair: 'DOT/CHF',
    venueTimestamp: '2025-07-01T09:12:00Z',
    settledAt: '2025-07-01T09:12:00Z',
    createdAt: '2025-07-01T09:20:00Z',
    updatedAt: '2025-07-01T09:20:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 1,
      value: 1276.7
    },
    taxLotRef: 'lot-dot-2024-sdx',
    notes: 'SDX desk monetized DOT gains mid-year.'
  },
  {
    id: 'txn-2025-0012',
    venue: 'KuCoin',
    baseAsset: 'ATOM',
    quoteAsset: 'USDT',
    type: 'staking_reward',
    quantity: 24,
    price: 12.1,
    grossValue: 290.4,
    feeAmount: 0.24,
    feeAsset: 'ATOM',
    netValue: 290.16,
    realizedPnl: 290.16,
    externalRef: 'kucoin:staking:2025-06',
    source: 'rugira_bot',
    initiatedBy: 'bot',
    strategyId: 'strategy-grid-trading',
    botId: 'bot-5',
    venueAccountId: 'kucoin-yield',
    tradePair: 'ATOM/USDT',
    venueTimestamp: '2025-06-15T12:00:00Z',
    settledAt: '2025-06-15T12:03:00Z',
    createdAt: '2025-06-15T12:05:00Z',
    updatedAt: '2025-06-15T12:05:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.88,
      value: 255.34
    },
    taxLotRef: 'income-2025-kucoin',
    notes: 'KuCoin validator distribution for June 2025.'
  },
  {
    id: 'txn-2025-0013',
    venue: 'OKX',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    type: 'trade',
    side: 'sell',
    quantity: 0.15,
    price: 46800,
    grossValue: 7020,
    feeAmount: 10.53,
    feeAsset: 'USDT',
    netValue: 7009.47,
    realizedPnl: 921.47,
    orderId: 'okx-2025-sell',
    externalRef: 'okx:2025:sell-btc',
    source: 'rugira_bot',
    initiatedBy: 'bot',
    strategyId: 'strategy-ai_trend_classifier',
    botId: 'bot-2',
    venueAccountId: 'okx-desk',
    tradePair: 'BTC/USDT',
    venueTimestamp: '2025-08-22T07:18:00Z',
    settledAt: '2025-08-22T07:18:05Z',
    createdAt: '2025-08-22T07:30:00Z',
    updatedAt: '2025-08-22T07:30:00Z',
    quoteConversion: {
      currency: 'CHF',
      rate: 0.86,
      value: 6028.14
    },
    taxLotRef: 'lot-btc-2024-grid',
    notes: 'OKX desk harvested BTC gains during summer rally.'
  }
];

export const mockVenueBalanceSnapshots: MockVenueBalanceSnapshot[] = [
  {
    id: 'bal-binance-btc-2023-12-31',
    venue: 'Binance',
    venueAccountId: 'binance-primary',
    asset: 'BTC',
    total: 0.9,
    available: 0.7,
    locked: 0.2,
    valueInBase: 27360,
    baseCurrency: 'CHF',
    capturedAt: '2023-12-31T23:59:59Z'
  },
  {
    id: 'bal-kraken-sol-2023-12-31',
    venue: 'Kraken',
    venueAccountId: 'kraken-primary',
    asset: 'SOL',
    total: 130,
    available: 120,
    locked: 10,
    valueInBase: 2650,
    baseCurrency: 'CHF',
    capturedAt: '2023-12-31T23:59:59Z'
  },
  {
    id: 'bal-okx-btc-2023-12-31',
    venue: 'OKX',
    venueAccountId: 'okx-desk',
    asset: 'BTC',
    total: 0.4,
    available: 0.4,
    locked: 0,
    valueInBase: 9900,
    baseCurrency: 'CHF',
    capturedAt: '2023-12-31T23:59:59Z'
  },
  {
    id: 'bal-bx-chf-2023-12-31',
    venue: 'BX Digital',
    venueAccountId: 'bxd-income',
    asset: 'CHF',
    total: 12450,
    available: 12450,
    locked: 0,
    valueInBase: 12450,
    baseCurrency: 'CHF',
    capturedAt: '2023-12-31T23:59:59Z'
  },
  {
    id: 'bal-binance-btc-2024-12-31',
    venue: 'Binance',
    venueAccountId: 'binance-primary',
    asset: 'BTC',
    total: 1.25,
    available: 1,
    locked: 0.25,
    valueInBase: 52050,
    baseCurrency: 'CHF',
    capturedAt: '2024-12-31T23:59:59Z'
  },
  {
    id: 'bal-binance-usdt-2024-12-31',
    venue: 'Binance',
    venueAccountId: 'binance-primary',
    asset: 'USDT',
    total: 18500,
    available: 18200,
    locked: 300,
    valueInBase: 16280,
    baseCurrency: 'CHF',
    capturedAt: '2024-12-31T23:59:59Z'
  },
  {
    id: 'bal-coinbase-eth-2024-12-31',
    venue: 'Coinbase',
    venueAccountId: 'coinbase-primary',
    asset: 'ETH',
    total: 4.2,
    available: 4.2,
    locked: 0,
    valueInBase: 13600,
    baseCurrency: 'CHF',
    capturedAt: '2024-12-31T23:59:59Z'
  },
  {
    id: 'bal-kucoin-atom-2024-12-31',
    venue: 'KuCoin',
    venueAccountId: 'kucoin-yield',
    asset: 'ATOM',
    total: 320,
    available: 300,
    locked: 20,
    valueInBase: 3200,
    baseCurrency: 'CHF',
    capturedAt: '2024-12-31T23:59:59Z'
  },
  {
    id: 'bal-sdx-dot-2024-12-31',
    venue: 'SDX',
    venueAccountId: 'sdx-yield',
    asset: 'DOT',
    total: 560,
    available: 520,
    locked: 40,
    valueInBase: 3800,
    baseCurrency: 'CHF',
    capturedAt: '2024-12-31T23:59:59Z'
  },
  {
    id: 'bal-binance-btc-2025-06-30',
    venue: 'Binance',
    venueAccountId: 'binance-primary',
    asset: 'BTC',
    total: 1.05,
    available: 0.75,
    locked: 0.3,
    valueInBase: 44700,
    baseCurrency: 'CHF',
    capturedAt: '2025-06-30T23:59:59Z'
  },
  {
    id: 'bal-coinbase-eth-2025-06-30',
    venue: 'Coinbase',
    venueAccountId: 'coinbase-primary',
    asset: 'ETH',
    total: 2.8,
    available: 2.6,
    locked: 0.2,
    valueInBase: 8500,
    baseCurrency: 'CHF',
    capturedAt: '2025-06-30T23:59:59Z'
  },
  {
    id: 'bal-sdx-dot-2025-06-30',
    venue: 'SDX',
    venueAccountId: 'sdx-yield',
    asset: 'DOT',
    total: 590,
    available: 540,
    locked: 50,
    valueInBase: 4150,
    baseCurrency: 'CHF',
    capturedAt: '2025-06-30T23:59:59Z'
  },
  {
    id: 'bal-bybit-arb-2025-06-30',
    venue: 'Bybit',
    venueAccountId: 'bybit-primary',
    asset: 'ARB',
    total: 220,
    available: 220,
    locked: 0,
    valueInBase: 191,
    baseCurrency: 'CHF',
    capturedAt: '2025-06-30T23:59:59Z'
  },
  {
    id: 'bal-securitize-usdc-2025-06-30',
    venue: 'Securitize',
    venueAccountId: 'securitize-yield',
    asset: 'USDC',
    total: 17500,
    available: 17500,
    locked: 0,
    valueInBase: 15600,
    baseCurrency: 'CHF',
    capturedAt: '2025-06-30T23:59:59Z'
  }
];

export const mockFxRates: MockFxRate[] = [
  {
    id: 'fx-usd-chf-2023-03-15',
    baseCurrency: 'USD',
    quoteCurrency: 'CHF',
    rate: 0.92,
    capturedAt: '2023-03-15T00:00:00Z',
    source: 'MockFXFeed'
  },
  {
    id: 'fx-usdt-chf-2023-08-05',
    baseCurrency: 'USDT',
    quoteCurrency: 'CHF',
    rate: 0.90,
    capturedAt: '2023-08-05T00:00:00Z',
    source: 'MockFXFeed'
  },
  {
    id: 'fx-usd-chf-2024-01-07',
    baseCurrency: 'USD',
    quoteCurrency: 'CHF',
    rate: 0.90,
    capturedAt: '2024-01-07T00:00:00Z',
    source: 'MockFXFeed'
  },
  {
    id: 'fx-usd-chf-2024-05-14',
    baseCurrency: 'USD',
    quoteCurrency: 'CHF',
    rate: 0.91,
    capturedAt: '2024-05-14T00:00:00Z',
    source: 'MockFXFeed'
  },
  {
    id: 'fx-usdt-chf-2024-09-18',
    baseCurrency: 'USDT',
    quoteCurrency: 'CHF',
    rate: 0.92,
    capturedAt: '2024-09-18T00:00:00Z',
    source: 'MockFXFeed'
  },
  {
    id: 'fx-eur-chf-2024-12-31',
    baseCurrency: 'EUR',
    quoteCurrency: 'CHF',
    rate: 0.98,
    capturedAt: '2024-12-31T00:00:00Z',
    source: 'MockFXFeed'
  },
  {
    id: 'fx-usdt-chf-2025-01-05',
    baseCurrency: 'USDT',
    quoteCurrency: 'CHF',
    rate: 0.88,
    capturedAt: '2025-01-05T00:00:00Z',
    source: 'MockFXFeed'
  },
  {
    id: 'fx-usd-chf-2025-02-14',
    baseCurrency: 'USD',
    quoteCurrency: 'CHF',
    rate: 0.87,
    capturedAt: '2025-02-14T00:00:00Z',
    source: 'MockFXFeed'
  },
  {
    id: 'fx-chf-chf-2025-03-20',
    baseCurrency: 'CHF',
    quoteCurrency: 'CHF',
    rate: 1,
    capturedAt: '2025-03-20T00:00:00Z',
    source: 'MockFXFeed'
  },
  {
    id: 'fx-usdt-chf-2025-08-22',
    baseCurrency: 'USDT',
    quoteCurrency: 'CHF',
    rate: 0.86,
    capturedAt: '2025-08-22T00:00:00Z',
    source: 'MockFXFeed'
  }
];

export const mockMarketPrices: MockMarketPrice[] = [
  {
    id: 'price-sol-usd-2023-03-15',
    venue: 'Kraken',
    symbol: 'SOL/USD',
    price: 20.1,
    currency: 'USD',
    capturedAt: '2023-03-15T10:00:00Z',
    source: 'Kraken'
  },
  {
    id: 'price-btc-usdt-2023-08-05',
    venue: 'OKX',
    symbol: 'BTC/USDT',
    price: 27550,
    currency: 'USDT',
    capturedAt: '2023-08-05T09:15:00Z',
    source: 'OKX'
  },
  {
    id: 'price-eth-usd-2024-01-07',
    venue: 'Coinbase',
    symbol: 'ETH/USD',
    price: 2105,
    currency: 'USD',
    capturedAt: '2024-01-07T09:30:00Z',
    source: 'Coinbase'
  },
  {
    id: 'price-atom-usdt-2024-07-01',
    venue: 'KuCoin',
    symbol: 'ATOM/USDT',
    price: 11.6,
    currency: 'USDT',
    capturedAt: '2024-07-01T12:00:00Z',
    source: 'KuCoin'
  },
  {
    id: 'price-btc-usdt-2025-01-05',
    venue: 'Binance',
    symbol: 'BTC/USDT',
    price: 42550,
    currency: 'USDT',
    capturedAt: '2025-01-05T10:00:00Z',
    source: 'Binance'
  },
  {
    id: 'price-eth-usd-2025-02-14',
    venue: 'Coinbase',
    symbol: 'ETH/USD',
    price: 2860,
    currency: 'USD',
    capturedAt: '2025-02-14T11:00:00Z',
    source: 'Coinbase'
  },
  {
    id: 'price-dot-chf-2025-03-20',
    venue: 'SDX',
    symbol: 'DOT/CHF',
    price: 6.9,
    currency: 'CHF',
    capturedAt: '2025-03-20T18:00:00Z',
    source: 'SDX'
  },
  {
    id: 'price-arb-usdt-2025-05-18',
    venue: 'Bybit',
    symbol: 'ARB/USDT',
    price: 1.86,
    currency: 'USDT',
    capturedAt: '2025-05-18T07:40:00Z',
    source: 'Bybit'
  }
];
