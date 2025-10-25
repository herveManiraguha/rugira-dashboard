import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SkipLink } from '@/components/ui/skip-link';
import { EmptyState } from '@/components/ui/empty-state';
import { StandardPageLayout } from '@/components/ui/standard-page-layout';
import { EnhancedTable, type ColumnDef } from '@/components/ui/enhanced-table';
import { MobileBotsTable } from '@/components/UI/MobileBotsTable';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import CreateBotModal from '@/components/Modals/CreateBotModal';
import { useIsMobile } from '@/hooks/use-mobile';
import { botAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  Play, 
  Square, 
  Settings, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  MoreHorizontal,
  Plus,
  Grid3X3,
  List,
  Activity,
  Clock,
  DollarSign,
  Zap,
  Shield,
  Search,
  Filter,
  Send
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BotData {
  id: string;
  name: string;
  strategy: string;
  status: 'running' | 'stopped' | 'error';
  venue: string;  // Changed from exchange to venue
  routeVia?: string;  // New field for routing
  pair: string;
  pnl24h: number;
  totalPnl: number;
  uptime: string;
  lastTrade: string;
  riskLevel?: 'Low' | 'Medium' | 'High';
  makerChecker?: boolean;
}

const mockBots: BotData[] = [
  {
    id: 'dlt-bx-01',
    name: 'DLT-BX-01',
    strategy: 'Conservative TWAP',
    status: 'running',
    venue: 'BX Digital',
    routeVia: 'InCore',
    pair: 'TEST-001/CHF',
    pnl24h: 0,
    totalPnl: 0,
    uptime: '0h 5m',
    lastTrade: 'Never',
    riskLevel: 'Low',
    makerChecker: true
  },
  {
    id: '1',
    name: 'Alpha Grid Bot',
    strategy: 'Grid Trading',
    status: 'running',
    venue: 'Binance',
    routeVia: 'Direct',
    pair: 'BTC/USDT',
    pnl24h: 247.83,
    totalPnl: 1247.83,
    uptime: '5d 12h',
    lastTrade: '2 minutes ago'
  },
  {
    id: '2', 
    name: 'Beta Arbitrage',
    strategy: 'Arbitrage',
    status: 'running',
    venue: 'Coinbase Pro',
    routeVia: 'Direct',
    pair: 'ETH/USD',
    pnl24h: -45.20,
    totalPnl: 892.41,
    uptime: '3d 8h',
    lastTrade: '15 minutes ago'
  },
  {
    id: '3',
    name: 'Gamma Momentum',
    strategy: 'Momentum',
    status: 'error',
    venue: 'Kraken',
    routeVia: 'Direct',
    pair: 'SOL/EUR',
    pnl24h: 0,
    totalPnl: -125.67,
    uptime: '0m',
    lastTrade: '2 hours ago'
  },
  {
    id: '4',
    name: 'Delta Mean Reversion',
    strategy: 'Mean Reversion',
    status: 'stopped',
    venue: 'Binance',
    routeVia: 'Direct',
    pair: 'ADA/USDT',
    pnl24h: 0,
    totalPnl: 456.78,
    uptime: '0m',
    lastTrade: '1 day ago'
  },
  {
    id: '5',
    name: 'Epsilon DCA Bot',
    strategy: 'DCA',
    status: 'running',
    venue: 'Bybit',
    routeVia: 'Direct',
    pair: 'MATIC/USDT',
    pnl24h: 125.40,
    totalPnl: 890.32,
    uptime: '2d 6h',
    lastTrade: '8 minutes ago'
  },
  {
    id: '6',
    name: 'Zeta Futures Bot',
    strategy: 'Futures Hedging',
    status: 'running',
    venue: 'OKX',
    routeVia: 'Direct',
    pair: 'DOGE/USDT',
    pnl24h: 98.76,
    totalPnl: 654.21,
    uptime: '1d 14h',
    lastTrade: '5 minutes ago'
  },
  {
    id: '7',
    name: 'Theta Scalping',
    strategy: 'Scalping',
    status: 'running',
    venue: 'KuCoin',
    routeVia: 'Direct',
    pair: 'LINK/USDT',
    pnl24h: 76.89,
    totalPnl: 432.10,
    uptime: '4d 2h',
    lastTrade: '1 minute ago'
  },
  {
    id: '8',
    name: 'Iota Cross Bot',
    strategy: 'Cross Venue',
    status: 'stopped',
    venue: 'Gate.io',
    routeVia: 'Direct',
    pair: 'UNI/USDT',
    pnl24h: 0,
    totalPnl: 234.56,
    uptime: '0m',
    lastTrade: '3 hours ago'
  },
  {
    id: '9',
    name: 'Kappa Range Bot',
    strategy: 'Range Trading',
    status: 'running',
    venue: 'Bitfinex',
    routeVia: 'Direct',
    pair: 'LTC/USD',
    pnl24h: 156.78,
    totalPnl: 1089.45,
    uptime: '6d 18h',
    lastTrade: '12 minutes ago'
  },
  {
    id: '10',
    name: 'Lambda Swing Bot',
    strategy: 'Swing Trading',
    status: 'error',
    venue: 'Gemini',
    routeVia: 'Direct',
    pair: 'BTC/USD',
    pnl24h: 0,
    totalPnl: -89.12,
    uptime: '0m',
    lastTrade: '4 hours ago'
  }
];

export default function LegacyBots() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [selectedBots, setSelectedBots] = useState<BotData[]>([]);
  const [selectedBotIds, setSelectedBotIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [isCreateBotModalOpen, setIsCreateBotModalOpen] = useState(false);
  const [bots, setBots] = useState<BotData[]>(mockBots);
  const pageSize = 10;

  const handleStartBot = (botId: string) => {
    console.log('Starting bot:', botId);
  };

  const handleStopBot = (botId: string) => {
    console.log('Stopping bot:', botId);
  };

  const handleDeleteBot = (botId: string) => {
    console.log('Deleting bot:', botId);
    setBots(prevBots => prevBots.filter(bot => bot.id !== botId));
  };

  const handleSendTestOrder = (botId: string) => {
    const bot = bots.find(b => b.id === botId);
    if (bot && bot.venue.includes('BX Digital')) {
      toast({
        title: "Test Order Sent (Paper)",
        description: "Pre-trade check passed → FIX NewOrderSingle → ExecutionReport (partial filled) → Drop-copy confirmed → Success",
        duration: 5000
      });
      console.log('Test order sent for bot:', botId);
    }
  };

  const handleCreateBot = (botData: any) => {
    console.log('Creating bot:', botData);
    const newBot: BotData = {
      id: (bots.length + 1).toString(),
      name: botData.name,
      strategy: botData.strategy === 'arbitrage' ? 'Arbitrage' : 
                botData.strategy === 'ma_crossover' ? 'Moving Average' :
                botData.strategy === 'grid_trading' ? 'Grid Trading' :
                botData.strategy === 'dca' ? 'DCA' :
                botData.strategy === 'momentum' ? 'Momentum' : 'Custom',
      status: 'stopped',
      venue: botData.exchange === 'binance' ? 'Binance' :
                botData.exchange === 'coinbase' ? 'Coinbase Pro' :
                botData.exchange === 'kraken' ? 'Kraken' :
                botData.exchange === 'bybit' ? 'Bybit' :
                botData.exchange === 'okx' ? 'OKX' : botData.exchange,
      routeVia: 'Direct',
      pair: botData.tradingPair || 'BTC/USDT',
      pnl24h: 0,
      totalPnl: 0,
      uptime: '0m',
      lastTrade: 'Never'
    };
    setBots(prevBots => [newBot, ...prevBots]);
    setIsCreateBotModalOpen(false);
  };

  const handleBulkStart = () => {
    console.log('Starting bots:', selectedBots.map(b => b.id));
  };

  const handleBulkStop = () => {
    console.log('Stopping bots:', selectedBots.map(b => b.id));
  };

  const handleSelectBot = (botId: string, selected: boolean) => {
    const newIds = new Set(selectedBotIds);
    if (selected) {
      newIds.add(botId);
    } else {
      newIds.delete(botId);
    }
    setSelectedBotIds(newIds);
    
    const selected_bots = bots.filter(bot => newIds.has(bot.id));
    setSelectedBots(selected_bots);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allIds = new Set(paginatedBots.map(bot => bot.id));
      setSelectedBotIds(allIds);
      setSelectedBots(paginatedBots);
    } else {
      setSelectedBotIds(new Set());
      setSelectedBots([]);
    }
  };

  // Define filters before using them
  const tableFilters = useMemo(() => [
    { id: 'running', label: 'Running', value: 'running' },
    { id: 'stopped', label: 'Stopped', value: 'stopped' },
    { id: 'error', label: 'Error', value: 'error' },
    { id: 'binance', label: 'Binance', value: 'binance' },
    { id: 'coinbase-pro', label: 'Coinbase Pro', value: 'coinbase pro' },
    { id: 'kraken', label: 'Kraken', value: 'kraken' },
    { id: 'bybit', label: 'Bybit', value: 'bybit' },
    { id: 'okx', label: 'OKX', value: 'okx' },
    { id: 'kucoin', label: 'KuCoin', value: 'kucoin' },
    { id: 'gate-io', label: 'Gate.io', value: 'gate.io' },
    { id: 'bitfinex', label: 'Bitfinex', value: 'bitfinex' },
    { id: 'gemini', label: 'Gemini', value: 'gemini' }
  ], []);

  // Filter and search data
  const filteredBots = useMemo(() => {
    let result = bots;

    // Apply search
    if (searchTerm) {
      result = result.filter(bot => {
        const searchLower = searchTerm.toLowerCase();
        return (
          bot.name.toLowerCase().includes(searchLower) ||
          bot.strategy.toLowerCase().includes(searchLower) ||
          bot.venue.toLowerCase().includes(searchLower) ||
          bot.pair.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply filters
    if (filters.length > 0) {
      result = result.filter(bot => {
        return filters.some(filterId => {
          const filter = tableFilters.find(f => f.id === filterId);
          if (!filter) return false;
          
          const filterValue = filter.value.toLowerCase();
          return (
            bot.status.toLowerCase().includes(filterValue) ||
            bot.venue.toLowerCase().includes(filterValue)
          );
        });
      });
    }

    return result;
  }, [searchTerm, filters, tableFilters]);

  // Paginate data
  const paginatedBots = useMemo(() => {
    const start = currentPage * pageSize;
    return filteredBots.slice(start, start + pageSize);
  }, [filteredBots, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredBots.length / pageSize);

  const getStatusBadge = (status: BotData['status']) => {
    const statusConfig = {
      running: {
        className: 'badge-success',
        icon: <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />,
        label: 'Running'
      },
      stopped: {
        className: 'badge-neutral',
        icon: <div className="w-2 h-2 bg-gray-400 rounded-full" />,
        label: 'Stopped'
      },
      error: {
        className: 'badge-error', 
        icon: <AlertTriangle className="w-3 h-3" />,
        label: 'Error'
      }
    };
    
    const config = statusConfig[status];
    
    return (
      <div className={`badge-status ${config.className}`}>
        {config.icon}
        <span>{config.label}</span>
      </div>
    );
  };

  const columns: ColumnDef<BotData>[] = [
    {
      id: 'name',
      header: 'Bot Name',
      accessorKey: 'name',
      sortable: true,
      priority: 'high',
      cell: (bot) => (
        <div className="flex items-center space-x-2 min-w-0 max-w-[200px]">
          <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="font-medium text-gray-900 text-sm truncate">{bot.name}</div>
            <div className="text-xs text-gray-500 truncate">{bot.strategy}</div>
          </div>
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      filterable: true,
      priority: 'high',
      cell: (bot) => getStatusBadge(bot.status)
    },
    {
      id: 'venue',
      header: 'Venue',
      accessorKey: 'venue',
      sortable: true,
      filterable: true,
      priority: 'medium',
      cell: (bot) => (
        <div className="min-w-0 max-w-[120px]">
          <div className="font-medium text-sm truncate">{bot.venue}</div>
          <div className="text-xs text-gray-500 truncate">{bot.pair}</div>
        </div>
      )
    },
    {
      id: 'routeVia',
      header: 'Route via',
      accessorKey: 'routeVia',
      sortable: true,
      priority: 'low',
      cell: (bot) => (
        <div className="text-sm text-gray-600">
          {bot.routeVia || 'Direct'}
        </div>
      )
    },
    {
      id: 'pnl24h',
      header: '24h P&L',
      accessorKey: 'pnl24h',
      sortable: true,
      priority: 'medium',
      cell: (bot) => (
        <div className={`flex items-center space-x-1 ${
          bot.pnl24h > 0 ? 'text-green-600' : bot.pnl24h < 0 ? 'text-red-600' : 'text-gray-600'
        }`}>
          {bot.pnl24h > 0 ? <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" /> : 
           bot.pnl24h < 0 ? <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" /> : null}
          <span className="text-sm">CHF {bot.pnl24h.toFixed(2)}</span>
        </div>
      )
    },
    {
      id: 'totalPnl',
      header: 'Total P&L',
      accessorKey: 'totalPnl',
      sortable: true,
      priority: 'low',
      cell: (bot) => (
        <span className={`font-medium text-sm ${
          bot.totalPnl > 0 ? 'text-green-600' : bot.totalPnl < 0 ? 'text-red-600' : 'text-gray-600'
        }`}>
          CHF {bot.totalPnl.toFixed(2)}
        </span>
      )
    },
    {
      id: 'uptime',
      header: 'Uptime',
      accessorKey: 'uptime',
      sortable: true,
      priority: 'low',
      cell: (bot) => (
        <div className="text-sm text-gray-600">{bot.uptime}</div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      priority: 'high',
      cell: (bot) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" data-testid={`bot-actions-${bot.id}`} className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => handleStartBot(bot.id)}
              disabled={bot.status === 'running'}
            >
              <Play className="h-4 w-4 mr-2" />
              Start
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleStopBot(bot.id)}
              disabled={bot.status === 'stopped'}
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </DropdownMenuItem>
            {bot.venue.includes('BX Digital') && (
              <DropdownMenuItem 
                onClick={() => handleSendTestOrder(bot.id)}
              >
                <Send className="h-4 w-4 mr-2" />
                Send test order (Paper)
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleDeleteBot(bot.id)}
              className="text-red-600"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const bulkActions = (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
      <Button size="sm" onClick={handleBulkStart} data-testid="bulk-start" className="h-9 w-full sm:w-auto">
        <Play className="h-4 w-4 mr-2" />
        Start Selected
      </Button>
      <ConfirmationDialog
        trigger={
          <Button size="sm" variant="outline" data-testid="bulk-stop" className="h-9 w-full sm:w-auto">
            <Square className="h-4 w-4 mr-2" />
            Stop Selected
          </Button>
        }
        title="Stop Selected Bots"
        description="Are you sure you want to stop the selected trading bots? This will halt their operations and close any pending orders."
        confirmText="Stop Bots"
        onConfirm={handleBulkStop}
        variant="destructive"
      />
    </div>
  );

  return (
    <StandardPageLayout
      title="Automations"
      subtitle="Manage and monitor your automated trading strategies"
      viewMode={viewMode === 'table' ? 'list' : 'cards'}
      onViewModeChange={(mode) => setViewMode(mode === 'list' ? 'table' : 'cards')}
      showViewModes={true}
      actionButton={{
        label: "Create Bot",
        onClick: () => setIsCreateBotModalOpen(true)
      }}
    >
      <div className="space-y-6" id="bots-table">
        {bots.length === 0 ? (
          <EmptyState
            icon={<Bot className="h-12 w-12" />}
            title="No trading bots found"
            description="Get started by creating your first automated trading bot to begin generating profits."
            action={{
              label: "Create Your First Bot",
              onClick: () => setIsCreateBotModalOpen(true)
            }}
          />
        ) : (viewMode === 'cards' || isMobile) ? (
          <BotCardsView 
            bots={filteredBots}
            onStartBot={handleStartBot}
            onStopBot={handleStopBot}
            onDeleteBot={handleDeleteBot}
            getStatusBadge={getStatusBadge}
          />
        ) : (
          <div className="w-full">
            <EnhancedTable
              data={bots}
              columns={columns}
              searchPlaceholder="Search bots by name, strategy, or exchange..."
              filters={tableFilters}
              selectedFilters={filters}
              onFilterChange={setFilters}
              onSelectionChange={setSelectedBots}
              bulkActions={bulkActions}
              pageSize={10}
              className="max-w-full"
            />
          </div>
        )}

        {/* Create Bot Modal */}
        <CreateBotModal
          isOpen={isCreateBotModalOpen}
          onClose={() => setIsCreateBotModalOpen(false)}
          onSubmit={handleCreateBot}
        />
      </div>
    </StandardPageLayout>
  );
}

// Bot Cards View Component
function BotCardsView({ bots, onStartBot, onStopBot, onDeleteBot, getStatusBadge }: {
  bots: BotData[];
  onStartBot: (id: string) => void;
  onStopBot: (id: string) => void;
  onDeleteBot: (id: string) => void;
  getStatusBadge: (status: BotData['status']) => React.ReactNode;
}) {
  const formatLastTrade = (lastTrade: string) => {
    return lastTrade;
  };

  const getStrategyIcon = (strategy: string) => {
    switch (strategy.toLowerCase()) {
      case 'grid trading':
        return <Activity className="h-5 w-5 text-blue-500" />;
      case 'arbitrage':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'momentum':
        return <Zap className="h-5 w-5 text-purple-500" />;
      case 'mean reversion':
        return <TrendingDown className="h-5 w-5 text-orange-500" />;
      case 'dca':
        return <DollarSign className="h-5 w-5 text-indigo-500" />;
      case 'futures hedging':
        return <Shield className="h-5 w-5 text-gray-500" />;
      case 'scalping':
        return <Clock className="h-5 w-5 text-red-500" />;
      default:
        return <Bot className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {bots.map((bot) => (
        <Card key={bot.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStrategyIcon(bot.strategy)}
                <div>
                  <CardTitle className="text-lg">{bot.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusBadge(bot.status)}
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatLastTrade(bot.lastTrade)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {bot.status === 'running' ? (
                  <ConfirmationDialog
                    trigger={
                      <Button variant="ghost" size="sm" data-testid={`stop-${bot.id}`}>
                        <Square className="h-4 w-4" />
                      </Button>
                    }
                    title="Stop Trading Bot"
                    description={`Are you sure you want to stop ${bot.name}? This will halt its operations and close any pending orders.`}
                    confirmText="Stop Bot"
                    onConfirm={() => onStopBot(bot.id)}
                    variant="destructive"
                  />
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onStartBot(bot.id)}
                    disabled={bot.status === 'error'}
                    data-testid={`start-${bot.id}`}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" data-testid={`actions-${bot.id}`}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Activity className="h-4 w-4 mr-2" />
                      View Performance
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <ConfirmationDialog
                      trigger={
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      }
                      title="Delete Trading Bot"
                      description={`Are you sure you want to delete ${bot.name}? This action cannot be undone.`}
                      confirmText="Delete Bot"
                      onConfirm={() => onDeleteBot(bot.id)}
                      variant="destructive"
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Strategy and Exchange Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Trading Info</span>
                <Activity className="h-4 w-4 text-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Strategy</span>
                  <p className="font-semibold">{bot.strategy}</p>
                </div>
                <div>
                  <span className="text-gray-500">Venue</span>
                  <p className="font-semibold">{bot.venue}</p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t">
                <span className="text-gray-500">Trading Pair</span>
                <p className="font-semibold">{bot.pair}</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Performance</span>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">24h P&L</span>
                  <p className={`font-semibold ${
                    bot.pnl24h > 0 ? 'text-green-600' : bot.pnl24h < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {bot.pnl24h > 0 ? '+' : ''}CHF {bot.pnl24h.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Total P&L</span>
                  <p className={`font-semibold ${
                    bot.totalPnl > 0 ? 'text-green-600' : bot.totalPnl < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {bot.totalPnl > 0 ? '+' : ''}CHF {bot.totalPnl.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Uptime and Activity */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Uptime</span>
                <p className="font-semibold">{bot.uptime}</p>
              </div>
              <div>
                <span className="text-gray-500">Last Trade</span>
                <p className="font-semibold">{bot.lastTrade}</p>
              </div>
            </div>

            {/* Performance Indicator */}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Performance</span>
                <div className="flex items-center space-x-1">
                  {bot.pnl24h > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : bot.pnl24h < 0 ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <Activity className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={`font-medium ${
                    bot.pnl24h > 0 ? 'text-green-600' : bot.pnl24h < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {bot.pnl24h > 0 ? 'Profitable' : bot.pnl24h < 0 ? 'Loss' : 'Neutral'}
                  </span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {bot.status === 'error' && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Bot encountered an error. Check configuration.</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
