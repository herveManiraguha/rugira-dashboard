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

// Extended types for comprehensive mock data
export interface BotConfig {
  id: string;
  name: string;
  strategy: string;
  exchange: string;
  tradingPair: string;
  status: 'active' | 'paused' | 'stopped' | 'error';
  allocation: number;
  currentPnL: number;
  dailyPnL: number;
  winRate: number;
  totalTrades: number;
  activeSince: string;
  lastTradeAt: string;
  config: {
    maxPositionSize: number;
    stopLoss: number;
    takeProfit: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export interface ExchangeConfig {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  apiKey: string;
  region: string;
  volume24h: number;
  balance: Record<string, number>;
  tradingPairs: string[];
  fees: {
    maker: number;
    taker: number;
  };
  limits: {
    dailyWithdrawal: number;
    maxOrderSize: number;
  };
  lastSync: string;
}

export interface StrategyConfig {
  id: string;
  name: string;
  type: string;
  description: string;
  status: 'active' | 'inactive';
  version: string;
  performance: {
    winRate: number;
    avgReturn: number;
    sharpeRatio: number;
  };
  backtestResults: {
    totalReturn: number;
    maxDrawdown: number;
    totalTrades: number;
    profitFactor: number;
  };
  parameters: Record<string, any>;
  lastModified: string;
}

export interface BacktestResult {
  id: string;
  strategyName: string;
  dateRange: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  results?: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    totalTrades: number;
    finalCapital: number;
    profitFactor: number;
    avgTradeDuration: string;
  };
  equityCurve?: Array<{timestamp: string; value: number}>;
  createdAt: string;
}

export interface MonitoringAlert {
  id: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  type: 'performance' | 'connection' | 'risk' | 'compliance' | 'system';
  title: string;
  message: string;
  source: string;
  acknowledged: boolean;
}

export interface ComplianceReport {
  id: string;
  period: string;
  type: 'monthly' | 'quarterly' | 'audit';
  status: 'pending' | 'completed';
  violations: number;
  warnings: number;
  trades: number;
  volume: number;
  riskScore: number;
  approvedBy: string | null;
  generatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  company: string;
  timezone: string;
  language: string;
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  apiKeys: Array<{
    id: string;
    name: string;
    created: string;
    lastUsed: string;
    permissions: string[];
  }>;
  sessions: Array<{
    id: string;
    device: string;
    location: string;
    lastActive: string;
  }>;
  preferences: Record<string, any>;
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
}

export interface KillSwitchState {
  active: boolean;
  scope: 'tenant' | 'global';
  profile: 'soft' | 'hard';
  by: string;
  at: Date;
  reason: string;
  filters?: {
    exchanges?: string[];
    tags?: string[];
  };
  note?: string;
}

export interface KillSwitchEngageRequest {
  scope: 'tenant' | 'global';
  profile: 'soft' | 'hard';
  filters?: {
    exchanges?: string[];
    tags?: string[];
  };
  reason: string;
}

export interface KillSwitchClearRequest {
  scope: 'tenant' | 'global';
  note?: string;
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
