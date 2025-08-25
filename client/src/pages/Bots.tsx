import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SkipLink } from '@/components/ui/skip-link';
import { EmptyState } from '@/components/ui/empty-state';
import { EnhancedTable, type ColumnDef } from '@/components/ui/enhanced-table';
import { MobileBotsTable } from '@/components/UI/MobileBotsTable';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import CreateBotModal from '@/components/Modals/CreateBotModal';
import { useIsMobile } from '@/hooks/use-mobile';
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
  Filter
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
  exchange: string;
  pair: string;
  pnl24h: number;
  totalPnl: number;
  uptime: string;
  lastTrade: string;
}

const mockBots: BotData[] = [
  {
    id: '1',
    name: 'Alpha Grid Bot',
    strategy: 'Grid Trading',
    status: 'running',
    exchange: 'Binance',
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
    exchange: 'Coinbase Pro',
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
    exchange: 'Kraken',
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
    exchange: 'Binance',
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
    exchange: 'Bybit',
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
    exchange: 'OKX',
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
    exchange: 'KuCoin',
    pair: 'LINK/USDT',
    pnl24h: 76.89,
    totalPnl: 432.10,
    uptime: '4d 2h',
    lastTrade: '1 minute ago'
  },
  {
    id: '8',
    name: 'Iota Cross Bot',
    strategy: 'Cross Exchange',
    status: 'stopped',
    exchange: 'Gate.io',
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
    exchange: 'Bitfinex',
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
    exchange: 'Gemini',
    pair: 'BTC/USD',
    pnl24h: 0,
    totalPnl: -89.12,
    uptime: '0m',
    lastTrade: '4 hours ago'
  }
];

export default function Bots() {
  const isMobile = useIsMobile();
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
      exchange: botData.exchange === 'binance' ? 'Binance' :
                botData.exchange === 'coinbase' ? 'Coinbase Pro' :
                botData.exchange === 'kraken' ? 'Kraken' :
                botData.exchange === 'bybit' ? 'Bybit' :
                botData.exchange === 'okx' ? 'OKX' : botData.exchange,
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
          bot.exchange.toLowerCase().includes(searchLower) ||
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
            bot.exchange.toLowerCase().includes(filterValue)
          );
        });
      });
    }

    return result;
  }, [searchTerm, filters]);

  // Paginate data
  const paginatedBots = useMemo(() => {
    const start = currentPage * pageSize;
    return filteredBots.slice(start, start + pageSize);
  }, [filteredBots, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredBots.length / pageSize);

  const getStatusBadge = (status: BotData['status']) => {
    const variants = {
      running: 'bg-green-100 text-green-800',
      stopped: 'bg-gray-100 text-gray-800', 
      error: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
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
        <div className="flex items-center space-x-2 min-w-0">
          <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{bot.name}</div>
            <div className="text-xs sm:text-sm text-gray-500 truncate">{bot.strategy}</div>
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
      id: 'exchange',
      header: 'Exchange',
      accessorKey: 'exchange',
      sortable: true,
      filterable: true,
      priority: 'medium',
      cell: (bot) => (
        <div className="min-w-0">
          <div className="font-medium text-sm truncate">{bot.exchange}</div>
          <div className="text-xs text-gray-500 truncate">{bot.pair}</div>
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
          <span className="text-sm">${bot.pnl24h.toFixed(2)}</span>
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
          ${bot.totalPnl.toFixed(2)}
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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 pb-4">
      <SkipLink href="#bots-table">Skip to bots table</SkipLink>
      
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Trading Bots</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage and monitor your automated trading strategies</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="flex border rounded-lg p-1 w-full sm:w-auto">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              data-testid="view-cards"
              className="flex-1 sm:flex-initial px-3 h-10 text-sm"
            >
              <Grid3X3 className="h-4 w-4 mr-2 sm:mr-0" />
              <span className="sm:hidden">Cards</span>
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              data-testid="view-table"
              className="flex-1 sm:flex-initial px-3 h-10 text-sm"
            >
              <List className="h-4 w-4 mr-2 sm:mr-0" />
              <span className="sm:hidden">Table</span>
            </Button>
          </div>
          <Button 
            onClick={() => setIsCreateBotModalOpen(true)}
            data-testid="create-bot"
            className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Bot
          </Button>
        </div>
      </div>

      <div id="bots-table">
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
        ) : viewMode === 'cards' ? (
          <BotCardsView 
            bots={filteredBots}
            onStartBot={handleStartBot}
            onStopBot={handleStopBot}
            onDeleteBot={handleDeleteBot}
            getStatusBadge={getStatusBadge}
          />
        ) : isMobile ? (
          <div className="space-y-4">
            {/* Mobile Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bots by name, strategy, or exchange..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
                  data-testid="mobile-search"
                />
              </div>
              
              {/* Mobile Filters */}
              {tableFilters.length > 0 && (
                <div className="flex items-start space-x-2">
                  <Filter className="h-4 w-4 text-gray-400 mt-2 flex-shrink-0" />
                  <div className="flex flex-wrap gap-2 flex-1">
                    {tableFilters.slice(0, 6).map(filter => (
                      <Badge
                        key={filter.id}
                        variant={filters.includes(filter.id) ? "default" : "outline"}
                        className="cursor-pointer min-h-[32px] px-3"
                        onClick={() => {
                          const newFilters = filters.includes(filter.id)
                            ? filters.filter(id => id !== filter.id)
                            : [...filters, filter.id];
                          setFilters(newFilters);
                        }}
                        data-testid={`mobile-filter-${filter.id}`}
                      >
                        {filter.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Bulk Actions for Mobile */}
              {selectedBotIds.size > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-700">
                      {selectedBotIds.size} bot{selectedBotIds.size > 1 ? 's' : ''} selected
                    </span>
                    {bulkActions}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Table View */}
            <MobileBotsTable
              bots={paginatedBots}
              selectedBots={selectedBotIds}
              onSelectBot={handleSelectBot}
              onSelectAll={handleSelectAll}
              onStartBot={handleStartBot}
              onStopBot={handleStopBot}
              onDeleteBot={handleDeleteBot}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
            />
          </div>
        ) : (
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
          />
        )}
      </div>

      {/* Create Bot Modal */}
      <CreateBotModal
        isOpen={isCreateBotModalOpen}
        onClose={() => setIsCreateBotModalOpen(false)}
        onSubmit={handleCreateBot}
      />
    </div>
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
                  <span className="text-gray-500">Exchange</span>
                  <p className="font-semibold">{bot.exchange}</p>
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
                    {bot.pnl24h > 0 ? '+' : ''}${bot.pnl24h.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Total P&L</span>
                  <p className={`font-semibold ${
                    bot.totalPnl > 0 ? 'text-green-600' : bot.totalPnl < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {bot.totalPnl > 0 ? '+' : ''}${bot.totalPnl.toFixed(2)}
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