export interface Bot {
  id: string;
  name: string;
  exchange: string;
  tradingPair: string;
  strategy: string;
  status: 'running' | 'stopped' | 'error' | 'starting';
  pnl24h: number;
  lastHeartbeat: Date | null;
  riskPolicy?: {
    maxPositionSize: number;
    stopLoss: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertBot {
  name: string;
  exchange: string;
  tradingPair: string;
  strategy: string;
  riskPolicy?: {
    maxPositionSize: number;
    stopLoss: number;
  };
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
  type: 'online' | 'warning' | 'error';
  message: string;
  details: string;
  pnl: number;
  timestamp: Date;
}

export interface HealthStatus {
  api: 'online' | 'warning' | 'error';
  orchestrator: 'online' | 'warning' | 'error';
  database: 'online' | 'warning' | 'error';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'trader' | 'readonly';
  lastLogin: Date | null;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  riskLevel: 'low' | 'medium' | 'high';
  isActive: boolean;
}

export interface ExchangeConnection {
  id: string;
  exchange: string;
  accountAlias: string;
  permissions: string[];
  lastVerified: Date | null;
  status: 'connected' | 'error' | 'pending';
}

export interface ComplianceAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
  impactedBot?: string;
  timestamp: Date;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface BacktestRun {
  id: string;
  strategy: string;
  parameters: Record<string, any>;
  symbols: string[];
  timeframe: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  results?: {
    pnl: number;
    winRate: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
  createdAt: Date;
  completedAt?: Date;
}

export interface PerformanceReport {
  totalPnL: number;
  roi: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  avgTradeSize: number;
  period: string;
}

export interface OperationalReport {
  orderSuccessRate: number;
  avgLatency: number;
  p95Latency: number;
  errorRate: number;
  uptime: number;
  totalOrders: number;
  period: string;
}
