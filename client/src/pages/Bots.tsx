import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Play, 
  Pause, 
  Eye, 
  Plus, 
  Search,
  Filter,
  Download,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Bot {
  id: string;
  name: string;
  exchange: string;
  tradingPair: string;
  strategy: string;
  status: 'starting' | 'running' | 'stopped' | 'error';
  performance: {
    pnl: number;
    pnlPercent: number;
    trades: number;
    winRate: number;
  };
  lastHeartbeat: string | null;
  riskPolicy: {
    maxPositionSize: number;
    stopLoss: number;
  };
  createdAt: string;
}

export default function Bots() {
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterExchange, setFilterExchange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch bots with sample data
  const { data: bots, isLoading: botsLoading } = useQuery<Bot[]>({
    queryKey: ['/api/bots'],
    queryFn: async () => {
      // Return sample bot data for now
      return [
        {
          id: '1',
          name: 'Alpha Arbitrage Bot',
          exchange: 'binance',
          tradingPair: 'BTC-USDT',
          strategy: 'arbitrage',
          status: 'running',
          performance: {
            pnl: 1247.32,
            pnlPercent: 12.47,
            trades: 247,
            winRate: 68.4
          },
          lastHeartbeat: new Date().toISOString(),
          riskPolicy: {
            maxPositionSize: 10,
            stopLoss: 5
          },
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '2',
          name: 'Beta Grid Trading',
          exchange: 'coinbase',
          tradingPair: 'ETH-USDT',
          strategy: 'grid_trading',
          status: 'stopped',
          performance: {
            pnl: -89.45,
            pnlPercent: -2.1,
            trades: 156,
            winRate: 45.2
          },
          lastHeartbeat: new Date(Date.now() - 300000).toISOString(),
          riskPolicy: {
            maxPositionSize: 15,
            stopLoss: 3
          },
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ] as Bot[];
    },
    refetchInterval: 5000,
  });

  const getStatusColor = (status: Bot['status']) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'starting': return 'bg-yellow-500 animate-pulse';
      case 'stopped': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: Bot['status']) => {
    switch (status) {
      case 'running': return <Badge className="bg-green-100 text-green-800">Running</Badge>;
      case 'starting': return <Badge className="bg-yellow-100 text-yellow-800">Starting</Badge>;
      case 'stopped': return <Badge variant="secondary">Stopped</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filteredBots = bots?.filter(bot => {
    const matchesStatus = filterStatus === 'all' || bot.status === filterStatus;
    const matchesExchange = filterExchange === 'all' || bot.exchange === filterExchange;
    const matchesSearch = searchQuery === '' || 
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.tradingPair.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesExchange && matchesSearch;
  }) || [];

  const CreateBotForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      exchange: '',
      tradingPair: '',
      strategy: '',
      maxPositionSize: 10,
      stopLoss: 5,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      toast({ title: "Bot creation is not yet implemented", variant: "destructive" });
      setIsCreateModalOpen(false);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Bot Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Alpha Arbitrage"
              required
            />
          </div>
          <div>
            <Label htmlFor="exchange">Exchange</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, exchange: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select exchange" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="binance">Binance</SelectItem>
                <SelectItem value="coinbase">Coinbase Pro</SelectItem>
                <SelectItem value="kraken">Kraken</SelectItem>
                <SelectItem value="ftx">FTX</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tradingPair">Trading Pair</Label>
            <Input
              id="tradingPair"
              value={formData.tradingPair}
              onChange={(e) => setFormData(prev => ({ ...prev, tradingPair: e.target.value }))}
              placeholder="e.g., BTC-USDT"
              required
            />
          </div>
          <div>
            <Label htmlFor="strategy">Strategy</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, strategy: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arbitrage">Arbitrage</SelectItem>
                <SelectItem value="grid_trading">Grid Trading</SelectItem>
                <SelectItem value="moving_average">Moving Average Crossover</SelectItem>
                <SelectItem value="mean_reversion">Mean Reversion</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="maxPosition">Max Position Size (%)</Label>
            <Input
              id="maxPosition"
              type="number"
              value={formData.maxPositionSize}
              onChange={(e) => setFormData(prev => ({ ...prev, maxPositionSize: Number(e.target.value) }))}
              min="1"
              max="100"
            />
          </div>
          <div>
            <Label htmlFor="stopLoss">Stop Loss (%)</Label>
            <Input
              id="stopLoss"
              type="number"
              value={formData.stopLoss}
              onChange={(e) => setFormData(prev => ({ ...prev, stopLoss: Number(e.target.value) }))}
              min="0.1"
              max="50"
              step="0.1"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCreateModalOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit">
            Create Bot
          </Button>
        </div>
      </form>
    );
  };

  const BotDetailsModal = ({ bot }: { bot: Bot }) => (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <span>{bot.name}</span>
          {getStatusBadge(bot.status)}
        </DialogTitle>
      </DialogHeader>
      
      <Tabs defaultValue="runtime" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="runtime">Runtime</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="runtime" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Status & Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    {getStatusBadge(bot.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Heartbeat:</span>
                    <span className="text-sm text-gray-500">
                      {bot.lastHeartbeat ? new Date(bot.lastHeartbeat).toLocaleTimeString() : 'Never'}
                    </span>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => toast({ title: "Start bot functionality not yet implemented" })}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast({ title: "Stop bot functionality not yet implemented" })}
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Stop
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Current Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">
                  No open positions
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Live Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-48 overflow-y-auto">
                <div>[{new Date().toISOString()}] Bot initialized</div>
                <div>[{new Date().toISOString()}] Connecting to {bot.exchange}...</div>
                <div>[{new Date().toISOString()}] Strategy: {bot.strategy} loaded</div>
                <div>[{new Date().toISOString()}] Monitoring {bot.tradingPair}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="config" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Basic Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Exchange:</span>
                  <span className="font-medium">{bot.exchange}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trading Pair:</span>
                  <span className="font-medium">{bot.tradingPair}</span>
                </div>
                <div className="flex justify-between">
                  <span>Strategy:</span>
                  <span className="font-medium">{bot.strategy}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Risk Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Max Position Size:</span>
                  <span className="font-medium">{bot.riskPolicy.maxPositionSize}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Stop Loss:</span>
                  <span className="font-medium">{bot.riskPolicy.stopLoss}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">P&L Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Total P&L:</span>
                  <span className={`font-medium ${bot.performance.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${bot.performance.pnl.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>P&L %:</span>
                  <span className={`font-medium ${bot.performance.pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {bot.performance.pnlPercent.toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Trading Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Trades:</span>
                  <span className="font-medium">{bot.performance.trades}</span>
                </div>
                <div className="flex justify-between">
                  <span>Win Rate:</span>
                  <span className="font-medium">{bot.performance.winRate.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                Performance Chart
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Export CSV
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-50 rounded flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                  <p>Performance chart will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Compliance Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 text-center py-4">
                No compliance alerts for this bot
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-xs text-gray-500 border-l-2 border-blue-200 pl-2">
                  [{new Date(bot.createdAt).toLocaleString()}] Bot created
                </div>
                <div className="text-xs text-gray-500 border-l-2 border-green-200 pl-2">
                  [{new Date().toLocaleString()}] Configuration updated
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Bot Management</h1>
          <p className="text-gray-600">Monitor and control your trading bots</p>
        </div>
        <div className="flex-shrink-0">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create Bot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Trading Bot</DialogTitle>
              </DialogHeader>
              <CreateBotForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="stopped">Stopped</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterExchange} onValueChange={setFilterExchange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by exchange" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exchanges</SelectItem>
                <SelectItem value="binance">Binance</SelectItem>
                <SelectItem value="coinbase">Coinbase</SelectItem>
                <SelectItem value="kraken">Kraken</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Saved Views
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bots Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bot Name</TableHead>
                <TableHead>Exchange</TableHead>
                <TableHead>Pair</TableHead>
                <TableHead>Strategy</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>P&L</TableHead>
                <TableHead>Last Heartbeat</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {botsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredBots.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No bots found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredBots.map((bot) => (
                  <TableRow key={bot.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(bot.status)}`} />
                        <span>{bot.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{bot.exchange}</TableCell>
                    <TableCell>{bot.tradingPair}</TableCell>
                    <TableCell>{bot.strategy}</TableCell>
                    <TableCell>{getStatusBadge(bot.status)}</TableCell>
                    <TableCell>
                      <span className={bot.performance.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ${bot.performance.pnl.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {bot.lastHeartbeat ? new Date(bot.lastHeartbeat).toLocaleTimeString() : 'Never'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toast({ title: "Start functionality not yet implemented" })}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toast({ title: "Stop functionality not yet implemented" })}
                        >
                          <Pause className="h-3 w-3" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <BotDetailsModal bot={bot} />
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}