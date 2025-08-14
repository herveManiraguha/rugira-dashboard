export interface Bot {
  id: string;
  name: string;
  exchange: string;
  tradingPair: string;
  strategy: string;
  status: 'running' | 'stopped' | 'error' | 'paused';
  performance: {
    pnl: number;
    pnlPercent: number;
    trades: number;
    winRate: number;
  };
  riskPolicy: {
    maxPositionSize: number;
    stopLoss: number;
  };
  createdAt: Date;
  lastUpdated: Date;
}

export interface KPI {
  id: string;
  label: string;
  value: number | string;
  change?: number;
  comparison: string;
  icon: string;
  type: 'currency' | 'percentage' | 'number' | 'time';
}

export interface ActivityFeed {
  id: string;
  type: 'online' | 'warning' | 'error' | 'offline';
  message: string;
  details: string;
  pnl: number;
  timestamp: Date;
}

export interface NotificationCount {
  count: number;
}

export interface Exchange {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  balance: Record<string, number>;
  pairs: string[];
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  performance: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}