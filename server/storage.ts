import { randomUUID } from "crypto";

// Trading Bot interfaces
interface Bot {
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

interface KPI {
  id: string;
  label: string;
  value: number | string;
  change?: number;
  comparison: string;
  icon: string;
  type: 'currency' | 'percentage' | 'number' | 'time';
}

interface ActivityFeed {
  id: string;
  type: 'online' | 'warning' | 'error' | 'offline';
  message: string;
  details: string;
  pnl: number;
  timestamp: Date;
}

export interface IStorage {
  // Bot management
  getAllBots(): Promise<Bot[]>;
  createBot(botData: Partial<Bot>): Promise<Bot>;
  updateBotStatus(id: string, status: Bot['status']): Promise<Bot>;
  stopAllBots(): Promise<void>;
  
  // KPIs and monitoring
  getKPIs(): Promise<KPI[]>;
  getActivities(): Promise<ActivityFeed[]>;
  
  // Compliance and reporting
  getComplianceAlerts(): Promise<any[]>;
  getPerformanceReport(): Promise<any>;
  getOperationalReport(): Promise<any>;
  
  // Strategies and exchanges
  getStrategies(): Promise<any[]>;
  getExchangeConnections(): Promise<any[]>;
  
  // Backtesting
  getBacktests(): Promise<any[]>;
  createBacktest(backtestData: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private bots: Map<string, Bot> = new Map();
  private activities: ActivityFeed[] = [];

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample bots
    const sampleBots: Bot[] = [
      {
        id: '1',
        name: 'Alpha Arbitrage Bot',
        exchange: 'binance',
        tradingPair: 'BTC-USDT',
        strategy: 'arbitrage',
        status: 'running',
        performance: {
          pnl: 2847.32,
          pnlPercent: 12.5,
          trades: 127,
          winRate: 78.2
        },
        riskPolicy: {
          maxPositionSize: 10,
          stopLoss: 5
        },
        createdAt: new Date('2024-01-15'),
        lastUpdated: new Date()
      },
      {
        id: '2',
        name: 'Beta Grid Trading',
        exchange: 'coinbase',
        tradingPair: 'ETH-USDT',
        strategy: 'grid_trading',
        status: 'running',
        performance: {
          pnl: 1200.15,
          pnlPercent: 8.3,
          trades: 89,
          winRate: 65.4
        },
        riskPolicy: {
          maxPositionSize: 15,
          stopLoss: 7
        },
        createdAt: new Date('2024-01-20'),
        lastUpdated: new Date()
      }
    ];

    sampleBots.forEach(bot => this.bots.set(bot.id, bot));

    // Sample activities
    this.activities = [
      {
        id: '1',
        type: 'online',
        message: 'Bot Alpha executed BTC-USDT trade',
        details: 'BUY 0.05 BTC at $43,250',
        pnl: 127.50,
        timestamp: new Date(Date.now() - 300000)
      },
      {
        id: '2',
        type: 'online',
        message: 'Bot Beta profit target reached',
        details: 'ETH-USDT position closed',
        pnl: 89.25,
        timestamp: new Date(Date.now() - 600000)
      },
      {
        id: '3',
        type: 'warning',
        message: 'High volatility detected',
        details: 'BTC-USDT spread increased to 0.8%',
        pnl: 0,
        timestamp: new Date(Date.now() - 900000)
      }
    ];
  }

  async getAllBots(): Promise<Bot[]> {
    return Array.from(this.bots.values());
  }

  async createBot(botData: Partial<Bot>): Promise<Bot> {
    const id = randomUUID();
    const bot: Bot = {
      id,
      name: botData.name || 'New Bot',
      exchange: botData.exchange || 'binance',
      tradingPair: botData.tradingPair || 'BTC-USDT',
      strategy: botData.strategy || 'arbitrage',
      status: botData.status || 'stopped',
      performance: {
        pnl: 0,
        pnlPercent: 0,
        trades: 0,
        winRate: 0
      },
      riskPolicy: botData.riskPolicy || {
        maxPositionSize: 10,
        stopLoss: 5
      },
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    
    this.bots.set(id, bot);
    return bot;
  }

  async updateBotStatus(id: string, status: Bot['status']): Promise<Bot> {
    const bot = this.bots.get(id);
    if (!bot) throw new Error('Bot not found');
    
    bot.status = status;
    bot.lastUpdated = new Date();
    this.bots.set(id, bot);
    return bot;
  }

  async stopAllBots(): Promise<void> {
    Array.from(this.bots.values()).forEach(bot => {
      bot.status = 'stopped';
      bot.lastUpdated = new Date();
    });
  }

  async getKPIs(): Promise<KPI[]> {
    const totalPnL = Array.from(this.bots.values()).reduce((sum, bot) => sum + bot.performance.pnl, 0);
    const runningBots = Array.from(this.bots.values()).filter(bot => bot.status === 'running').length;
    
    return [
      {
        id: '1',
        label: 'Total P/L (24h)',
        value: totalPnL,
        change: 12.5,
        comparison: 'vs. yesterday',
        icon: 'chart-line',
        type: 'currency'
      },
      {
        id: '2',
        label: 'Active Bots',
        value: runningBots,
        comparison: 'All systems operational',
        icon: 'robot',
        type: 'number'
      }
    ];
  }

  async getActivities(): Promise<ActivityFeed[]> {
    return this.activities;
  }

  async getComplianceAlerts(): Promise<any[]> {
    return [
      { id: '1', level: 'warning', message: 'Position limit approaching', timestamp: new Date() }
    ];
  }

  async getPerformanceReport(): Promise<any> {
    return { totalReturn: 15.7, sharpeRatio: 1.8, maxDrawdown: -3.2 };
  }

  async getOperationalReport(): Promise<any> {
    return { uptime: 99.8, avgLatency: 125, errorRate: 0.02 };
  }

  async getStrategies(): Promise<any[]> {
    return [
      { id: '1', name: 'Arbitrage', description: 'Cross-exchange arbitrage' },
      { id: '2', name: 'Grid Trading', description: 'Grid-based market making' }
    ];
  }

  async getExchangeConnections(): Promise<any[]> {
    return [
      { id: '1', name: 'Binance', status: 'connected', balance: { BTC: 0.5, USDT: 10000 } },
      { id: '2', name: 'Coinbase', status: 'connected', balance: { ETH: 5.2, USDT: 8500 } }
    ];
  }

  async getBacktests(): Promise<any[]> {
    return [
      { id: '1', name: 'Arbitrage Strategy Test', status: 'completed', return: 18.5 }
    ];
  }

  async createBacktest(backtestData: any): Promise<any> {
    const id = randomUUID();
    return { id, ...backtestData, status: 'running', createdAt: new Date() };
  }
}

export const storage = new MemStorage();
