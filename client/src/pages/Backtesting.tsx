import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
        <div className="grid grid-cols-2 gap-4">
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDateFrom ? selectedDateFrom.toLocaleDateString() : "Pick start date"}
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
                  {selectedDateTo ? selectedDateTo.toLocaleDateString() : "Pick end date"}
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Strategy Backtesting</h1>
          <p className="text-gray-600">Test your trading strategies against historical data</p>
        </div>
        <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Backtest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
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
          <Card>
            <CardContent className="p-0">
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
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          {backtest.status === 'completed' && (
                            <Button size="sm" variant="outline">
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
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Total Return</div>
                    <div className={`text-lg font-bold ${backtest.results!.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {backtest.results!.totalReturn >= 0 ? '+' : ''}{backtest.results!.totalReturn.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Sharpe Ratio</div>
                    <div className="text-lg font-bold">{backtest.results!.sharpeRatio.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Max Drawdown</div>
                    <div className="text-lg font-bold text-red-600">{backtest.results!.maxDrawdown.toFixed(1)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Win Rate</div>
                    <div className="text-lg font-bold">{backtest.results!.winRate.toFixed(1)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Total Trades</div>
                    <div className="text-lg font-bold">{backtest.results!.totalTrades}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Final Capital</div>
                    <div className="text-lg font-bold">${backtest.results!.finalCapital.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                    <p>Equity curve and performance charts</p>
                    <p className="text-sm">Real-time backtest visualization will appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-50 rounded flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg mb-2">Strategy Performance Comparison</p>
                  <p className="text-sm">Side-by-side comparison of backtest results</p>
                  <p className="text-sm">Select multiple completed backtests to compare</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}