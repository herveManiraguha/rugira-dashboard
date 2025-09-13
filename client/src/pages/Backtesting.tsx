import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Play, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  BarChart3, 
  Plus,
  Download,
  Settings,
  Clock,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';

interface BacktestConfig {
  strategyId: string;
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  tradingPair: string;
  exchanges: string[];
  parameters: Record<string, any>;
}

interface BacktestResult {
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
  };
  createdAt: string;
}

export default function Backtesting() {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Date>();
  const [selectedDateTo, setSelectedDateTo] = useState<Date>();
  const [selectedBacktestId, setSelectedBacktestId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Generate equity curve data for backtesting
  const generateEquityCurve = (strategyName: string, finalCapital: number): Array<{date: string, equity: number, drawdown: number}> => {
    const data: Array<{date: string, equity: number, drawdown: number}> = [];
    let capital = 100000; // Starting capital
    const targetCapital = finalCapital;
    const days = 365; // Full year backtest
    
    const totalReturn = (targetCapital - capital) / capital;
    const dailyReturn = Math.pow(1 + totalReturn, 1/days) - 1;
    
    for (let i = 0; i <= days; i++) {
      const date = new Date('2024-01-01');
      date.setDate(date.getDate() + i);
      
      // Add some volatility to make it realistic
      const volatility = (Math.random() - 0.5) * 0.02;
      const adjustedReturn = dailyReturn + volatility;
      capital *= (1 + adjustedReturn);
      
      // Ensure we end close to target
      if (i === days) capital = targetCapital;
      
      data.push({
        date: date.toISOString().split('T')[0],
        equity: Math.round(capital * 100) / 100,
        drawdown: Math.max(0, (capital / Math.max(...data.map(d => d.equity || capital)) - 1) * 100)
      });
    }
    return data;
  };

  // Generate monthly performance breakdown
  const generateMonthlyPerformance = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      return: (Math.random() - 0.3) * 8, // Monthly returns between -5% and +5%
      trades: Math.floor(Math.random() * 30 + 10),
      winRate: Math.random() * 30 + 55 // 55-85% win rate
    }));
  };
  const [backtests] = useState<BacktestResult[]>([
    {
      id: '1',
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
        finalCapital: 124700
      },
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '2',
      strategyName: 'Grid Trading Strategy',
      dateRange: '2024-06-01 to 2024-12-31',
      status: 'running',
      progress: 76,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ]);
  const { toast } = useToast();

  // Handle download backtest results
  const handleDownloadBacktest = (backtest: BacktestResult) => {
    if (!backtest.results || backtest.status !== 'completed') return;

    // Create CSV content
    const csvContent = [
      // Header row
      ['Metric', 'Value', 'Unit'].join(','),
      // Data rows
      ['Strategy Name', `"${backtest.strategyName}"`, ''],
      ['Date Range', `"${backtest.dateRange}"`, ''],
      ['Status', backtest.status, ''],
      ['Total Return', backtest.results.totalReturn.toFixed(2), '%'],
      ['Sharpe Ratio', backtest.results.sharpeRatio.toFixed(2), ''],
      ['Max Drawdown', backtest.results.maxDrawdown.toFixed(2), '%'],
      ['Win Rate', backtest.results.winRate.toFixed(2), '%'],
      ['Total Trades', backtest.results.totalTrades.toString(), ''],
      ['Final Capital', backtest.results.finalCapital.toString(), '$'],
      ['Created At', backtest.createdAt, '']
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `backtest-${backtest.strategyName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Complete",
      description: "Backtest results exported to CSV successfully."
    });
  };

  const getStatusBadge = (status: BacktestResult['status']) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'running': return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const BacktestConfigForm = () => {
    const [config, setConfig] = useState<Partial<BacktestConfig>>({
      strategyId: '',
      initialCapital: 100000,
      tradingPair: 'BTC-USDT',
      exchanges: ['binance'],
      parameters: {}
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      toast({ title: "Backtest will start once backend API is implemented" });
      setIsConfigModalOpen(false);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="strategy">Strategy</Label>
            <Select onValueChange={(value) => setConfig(prev => ({ ...prev, strategyId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="moving_average">Moving Average Crossover</SelectItem>
                <SelectItem value="grid_trading">Grid Trading</SelectItem>
                <SelectItem value="arbitrage">Cross-Exchange Arbitrage</SelectItem>
                <SelectItem value="momentum">Momentum Breakout</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tradingPair">Trading Pair</Label>
            <Input
              id="tradingPair"
              value={config.tradingPair}
              onChange={(e) => setConfig(prev => ({ ...prev, tradingPair: e.target.value }))}
              placeholder="BTC-USDT"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="truncate">{selectedDateFrom ? selectedDateFrom.toLocaleDateString() : "Pick start date"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDateFrom}
                  onSelect={setSelectedDateFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="truncate">{selectedDateTo ? selectedDateTo.toLocaleDateString() : "Pick end date"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDateTo}
                  onSelect={setSelectedDateTo}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label htmlFor="initialCapital">Initial Capital ($)</Label>
          <Input
            id="initialCapital"
            type="number"
            value={config.initialCapital}
            onChange={(e) => setConfig(prev => ({ ...prev, initialCapital: Number(e.target.value) }))}
            min="1000"
            step="1000"
          />
        </div>

        <div>
          <Label htmlFor="exchanges">Exchanges</Label>
          <Select onValueChange={(value) => setConfig(prev => ({ ...prev, exchanges: [value] }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select exchange" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="binance">Binance</SelectItem>
              <SelectItem value="coinbase">Coinbase Pro</SelectItem>
              <SelectItem value="kraken">Kraken</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => setIsConfigModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">
            <Play className="h-4 w-4 mr-2" />
            Start Backtest
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Strategy Backtesting</h1>
          <p className="text-gray-600">Test your trading strategies against historical data</p>
        </div>
        <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Backtest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configure Backtest</DialogTitle>
            </DialogHeader>
            <BacktestConfigForm />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="results" className="w-full">
        <TabsList>
          <TabsTrigger value="results">Backtest Results</TabsTrigger>
          <TabsTrigger value="comparison">Compare Strategies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="results" className="space-y-6">
          {/* Mobile Cards View */}
          <div className="block md:hidden space-y-4">
            {backtests.map((backtest) => (
              <Card key={backtest.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{backtest.strategyName}</div>
                      <div className="text-sm text-gray-500 mt-1">{backtest.dateRange}</div>
                    </div>
                    {getStatusBadge(backtest.status)}
                  </div>
                  
                  {backtest.status === 'running' && (
                    <div className="flex items-center space-x-2">
                      <Progress value={backtest.progress} className="flex-1" />
                      <span className="text-xs text-gray-500">{backtest.progress}%</span>
                    </div>
                  )}
                  
                  {backtest.results && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <div className="text-xs text-gray-500">Return</div>
                        <div className={backtest.results.totalReturn >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {backtest.results.totalReturn >= 0 ? '+' : ''}{backtest.results.totalReturn.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Sharpe</div>
                        <div className="font-medium">{backtest.results.sharpeRatio.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Drawdown</div>
                        <div className="text-red-600 font-medium">{backtest.results.maxDrawdown.toFixed(1)}%</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedBacktestId(backtest.id);
                        setIsDetailsModalOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                    {backtest.status === 'completed' && (
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <Card className="hidden md:block">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Strategy</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Return</TableHead>
                    <TableHead>Sharpe Ratio</TableHead>
                    <TableHead>Max Drawdown</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backtests.map((backtest) => (
                    <TableRow key={backtest.id}>
                      <TableCell className="font-medium">{backtest.strategyName}</TableCell>
                      <TableCell>{backtest.dateRange}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(backtest.status)}
                          {backtest.status === 'running' && (
                            <div className="flex items-center space-x-2">
                              <Progress value={backtest.progress} className="w-16" />
                              <span className="text-xs text-gray-500">{backtest.progress}%</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {backtest.results ? (
                          <span className={backtest.results.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {backtest.results.totalReturn >= 0 ? '+' : ''}{backtest.results.totalReturn.toFixed(1)}%
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {backtest.results ? backtest.results.sharpeRatio.toFixed(2) : '-'}
                      </TableCell>
                      <TableCell>
                        {backtest.results ? (
                          <span className="text-red-600">{backtest.results.maxDrawdown.toFixed(1)}%</span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedBacktestId(backtest.id);
                              setIsDetailsModalOpen(true);
                            }}
                          >
                            View Details
                          </Button>
                          {backtest.status === 'completed' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDownloadBacktest(backtest)}
                              data-testid={`button-download-backtest-${backtest.id}`}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Detailed Results for Completed Backtests */}
          {backtests.filter(b => b.status === 'completed' && b.results).map((backtest) => (
            <Card key={`details-${backtest.id}`}>
              <CardHeader>
                <CardTitle>Results: {backtest.strategyName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Total Return</div>
                    <div className={`text-sm sm:text-lg font-bold ${backtest.results!.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {backtest.results!.totalReturn >= 0 ? '+' : ''}{backtest.results!.totalReturn.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Sharpe Ratio</div>
                    <div className="text-sm sm:text-lg font-bold">{backtest.results!.sharpeRatio.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Max Drawdown</div>
                    <div className="text-sm sm:text-lg font-bold text-red-600">{backtest.results!.maxDrawdown.toFixed(1)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Win Rate</div>
                    <div className="text-sm sm:text-lg font-bold">{backtest.results!.winRate.toFixed(1)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Total Trades</div>
                    <div className="text-sm sm:text-lg font-bold">{backtest.results!.totalTrades}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Final Capital</div>
                    <div className="text-sm sm:text-lg font-bold">${backtest.results!.finalCapital.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Equity Curve Chart */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Equity Curve</h4>
                    <div className="h-64 border rounded">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={generateEquityCurve(backtest.strategyName, backtest.results!.finalCapital)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date"
                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          />
                          <YAxis 
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                          />
                          <Tooltip 
                            labelFormatter={(value) => new Date(value).toLocaleDateString()}
                            formatter={(value: any) => [`$${value.toFixed(2)}`, 'Portfolio Value']}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="equity" 
                            stroke="#1b7a46" 
                            fill="#1b7a46" 
                            fillOpacity={0.1}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Monthly Performance Chart */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Monthly Returns</h4>
                    <div className="h-64 border rounded">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={generateMonthlyPerformance()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
                          <Tooltip 
                            formatter={(value: any, name) => [
                              name === 'return' ? `${Number(value).toFixed(2)}%` : Number(value).toFixed(1),
                              name === 'return' ? 'Monthly Return' : name === 'trades' ? 'Trades' : 'Win Rate %'
                            ]}
                          />
                          <Bar 
                            dataKey="return" 
                            fill="#e10600"
                            name="return"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-6">
          {/* Strategy Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Strategy Comparison</CardTitle>
              <p className="text-sm text-gray-600">Compare multiple strategies side-by-side</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Strategy 1</Label>
                  <Select defaultValue="moving_average">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moving_average">Moving Average Crossover</SelectItem>
                      <SelectItem value="grid_trading">Grid Trading Strategy</SelectItem>
                      <SelectItem value="momentum">Momentum Breakout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Strategy 2</Label>
                  <Select defaultValue="grid_trading">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moving_average">Moving Average Crossover</SelectItem>
                      <SelectItem value="grid_trading">Grid Trading Strategy</SelectItem>
                      <SelectItem value="momentum">Momentum Breakout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Strategy 3</Label>
                  <Select defaultValue="momentum">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moving_average">Moving Average Crossover</SelectItem>
                      <SelectItem value="grid_trading">Grid Trading Strategy</SelectItem>
                      <SelectItem value="momentum">Momentum Breakout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics Comparison - Mobile Cards View */}
          <div className="block md:hidden space-y-4">
            <h3 className="text-lg font-semibold px-1">Performance Metrics Comparison</h3>
            
            {/* Total Return Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Total Return</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Moving Average</span>
                  <span className="text-green-600 font-medium">+24.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Grid Trading</span>
                  <span className="text-green-600 font-medium">+18.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Momentum</span>
                  <span className="text-green-600 font-medium">+31.2%</span>
                </div>
              </CardContent>
            </Card>

            {/* Other metrics cards */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Sharpe Ratio</div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">MA</div>
                      <div className="font-medium">1.42</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Grid</div>
                      <div className="font-medium">1.18</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Mom</div>
                      <div className="font-medium">1.67</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Max Drawdown</div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center text-red-600 font-medium">-8.3%</div>
                    <div className="text-center text-red-600 font-medium">-12.1%</div>
                    <div className="text-center text-red-600 font-medium">-15.8%</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Win Rate</div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center font-medium">67.2%</div>
                    <div className="text-center font-medium">84.5%</div>
                    <div className="text-center font-medium">58.9%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics Comparison Table - Desktop Only */}
          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle>Performance Metrics Comparison</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-center">Moving Average Crossover</TableHead>
                    <TableHead className="text-center">Grid Trading Strategy</TableHead>
                    <TableHead className="text-center">Momentum Breakout</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Total Return</TableCell>
                    <TableCell className="text-center text-green-600 font-medium">+24.7%</TableCell>
                    <TableCell className="text-center text-green-600 font-medium">+18.3%</TableCell>
                    <TableCell className="text-center text-green-600 font-medium">+31.2%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sharpe Ratio</TableCell>
                    <TableCell className="text-center">1.42</TableCell>
                    <TableCell className="text-center">1.18</TableCell>
                    <TableCell className="text-center">1.67</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Max Drawdown</TableCell>
                    <TableCell className="text-center text-red-600">-8.3%</TableCell>
                    <TableCell className="text-center text-red-600">-12.1%</TableCell>
                    <TableCell className="text-center text-red-600">-15.8%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Win Rate</TableCell>
                    <TableCell className="text-center">67.2%</TableCell>
                    <TableCell className="text-center">84.5%</TableCell>
                    <TableCell className="text-center">58.9%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Trades</TableCell>
                    <TableCell className="text-center">247</TableCell>
                    <TableCell className="text-center">1,852</TableCell>
                    <TableCell className="text-center">89</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Avg Trade Duration</TableCell>
                    <TableCell className="text-center">2.3 days</TableCell>
                    <TableCell className="text-center">4.2 hours</TableCell>
                    <TableCell className="text-center">5.7 days</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Profit Factor</TableCell>
                    <TableCell className="text-center">1.84</TableCell>
                    <TableCell className="text-center">1.52</TableCell>
                    <TableCell className="text-center">2.13</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Final Capital</TableCell>
                    <TableCell className="text-center font-medium">CHF 124,700</TableCell>
                    <TableCell className="text-center font-medium">CHF 118,300</TableCell>
                    <TableCell className="text-center font-medium">CHF 131,200</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Equity Curves Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Equity Curves Comparison</CardTitle>
              <p className="text-sm text-gray-600">Portfolio value over time for each strategy</p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={(() => {
                    const data = [];
                    for (let i = 0; i <= 365; i++) {
                      const date = new Date('2024-01-01');
                      date.setDate(date.getDate() + i);
                      
                      // Moving Average - steady growth with moderate volatility
                      const ma_progress = i / 365;
                      const ma_base = 100000 * (1 + 0.247 * ma_progress);
                      const ma_volatility = (Math.sin(i * 0.1) + Math.sin(i * 0.03)) * 2000;
                      
                      // Grid Trading - smaller gains, more stable
                      const grid_progress = i / 365;
                      const grid_base = 100000 * (1 + 0.183 * grid_progress);
                      const grid_volatility = (Math.sin(i * 0.2) + Math.cos(i * 0.05)) * 800;
                      
                      // Momentum - highest returns but more volatile
                      const momentum_progress = i / 365;
                      const momentum_base = 100000 * (1 + 0.312 * momentum_progress);
                      const momentum_volatility = (Math.sin(i * 0.08) + Math.cos(i * 0.12)) * 4000;
                      
                      data.push({
                        date: date.toISOString().split('T')[0],
                        movingAverage: Math.round(ma_base + ma_volatility),
                        gridTrading: Math.round(grid_base + grid_volatility),
                        momentum: Math.round(momentum_base + momentum_volatility)
                      });
                    }
                    return data;
                  })()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: any, name) => [
                        `$${Number(value).toLocaleString()}`,
                        name === 'movingAverage' ? 'Moving Average' : 
                        name === 'gridTrading' ? 'Grid Trading' : 'Momentum'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="movingAverage" 
                      stroke="#e10600" 
                      strokeWidth={2}
                      dot={false}
                      name="movingAverage"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="gridTrading" 
                      stroke="#1B7A46" 
                      strokeWidth={2}
                      dot={false}
                      name="gridTrading"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="momentum" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={false}
                      name="momentum"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-[#e10600]"></div>
                  <span className="text-sm">Moving Average Crossover</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-[#1B7A46]"></div>
                  <span className="text-sm">Grid Trading Strategy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-[#2563eb]"></div>
                  <span className="text-sm">Momentum Breakout</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk vs Return Scatter Plot */}
          <Card>
            <CardHeader>
              <CardTitle>Risk vs Return Analysis</CardTitle>
              <p className="text-sm text-gray-600">Compare risk-adjusted returns across strategies</p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={[
                      { risk: 8.3, return: 24.7, strategy: 'Moving Average', size: 247 },
                      { risk: 12.1, return: 18.3, strategy: 'Grid Trading', size: 1852 },
                      { risk: 15.8, return: 31.2, strategy: 'Momentum', size: 89 }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="risk"
                      type="number"
                      domain={[0, 20]}
                      tickFormatter={(value) => `${value}%`}
                      label={{ value: 'Max Drawdown (%)', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      dataKey="return"
                      type="number"
                      domain={[0, 35]}
                      tickFormatter={(value) => `${value}%`}
                      label={{ value: 'Total Return (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value: any, name: any) => [
                        name === 'return' ? `${Number(value).toFixed(1)}%` : 
                        name === 'risk' ? `${Number(value).toFixed(1)}%` : Number(value),
                        name === 'return' ? 'Total Return' : 
                        name === 'risk' ? 'Max Drawdown' : 'Total Trades'
                      ]}
                      labelFormatter={(label: any, payload: any) => payload?.[0]?.payload?.strategy || ''}
                    />
                    {/* Custom scatter points */}
                    <Line 
                      type="monotone" 
                      dataKey="return" 
                      stroke="none"
                      dot={{ fill: '#e10600', stroke: '#e10600', strokeWidth: 2, r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Risk-Return Summary */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Best Risk-Adjusted Return</div>
                  <div className="font-semibold text-[#e10600]">Moving Average Crossover</div>
                  <div className="text-xs text-gray-500">Sharpe Ratio: 1.42</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Highest Total Return</div>
                  <div className="font-semibold text-blue-600">Momentum Breakout</div>
                  <div className="text-xs text-gray-500">+31.2% in 12 months</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Most Conservative</div>
                  <div className="font-semibold text-green-600">Grid Trading Strategy</div>
                  <div className="text-xs text-gray-500">Lowest max drawdown</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance Comparison</CardTitle>
              <p className="text-sm text-gray-600">Month-by-month return comparison</p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={(() => {
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return months.map(month => ({
                      month,
                      movingAverage: (Math.random() - 0.2) * 6 + 2, // Avg 2% with volatility
                      gridTrading: (Math.random() - 0.3) * 4 + 1.5, // Avg 1.5% with less volatility
                      momentum: (Math.random() - 0.4) * 12 + 2.6 // Avg 2.6% with high volatility
                    }));
                  })()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
                    <Tooltip 
                      formatter={(value: any, name) => [
                        `${Number(value).toFixed(1)}%`,
                        name === 'movingAverage' ? 'Moving Average' : 
                        name === 'gridTrading' ? 'Grid Trading' : 'Momentum'
                      ]}
                    />
                    <Bar dataKey="movingAverage" fill="#e10600" name="movingAverage" />
                    <Bar dataKey="gridTrading" fill="#1B7A46" name="gridTrading" />
                    <Bar dataKey="momentum" fill="#2563eb" name="momentum" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Backtest Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Backtest Details</DialogTitle>
            <DialogDescription>
              Comprehensive analysis and results for the selected backtest
            </DialogDescription>
          </DialogHeader>
          
          {selectedBacktestId && (() => {
            const backtest = backtests.find(b => b.id === selectedBacktestId);
            if (!backtest || !backtest.results) return null;
            
            return (
              <div className="space-y-4 sm:space-y-6">
                {/* Strategy Information */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">{backtest.strategyName}</h3>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <div className="text-gray-500">Period</div>
                      <div className="font-medium">{backtest.dateRange}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Initial Capital</div>
                      <div className="font-medium">CHF 100,000</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Trading Pair</div>
                      <div className="font-medium">BTC-USDT</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Exchange</div>
                      <div className="font-medium">Binance</div>
                    </div>
                  </div>
                </div>

                {/* Key Performance Metrics */}
                <div>
                  <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Key Metrics</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                    <Card>
                      <CardContent className="p-2 sm:p-3">
                        <div className="text-[10px] sm:text-xs text-gray-500">Total Return</div>
                        <div className={`text-sm sm:text-lg font-bold ${backtest.results.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {backtest.results.totalReturn >= 0 ? '+' : ''}{backtest.results.totalReturn.toFixed(2)}%
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-2 sm:p-3">
                        <div className="text-[10px] sm:text-xs text-gray-500">Sharpe Ratio</div>
                        <div className="text-sm sm:text-lg font-bold">{backtest.results.sharpeRatio.toFixed(2)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-2 sm:p-3">
                        <div className="text-[10px] sm:text-xs text-gray-500">Max Drawdown</div>
                        <div className="text-sm sm:text-lg font-bold text-red-600">{backtest.results.maxDrawdown.toFixed(2)}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-2 sm:p-3">
                        <div className="text-[10px] sm:text-xs text-gray-500">Win Rate</div>
                        <div className="text-sm sm:text-lg font-bold">{backtest.results.winRate.toFixed(1)}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-2 sm:p-3">
                        <div className="text-[10px] sm:text-xs text-gray-500">Total Trades</div>
                        <div className="text-sm sm:text-lg font-bold">{backtest.results.totalTrades}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-2 sm:p-3">
                        <div className="text-[10px] sm:text-xs text-gray-500">Profit Factor</div>
                        <div className="text-sm sm:text-lg font-bold">1.84</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-2 sm:p-3">
                        <div className="text-[10px] sm:text-xs text-gray-500">Avg Win/Loss</div>
                        <div className="text-sm sm:text-lg font-bold">1.52</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-2 sm:p-3">
                        <div className="text-[10px] sm:text-xs text-gray-500">Final Capital</div>
                        <div className="text-sm sm:text-lg font-bold">${backtest.results.finalCapital.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Trade Statistics */}
                <div>
                  <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Trade Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <Card>
                      <CardContent className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-500">Winning Trades</span>
                          <span className="font-medium">166</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-500">Losing Trades</span>
                          <span className="font-medium">81</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-500">Average Win</span>
                          <span className="font-medium text-green-600">+CHF 487.23</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-500">Average Loss</span>
                          <span className="font-medium text-red-600">-CHF 321.15</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-500">Largest Win</span>
                          <span className="font-medium text-green-600">+CHF 2,347.89</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-500">Largest Loss</span>
                          <span className="font-medium text-red-600">-CHF 1,123.45</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-500">Avg Trade Duration</span>
                          <span className="font-medium">2.3 days</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-500">Best Month</span>
                          <span className="font-medium text-green-600">+8.7% (April)</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-500">Worst Month</span>
                          <span className="font-medium text-red-600">-3.2% (September)</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-500">Consecutive Wins</span>
                          <span className="font-medium">12 (max)</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-500">Consecutive Losses</span>
                          <span className="font-medium">5 (max)</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-500">Recovery Factor</span>
                          <span className="font-medium">2.98</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Risk Analysis */}
                <div>
                  <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Risk Analysis</h3>
                  <Card>
                    <CardContent className="p-3 sm:p-4">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div>
                          <div className="text-gray-500">Value at Risk (95%)</div>
                          <div className="font-medium">-CHF 2,456</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Expected Shortfall</div>
                          <div className="font-medium">-CHF 3,123</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Calmar Ratio</div>
                          <div className="font-medium">2.97</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Sortino Ratio</div>
                          <div className="font-medium">1.89</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Volatility (Annual)</div>
                          <div className="font-medium">17.4%</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Downside Deviation</div>
                          <div className="font-medium">13.1%</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Max Drawdown Duration</div>
                          <div className="font-medium">23 days</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Recovery Time</div>
                          <div className="font-medium">8 days</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3 sm:pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Close
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button className="w-full sm:w-auto">
                    Deploy Strategy
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}