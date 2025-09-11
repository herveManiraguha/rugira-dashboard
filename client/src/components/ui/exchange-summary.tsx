import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ExchangeIcon } from '@/components/ui/exchange-icon';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Activity } from 'lucide-react';

interface ExchangeSummaryData {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  logo?: string;
  activeBots: number;
  balance: number;
  currency: string;
  last24hVolume: number;
}

interface ExchangeSummaryProps {
  exchanges: ExchangeSummaryData[];
  onAddExchange?: () => void;
  onExchangeClick?: (exchangeId: string) => void;
  className?: string;
}

export function ExchangeSummary({ 
  exchanges, 
  onAddExchange, 
  onExchangeClick,
  className = '' 
}: ExchangeSummaryProps) {
  const connectedExchanges = exchanges.filter(ex => ex.status === 'connected');
  const totalBalance = connectedExchanges.reduce((sum, ex) => sum + ex.balance, 0);
  const totalBots = connectedExchanges.reduce((sum, ex) => sum + ex.activeBots, 0);

  return (
    <Card className={className}>
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Exchange Connections</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAddExchange}
            data-testid="add-exchange-summary"
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
          <div className="text-center sm:text-left">
            <span className="text-gray-500 text-xs sm:text-sm">Connected</span>
            <p className="font-semibold text-green-600 text-sm sm:text-base">{connectedExchanges.length}/{exchanges.length}</p>
          </div>
          <div className="text-center sm:text-left">
            <span className="text-gray-500 text-xs sm:text-sm">Total Balance</span>
            <p className="font-semibold text-sm sm:text-base">${totalBalance.toLocaleString()}</p>
          </div>
          <div className="text-center sm:text-left">
            <span className="text-gray-500 text-xs sm:text-sm">Active Bots</span>
            <p className="font-semibold text-sm sm:text-base">{totalBots}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {exchanges.map((exchange) => (
            <div
              key={exchange.id}
              className={`
                group p-3 rounded-lg border transition-all cursor-pointer
                ${exchange.status === 'connected' 
                  ? 'hover:shadow-md hover:border-blue-200 bg-white' 
                  : 'bg-gray-50 border-gray-200'
                }
              `}
              onClick={() => onExchangeClick?.(exchange.id)}
              data-testid={`exchange-summary-${exchange.id}`}
            >
              <div className="flex flex-col items-center space-y-2">
                <ExchangeIcon 
                  name={exchange.name}
                  logo={exchange.logo}
                  size="sm"
                  className={exchange.status !== 'connected' ? 'opacity-50' : ''}
                />
                
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-900 truncate w-full">
                    {exchange.name}
                  </p>
                  
                  <div className="mt-1 flex justify-center">
                    <StatusBadge 
                      status={exchange.status === 'connected' ? 'online' : 
                             exchange.status === 'error' ? 'error' : 'offline'}
                      showIcon={false}
                      className="text-xs px-1 py-0"
                    />
                  </div>
                  
                  {exchange.status === 'connected' && (
                    <div className="mt-1 text-xs text-gray-500">
                      <div>{exchange.activeBots} bot{exchange.activeBots !== 1 ? 's' : ''}</div>
                      <div className="font-medium">
                        ${exchange.balance.toLocaleString()} {exchange.currency}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}