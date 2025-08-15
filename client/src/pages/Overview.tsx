import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoMode } from "@/contexts/DemoContext";
import DemoStoryViewer from "@/components/Demo/DemoStoryViewer";
import SampleExportModal from "@/components/Demo/SampleExportModal";
import { DEMO_BOTS, DEMO_METRICS, DEMO_TRADES, DEMO_ALERTS } from "../../../shared/demo-data";
import { 
  TrendingUp, 
  TrendingDown, 
  Bot, 
  CheckCircle, 
  Clock,
  DollarSign,
  Activity,
  AlertTriangle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { KPICard, KPICardGrid } from "@/components/ui/kpi-card";
import { EnhancedChart } from "@/components/ui/enhanced-chart";
import { SkipLink } from "@/components/ui/skip-link";
import { TimeRangeSelector } from "@/components/ui/time-range-selector";
import { ExchangeSummary } from "@/components/ui/exchange-summary";

interface KPI {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  comparison: string;
  icon: string;
  type: 'currency' | 'percentage' | 'number' | 'time';
}

interface ActivityItem {
  id: string;
  type: 'online' | 'warning' | 'error';
  message: string;
  details: string;
  pnl: number;
  timestamp: string;
}

export default function Overview() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [timeRange, setTimeRange] = useState('24h' as const);
  const [showExportModal, setShowExportModal] = useState(false);
  const { isDemoMode, isReadOnly } = useDemoMode();

  // Generate mock KPI data
  const generateKPIData = (): KPI[] => {
    const currentValue = 105247.32;
    const previousValue = 100000;
    const change = ((currentValue - previousValue) / previousValue * 100);
    
    return [
      {
        id: '1',
        label: 'Total Portfolio Value',
        value: currentValue,
        change: change,
        comparison: 'vs last month',
        icon: 'chart-line',
        type: 'currency'
      },
      {
        id: '2',
        label: 'Active Bots',
        value: 7,
        change: 16.7,
        comparison: '6 running, 1 stopped',
        icon: 'robot',
        type: 'number'
      },
      {
        id: '3',
        label: 'Today\'s P&L',
        value: 1247.83,
        change: 12.4,
        comparison: 'vs yesterday',
        icon: 'check-circle',
        type: 'currency'
      },
      {
        id: '4',
        label: 'Avg Response Time',
        value: 47,
        change: -8.2,
        comparison: 'vs last week',
        icon: 'clock',
        type: 'time'
      }
    ];
  };

  // Generate mock activity data
  const generateActivityData = (): ActivityItem[] => {
    const activities = [];
    const now = new Date();
    
    for (let i = 0; i < 8; i++) {
      const timestamp = new Date(now.getTime() - (i * 5 + Math.random() * 10) * 60000);
      const types = ['online', 'warning', 'error'] as const;
      const type = types[Math.floor(Math.random() * types.length)];
      
      const messages = {
        online: [
          'Alpha Arbitrage Bot executed trade on Binance',
          'Beta Grid Trading opened new position',
          'Gamma Momentum Bot closed profitable trade',
          'Delta Mean Reversion rebalanced portfolio'
        ],
        warning: [
          'High volatility detected in BTC-USDT pair',
          'Position size approaching limit threshold',
          'Network latency increased on Coinbase'
        ],
        error: [
          'Failed to execute order on FTX',
          'API rate limit exceeded on Kraken'
        ]
      };
      
      const details = {
        online: [
          'BTC-USDT • Size: $2,450 • Fee: $2.45',
          'ETH-USDT • Size: $1,200 • Fee: $1.20',
          'SOL-USDT • Size: $800 • Fee: $0.80',
          'AVAX-USDT • Size: $500 • Fee: $0.50'
        ],
        warning: [
          'Current volatility: 24.5% (24h)',
          'Current: 87% • Limit: 90%',
          'Current: 145ms • Normal: <100ms'
        ],
        error: [
          'Error: Insufficient balance',
          'Retry in 60 seconds'
        ]
      };
      
      const pnls = {
        online: () => (Math.random() - 0.4) * 500, // Slight positive bias
        warning: () => 0,
        error: () => -(Math.random() * 200)
      };
      
      activities.push({
        id: `activity-${i}`,
        type,
        message: messages[type][Math.floor(Math.random() * messages[type].length)],
        details: details[type][Math.floor(Math.random() * details[type].length)],
        pnl: Math.round(pnls[type]() * 100) / 100,
        timestamp: timestamp.toISOString()
      });
    }
    
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const kpis = generateKPIData();
  const activities = generateActivityData();
  const kpisLoading = false;
  const activitiesLoading = false;

  // Generate mock performance data for charts
  const generateEquityData = () => {
    const data: Array<{date: string; value: number; pnl: number; pnlPercent: string}> = [];
    const baseValue = 100000;
    let currentValue = baseValue;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate realistic trading performance with volatility
      const changePercent = (Math.random() - 0.48) * 2; // Slight upward bias
      currentValue = currentValue * (1 + changePercent / 100);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(currentValue),
        pnl: Math.round(currentValue - baseValue),
        pnlPercent: ((currentValue - baseValue) / baseValue * 100).toFixed(2)
      });
    }
    return data;
  };

  const generateDailyPnLData = () => {
    const data: Array<{date: string; pnl: number; cumulative: number}> = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic daily P&L
      const dailyPnL = (Math.random() - 0.45) * 2000; // Slight positive bias
      
      data.push({
        date: date.toISOString().split('T')[0],
        pnl: Math.round(dailyPnL),
        cumulative: data.length > 0 ? data[data.length - 1].cumulative + dailyPnL : dailyPnL
      });
    }
    return data;
  };

  const generateVolumeData = () => {
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate trading volume with some randomness
      const baseVolume = 50000;
      const volume = baseVolume + (Math.random() - 0.5) * 30000;
      
      data.push({
        date: date.toISOString().split('T')[0],
        volume: Math.round(Math.max(volume, 5000)), // Ensure minimum volume
        trades: Math.round(20 + Math.random() * 40)
      });
    }
    return data;
  };

  const equityData = generateEquityData();
  const dailyPnLData = generateDailyPnLData();
  const volumeData = generateVolumeData();

  // Mock exchange summary data
  const exchangeSummaryData = [
    {
      id: '1',
      name: 'Binance',
      status: 'connected' as const,
      logo: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.svg',
      activeBots: 4,
      balance: 12450.32,
      currency: 'USDT',
      last24hVolume: 45000
    },
    {
      id: '2',
      name: 'Coinbase Pro',
      status: 'connected' as const,
      logo: 'https://cryptologos.cc/logos/coinbase-coin-logo.svg',
      activeBots: 2,
      balance: 5620.78,
      currency: 'USD',
      last24hVolume: 28000
    },
    {
      id: '3',
      name: 'Bybit',
      status: 'connected' as const,
      logo: 'https://cryptologos.cc/logos/bybit-token-bit-logo.svg',
      activeBots: 3,
      balance: 3420.15,
      currency: 'USDT',
      last24hVolume: 32000
    },
    {
      id: '4',
      name: 'OKX',
      status: 'connected' as const,
      logo: 'https://cryptologos.cc/logos/okex-okb-logo.svg',
      activeBots: 5,
      balance: 7850.92,
      currency: 'USDT',
      last24hVolume: 51000
    },
    {
      id: '5',
      name: 'Kraken',
      status: 'error' as const,
      logo: 'https://cryptologos.cc/logos/kraken-kraken-logo.svg',
      activeBots: 0,
      balance: 0,
      currency: 'EUR',
      last24hVolume: 0
    },
    {
      id: '6',
      name: 'KuCoin',
      status: 'connected' as const,
      logo: 'https://cryptologos.cc/logos/kucoin-token-kcs-logo.svg',
      activeBots: 2,
      balance: 2940.78,
      currency: 'USDT',
      last24hVolume: 19000
    }
  ];

  // Setup SSE for real-time updates
  useEffect(() => {
    const eventSource = new EventSource('/api/stream');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'heartbeat' || data.type === 'update') {
        setLastUpdated(new Date());
      }
    };

    eventSource.onerror = () => {
      console.log('SSE connection lost, falling back to polling');
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const formatValue = (value: string | number, type: KPI['type']): string => {
    switch (type) {
      case 'currency':
        return typeof value === 'number' ? 
          `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
          String(value);
      case 'percentage':
        return typeof value === 'number' ? `${value.toFixed(2)}%` : String(value);
      case 'time':
        return typeof value === 'number' ? `${value}ms` : String(value);
      default:
        return String(value);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'chart-line':
        return <TrendingUp className="h-5 w-5" />;
      case 'robot':
        return <Bot className="h-5 w-5" />;
      case 'check-circle':
        return <CheckCircle className="h-5 w-5" />;
      case 'clock':
        return <Clock className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'online':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'warning':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Overview</h1>
          <p className="text-sm md:text-base text-gray-600">Trading performance and system status</p>
        </div>
        <div className="text-xs md:text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()} UTC
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <KPICardGrid>
        {kpisLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <KPICard
              key={i}
              title="Loading..."
              value=""
              loading={true}
            />
          ))
        ) : (
          kpis?.map((kpi) => (
            <KPICard
              key={kpi.id}
              title={kpi.label}
              value={kpi.value}
              delta={kpi.change ? {
                value: kpi.change,
                period: kpi.comparison,
                isPositive: kpi.change > 0
              } : undefined}
              icon={getIcon(kpi.icon)}
              formatter={(value) => formatValue(value, kpi.type)}
            />
          ))
        )}
      </KPICardGrid>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Enhanced Equity Curve Chart */}
        <EnhancedChart
          title="Portfolio Equity Curve"
          description="Track your portfolio performance over time with key trading events marked"
          data={equityData.map(d => ({ timestamp: d.date, value: d.value, pnl: d.pnl }))}
          dataKeys={[
            { key: 'value', label: 'Portfolio Value', color: '#16a34a' },
            { key: 'pnl', label: 'P&L', color: '#dc2626' }
          ]}
          timeRange={timeRange}
          onTimeRangeChange={(range) => setTimeRange(range.value)}
          formatValue={(value) => `$${value.toLocaleString()}`}
          className="lg:col-span-2"
        />

        {/* Enhanced Daily P&L Chart */}
        <EnhancedChart
          title="Daily P&L"
          description="Daily profit and loss breakdown"
          data={dailyPnLData.map(d => ({ timestamp: d.date, value: d.pnl, pnl: d.pnl }))}
          dataKeys={[
            { key: 'pnl', label: 'Daily P&L', color: '#dc2626' }
          ]}
          formatValue={(value) => `$${Number(value).toFixed(2)}`}
        />

        {/* Trading Volume Chart */}
        <EnhancedChart
          title="Trading Volume"
          description="Daily trading volume and number of trades"
          data={volumeData.map(d => ({ timestamp: d.date, value: d.volume, volume: d.volume, trades: d.trades }))}
          dataKeys={[
            { key: 'volume', label: 'Volume ($)', color: '#3b82f6' },
            { key: 'trades', label: 'Trades', color: '#f59e0b' }
          ]}
          formatValue={(value) => `$${value.toLocaleString()}`}
        />
      </div>

      {/* Exchange Summary */}
      <ExchangeSummary 
        exchanges={exchangeSummaryData}
        onAddExchange={() => console.log('Add exchange')}
        onExchangeClick={(id) => console.log('Exchange clicked:', id)}
      />

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Live Trading Activity
            </CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-48 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities?.length ? (
            <div className="space-y-0 divide-y">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(activity.type)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.details}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      activity.pnl > 0 ? 'text-green-600' : activity.pnl < 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {activity.pnl > 0 ? '+' : ''}${activity.pnl.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <div className="text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No recent activity</p>
                <p className="text-sm text-gray-400">Trading activity will appear here in real-time</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Demo Components */}
      {isDemoMode && (
        <div className="space-y-6">
          <DemoStoryViewer />
          
          <Card>
            <CardHeader>
              <CardTitle>Sample Exports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => setShowExportModal(true)}
                  variant="outline"
                  disabled={isReadOnly}
                  data-testid="button-sample-exports"
                >
                  Download Sample Reports
                </Button>
                {isReadOnly && (
                  <p className="text-sm text-gray-500 flex items-center">
                    Export disabled in read-only mode
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <SampleExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />
    </div>
  );
}