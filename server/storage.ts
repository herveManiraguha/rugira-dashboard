import { randomUUID } from "crypto";
import { mockBots, mockTrades, mockStrategies, mockExchanges, mockMarketData, mockPerformanceData, mockRiskData, mockComplianceData } from "../shared/mockData";

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
  
  // Trading data
  getRecentTrades(): Promise<any[]>;
  getTradeHistory(botId?: string): Promise<any[]>;
  
  // Market data
  getMarketData(): Promise<any[]>;
  getPerformanceData(): Promise<any>;
  
  // Risk & Compliance
  getRiskData(): Promise<any>;
  
  // Kill Switch
  getKillSwitchState(): Promise<import('../shared/schema').KillSwitchState | null>;
  engageKillSwitch(state: import('../shared/schema').KillSwitchState): Promise<void>;
  clearKillSwitch(): Promise<void>;
  getComplianceData(): Promise<any>;
  getComplianceAlerts(): Promise<any[]>;
  getPerformanceReport(): Promise<any>;
  getOperationalReport(): Promise<any>;
  
  // Strategies and exchanges
  getStrategies(): Promise<any[]>;
  getExchangeConnections(): Promise<any[]>;
  getAllExchanges(): Promise<any[]>;
  
  // Backtesting
  getBacktests(): Promise<any[]>;
  createBacktest(backtestData: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private bots: Map<string, Bot> = new Map();
  private activities: ActivityFeed[] = [];
  private killSwitchState: import('../shared/schema').KillSwitchState | null = null;

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



  async getBacktests(): Promise<any[]> {
    return [
      { id: '1', name: 'Arbitrage Strategy Test', status: 'completed', return: 18.5 }
    ];
  }

  async createBacktest(backtestData: any): Promise<any> {
    const id = randomUUID();
    return { id, ...backtestData, status: 'running', createdAt: new Date() };
  }

  // Mock data methods
  async getRecentTrades(): Promise<any[]> {
    return mockTrades.slice(0, 10);
  }

  async getTradeHistory(botId?: string): Promise<any[]> {
    if (botId) {
      return mockTrades.filter(trade => trade.botId === botId);
    }
    return mockTrades;
  }

  async getMarketData(): Promise<any[]> {
    return mockMarketData;
  }

  async getPerformanceData(): Promise<any> {
    return mockPerformanceData;
  }

  async getRiskData(): Promise<any> {
    return mockRiskData;
  }

  async getComplianceData(): Promise<any> {
    return mockComplianceData;
  }

  async getAllExchanges(): Promise<any[]> {
    return mockExchanges;
  }

  // Override existing methods to use mock data
  async getStrategies(): Promise<any[]> {
    return mockStrategies;
  }

  async getExchangeConnections(): Promise<any[]> {
    return mockExchanges;
  }

  async getAllBots(): Promise<Bot[]> {
    // Convert mock bots to our Bot interface format
    return mockBots.map(bot => ({
      id: bot.id,
      name: bot.name,
      exchange: bot.exchange,
      tradingPair: bot.tradingPair,
      strategy: bot.strategy,
      status: bot.status as Bot['status'],
      performance: {
        pnl: bot.pnl,
        pnlPercent: bot.pnlPercent,
        trades: bot.totalTrades,
        winRate: bot.winRate
      },
      riskPolicy: {
        maxPositionSize: 10,
        stopLoss: 5
      },
      createdAt: new Date(bot.createdAt),
      lastUpdated: new Date()
    }));
  }

  async getKPIs(): Promise<KPI[]> {
    const totalPnL = mockBots.reduce((sum, bot) => sum + bot.pnl, 0);
    const dailyPnL = mockBots.reduce((sum, bot) => sum + bot.dailyPnl, 0);
    const runningBots = mockBots.filter(bot => bot.status === 'running').length;
    const totalTrades = mockBots.reduce((sum, bot) => sum + bot.totalTrades, 0);
    
    return [
      {
        id: '1',
        label: 'Total P/L',
        value: `$${totalPnL.toLocaleString()}`,
        change: 12.5,
        comparison: 'vs. last month',
        icon: 'chart-line',
        type: 'currency'
      },
      {
        id: '2',
        label: 'Daily P/L',
        value: `$${dailyPnL.toLocaleString()}`,
        change: -2.3,
        comparison: 'vs. yesterday',
        icon: 'trending-up',
        type: 'currency'
      },
      {
        id: '3',
        label: 'Active Bots',
        value: runningBots,
        comparison: `${mockBots.length} total bots`,
        icon: 'robot',
        type: 'number'
      },
      {
        id: '4',
        label: 'Total Trades',
        value: totalTrades.toLocaleString(),
        change: 8.7,
        comparison: 'vs. last week',
        icon: 'activity',
        type: 'number'
      }
    ];
  }

  // Kill Switch implementation
  async getKillSwitchState(): Promise<import('../shared/schema').KillSwitchState | null> {
    return this.killSwitchState;
  }

  async engageKillSwitch(state: import('../shared/schema').KillSwitchState): Promise<void> {
    this.killSwitchState = state;
    
    // In a real implementation, this would:
    // 1. Update Redis/DB with the kill switch state
    // 2. Broadcast to all services via SSE/WebSocket
    // 3. Trigger order cancellation for hard halt
    console.log(`Kill Switch ENGAGED: ${state.scope}/${state.profile} by ${state.by}`);
  }

  async clearKillSwitch(): Promise<void> {
    this.killSwitchState = null;
    
    // In a real implementation, this would:
    // 1. Clear Redis/DB state
    // 2. Broadcast TRADING_RESUMED event
    console.log('Kill Switch CLEARED');
  }
}

export const storage = new MemStorage();
