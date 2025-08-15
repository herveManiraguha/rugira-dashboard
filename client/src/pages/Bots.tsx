import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SkipLink } from '@/components/ui/skip-link';
import { EmptyState } from '@/components/ui/empty-state';
import { EnhancedTable, type ColumnDef } from '@/components/ui/enhanced-table';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { 
  Bot, 
  Play, 
  Square, 
  Settings, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  MoreHorizontal,
  Plus
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
    exchange: 'Coinbase',
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
  }
];

export default function Bots() {
  const [selectedBots, setSelectedBots] = useState<BotData[]>([]);
  const [filters, setFilters] = useState<string[]>([]);

  const handleStartBot = (botId: string) => {
    console.log('Starting bot:', botId);
  };

  const handleStopBot = (botId: string) => {
    console.log('Stopping bot:', botId);
  };

  const handleDeleteBot = (botId: string) => {
    console.log('Deleting bot:', botId);
  };

  const handleBulkStart = () => {
    console.log('Starting bots:', selectedBots.map(b => b.id));
  };

  const handleBulkStop = () => {
    console.log('Stopping bots:', selectedBots.map(b => b.id));
  };

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
      cell: (bot) => (
        <div className="flex items-center space-x-3">
          <Bot className="h-5 w-5 text-gray-400" />
          <div>
            <div className="font-medium text-gray-900">{bot.name}</div>
            <div className="text-sm text-gray-500">{bot.strategy}</div>
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
      cell: (bot) => getStatusBadge(bot.status)
    },
    {
      id: 'exchange',
      header: 'Exchange',
      accessorKey: 'exchange',
      sortable: true,
      filterable: true,
      cell: (bot) => (
        <div>
          <div className="font-medium">{bot.exchange}</div>
          <div className="text-sm text-gray-500">{bot.pair}</div>
        </div>
      )
    },
    {
      id: 'pnl24h',
      header: '24h P&L',
      accessorKey: 'pnl24h',
      sortable: true,
      cell: (bot) => (
        <div className={`flex items-center space-x-1 ${
          bot.pnl24h > 0 ? 'text-green-600' : bot.pnl24h < 0 ? 'text-red-600' : 'text-gray-600'
        }`}>
          {bot.pnl24h > 0 ? <TrendingUp className="h-4 w-4" /> : 
           bot.pnl24h < 0 ? <TrendingDown className="h-4 w-4" /> : null}
          <span>${bot.pnl24h.toFixed(2)}</span>
        </div>
      )
    },
    {
      id: 'totalPnl',
      header: 'Total P&L',
      accessorKey: 'totalPnl',
      sortable: true,
      cell: (bot) => (
        <span className={`font-medium ${
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
      sortable: true
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (bot) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" data-testid={`bot-actions-${bot.id}`}>
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

  const tableFilters = [
    { id: 'running', label: 'Running', value: 'running' },
    { id: 'stopped', label: 'Stopped', value: 'stopped' },
    { id: 'error', label: 'Error', value: 'error' },
    { id: 'binance', label: 'Binance', value: 'binance' },
    { id: 'coinbase', label: 'Coinbase', value: 'coinbase' }
  ];

  const bulkActions = (
    <div className="flex space-x-2">
      <Button size="sm" onClick={handleBulkStart} data-testid="bulk-start">
        <Play className="h-4 w-4 mr-1" />
        Start
      </Button>
      <ConfirmationDialog
        trigger={
          <Button size="sm" variant="outline" data-testid="bulk-stop">
            <Square className="h-4 w-4 mr-1" />
            Stop
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
    <div className="space-y-6 p-6">
      <SkipLink href="#bots-table">Skip to bots table</SkipLink>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trading Bots</h1>
          <p className="text-gray-600">Manage and monitor your automated trading strategies</p>
        </div>
        <Button data-testid="create-bot">
          <Plus className="h-4 w-4 mr-2" />
          Create Bot
        </Button>
      </div>

      <div id="bots-table">
        {mockBots.length === 0 ? (
          <EmptyState
            icon={<Bot className="h-12 w-12" />}
            title="No trading bots found"
            description="Get started by creating your first automated trading bot to begin generating profits."
            action={{
              label: "Create Your First Bot",
              onClick: () => console.log('Create bot')
            }}
          />
        ) : (
          <EnhancedTable
            data={mockBots}
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
    </div>
  );
}