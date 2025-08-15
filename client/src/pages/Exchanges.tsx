import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { ExchangeIcon } from '@/components/ui/exchange-icon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Settings, 
  Plus,
  RefreshCw,
  Unlink,
  AlertTriangle,
  Clock,
  Shield,
  TrendingUp,
  DollarSign,
  Grid3X3,
  List,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExchangeData {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'connecting';
  lastSync: string;
  tradingFees: {
    maker: number;
    taker: number;
  };
  apiLimits: {
    used: number;
    total: number;
  };
  balance: {
    total: number;
    available: number;
    currency: string;
  };
  supportedPairs: number;
  activeBots: number;
  logo: string;
  features: string[];
}

const mockExchanges: ExchangeData[] = [
  {
    id: '1',
    name: 'Binance',
    status: 'connected',
    lastSync: '2024-01-15T10:30:00Z',
    tradingFees: { maker: 0.1, taker: 0.1 },
    apiLimits: { used: 450, total: 1200 },
    balance: { total: 12450.32, available: 8921.45, currency: 'USDT' },
    supportedPairs: 1800,
    activeBots: 4,
    logo: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.svg',
    features: ['Spot Trading', 'Futures', 'Margin', 'Options', 'P2P', 'Staking']
  },
  {
    id: '2',
    name: 'Coinbase Pro',
    status: 'connected',
    lastSync: '2024-01-15T10:29:00Z',
    tradingFees: { maker: 0.5, taker: 0.5 },
    apiLimits: { used: 120, total: 1000 },
    balance: { total: 5620.78, available: 4150.23, currency: 'USD' },
    supportedPairs: 180,
    activeBots: 2,
    logo: 'https://cryptologos.cc/logos/coinbase-coin-logo.svg',
    features: ['Spot Trading', 'Institutional', 'Advanced Trading', 'API Access']
  },
  {
    id: '3',
    name: 'Kraken',
    status: 'error',
    lastSync: '2024-01-15T09:45:00Z',
    tradingFees: { maker: 0.16, taker: 0.26 },
    apiLimits: { used: 0, total: 720 },
    balance: { total: 0, available: 0, currency: 'EUR' },
    supportedPairs: 220,
    activeBots: 0,
    logo: 'https://cryptologos.cc/logos/kraken-kraken-logo.svg',
    features: ['Spot Trading', 'Futures', 'Margin', 'Staking', 'DeFi']
  },
  {
    id: '4',
    name: 'Bybit',
    status: 'connected',
    lastSync: '2024-01-15T10:25:00Z',
    tradingFees: { maker: 0.1, taker: 0.1 },
    apiLimits: { used: 280, total: 600 },
    balance: { total: 3420.15, available: 2890.67, currency: 'USDT' },
    supportedPairs: 400,
    activeBots: 3,
    logo: 'https://cryptologos.cc/logos/bybit-token-bit-logo.svg',
    features: ['Spot Trading', 'Futures', 'Options', 'Copy Trading', 'NFT']
  },
  {
    id: '5',
    name: 'OKX',
    status: 'connected',
    lastSync: '2024-01-15T10:28:00Z',
    tradingFees: { maker: 0.08, taker: 0.1 },
    apiLimits: { used: 340, total: 1000 },
    balance: { total: 7850.92, available: 6120.45, currency: 'USDT' },
    supportedPairs: 500,
    activeBots: 5,
    logo: 'https://cryptologos.cc/logos/okex-okb-logo.svg',
    features: ['Spot Trading', 'Futures', 'Options', 'DeFi', 'Web3 Wallet']
  },
  {
    id: '6',
    name: 'KuCoin',
    status: 'connected',
    lastSync: '2024-01-15T10:27:00Z',
    tradingFees: { maker: 0.1, taker: 0.1 },
    apiLimits: { used: 190, total: 800 },
    balance: { total: 2940.78, available: 2340.12, currency: 'USDT' },
    supportedPairs: 750,
    activeBots: 2,
    logo: 'https://cryptologos.cc/logos/kucoin-token-kcs-logo.svg',
    features: ['Spot Trading', 'Futures', 'Margin', 'Pool-X', 'Trading Bots']
  },
  {
    id: '7',
    name: 'Huobi Global',
    status: 'disconnected',
    lastSync: '2024-01-14T15:20:00Z',
    tradingFees: { maker: 0.2, taker: 0.2 },
    apiLimits: { used: 0, total: 600 },
    balance: { total: 0, available: 0, currency: 'USDT' },
    supportedPairs: 600,
    activeBots: 0,
    logo: 'https://cryptologos.cc/logos/huobi-token-ht-logo.svg',
    features: ['Spot Trading', 'Futures', 'Margin', 'DeFi', 'Prime Pool']
  },
  {
    id: '8',
    name: 'Gate.io',
    status: 'connected',
    lastSync: '2024-01-15T10:26:00Z',
    tradingFees: { maker: 0.2, taker: 0.2 },
    apiLimits: { used: 150, total: 500 },
    balance: { total: 1850.45, available: 1420.33, currency: 'USDT' },
    supportedPairs: 900,
    activeBots: 1,
    logo: 'https://cryptologos.cc/logos/gate-gt-logo.svg',
    features: ['Spot Trading', 'Futures', 'Options', 'Copy Trading', 'Startup']
  },
  {
    id: '9',
    name: 'Bitfinex',
    status: 'connecting',
    lastSync: '2024-01-15T10:20:00Z',
    tradingFees: { maker: 0.1, taker: 0.2 },
    apiLimits: { used: 45, total: 300 },
    balance: { total: 0, available: 0, currency: 'USD' },
    supportedPairs: 350,
    activeBots: 0,
    logo: 'https://cryptologos.cc/logos/bitfinex-leo-logo.svg',
    features: ['Spot Trading', 'Margin', 'Derivatives', 'Lending', 'OTC']
  },
  {
    id: '10',
    name: 'Gemini',
    status: 'disconnected',
    lastSync: '2024-01-12T08:15:00Z',
    tradingFees: { maker: 0.25, taker: 0.35 },
    apiLimits: { used: 0, total: 600 },
    balance: { total: 0, available: 0, currency: 'USD' },
    supportedPairs: 80,
    activeBots: 0,
    logo: 'https://cryptologos.cc/logos/gemini-dollar-gusd-logo.svg',
    features: ['Spot Trading', 'Custody', 'Institutional', 'ActiveTrader']
  }
];

export default function Exchanges() {
  const [exchanges] = useState(mockExchanges);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const handleConnect = (exchangeId: string) => {
    console.log('Connecting to exchange:', exchangeId);
  };

  const handleDisconnect = (exchangeId: string) => {
    console.log('Disconnecting from exchange:', exchangeId);
  };

  const handleRefresh = (exchangeId: string) => {
    console.log('Refreshing exchange data:', exchangeId);
  };

  const getStatusBadge = (status: ExchangeData['status']) => {
    switch (status) {
      case 'connected':
        return <StatusBadge status="online" label="Connected" />;
      case 'disconnected':
        return <StatusBadge status="offline" label="Disconnected" />;
      case 'error':
        return <StatusBadge status="error" label="Error" />;
      case 'connecting':
        return <StatusBadge status="pending" label="Connecting" />;
      default:
        return <StatusBadge status="offline" label="Unknown" />;
    }
  };

  const getApiUsageColor = (used: number, total: number) => {
    const percentage = (used / total) * 100;
    if (percentage > 80) return 'bg-red-500';
    if (percentage > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatLastSync = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Exchange Connections"
        description="Manage your cryptocurrency exchange integrations and API connections"
        actions={
          <div className="flex items-center space-x-2">
            <div className="flex border rounded-lg p-1">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                data-testid="view-cards"
                className="px-3"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                data-testid="view-table"
                className="px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button data-testid="add-exchange">
              <Plus className="h-4 w-4 mr-2" />
              Add Exchange
            </Button>
          </div>
        }
      />

      <main id="main-content">
        {exchanges.length === 0 ? (
          <EmptyState
            icon={<TrendingUp className="h-12 w-12" />}
            title="No exchanges connected"
            description="Connect your first exchange to start automated trading across multiple platforms."
            action={{
              label: "Connect Exchange",
              onClick: () => console.log('Connect exchange')
            }}
          />
        ) : viewMode === 'table' ? (
          <ExchangeTableView 
            exchanges={exchanges}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onRefresh={handleRefresh}
            getStatusBadge={getStatusBadge}
            formatLastSync={formatLastSync}
            getApiUsageColor={getApiUsageColor}
          />
        ) : (
          <ExchangeCardView 
            exchanges={exchanges}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onRefresh={handleRefresh}
            getStatusBadge={getStatusBadge}
            formatLastSync={formatLastSync}
            getApiUsageColor={getApiUsageColor}
          />
        )}
      </main>
    </div>
  );
}

// Card View Component
function ExchangeCardView({ exchanges, onConnect, onDisconnect, onRefresh, getStatusBadge, formatLastSync, getApiUsageColor }: {
  exchanges: ExchangeData[];
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onRefresh: (id: string) => void;
  getStatusBadge: (status: ExchangeData['status']) => React.ReactNode;
  formatLastSync: (timestamp: string) => string;
  getApiUsageColor: (used: number, total: number) => string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {exchanges.map((exchange) => (
        <Card key={exchange.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ExchangeIcon 
                  name={exchange.name}
                  logo={exchange.logo}
                  size="md"
                />
                <div>
                  <CardTitle className="text-lg">{exchange.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusBadge(exchange.status)}
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatLastSync(exchange.lastSync)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRefresh(exchange.id)}
                  disabled={exchange.status === 'disconnected'}
                  data-testid={`refresh-${exchange.id}`}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                
                {exchange.status === 'connected' ? (
                  <ConfirmationDialog
                    trigger={
                      <Button variant="ghost" size="sm" data-testid={`disconnect-${exchange.id}`}>
                        <Unlink className="h-4 w-4" />
                      </Button>
                    }
                    title="Disconnect Exchange"
                    description={`Are you sure you want to disconnect from ${exchange.name}? This will stop all active bots on this exchange.`}
                    confirmText="Disconnect"
                    onConfirm={() => onDisconnect(exchange.id)}
                    variant="destructive"
                  />
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onConnect(exchange.id)}
                    data-testid={`connect-${exchange.id}`}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Balance Information */}
            {exchange.status === 'connected' && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Account Balance</span>
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total</span>
                    <p className="font-semibold">
                      {exchange.balance.total.toLocaleString()} {exchange.balance.currency}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Available</span>
                    <p className="font-semibold">
                      {exchange.balance.available.toLocaleString()} {exchange.balance.currency}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* API Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">API Usage</span>
                <span className="text-xs text-gray-500">
                  {exchange.apiLimits.used}/{exchange.apiLimits.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${getApiUsageColor(exchange.apiLimits.used, exchange.apiLimits.total)}`}
                  style={{ width: `${(exchange.apiLimits.used / exchange.apiLimits.total) * 100}%` }}
                />
              </div>
            </div>

            {/* Trading Fees */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Maker Fee</span>
                <p className="font-semibold">{exchange.tradingFees.maker}%</p>
              </div>
              <div>
                <span className="text-gray-500">Taker Fee</span>
                <p className="font-semibold">{exchange.tradingFees.taker}%</p>
              </div>
            </div>

            {/* Features */}
            <div>
              <span className="text-sm font-medium text-gray-700 mb-2 block">Features</span>
              <div className="flex flex-wrap gap-2">
                {exchange.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
              <span>{exchange.supportedPairs} pairs</span>
              <span>{exchange.activeBots} active bot{exchange.activeBots !== 1 ? 's' : ''}</span>
            </div>

            {/* Error Message */}
            {exchange.status === 'error' && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">API connection failed. Check your credentials.</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Table View Component
function ExchangeTableView({ exchanges, onConnect, onDisconnect, onRefresh, getStatusBadge, formatLastSync, getApiUsageColor }: {
  exchanges: ExchangeData[];
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onRefresh: (id: string) => void;
  getStatusBadge: (status: ExchangeData['status']) => React.ReactNode;
  formatLastSync: (timestamp: string) => string;
  getApiUsageColor: (used: number, total: number) => string;
}) {
  const getAccountAlias = (name: string) => {
    const aliases = {
      'Binance': 'Main Trading Account',
      'Coinbase Pro': 'Secondary Account',
      'Kraken': 'European Trading',
      'Bybit': 'Derivatives Account',
      'OKX': 'Asian Markets',
      'KuCoin': 'Altcoin Trading',
      'Huobi Global': 'Spot Trading',
      'Gate.io': 'DeFi Assets',
      'Bitfinex': 'Professional Trading',
      'Gemini': 'Primary Account'
    };
    return aliases[name as keyof typeof aliases] || 'Primary Account';
  };

  const getPermission = (name: string) => {
    const permissions = {
      'Binance': 'Trade-only',
      'Coinbase Pro': 'Read-only', 
      'Kraken': 'Full Access',
      'Bybit': 'Trade-only',
      'OKX': 'Read-only',
      'KuCoin': 'Full Access',
      'Huobi Global': 'Trade-only',
      'Gate.io': 'Trade-only',
      'Bitfinex': 'Full Access',
      'Gemini': 'Read-only'
    };
    return permissions[name as keyof typeof permissions] || 'Read-only';
  };

  const getPermissionBadgeColor = (permission: string) => {
    return permission === 'Full Access' ? 'bg-green-100 text-green-800' :
           permission === 'Trade-only' ? 'bg-orange-100 text-orange-800' :
           'bg-blue-100 text-blue-800';
  };

  return (
    <div className="border rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Exchange</TableHead>
            <TableHead>Account Alias</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Environment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Verified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exchanges.map((exchange) => (
            <TableRow key={exchange.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="flex items-center space-x-3">
                  <ExchangeIcon 
                    name={exchange.name}
                    logo={exchange.logo}
                    size="sm"
                  />
                  <span className="font-medium">{exchange.name}</span>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="font-medium text-sm">
                  {getAccountAlias(exchange.name)}
                </div>
              </TableCell>
              
              <TableCell>
                <Badge className={getPermissionBadgeColor(getPermission(exchange.name))}>
                  {getPermission(exchange.name)}
                </Badge>
              </TableCell>
              
              <TableCell>
                <Badge variant="outline" className="bg-gray-100">paper</Badge>
              </TableCell>
              
              <TableCell>
                {getStatusBadge(exchange.status)}
              </TableCell>
              
              <TableCell>
                <span className="text-sm text-gray-600">
                  {formatLastSync(exchange.lastSync)}
                </span>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRefresh(exchange.id)}
                    disabled={exchange.status === 'disconnected'}
                    data-testid={`table-refresh-${exchange.id}`}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" data-testid={`table-actions-${exchange.id}`}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Test Connection
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {exchange.status === 'connected' ? (
                        <ConfirmationDialog
                          trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                              <Unlink className="h-4 w-4 mr-2" />
                              Disconnect
                            </DropdownMenuItem>
                          }
                          title="Disconnect Exchange"
                          description={`Are you sure you want to disconnect from ${exchange.name}? This will stop all active bots on this exchange.`}
                          confirmText="Disconnect"
                          onConfirm={() => onDisconnect(exchange.id)}
                          variant="destructive"
                        />
                      ) : (
                        <DropdownMenuItem onClick={() => onConnect(exchange.id)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Connect
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}