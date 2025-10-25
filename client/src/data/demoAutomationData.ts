export type RiskStatus = 'OK' | 'WARN' | 'HALT';
export type ComplianceStatus = 'PASS' | 'WARN' | 'BLOCK';

export interface DemoAutomation {
  id: string;
  name: string;
  strategy: string;
  venue: string;
  routeVia: string;
  pair: string;
  status: 'running' | 'stopped' | 'error';
  uptime: string;
  lastTrade?: string;
  pnl24h: number;
  totalPnl: number;
  signalNow: number;
  signalTrend: number;
  signalSummary: string;
  riskStatus: RiskStatus;
  riskScore: number;
  drawdownPercent: number;
  consecutiveLosses: number;
  budgetUtilizationPercent: number;
  latencyP50?: number;
  latencyP95?: number;
  rejectRatePercent?: number;
  venueEdgeBps?: number;
  nextAction: string;
  complianceStatus: ComplianceStatus;
  complianceReason?: string;
}

export const demoAutomations: DemoAutomation[] = [
  {
    id: 'dlt-bx-01',
    name: 'DLT-BX-01',
    strategy: 'Conservative TWAP',
    venue: 'BX Digital',
    routeVia: 'InCore',
    pair: 'TEST-001/CHF',
    status: 'running',
    uptime: '0h 5m',
    lastTrade: 'Never',
    pnl24h: 0,
    totalPnl: 0,
    signalNow: 12,
    signalTrend: 58,
    signalSummary: 'Idle—no urgency',
    riskStatus: 'OK',
    riskScore: 8,
    drawdownPercent: 0,
    consecutiveLosses: 0,
    budgetUtilizationPercent: 3,
    latencyP50: 520,
    latencyP95: 820,
    rejectRatePercent: 0.1,
    venueEdgeBps: 0.6,
    nextAction: '2m',
    complianceStatus: 'PASS',
  },
  {
    id: 'alpha-grid-bot',
    name: 'Alpha Grid Bot',
    strategy: 'Grid Trading',
    venue: 'Binance',
    routeVia: 'Direct',
    pair: 'BTC/USDT',
    status: 'running',
    uptime: '5d 12h',
    lastTrade: '2 minutes ago',
    pnl24h: 247.83,
    totalPnl: 1247.83,
    signalNow: 74,
    signalTrend: 68,
    signalSummary: 'Grid boundary touched',
    riskStatus: 'OK',
    riskScore: 22,
    drawdownPercent: 3.1,
    consecutiveLosses: 0,
    budgetUtilizationPercent: 38,
    latencyP50: 420,
    latencyP95: 690,
    rejectRatePercent: 0.3,
    venueEdgeBps: 4.8,
    nextAction: '3m',
    complianceStatus: 'PASS',
  },
  {
    id: 'beta-arbitrage',
    name: 'Beta Arbitrage',
    strategy: 'Arbitrage',
    venue: 'Coinbase Pro',
    routeVia: 'Direct',
    pair: 'ETH/USD',
    status: 'running',
    uptime: '3d 8h',
    lastTrade: '15 minutes ago',
    pnl24h: -45.2,
    totalPnl: 892.41,
    signalNow: 51,
    signalTrend: 62,
    signalSummary: 'Small cross-venue spread',
    riskStatus: 'WARN',
    riskScore: 55,
    drawdownPercent: 7.4,
    consecutiveLosses: 2,
    budgetUtilizationPercent: 44,
    latencyP50: 380,
    latencyP95: 640,
    rejectRatePercent: 0.2,
    venueEdgeBps: 3.1,
    nextAction: '1m',
    complianceStatus: 'PASS',
  },
  {
    id: 'gamma-momentum',
    name: 'Gamma Momentum',
    strategy: 'Momentum',
    venue: 'Kraken',
    routeVia: 'Direct',
    pair: 'SOL/EUR',
    status: 'error',
    uptime: '0m',
    lastTrade: '2 hours ago',
    pnl24h: 0,
    totalPnl: -125.67,
    signalNow: 0,
    signalTrend: 0,
    signalSummary: 'Bot offline',
    riskStatus: 'HALT',
    riskScore: 90,
    drawdownPercent: 12.9,
    consecutiveLosses: 5,
    budgetUtilizationPercent: 62,
    latencyP50: undefined,
    latencyP95: undefined,
    rejectRatePercent: undefined,
    venueEdgeBps: undefined,
    nextAction: '—',
    complianceStatus: 'WARN',
    complianceReason: 'Connectivity error',
  },
  {
    id: 'delta-mean-reversion',
    name: 'Delta Mean Reversion',
    strategy: 'Mean Reversion',
    venue: 'Binance',
    routeVia: 'Direct',
    pair: 'ADA/USDT',
    status: 'stopped',
    uptime: '0m',
    lastTrade: '1 day ago',
    pnl24h: 0,
    totalPnl: 456.78,
    signalNow: 33,
    signalTrend: 57,
    signalSummary: 'Waiting for z-score > 2',
    riskStatus: 'OK',
    riskScore: 12,
    drawdownPercent: 1.1,
    consecutiveLosses: 0,
    budgetUtilizationPercent: 12,
    latencyP50: 510,
    latencyP95: 790,
    rejectRatePercent: undefined,
    venueEdgeBps: 2.2,
    nextAction: '5m',
    complianceStatus: 'PASS',
  },
  {
    id: 'epsilon-dca-bot',
    name: 'Epsilon DCA Bot',
    strategy: 'DCA',
    venue: 'Bybit',
    routeVia: 'Direct',
    pair: 'MATIC/USDT',
    status: 'running',
    uptime: '2d 6h',
    lastTrade: '8 minutes ago',
    pnl24h: 125.4,
    totalPnl: 890.32,
    signalNow: 46,
    signalTrend: 60,
    signalSummary: 'Scheduled DCA window',
    riskStatus: 'OK',
    riskScore: 18,
    drawdownPercent: 2.3,
    consecutiveLosses: 0,
    budgetUtilizationPercent: 20,
    latencyP50: 450,
    latencyP95: 710,
    rejectRatePercent: undefined,
    venueEdgeBps: 1.6,
    nextAction: '15m',
    complianceStatus: 'PASS',
  },
  {
    id: 'zeta-futures-bot',
    name: 'Zeta Futures Bot',
    strategy: 'Futures Hedging',
    venue: 'OKX',
    routeVia: 'Direct',
    pair: 'DOGE/USDT',
    status: 'running',
    uptime: '1d 14h',
    lastTrade: '5 minutes ago',
    pnl24h: 98.76,
    totalPnl: 654.21,
    signalNow: 58,
    signalTrend: 63,
    signalSummary: 'Carry hedge active',
    riskStatus: 'OK',
    riskScore: 26,
    drawdownPercent: 3,
    consecutiveLosses: 1,
    budgetUtilizationPercent: 28,
    latencyP50: undefined,
    latencyP95: undefined,
    rejectRatePercent: undefined,
    venueEdgeBps: 2.9,
    nextAction: '—',
    complianceStatus: 'PASS',
  },
  {
    id: 'theta-scalping',
    name: 'Theta Scalping',
    strategy: 'Scalping',
    venue: 'KuCoin',
    routeVia: 'Direct',
    pair: 'LINK/USDT',
    status: 'running',
    uptime: '4d 2h',
    lastTrade: '1 minute ago',
    pnl24h: 76.89,
    totalPnl: 432.1,
    signalNow: 63,
    signalTrend: 66,
    signalSummary: 'Order-flow imbalance',
    riskStatus: 'OK',
    riskScore: 31,
    drawdownPercent: 4,
    consecutiveLosses: 1,
    budgetUtilizationPercent: 34,
    latencyP50: 340,
    latencyP95: 590,
    rejectRatePercent: undefined,
    venueEdgeBps: 2.5,
    nextAction: '1m',
    complianceStatus: 'PASS',
  },
  {
    id: 'iota-cross-bot',
    name: 'Iota Cross Bot',
    strategy: 'Cross Venue',
    venue: 'Gate.io',
    routeVia: 'Direct',
    pair: 'UNI/USDT',
    status: 'stopped',
    uptime: '0m',
    lastTrade: '3 hours ago',
    pnl24h: 0,
    totalPnl: 234.56,
    signalNow: 20,
    signalTrend: 54,
    signalSummary: 'Spread insufficient',
    riskStatus: 'OK',
    riskScore: 10,
    drawdownPercent: 0.9,
    consecutiveLosses: 0,
    budgetUtilizationPercent: 9,
    latencyP50: undefined,
    latencyP95: undefined,
    rejectRatePercent: undefined,
    venueEdgeBps: undefined,
    nextAction: '—',
    complianceStatus: 'PASS',
  },
];

export interface DemoSignalStackItem {
  strength: number;
  confidence: number;
  summary: string;
  model: string;
  updated: string;
}

export interface DemoPreTradeSnapshot {
  freeBalance: string;
  exposure: Record<string, string | number>;
  openOrders: number;
  fundingRatePercent?: number;
  apiThrottleRemaining: number;
  riskGate: RiskStatus;
  messages: string[];
}

export interface DemoVenueRoute {
  id: string;
  name: string;
  bestBid: number;
  bestAsk: number;
  topLevelSize: number;
  feeBps: number;
  estimatedSlippageBps: number;
  routeScore: number;
  notes?: string;
  recommended?: boolean;
}

export interface DemoGuardrails {
  sizePercent: number;
  stopLossPercent: number;
  takeProfitPercent: number;
  maxDailyLossPercent: number;
  haltAfterLosses: number;
}

export interface DemoConsoleData {
  defaultPair: string;
  signalStack: DemoSignalStackItem[];
  preTrade: DemoPreTradeSnapshot;
  venueMatrix: DemoVenueRoute[];
  guardrails: DemoGuardrails;
}

export const demoConsoleData: DemoConsoleData = {
  defaultPair: 'BTC/USDT',
  signalStack: [
    {
      strength: 78,
      confidence: 71,
      summary: 'Grid boundary retest on 15m',
      model: 'grid_v2',
      updated: 'now',
    },
    {
      strength: 65,
      confidence: 64,
      summary: 'MR z-score 2.1 on 1h',
      model: 'mr_v1',
      updated: 'now',
    },
    {
      strength: 54,
      confidence: 59,
      summary: 'Momentum continuation',
      model: 'momo_v2',
      updated: 'now',
    },
  ],
  preTrade: {
    freeBalance: 'CHF 25,430.12',
    exposure: {
      BTC: '1.24',
      USDT: '38,940',
    },
    openOrders: 2,
    fundingRatePercent: 0.01,
    apiThrottleRemaining: 480,
    riskGate: 'OK',
    messages: [
      'Compliance: KYT clean',
      'Latency healthy (p50 420ms)',
      'Risk: 62% budget remaining today',
    ],
  },
  venueMatrix: [
    {
      id: 'binance',
      name: 'Binance',
      bestBid: 67234.5,
      bestAsk: 67235.1,
      topLevelSize: 8.4,
      feeBps: 7.5,
      estimatedSlippageBps: 2.8,
      routeScore: 92,
      notes: 'Primary',
      recommended: true,
    },
    {
      id: 'coinbase-pro',
      name: 'Coinbase Pro',
      bestBid: 67233.9,
      bestAsk: 67235.9,
      topLevelSize: 6.1,
      feeBps: 10,
      estimatedSlippageBps: 3.1,
      routeScore: 86,
    },
    {
      id: 'kraken',
      name: 'Kraken',
      bestBid: 67233.7,
      bestAsk: 67236.3,
      topLevelSize: 5.6,
      feeBps: 10,
      estimatedSlippageBps: 3.4,
      routeScore: 82,
    },
    {
      id: 'bybit',
      name: 'Bybit',
      bestBid: 67234,
      bestAsk: 67236,
      topLevelSize: 7,
      feeBps: 8.5,
      estimatedSlippageBps: 3,
      routeScore: 84,
    },
  ],
  guardrails: {
    sizePercent: 1.8,
    stopLossPercent: 1.2,
    takeProfitPercent: 2.4,
    maxDailyLossPercent: 5,
    haltAfterLosses: 5,
  },
};

export interface DemoStrategy {
  slug: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  timeframe: string;
  risk: 'Low' | 'Medium';
  bestFor: string;
  defaults: Record<string, number>;
  riskDefaults: {
    maxPositionSizePercent?: number;
    stopLossPercent?: number;
  };
}

export const demoStrategies: DemoStrategy[] = [
  {
    slug: 'grid-trading',
    name: 'Grid Trading (Beginner)',
    level: 'Beginner',
    description: 'Places buy/sell orders at intervals above/below price.',
    timeframe: '15m–1h',
    risk: 'Low',
    bestFor: 'stable coins/low-vol periods',
    defaults: {
      gridSteps: 12,
      gridWidthPct: 0.8,
    },
    riskDefaults: {
      maxPositionSizePercent: 10,
      stopLossPercent: 5,
    },
  },
  {
    slug: 'dca',
    name: 'DCA (Beginner)',
    level: 'Beginner',
    description: 'Dollar-cost average into positions on schedule.',
    timeframe: '1d–1w',
    risk: 'Low',
    bestFor: 'long-term investors',
    defaults: {
      intervalMins: 1440,
      amountPct: 2,
    },
    riskDefaults: {
      stopLossPercent: 0,
    },
  },
  {
    slug: 'arbitrage',
    name: 'Arbitrage (Advanced)',
    level: 'Advanced',
    description: 'Captures spreads across venues with synchronized legs.',
    timeframe: '1s–5m',
    risk: 'Low',
    bestFor: 'HFT',
    defaults: {
      minSpreadBps: 8,
      maxLegLatencyMs: 700,
    },
    riskDefaults: {
      maxPositionSizePercent: 15,
      stopLossPercent: 2,
    },
  },
  {
    slug: 'market-making',
    name: 'Market Making (Advanced)',
    level: 'Advanced',
    description: 'Posts two-sided liquidity around midprice.',
    timeframe: '1m–1h',
    risk: 'Medium',
    bestFor: 'liquid venues',
    defaults: {
      targetSpreadBps: 12,
    },
    riskDefaults: {
      maxPositionSizePercent: 20,
    },
  },
  {
    slug: 'momentum',
    name: 'Momentum (Intermediate)',
    level: 'Intermediate',
    description: 'Rides directional moves using RSI triggers.',
    timeframe: '15m–4h',
    risk: 'Medium',
    bestFor: 'trending markets',
    defaults: {
      rsiPeriod: 14,
      entryRSI: 60,
    },
    riskDefaults: {
      maxPositionSizePercent: 5,
      stopLossPercent: 3,
    },
  },
  {
    slug: 'mean-reversion',
    name: 'Mean Reversion (Intermediate)',
    level: 'Intermediate',
    description: 'Contrarian entries around statistical extremes.',
    timeframe: '1h–1d',
    risk: 'Medium',
    bestFor: 'predictable patterns',
    defaults: {
      zScoreEntry: 2,
      zScoreExit: 0.5,
    },
    riskDefaults: {
      maxPositionSizePercent: 6,
      stopLossPercent: 2.5,
    },
  },
];
