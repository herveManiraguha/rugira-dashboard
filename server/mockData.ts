// Mock Data Service for all dashboard features
import type { 
  BotConfig, 
  ExchangeConfig, 
  StrategyConfig,
  BacktestResult,
  MonitoringAlert,
  ComplianceReport,
  UserProfile
} from '../shared/schema';
import { mockStrategies } from '../shared/mockData';

// Helper to generate realistic time series data
function generateTimeSeriesData(days: number, baseValue: number, volatility: number = 0.1) {
  const data = [];
  let currentValue = baseValue;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random walk with mean reversion
    const change = (Math.random() - 0.5) * volatility * currentValue;
    currentValue = currentValue + change;
    
    data.push({
      timestamp: date.toISOString(),
      value: Math.round(currentValue * 100) / 100
    });
  }
  
  return data;
}

// Generate realistic bot data
export function generateBotData(): BotConfig[] {
  const strategies = ['Grid Trading', 'Moving Average', 'Momentum', 'Arbitrage', 'Market Making'];
  const exchanges = ['Binance', 'Coinbase', 'Kraken', 'FTX', 'Bitfinex'];
  const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'MATIC/USDT', 'LINK/USDT'];
  const statuses = ['active', 'paused', 'stopped', 'error'] as const;
  
  return Array.from({ length: 12 }, (_, i) => ({
    id: `bot-${i + 1}`,
    name: `Trading Bot ${i + 1}`,
    strategy: strategies[i % strategies.length],
    exchange: exchanges[i % exchanges.length],
    tradingPair: pairs[i % pairs.length],
    status: statuses[i % 4],
    allocation: Math.round(Math.random() * 50000 + 10000),
    currentPnL: Math.round((Math.random() - 0.3) * 5000 * 100) / 100,
    dailyPnL: Math.round((Math.random() - 0.3) * 500 * 100) / 100,
    winRate: Math.round((Math.random() * 30 + 55) * 10) / 10,
    totalTrades: Math.floor(Math.random() * 500 + 50),
    activeSince: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    lastTradeAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    config: {
      maxPositionSize: Math.round(Math.random() * 10000 + 1000),
      stopLoss: Math.round((Math.random() * 5 + 2) * 10) / 10,
      takeProfit: Math.round((Math.random() * 10 + 5) * 10) / 10,
      riskLevel: ['low', 'medium', 'high'][i % 3] as 'low' | 'medium' | 'high'
    }
  }));
}

// Generate exchange data
export function generateExchangeData(): ExchangeConfig[] {
  const exchanges = [
    { name: 'Binance', region: 'Global', volume24h: 28500000000 },
    { name: 'Coinbase', region: 'US', volume24h: 2100000000 },
    { name: 'Kraken', region: 'EU', volume24h: 890000000 },
    { name: 'FTX', region: 'Global', volume24h: 1200000000 },
    { name: 'Bitfinex', region: 'Asia', volume24h: 450000000 }
  ];
  
  return exchanges.map((exchange, i) => ({
    id: `exchange-${i + 1}`,
    name: exchange.name,
    status: i === 3 ? 'disconnected' : 'connected' as 'connected' | 'disconnected',
    apiKey: '•••••••••••••••',
    region: exchange.region,
    volume24h: exchange.volume24h,
    balance: {
      USD: Math.round(Math.random() * 100000 + 10000),
      BTC: Math.round(Math.random() * 5 * 100000) / 100000,
      ETH: Math.round(Math.random() * 50 * 1000) / 1000
    },
    tradingPairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'MATIC/USDT'],
    fees: {
      maker: 0.1,
      taker: 0.15
    },
    limits: {
      dailyWithdrawal: 100000,
      maxOrderSize: 50000
    },
    lastSync: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString()
  }));
}

// Generate strategy data
export function generateStrategyData(): StrategyConfig[] {
  return mockStrategies.map((strategy, index) => {
    const performance = strategy.performance ?? {
      winRate: strategy.overlay ? 0 : 60,
      avgReturn: strategy.overlay ? 0 : 1.5,
      sharpeRatio: strategy.overlay ? 0 : 1.2
    };

    const totalReturn =
      strategy.backtestResults?.totalReturn ??
      (performance.avgReturn ? Math.round(performance.avgReturn * 12 * 10) / 10 : 0);

    const maxDrawdown =
      strategy.backtestResults?.maxDrawdown !== undefined
        ? Math.abs(strategy.backtestResults.maxDrawdown)
        : strategy.overlay
          ? 5
          : 12;

    const totalTrades =
      (strategy.backtestResults as any)?.totalTrades ??
      (strategy.overlay ? 0 : 250 + index * 15);

    const profitFactor =
      (strategy.backtestResults as any)?.profitFactor ??
      (strategy.overlay ? 1.0 : Math.max(1.1, 1 + performance.avgReturn / 2));

    return {
      id: strategy.id,
      name: strategy.name,
      type: strategy.type,
      description: strategy.description,
      status: 'active' as const,
      version: strategy.version ?? `v1.${index}`,
      performance,
      backtestResults: {
        totalReturn,
        maxDrawdown,
        totalTrades,
        profitFactor
      },
      parameters: strategy.parameters ?? {},
      lastModified: new Date(Date.now() - index * 86400000).toISOString()
    };
  });
}

// Generate backtest results
export function generateBacktestResults(): BacktestResult[] {
  return [
    {
      id: 'backtest-1',
      strategyName: 'Moving Average Crossover',
      dateRange: '2024-01-01 to 2024-12-31',
      status: 'completed',
      progress: 100,
      results: {
        totalReturn: 24.7,
        sharpeRatio: 1.42,
        maxDrawdown: -8.3,
        winRate: 67.2,
        totalTrades: 247,
        finalCapital: 124700,
        profitFactor: 1.84,
        avgTradeDuration: '2.3 days'
      },
      equityCurve: generateTimeSeriesData(365, 100000, 0.02),
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'backtest-2',
      strategyName: 'Grid Trading Strategy',
      dateRange: '2024-06-01 to 2024-12-31',
      status: 'completed',
      progress: 100,
      results: {
        totalReturn: 18.3,
        sharpeRatio: 1.18,
        maxDrawdown: -12.1,
        winRate: 84.5,
        totalTrades: 1852,
        finalCapital: 118300,
        profitFactor: 1.52,
        avgTradeDuration: '4.2 hours'
      },
      equityCurve: generateTimeSeriesData(214, 100000, 0.015),
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: 'backtest-3',
      strategyName: 'Momentum Breakout',
      dateRange: '2024-03-01 to 2024-12-31',
      status: 'running',
      progress: 76,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ];
}

// Generate monitoring alerts
export function generateMonitoringAlerts(): MonitoringAlert[] {
  const severities = ['info', 'warning', 'error', 'critical'] as const;
  const types = ['performance', 'connection', 'risk', 'compliance', 'system'] as const;
  
  return Array.from({ length: 15 }, (_, i) => ({
    id: `alert-${i + 1}`,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    severity: severities[i % 4],
    type: types[i % 5],
    title: [
      'High drawdown detected',
      'API rate limit warning',
      'Connection lost to exchange',
      'Risk threshold exceeded',
      'Compliance check required',
      'Low balance warning',
      'Strategy performance degradation',
      'Order execution failed',
      'Market volatility spike',
      'System resource usage high',
      'Authentication expiring soon',
      'Unusual trading pattern detected',
      'Price feed interrupted',
      'Backup required',
      'Configuration update available'
    ][i],
    message: `Alert details for ${[
      'High drawdown detected',
      'API rate limit warning',
      'Connection lost to exchange',
      'Risk threshold exceeded',
      'Compliance check required',
      'Low balance warning',
      'Strategy performance degradation',
      'Order execution failed',
      'Market volatility spike',
      'System resource usage high',
      'Authentication expiring soon',
      'Unusual trading pattern detected',
      'Price feed interrupted',
      'Backup required',
      'Configuration update available'
    ][i]}`,
    source: `Bot-${(i % 5) + 1}`,
    acknowledged: i > 10
  }));
}

// Generate compliance reports
export function generateComplianceReports(): ComplianceReport[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: `report-${i + 1}`,
    period: new Date(Date.now() - (i + 1) * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
    type: ['monthly', 'quarterly', 'audit'][i % 3] as 'monthly' | 'quarterly' | 'audit',
    status: i === 0 ? 'pending' : 'completed' as 'pending' | 'completed',
    violations: Math.floor(Math.random() * 3),
    warnings: Math.floor(Math.random() * 5),
    trades: Math.floor(Math.random() * 5000 + 1000),
    volume: Math.round(Math.random() * 1000000 + 100000),
    riskScore: Math.round(Math.random() * 30 + 20),
    approvedBy: i === 0 ? null : 'Compliance Officer',
    generatedAt: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString()
  }));
}

// Generate portfolio data
export function generatePortfolioData() {
  return {
    totalValue: 458320.50,
    dailyChange: 3245.20,
    dailyChangePercent: 0.71,
    weeklyChange: 12340.80,
    weeklyChangePercent: 2.77,
    monthlyChange: -8920.30,
    monthlyChangePercent: -1.91,
    allocation: {
      BTC: 45,
      ETH: 25,
      USDT: 20,
      Others: 10
    },
    performance: generateTimeSeriesData(30, 450000, 0.02),
    positions: [
      { asset: 'BTC', amount: 5.234, value: 206420.50, change24h: 2.3 },
      { asset: 'ETH', amount: 68.12, value: 114520.80, change24h: -1.2 },
      { asset: 'USDT', amount: 91678.45, value: 91678.45, change24h: 0 },
      { asset: 'SOL', amount: 423.5, value: 28450.30, change24h: 5.8 },
      { asset: 'MATIC', amount: 15230, value: 17250.45, change24h: -3.4 }
    ]
  };
}

// Generate market data
export function generateMarketData() {
  return {
    prices: {
      BTC: { price: 43250.30, change24h: 2.3, volume24h: 28500000000 },
      ETH: { price: 2280.40, change24h: -1.2, volume24h: 12300000000 },
      SOL: { price: 67.23, change24h: 5.8, volume24h: 890000000 },
      MATIC: { price: 1.13, change24h: -3.4, volume24h: 456000000 }
    },
    indicators: {
      fearGreedIndex: 65,
      volatilityIndex: 42,
      marketCap: 1680000000000,
      dominance: { BTC: 52.3, ETH: 18.7 }
    },
    trends: generateTimeSeriesData(7, 43000, 0.03)
  };
}

// Generate user profile data
export function generateUserProfile(): UserProfile {
  return {
    id: 'user-1',
    email: 'hanz.mueller@rugira.ch',
    name: 'Hanz Mueller',
    role: 'admin',
    company: 'Rugira Trading AG',
    timezone: 'Europe/Zurich',
    language: 'en',
    twoFactorEnabled: true,
    emailNotifications: true,
    apiKeys: [
      { id: 'key-1', name: 'Production Bot', created: '2024-01-15', lastUsed: '2024-12-27', permissions: ['trading', 'reading'] },
      { id: 'key-2', name: 'Monitoring Service', created: '2024-03-20', lastUsed: '2024-12-26', permissions: ['reading'] }
    ],
    sessions: [
      { id: 'session-1', device: 'Chrome on Windows', location: 'Zurich, CH', lastActive: new Date().toISOString() },
      { id: 'session-2', device: 'Safari on iPhone', location: 'Zurich, CH', lastActive: new Date(Date.now() - 86400000).toISOString() }
    ],
    preferences: {
      theme: 'light',
      currency: 'USD',
      dateFormat: 'DD/MM/YYYY',
      defaultExchange: 'Binance',
      riskLevel: 'medium'
    }
  };
}

// Generate admin statistics
export function generateAdminStats() {
  return {
    users: {
      total: 127,
      active: 89,
      new: 12,
      growth: 8.3
    },
    bots: {
      total: 342,
      active: 278,
      paused: 45,
      error: 19
    },
    trading: {
      volume24h: 4580000,
      trades24h: 12456,
      avgTradeSize: 367.50,
      successRate: 67.8
    },
    system: {
      uptime: 99.98,
      responseTime: 124,
      cpuUsage: 42,
      memoryUsage: 68,
      diskUsage: 35
    },
    revenue: {
      daily: 12340,
      weekly: 78920,
      monthly: 298450,
      fees: 3240
    }
  };
}

// Generate activity logs
export function generateActivityLogs() {
  const actions = [
    'Bot started', 'Bot stopped', 'Strategy modified', 'Trade executed',
    'Withdrawal requested', 'API key created', 'Settings updated',
    'Report generated', 'Alert acknowledged', 'Exchange connected'
  ];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `log-${i + 1}`,
    timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
    action: actions[i % actions.length],
    user: i % 3 === 0 ? 'System' : 'Hanz Mueller',
    details: `${actions[i % actions.length]} for Bot-${(i % 5) + 1}`,
    ip: '192.168.1.' + (100 + i),
    status: i % 10 === 0 ? 'failed' : 'success' as 'success' | 'failed'
  }));
}

// Generate report data
export function generateReportData(type: string) {
  switch (type) {
    case 'trading':
      return {
        summary: {
          totalTrades: 5234,
          winningTrades: 3521,
          losingTrades: 1713,
          totalVolume: 4580000,
          totalProfit: 124500,
          avgProfit: 23.78
        },
        byStrategy: generateStrategyData().map(s => ({
          name: s.name,
          trades: Math.floor(Math.random() * 1000 + 100),
          profit: Math.round(Math.random() * 50000 - 10000),
          winRate: s.performance.winRate
        })),
        byExchange: generateExchangeData().map(e => ({
          name: e.name,
          volume: e.volume24h,
          fees: Math.round(e.volume24h * 0.001),
          trades: Math.floor(Math.random() * 2000 + 500)
        })),
        timeline: generateTimeSeriesData(30, 4000, 0.1)
      };
      
    case 'performance':
      return {
        overview: {
          totalReturn: 24.7,
          sharpeRatio: 1.42,
          maxDrawdown: -8.3,
          calmarRatio: 2.97,
          sortinoRatio: 1.89,
          winRate: 67.2
        },
        monthly: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i, 1).toISOString().slice(0, 7),
          return: Math.round((Math.random() - 0.2) * 8 * 100) / 100,
          trades: Math.floor(Math.random() * 500 + 100),
          volume: Math.round(Math.random() * 500000 + 100000)
        })),
        drawdown: generateTimeSeriesData(365, 0, 0.5).map(d => ({
          ...d,
          value: -Math.abs(d.value)
        }))
      };
      
    default:
      return {
        message: 'Report type not found'
      };
  }
}
