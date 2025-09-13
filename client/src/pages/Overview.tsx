import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StandardPageLayout } from "@/components/ui/standard-page-layout";
import { useDemoMode } from "@/contexts/DemoContext";
import DemoStoryViewer from "@/components/Demo/DemoStoryViewer";
import SampleExportModal from "@/components/Demo/SampleExportModal";
import { overviewAPI, portfolioAPI, botAPI, monitoringAPI } from "@/services/api";
import { 
  TrendingUp, 
  TrendingDown, 
  Bot, 
  CheckCircle, 
  Clock,
  DollarSign,
  Activity,
  AlertTriangle,
  Bell,
  FileCheck,
  X
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { KPICard, KPICardGrid } from "@/components/ui/kpi-card";
import { EnhancedChart } from "@/components/ui/enhanced-chart";
import { SkipLink } from "@/components/ui/skip-link";
import { TimeRangeSelector } from "@/components/ui/time-range-selector";
import { ExchangeSummary } from "@/components/ui/exchange-summary";
import { useAuth } from "@/contexts/AuthContext";
import AddExchangeModal from "@/components/Exchange/AddExchangeModal";
import { useToast } from "@/hooks/use-toast";


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
  const [isAddVenueModalOpen, setIsAddVenueModalOpen] = useState(false);
  const { isDemoMode, isReadOnly } = useDemoMode();
  const { tenantRoles } = useAuth();
  const canApprove = tenantRoles?.includes('admin') || tenantRoles?.includes('compliance');
  const { toast } = useToast();
  
  // Fetch overview data from API
  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ['/api/overview'],
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 2
  });
  
  // Fetch portfolio data from API
  const { data: portfolioData, isLoading: portfolioLoading } = useQuery({
    queryKey: ['/api/portfolio'],
    refetchInterval: 30000
  });
  
  // Fetch monitoring alerts
  const { data: alertsData } = useQuery({
    queryKey: ['/api/monitoring/alerts'],
    refetchInterval: 60000
  });

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
          'BTC-USDT • Size: CHF 2,450 • Fee: CHF 2.45',
          'ETH-USDT • Size: CHF 1,200 • Fee: CHF 1.20',
          'SOL-USDT • Size: CHF 800 • Fee: CHF 0.80',
          'AVAX-USDT • Size: CHF 500 • Fee: CHF 0.50'
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

  // Handle add venue submission
  const handleAddVenue = async (data: any) => {
    console.log('Adding venue:', data);
    setIsAddVenueModalOpen(false);
    toast({
      title: "Venue Added",
      description: "Successfully connected to new venue."
    });
  };

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
      activeBots: 4,
      balance: 12450.32,
      currency: 'USDT',
      last24hVolume: 45000
    },
    {
      id: '2',
      name: 'Coinbase Pro',
      status: 'connected' as const,
      activeBots: 2,
      balance: 5620.78,
      currency: 'USD',
      last24hVolume: 28000
    },
    {
      id: '3',
      name: 'Bybit',
      status: 'connected' as const,
      activeBots: 3,
      balance: 3420.15,
      currency: 'USDT',
      last24hVolume: 32000
    },
    {
      id: '4',
      name: 'OKX',
      status: 'connected' as const,
      activeBots: 5,
      balance: 7850.92,
      currency: 'USDT',
      last24hVolume: 51000
    },
    {
      id: '5',
      name: 'Kraken',
      status: 'error' as const,
      activeBots: 0,
      balance: 0,
      currency: 'EUR',
      last24hVolume: 0
    },
    {
      id: '6',
      name: 'KuCoin',
      status: 'connected' as const,
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
          `CHF ${value.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
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
    <StandardPageLayout
      title="Overview"
      subtitle="Trading performance and system status"
      additionalControls={
        <div className="text-xs text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()} UTC
        </div>
      }
    >
      <div className="space-y-4 md:space-y-6">

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
          kpis?.map((kpi) => {
            // Generate sample sparkline data
            const sparklineData = Array.from({ length: 12 }, (_, i) => {
              const base = typeof kpi.value === 'number' ? kpi.value : 100;
              const variation = base * 0.1;
              return base + (Math.random() - 0.5) * variation - (variation * 0.3 * (11 - i) / 11);
            });
            
            return (
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
                sparklineData={sparklineData}
              />
            );
          })
        )}
      </KPICardGrid>

      {/* Main Content Grid - 2 column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Charts */}
        <div className="xl:col-span-2 space-y-4 md:space-y-6">
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Enhanced Equity Curve Chart */}
            <EnhancedChart
              title="Portfolio Equity Curve"
              description="Track your portfolio performance over time"
              data={equityData.map(d => ({ timestamp: d.date, value: d.value, pnl: d.pnl }))}
              dataKeys={[
                { key: 'value', label: 'Portfolio Value', color: '#15803D' },
                { key: 'pnl', label: 'P&L', color: '#DC2626' }
              ]}
              timeRange={timeRange}
              onTimeRangeChange={(range) => setTimeRange(range.value)}
              formatValue={(value) => `CHF ${value.toLocaleString('de-CH')}`}
              className="lg:col-span-2"
            />

            {/* Enhanced Daily P&L Chart */}
            <EnhancedChart
              title="Daily P&L"
              description="Daily profit and loss breakdown"
              data={dailyPnLData.map(d => ({ timestamp: d.date, value: d.pnl, pnl: d.pnl }))}
              dataKeys={[
                { key: 'pnl', label: 'Daily P&L', color: '#DC2626' }
              ]}
              formatValue={(value) => `CHF ${Number(value).toFixed(2)}`}
            />

            {/* Trading Volume Chart */}
            <EnhancedChart
              title="Trading Volume"
              description="Daily trading volume and number of trades"
              data={volumeData.map(d => ({ timestamp: d.date, value: d.volume, volume: d.volume, trades: d.trades }))}
              dataKeys={[
                { key: 'volume', label: 'Volume (CHF)', color: '#1E40AF' },
                { key: 'trades', label: 'Trades', color: '#A16207' }
              ]}
              formatValue={(value) => `CHF ${value.toLocaleString('de-CH')}`}
            />
          </div>

          {/* Exchange Summary */}
          <ExchangeSummary 
            exchanges={exchangeSummaryData}
            onAddExchange={() => setIsAddVenueModalOpen(true)}
            onExchangeClick={(id) => console.log('Exchange clicked:', id)}
          />
        </div>

        {/* Right Column - Activity and Alerts */}
        <div className="space-y-4 md:space-y-6">
          {/* Pending Approvals - Only show if user has approval permissions */}
          {canApprove && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <FileCheck className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Pending Approvals
              </CardTitle>
              <Badge variant="destructive" className="text-xs">
                2
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-900">Mode Change</span>
                  <Clock className="h-3 w-3 text-gray-400" />
                </div>
                <p className="mb-1 text-xs text-gray-600">
                  BTCUSD-MM-01 from Paper to Live
                </p>
                <p className="text-xs text-gray-500">
                  Martin Keller • 02/09/2025, 15:44:54
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-900">Risk Increase</span>
                  <Clock className="h-3 w-3 text-gray-400" />
                </div>
                <p className="mb-1 text-xs text-gray-600">
                  ETHUSD-ARB-02 Daily loss limit: CHF 5,000 → CHF 10,000
                </p>
                <p className="text-xs text-gray-500">
                  Lin Zhang • 02/09/2025, 14:44:54
                </p>
              </div>
            </div>
          </CardContent>
          </Card>
          )}

          {/* System Alerts */}
          <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-amber-600" />
                  <div>
                    <p className="text-xs font-medium text-amber-700">API rate limit exceeded on Kraken</p>
                    <p className="mt-1 text-xs text-amber-600">18m ago</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-amber-700 hover:bg-amber-100"
                >
                  Dismiss
                </Button>
              </div>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <Bell className="mt-0.5 h-3.5 w-3.5 text-blue-600" />
                  <div>
                    <p className="text-xs font-medium text-blue-700">Scheduled maintenance tonight 2-3 AM</p>
                    <p className="mt-1 text-xs text-blue-600">2h ago</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-blue-700 hover:bg-blue-100"
                >
                  Dismiss
                </Button>
              </div>
            </div>
            </div>
          </CardContent>
        </Card>

          {/* Recent Activity - Compact version */}
          <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Live Trading Activity
            </CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 self-start sm:self-auto">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <div className="space-y-3 sm:space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border-b space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 sm:w-48 mb-1" />
                      <Skeleton className="h-3 w-24 sm:w-32" />
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities?.length ? (
            <div className="space-y-0 divide-y">
              {activities.map((activity) => (
                <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    {getStatusIcon(activity.type)}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.message}</p>
                      <p className="text-xs text-gray-500 truncate">{activity.details}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className={`text-sm font-medium ${
                      activity.pnl > 0 ? 'text-pnl-positive' : activity.pnl < 0 ? 'text-pnl-negative' : 'text-gray-500'
                    }`}>
                      {activity.pnl > 0 ? '+' : ''}CHF {activity.pnl.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 sm:py-12 text-gray-500">
              <div className="text-center">
                <Activity className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm sm:text-base">No recent activity</p>
                <p className="text-xs sm:text-sm text-gray-400">Trading activity will appear here in real-time</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
        </div>
      </div>

      {/* Demo Components */}
      {isDemoMode && (
        <div className="space-y-6">
          <DemoStoryViewer />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Sample Exports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Button 
                  onClick={() => setShowExportModal(true)}
                  variant="outline"
                  disabled={isReadOnly}
                  data-testid="button-sample-exports"
                  className="w-full sm:w-auto"
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

      {/* Add Venue Modal */}
      <AddExchangeModal
        isOpen={isAddVenueModalOpen}
        onClose={() => setIsAddVenueModalOpen(false)}
        onSubmit={handleAddVenue}
      />
      </div>
    </StandardPageLayout>
  );
}