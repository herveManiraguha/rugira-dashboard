import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { 
  Settings, 
  Plus,
  RefreshCw,
  Unlink,
  AlertTriangle,
  Clock,
  Shield,
  TrendingUp,
  DollarSign
} from 'lucide-react';

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
    logo: '/logos/binance.svg',
    features: ['Spot Trading', 'Futures', 'Margin', 'Options']
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
    logo: '/logos/coinbase.svg',
    features: ['Spot Trading', 'Institutional']
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
    logo: '/logos/kraken.svg',
    features: ['Spot Trading', 'Futures', 'Margin']
  },
  {
    id: '4',
    name: 'FTX',
    status: 'disconnected',
    lastSync: '2024-01-10T15:20:00Z',
    tradingFees: { maker: 0.02, taker: 0.07 },
    apiLimits: { used: 0, total: 3000 },
    balance: { total: 0, available: 0, currency: 'USD' },
    supportedPairs: 300,
    activeBots: 0,
    logo: '/logos/ftx.svg',
    features: ['Spot Trading', 'Futures', 'Options', 'Leveraged Tokens']
  }
];

export default function Exchanges() {
  const [exchanges] = useState(mockExchanges);

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
          <Button data-testid="add-exchange">
            <Plus className="h-4 w-4 mr-2" />
            Add Exchange
          </Button>
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
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {exchanges.map((exchange) => (
              <Card key={exchange.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-gray-600" />
                      </div>
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
                        onClick={() => handleRefresh(exchange.id)}
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
                          onConfirm={() => handleDisconnect(exchange.id)}
                          variant="destructive"
                        />
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleConnect(exchange.id)}
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
        )}
      </main>
    </div>
  );
}