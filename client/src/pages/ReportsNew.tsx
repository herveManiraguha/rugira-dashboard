import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  TrendingUp, 
  TrendingDown,
  Download, 
  DollarSign, 
  Target, 
  Clock, 
  AlertTriangle,
  ChevronDown,
  X,
  Save,
  Filter,
  BarChart3,
  Activity,
  Shield,
  Zap,
  Server,
  Wifi,
  AlertCircle,
  CheckCircle,
  XCircle,
  Lock,
  Info,
  FileText,
  Table as TableIcon
} from "lucide-react";
import { useDemoMode } from "@/contexts/DemoContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRBAC } from "@/lib/rbac";
import StepUpConsentModal from "@/components/StepUpConsentModal";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend,
  Treemap,
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';

// Types
interface Filter {
  strategies: string[];
  venues: string[];
  botStates: string[];
}

interface SavedView {
  name: string;
  dateRange: string;
  filters: Filter;
  tab: string;
}

// Helper functions
const formatCurrency = (value: number): string => {
  return `CHF ${value.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

const formatPercent = (value: number): string => {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
};

const formatNumber = (value: number): string => {
  return value.toLocaleString('en-US');
};

export default function ReportsNew() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'performance');
  const [dateRange, setDateRange] = useState('30d');
  const [filters, setFilters] = useState<Filter>({
    strategies: [],
    venues: [],
    botStates: []
  });
  const [savedViews, setSavedViews] = useState<SavedView[]>([
    { name: 'Desk overview', dateRange: '30d', filters: { strategies: [], venues: [], botStates: [] }, tab: 'performance' },
    { name: 'Venue attribution', dateRange: '7d', filters: { strategies: [], venues: [], botStates: [] }, tab: 'performance' },
    { name: 'Risk posture', dateRange: '90d', filters: { strategies: [], venues: [], botStates: [] }, tab: 'risk' },
    { name: 'Ops health', dateRange: '7d', filters: { strategies: [], venues: [], botStates: [] }, tab: 'operational' }
  ]);
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStepUpModal, setShowStepUpModal] = useState(false);
  const [pendingExportType, setPendingExportType] = useState<string | null>(null);
  
  const { isDemoMode } = useDemoMode();
  const authContext = useAuth();
  const rbac = useRBAC(authContext?.user || null, authContext?.currentTenant || null);
  const { toast } = useToast();
  
  const canExportReports = rbac.can('export_reports');
  const canExportCompliance = rbac.can('export_compliance');

  // Update URL and localStorage when tab changes
  useEffect(() => {
    const currentPath = location.split('?')[0];
    setLocation(`${currentPath}?tab=${activeTab}`);
    localStorage.setItem('reports-active-tab', activeTab);
  }, [activeTab, location, setLocation]);

  // Load saved tab from localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem('reports-active-tab');
    if (savedTab && ['performance', 'operational', 'risk'].includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, []);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [dateRange, filters, activeTab]);

  // Generate demo data based on date range
  const getDaysFromRange = (range: string): number => {
    switch (range) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case 'ytd': return Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24));
      case '1y': return 365;
      case 'all': return 730;
      default: return 30;
    }
  };

  const days = getDaysFromRange(dateRange);

  // Performance metrics calculation
  const performanceMetrics = useMemo(() => {
    const startEquity = 100000;
    const endEquity = startEquity * (1 + (0.124 * (days / 365))); // Annualized 12.4% return
    const roi = ((endEquity / startEquity) - 1) * 100;
    const sharpeRatio = days > 30 ? 1.84 : 0.92; // Annualized if > 30 days
    const maxDD = -3.2 - (days / 365) * 1.5; // Deeper DD over longer periods
    const winRate = 68.4 - (days / 365) * 2; // Slightly lower win rate over time
    const totalFees = 2450 * (days / 30);
    
    return {
      netPnL: endEquity - startEquity,
      roi,
      sharpe: sharpeRatio,
      maxDrawdown: maxDD,
      winRate,
      fees: totalFees
    };
  }, [days]);

  // Equity curve data
  const equityCurveData = useMemo(() => {
    const data = [];
    let equity = 100000;
    let maxEquity = equity;
    
    for (let i = 0; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      // Generate realistic daily returns
      const dailyReturn = (Math.random() - 0.45) * 0.03;
      equity *= (1 + dailyReturn);
      maxEquity = Math.max(maxEquity, equity);
      const drawdown = ((equity - maxEquity) / maxEquity) * 100;
      
      data.push({
        date: date.toISOString().split('T')[0],
        equity: Math.round(equity),
        drawdown: Math.round(drawdown * 100) / 100,
        normalized: (equity / 100000) * 100
      });
    }
    return data;
  }, [days]);

  // Bot performance data
  const botPerformanceData = [
    { name: 'Alpha Arbitrage', pnl: 12473.32, roi: 24.5, sharpe: 2.1, trades: 247, fees: 456.78, winRate: 68.4 },
    { name: 'Beta Grid', pnl: -894.45, roi: -1.8, sharpe: -0.3, trades: 156, fees: 234.56, winRate: 45.2 },
    { name: 'Gamma Momentum', pnl: 8921.15, roi: 17.8, sharpe: 1.9, trades: 189, fees: 345.67, winRate: 72.1 },
    { name: 'Delta Mean Rev', pnl: 5678.89, roi: 11.3, sharpe: 1.5, trades: 134, fees: 234.56, winRate: 58.9 },
    { name: 'Epsilon Scalp', pnl: 21345.56, roi: 42.7, sharpe: 2.8, trades: 567, fees: 890.12, winRate: 61.3 }
  ];

  // Strategy attribution data
  const strategyAttributionData = [
    { strategy: 'Arbitrage', netPnL: 23456.78, roi: 18.5, winRate: 71.2, trades: 523, fees: 890.12 },
    { strategy: 'Grid Trading', netPnL: 12345.67, roi: 9.8, winRate: 62.4, trades: 412, fees: 678.90 },
    { strategy: 'Momentum', netPnL: 18234.56, roi: 14.5, winRate: 68.9, trades: 367, fees: 567.89 },
    { strategy: 'Mean Reversion', netPnL: 9876.54, roi: 7.8, winRate: 59.3, trades: 289, fees: 456.78 },
    { strategy: 'Scalping', netPnL: 15432.10, roi: 12.2, winRate: 64.7, trades: 678, fees: 1234.56 }
  ];

  // Venue attribution data
  const venueAttributionData = [
    { venue: 'Binance', netPnL: 34567.89, fees: 1234.56, successRate: 98.7 },
    { venue: 'Coinbase', netPnL: 23456.78, fees: 890.12, successRate: 97.5 },
    { venue: 'Kraken', netPnL: 12345.67, fees: 567.89, successRate: 96.8 },
    { venue: 'BX Digital', netPnL: 8765.43, fees: 345.67, successRate: 99.2 },
    { venue: 'SDX', netPnL: 0, fees: 0, successRate: 0 }
  ];

  // Top/Bottom contributors
  const topBottomContributors = [
    { entity: 'Epsilon Scalp (Bot)', pnl: 21345.56, roi: 42.7, rank: 1 },
    { entity: 'Alpha Arbitrage (Bot)', pnl: 12473.32, roi: 24.5, rank: 2 },
    { entity: 'Momentum (Strategy)', pnl: 18234.56, roi: 14.5, rank: 3 },
    { entity: 'Binance (Venue)', pnl: 34567.89, roi: 28.9, rank: 4 },
    { entity: 'Gamma Momentum (Bot)', pnl: 8921.15, roi: 17.8, rank: 5 },
    { entity: 'Beta Grid (Bot)', pnl: -894.45, roi: -1.8, rank: -1 },
    { entity: 'Test Bot 7', pnl: -567.89, roi: -1.1, rank: -2 },
    { entity: 'Paper Bot 3', pnl: -234.56, roi: -0.5, rank: -3 },
    { entity: 'Dev Bot 2', pnl: -123.45, roi: -0.2, rank: -4 },
    { entity: 'Sandbox Bot', pnl: -45.67, roi: -0.1, rank: -5 }
  ];

  // Operational metrics
  const operationalMetrics = {
    orderSuccess: 97.3,
    rateLimitHits: 23,
    errorCount: 156,
    p95Latency: 125,
    apiUsage: 43,
    venueUptime: 99.7
  };

  // Risk metrics
  const riskMetrics = {
    var95: 24567.89,
    exposure: 156789.12,
    concentration: 34.5,
    ddCapTriggers: 3,
    slTpActivations: 47,
    breaches: 2
  };

  // Exposure treemap data
  const exposureTreemapData = [
    { name: 'BTC', size: 45678, fill: '#e10600' },
    { name: 'ETH', size: 34567, fill: '#1B7A46' },
    { name: 'SOL', size: 23456, fill: '#3b82f6' },
    { name: 'AVAX', size: 12345, fill: '#f59e0b' },
    { name: 'MATIC', size: 8901, fill: '#8b5cf6' },
    { name: 'DOT', size: 6789, fill: '#ec4899' },
    { name: 'ATOM', size: 4567, fill: '#10b981' },
    { name: 'Other', size: 20486, fill: '#6b7280' }
  ];

  // Risk-return scatter data
  const riskReturnScatterData = botPerformanceData.map(bot => ({
    x: Math.abs(bot.roi) * 0.5 + Math.random() * 5, // Volatility proxy
    y: bot.roi,
    name: bot.name,
    size: Math.sqrt(Math.abs(bot.pnl)) * 2
  }));

  // Breaches data
  const breachesData = [
    {
      policy: 'Daily DD Limit',
      requestedBy: 'lin.zhang',
      approvedBy: 'clara.fischer',
      action: 'Temporary increase to 5%',
      time: '2025-01-15 09:45',
      notes: 'Market volatility spike'
    },
    {
      policy: 'Position Size',
      requestedBy: 'martin.keller',
      approvedBy: 'hans.mueller',
      action: 'Override for BTC position',
      time: '2025-01-14 14:23',
      notes: 'Opportunity trade approved'
    }
  ];

  const handleExport = (type: string) => {
    if (!canExportReports && type !== 'risk-pack') {
      toast({
        title: "Export Restricted",
        description: rbac.getDisabledReason('export_reports'),
        variant: "destructive"
      });
      return;
    }

    setPendingExportType(type);
    setShowStepUpModal(true);
  };

  const handleStepUpConfirm = () => {
    setShowStepUpModal(false);
    
    const timestamp = new Date().toISOString().split('T')[0];
    const userEmail = authContext?.user?.email?.split('@')[0] || 'user';
    
    let filename = '';
    let href = '';
    
    switch (pendingExportType) {
      case 'performance-pdf':
        filename = `rugira_performance_${timestamp}_${userEmail}.pdf`;
        href = '/samples/rugira_monthly_performance_report_sample.pdf';
        break;
      case 'attribution-csv':
        filename = `rugira_attribution_${timestamp}_${userEmail}.csv`;
        href = '/samples/rugira_audit_extract_sample.csv';
        break;
      case 'operational-csv':
        filename = `rugira_operational_${timestamp}_${userEmail}.csv`;
        href = '/samples/rugira_audit_extract_sample.csv';
        break;
      case 'risk-pack':
        filename = `rugira_risk_pack_${timestamp}_${userEmail}.pdf`;
        href = '/samples/rugira_monthly_performance_report_sample.pdf';
        break;
    }
    
    if (filename && href) {
      const link = document.createElement('a');
      link.href = href;
      link.download = filename;
      link.click();
      
      toast({
        title: "Export Complete",
        description: `File saved as ${filename}`,
      });
    }
    
    setPendingExportType(null);
  };

  const handleSaveView = () => {
    const viewName = prompt('Enter a name for this view:');
    if (viewName) {
      const newView: SavedView = {
        name: viewName,
        dateRange,
        filters,
        tab: activeTab
      };
      setSavedViews([...savedViews, newView]);
      toast({
        title: "View Saved",
        description: `"${viewName}" has been saved`,
      });
    }
  };

  const handleLoadView = (view: SavedView) => {
    setDateRange(view.dateRange);
    setFilters(view.filters);
    setActiveTab(view.tab);
    setSelectedView(view.name);
    toast({
      title: "View Loaded",
      description: `"${view.name}" has been applied`,
    });
  };

  const removeFilter = (type: 'strategies' | 'venues' | 'botStates', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].filter(v => v !== value)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      strategies: [],
      venues: [],
      botStates: []
    });
  };

  const activeFilterCount = filters.strategies.length + filters.venues.length + filters.botStates.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">Performance analysis and operational metrics</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white border rounded-lg p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Time Range */}
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7D</SelectItem>
              <SelectItem value="30d">30D</SelectItem>
              <SelectItem value="90d">90D</SelectItem>
              <SelectItem value="ytd">YTD</SelectItem>
              <SelectItem value="1y">1Y</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>

          {/* Saved Views */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                {selectedView || 'Saved Views'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {savedViews.map((view, idx) => (
                <DropdownMenuItem key={idx} onClick={() => handleLoadView(view)}>
                  {view.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSaveView}>
                <Save className="h-4 w-4 mr-2" />
                Save Current View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium mb-2">Strategy</Label>
                    <div className="space-y-2">
                      {['Arbitrage', 'Grid Trading', 'Momentum', 'Mean Reversion', 'Scalping'].map(s => (
                        <label key={s} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.strategies.includes(s)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, strategies: [...prev.strategies, s] }));
                              } else {
                                setFilters(prev => ({ ...prev, strategies: prev.strategies.filter(v => v !== s) }));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium mb-2">Venue</Label>
                    <div className="space-y-2">
                      {['Binance', 'Coinbase', 'Kraken', 'BX Digital'].map(v => (
                        <label key={v} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.venues.includes(v)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, venues: [...prev.venues, v] }));
                              } else {
                                setFilters(prev => ({ ...prev, venues: prev.venues.filter(val => val !== v) }));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{v}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium mb-2">Bot State</Label>
                    <div className="space-y-2">
                      {['Running', 'Stopped', 'Error'].map(s => (
                        <label key={s} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.botStates.includes(s)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, botStates: [...prev.botStates, s] }));
                              } else {
                                setFilters(prev => ({ ...prev, botStates: prev.botStates.filter(v => v !== s) }));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.strategies.map(s => (
              <Badge key={s} variant="secondary" className="gap-1">
                Strategy: {s}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeFilter('strategies', s)}
                />
              </Badge>
            ))}
            {filters.venues.map(v => (
              <Badge key={v} variant="secondary" className="gap-1">
                Venue: {v}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeFilter('venues', v)}
                />
              </Badge>
            ))}
            {filters.botStates.map(s => (
              <Badge key={s} variant="secondary" className="gap-1">
                State: {s}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeFilter('botStates', s)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {/* KPI Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Net P&L</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className={`text-lg font-bold tabular-nums ${performanceMetrics.netPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(performanceMetrics.netPnL)}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total profit/loss for selected period</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">ROI</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className={`text-lg font-bold tabular-nums ${performanceMetrics.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercent(performanceMetrics.roi)}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Return on investment normalized to selected range</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Sharpe Ratio</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="text-lg font-bold tabular-nums">
                          {performanceMetrics.sharpe.toFixed(2)}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mean return ÷ volatility; annualized for ranges &gt; 30D</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Max Drawdown</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="text-lg font-bold tabular-nums text-red-600">
                          {formatPercent(performanceMetrics.maxDrawdown)}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Most negative drawdown over selected range</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Win Rate</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="text-lg font-bold tabular-nums">
                          {performanceMetrics.winRate.toFixed(1)}%
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Winning trades ÷ total trades</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Fees</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="text-lg font-bold tabular-nums">
                          {formatCurrency(performanceMetrics.fees)}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total fees paid over selected range</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Equity Curve */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Equity Curve (normalized)</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatPercent((equityCurveData[equityCurveData.length - 1]?.normalized - 100) || 0)} over {dateRange.toUpperCase()}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={equityCurveData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date"
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis yAxisId="left" tickFormatter={(value) => `${value}%`} />
                        <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                        <RechartsTooltip
                          labelFormatter={(value) => new Date(value).toLocaleDateString()}
                          formatter={(value: any, name: string) => [
                            name === 'normalized' ? `${value.toFixed(2)}%` : `${value.toFixed(2)}%`,
                            name === 'normalized' ? 'Equity' : 'Drawdown'
                          ]}
                        />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="normalized" 
                          stroke="#e10600" 
                          strokeWidth={2}
                          dot={false}
                          name="normalized"
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="drawdown" 
                          stroke="#ef4444" 
                          strokeWidth={1}
                          dot={false}
                          name="drawdown"
                          strokeDasharray="5 5"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* P&L by Bot */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>P&L by Bot</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      CHF <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>CHF</DropdownMenuItem>
                    <DropdownMenuItem>%</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={botPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          fontSize={11}
                        />
                        <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                        <RechartsTooltip 
                          formatter={(value: any, name: string) => {
                            if (name === 'pnl') return [formatCurrency(value), 'P&L'];
                            return [value, name];
                          }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-2 border rounded shadow-lg text-xs">
                                  <p className="font-semibold">{data.name}</p>
                                  <p>P&L: {formatCurrency(data.pnl)}</p>
                                  <p>ROI: {formatPercent(data.roi)}</p>
                                  <p>Sharpe: {data.sharpe.toFixed(2)}</p>
                                  <p>Trades: {data.trades}</p>
                                  <p>Fees: {formatCurrency(data.fees)}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="pnl" fill={(data: any) => data.pnl >= 0 ? '#16a34a' : '#ef4444'} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Attribution Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* P&L by Strategy */}
            <Card>
              <CardHeader>
                <CardTitle>P&L by Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-48 w-full" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Strategy</TableHead>
                        <TableHead className="text-right">Net P&L</TableHead>
                        <TableHead className="text-right">ROI %</TableHead>
                        <TableHead className="text-right">Win Rate %</TableHead>
                        <TableHead className="text-right">Trades</TableHead>
                        <TableHead className="text-right">Fees</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {strategyAttributionData.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{row.strategy}</TableCell>
                          <TableCell className={`text-right tabular-nums ${row.netPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(row.netPnL)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">{row.roi.toFixed(1)}%</TableCell>
                          <TableCell className="text-right tabular-nums">{row.winRate.toFixed(1)}%</TableCell>
                          <TableCell className="text-right tabular-nums">{formatNumber(row.trades)}</TableCell>
                          <TableCell className="text-right tabular-nums">{formatCurrency(row.fees)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* P&L by Venue */}
            <Card>
              <CardHeader>
                <CardTitle>P&L by Venue</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-48 w-full" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Venue</TableHead>
                        <TableHead className="text-right">Net P&L</TableHead>
                        <TableHead className="text-right">Fees</TableHead>
                        <TableHead className="text-right">Order Success %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {venueAttributionData.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{row.venue}</TableCell>
                          <TableCell className={`text-right tabular-nums ${row.netPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(row.netPnL)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">{formatCurrency(row.fees)}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {row.successRate > 0 ? `${row.successRate.toFixed(1)}%` : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top/Bottom Contributors */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top/Bottom 5 Contributors</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('performance-pdf')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Monthly Performance Report (PDF)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('attribution-csv')}>
                    <TableIcon className="h-4 w-4 mr-2" />
                    Attribution (CSV)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Top 5 Contributors</h4>
                    <div className="space-y-2">
                      {topBottomContributors
                        .filter(c => c.rank > 0)
                        .map((contributor, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <span className="text-sm font-medium">{contributor.entity}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-sm tabular-nums text-green-600 font-semibold">
                                {formatCurrency(contributor.pnl)}
                              </span>
                              <span className="text-sm tabular-nums text-gray-600">
                                ROI: {formatPercent(contributor.roi)}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Bottom 5 Contributors</h4>
                    <div className="space-y-2">
                      {topBottomContributors
                        .filter(c => c.rank < 0)
                        .map((contributor, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-red-50 rounded">
                            <span className="text-sm font-medium">{contributor.entity}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-sm tabular-nums text-red-600 font-semibold">
                                {formatCurrency(contributor.pnl)}
                              </span>
                              <span className="text-sm tabular-nums text-gray-600">
                                ROI: {formatPercent(contributor.roi)}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {isDemoMode && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-700">
                Sample/Simulated Data - Figures are simulated and for demonstration only. Not investment advice.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Operational Tab */}
        <TabsContent value="operational" className="space-y-6">
          {/* KPI Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Order Success %</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="text-lg font-bold tabular-nums text-green-600">
                          {operationalMetrics.orderSuccess}%
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>(Fills + acked cancels) ÷ submitted</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Rate-limit Hits</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="text-lg font-bold tabular-nums text-amber-600">
                          {operationalMetrics.rateLimitHits}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Count over the period</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Error Count</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="text-lg font-bold tabular-nums text-red-600">
                          {operationalMetrics.errorCount}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total errors in period</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">p95 Latency</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="text-lg font-bold tabular-nums">
                          {operationalMetrics.p95Latency}ms
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Decision-to-ack p95</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">API Usage vs Cap</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="text-lg font-bold tabular-nums">
                          {operationalMetrics.apiUsage}%
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Average % usage</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Venue Uptime %</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="text-lg font-bold tabular-nums text-green-600">
                          {operationalMetrics.venueUptime}%
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Weighted by routed volume</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Latency Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Latency Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={equityCurveData.map((d, i) => ({
                        date: d.date,
                        p50: 60 + Math.random() * 20,
                        p95: 120 + Math.random() * 30,
                        p99: 180 + Math.random() * 50
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date"
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis tickFormatter={(value) => `${value}ms`} />
                        <RechartsTooltip
                          labelFormatter={(value) => new Date(value).toLocaleDateString()}
                          formatter={(value: any) => [`${value.toFixed(0)}ms`]}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="p50" stroke="#16a34a" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="p95" stroke="#f59e0b" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="p99" stroke="#ef4444" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Error Taxonomy */}
            <Card>
              <CardHeader>
                <CardTitle>Error Taxonomy</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { type: 'Auth', count: 12 },
                        { type: 'Rate Limit', count: 23 },
                        { type: 'Network', count: 45 },
                        { type: 'Validation', count: 76 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="count" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Venue Health Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Venue Health</CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleExport('operational-csv')}>
                <Download className="h-4 w-4 mr-2" />
                Operational Metrics (CSV)
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Venue</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead className="text-right">Last Sync</TableHead>
                      <TableHead className="text-right">Retries</TableHead>
                      <TableHead className="text-right">WS Reconnects</TableHead>
                      <TableHead className="text-right">API Usage %</TableHead>
                      <TableHead className="text-right">Order Success %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { venue: 'Binance', state: 'Connected', lastSync: '2 mins ago', retries: 0, reconnects: 1, apiUsage: 45, successRate: 98.7 },
                      { venue: 'Coinbase', state: 'Connected', lastSync: '1 min ago', retries: 0, reconnects: 0, apiUsage: 32, successRate: 97.5 },
                      { venue: 'Kraken', state: 'Warning', lastSync: '5 mins ago', retries: 3, reconnects: 2, apiUsage: 67, successRate: 96.8 },
                      { venue: 'BX Digital', state: 'Connected', lastSync: '30 secs ago', retries: 0, reconnects: 0, apiUsage: 12, successRate: 99.2 }
                    ].map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{row.venue}</TableCell>
                        <TableCell>
                          <Badge variant={row.state === 'Connected' ? 'default' : row.state === 'Warning' ? 'secondary' : 'destructive'}>
                            {row.state === 'Connected' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : row.state === 'Warning' ? (
                              <AlertTriangle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {row.state}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{row.lastSync}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.retries}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.reconnects}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.apiUsage}%</TableCell>
                        <TableCell className="text-right tabular-nums">{row.successRate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {isDemoMode && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-700">
                Sample/Simulated Data - Figures are simulated and for demonstration only.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk" className="space-y-6">
          {/* KPI Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">VaR 95%</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="text-lg font-bold tabular-nums text-amber-600">
                          {formatCurrency(riskMetrics.var95)}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Value at Risk at 95% confidence</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Exposure</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="text-lg font-bold tabular-nums">
                          {formatCurrency(riskMetrics.exposure)}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Gross exposure for selected assets/venues</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Largest Conc. %</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="text-lg font-bold tabular-nums text-amber-600">
                          {riskMetrics.concentration}%
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Max single asset/venue weight</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">DD Cap Triggers</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="text-lg font-bold tabular-nums">
                          {riskMetrics.ddCapTriggers}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Daily drawdown guard activations</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">SL/TP Activations</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="text-lg font-bold tabular-nums">
                          {riskMetrics.slTpActivations}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Stop-loss/take-profit triggers</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Breaches</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="text-lg font-bold tabular-nums text-red-600">
                          {riskMetrics.breaches}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Number of risk policy breaches</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exposure Treemap */}
            <Card>
              <CardHeader>
                <CardTitle>Exposure Treemap</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <Treemap
                        data={exposureTreemapData}
                        dataKey="size"
                        ratio={4/3}
                        stroke="#fff"
                        fill="#e10600"
                        content={({ x, y, width, height, value, name, fill }: any) => {
                          return (
                            <g>
                              <rect
                                x={x}
                                y={y}
                                width={width}
                                height={height}
                                style={{ fill, stroke: '#fff', strokeWidth: 2 }}
                              />
                              {width > 50 && height > 30 && (
                                <>
                                  <text
                                    x={x + width / 2}
                                    y={y + height / 2 - 5}
                                    textAnchor="middle"
                                    fill="#fff"
                                    fontSize={14}
                                    fontWeight="bold"
                                  >
                                    {name}
                                  </text>
                                  <text
                                    x={x + width / 2}
                                    y={y + height / 2 + 15}
                                    textAnchor="middle"
                                    fill="#fff"
                                    fontSize={12}
                                  >
                                    {formatCurrency(value)}
                                  </text>
                                </>
                              )}
                            </g>
                          );
                        }}
                      />
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Risk-Return Scatter */}
            <Card>
              <CardHeader>
                <CardTitle>Risk-Return Scatter</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="x" 
                          name="Volatility"
                          tickFormatter={(value) => `${value.toFixed(0)}%`}
                        />
                        <YAxis 
                          dataKey="y" 
                          name="ROI"
                          tickFormatter={(value) => `${value.toFixed(0)}%`}
                        />
                        <RechartsTooltip 
                          formatter={(value: any, name: string) => {
                            if (name === 'x') return [`${value.toFixed(1)}%`, 'Volatility'];
                            if (name === 'y') return [`${value.toFixed(1)}%`, 'ROI'];
                            return [value, name];
                          }}
                          labelFormatter={(label) => riskReturnScatterData.find(d => d.x === label)?.name || ''}
                        />
                        <Scatter 
                          data={riskReturnScatterData} 
                          fill="#e10600"
                        >
                          {riskReturnScatterData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.y >= 0 ? '#16a34a' : '#ef4444'} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Breaches Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Breaches & Outcomes</CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleExport('risk-pack')}>
                <Download className="h-4 w-4 mr-2" />
                Risk Pack (CSV/PDF)
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Policy</TableHead>
                      <TableHead>Requested by</TableHead>
                      <TableHead>Approved by</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {breachesData.map((breach, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{breach.policy}</TableCell>
                        <TableCell>{breach.requestedBy}</TableCell>
                        <TableCell>{breach.approvedBy}</TableCell>
                        <TableCell>{breach.action}</TableCell>
                        <TableCell className="tabular-nums">{breach.time}</TableCell>
                        <TableCell className="text-gray-600">{breach.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {isDemoMode && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-700">
                Sample/Simulated Data - Figures are simulated and for demonstration only. Not investment advice.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Step-up Consent Modal */}
      <StepUpConsentModal
        isOpen={showStepUpModal}
        onClose={() => {
          setShowStepUpModal(false);
          setPendingExportType(null);
        }}
        onConfirm={handleStepUpConfirm}
        operation={`Export ${pendingExportType?.replace('-', ' ')}`}
        description="You are about to export sensitive financial data. This action will be logged for audit purposes."
      />
    </div>
  );
}