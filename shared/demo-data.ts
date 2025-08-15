// Demo data for the Rugira Trading Dashboard
// All data is simulated and deterministic for demonstration purposes

export interface DemoBot {
  id: string;
  name: string;
  strategy: string;
  exchange: string;
  status: 'active' | 'paused' | 'stopped';
  pnl: number;
  trades: number;
  riskLevel: 'low' | 'medium' | 'high';
  allocation: number;
  createdAt: string;
}

export interface DemoTrade {
  id: string;
  botId: string;
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  pnl: number;
  status: 'executed' | 'pending' | 'cancelled';
  timestamp: string;
}

export interface DemoAlert {
  id: string;
  type: 'risk' | 'compliance' | 'system' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  status: 'active' | 'resolved' | 'acknowledged';
  timestamp: string;
  botId?: string;
}

export interface DemoMetrics {
  totalPnL: number;
  dailyPnL: number;
  totalTrades: number;
  winRate: number;
  sharpeRatio: number;
  maxDrawdown: number;
  activeBots: number;
  totalAllocation: number;
}

export interface DemoStoryEvent {
  timestamp: number; // seconds from start
  type: 'bot_start' | 'trade_placed' | 'risk_trigger' | 'alert_created' | 'alert_resolved';
  data: any;
  description: string;
}

// Fixed demo data
export const DEMO_BOTS: DemoBot[] = [
  {
    id: 'bot-001',
    name: 'Swiss Momentum Alpha',
    strategy: 'Momentum Following',
    exchange: 'Binance',
    status: 'active',
    pnl: 1247.50,
    trades: 23,
    riskLevel: 'medium',
    allocation: 25000,
    createdAt: '2025-08-01T08:00:00Z'
  },
  {
    id: 'bot-002',
    name: 'Arbitrage Hunter',
    strategy: 'Cross-Exchange Arbitrage',
    exchange: 'Coinbase Pro',
    status: 'active',
    pnl: 892.30,
    trades: 15,
    riskLevel: 'low',
    allocation: 15000,
    createdAt: '2025-08-05T14:30:00Z'
  },
  {
    id: 'bot-003',
    name: 'Risk Parity DeFi',
    strategy: 'Risk Parity',
    exchange: 'Uniswap V3',
    status: 'paused',
    pnl: -156.80,
    trades: 8,
    riskLevel: 'high',
    allocation: 10000,
    createdAt: '2025-08-10T09:15:00Z'
  }
];

export const DEMO_TRADES: DemoTrade[] = [
  {
    id: 'trade-001',
    botId: 'bot-001',
    symbol: 'BTC/USDT',
    side: 'buy',
    amount: 0.5,
    price: 67850.00,
    pnl: 425.50,
    status: 'executed',
    timestamp: '2025-08-15T10:30:00Z'
  },
  {
    id: 'trade-002',
    botId: 'bot-001',
    symbol: 'ETH/USDT',
    side: 'sell',
    amount: 2.3,
    price: 3240.00,
    pnl: 167.20,
    status: 'executed',
    timestamp: '2025-08-15T11:15:00Z'
  },
  {
    id: 'trade-003',
    botId: 'bot-002',
    symbol: 'BTC/USD',
    side: 'buy',
    amount: 0.25,
    price: 67900.00,
    pnl: 78.50,
    status: 'executed',
    timestamp: '2025-08-15T11:45:00Z'
  }
];

export const DEMO_ALERTS: DemoAlert[] = [
  {
    id: 'alert-001',
    type: 'risk',
    severity: 'high',
    title: 'Risk Limit Exceeded',
    message: 'Swiss Momentum Alpha has exceeded 80% of daily loss limit',
    status: 'resolved',
    timestamp: '2025-08-15T12:00:00Z',
    botId: 'bot-001'
  },
  {
    id: 'alert-002',
    type: 'compliance',
    severity: 'medium',
    title: 'Position Size Alert',
    message: 'Total exposure approaching regulatory limit',
    status: 'acknowledged',
    timestamp: '2025-08-15T12:10:00Z'
  }
];

export const DEMO_METRICS: DemoMetrics = {
  totalPnL: 1982.50,
  dailyPnL: 287.40,
  totalTrades: 46,
  winRate: 68.5,
  sharpeRatio: 1.47,
  maxDrawdown: -3.2,
  activeBots: 2,
  totalAllocation: 50000
};

// 90-second scripted demo story
export const DEMO_STORY: DemoStoryEvent[] = [
  {
    timestamp: 0,
    type: 'bot_start',
    data: { botId: 'bot-001' },
    description: 'Swiss Momentum Alpha bot activated'
  },
  {
    timestamp: 15,
    type: 'trade_placed',
    data: { 
      tradeId: 'demo-trade-1',
      botId: 'bot-001',
      symbol: 'BTC/USDT',
      side: 'buy',
      amount: 0.3,
      price: 67850.00
    },
    description: 'Opening BTC position based on momentum signal'
  },
  {
    timestamp: 35,
    type: 'trade_placed',
    data: { 
      tradeId: 'demo-trade-2',
      botId: 'bot-001',
      symbol: 'ETH/USDT',
      side: 'buy',
      amount: 1.5,
      price: 3240.00
    },
    description: 'Adding ETH position to portfolio'
  },
  {
    timestamp: 50,
    type: 'risk_trigger',
    data: { 
      botId: 'bot-001',
      riskType: 'daily_loss_limit',
      threshold: 80
    },
    description: 'Risk management system triggered - 80% of daily loss limit reached'
  },
  {
    timestamp: 55,
    type: 'alert_created',
    data: {
      alertId: 'demo-alert-1',
      type: 'risk',
      severity: 'high',
      title: 'Risk Limit Exceeded',
      message: 'Swiss Momentum Alpha has exceeded 80% of daily loss limit'
    },
    description: 'Risk alert generated for immediate attention'
  },
  {
    timestamp: 75,
    type: 'alert_resolved',
    data: {
      alertId: 'demo-alert-1',
      resolution: 'Position reduced automatically by risk management system'
    },
    description: 'Risk alert resolved - positions adjusted'
  }
];

// Generate sample export data
export function generateSamplePerformanceReport() {
  return {
    reportType: 'Monthly Performance Report',
    period: 'August 2025',
    generated: new Date().toISOString(),
    disclaimer: 'SAMPLE / SIMULATED DATA - Not actual trading results',
    summary: {
      totalReturn: '4.85%',
      sharpeRatio: 1.47,
      maxDrawdown: '-3.2%',
      totalTrades: 46,
      winRate: '68.5%'
    },
    bots: DEMO_BOTS.map(bot => ({
      name: bot.name,
      strategy: bot.strategy,
      pnl: bot.pnl,
      trades: bot.trades,
      allocation: bot.allocation
    }))
  };
}

export function generateSampleAuditData() {
  return DEMO_TRADES.map(trade => ({
    timestamp: trade.timestamp,
    bot_name: DEMO_BOTS.find(b => b.id === trade.botId)?.name || 'Unknown',
    symbol: trade.symbol,
    side: trade.side,
    amount: trade.amount,
    price: trade.price,
    pnl: trade.pnl,
    status: trade.status,
    disclaimer: 'SAMPLE / SIMULATED DATA'
  }));
}