import React from 'react';
import { Bot, Play, Square, Settings, AlertTriangle, MoreVertical, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

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

interface MobileBotsTableProps {
  bots: BotData[];
  selectedBots: Set<string>;
  onSelectBot: (botId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onStartBot: (botId: string) => void;
  onStopBot: (botId: string) => void;
  onDeleteBot: (botId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
}

export function MobileBotsTable({
  bots,
  selectedBots,
  onSelectBot,
  onSelectAll,
  onStartBot,
  onStopBot,
  onDeleteBot,
  currentPage,
  totalPages,
  onPageChange,
}: MobileBotsTableProps) {
  const allSelected = bots.length > 0 && bots.every(bot => selectedBots.has(bot.id));
  const someSelected = bots.some(bot => selectedBots.has(bot.id));

  const getStatusBadge = (status: BotData['status']) => {
    const variants = {
      running: 'bg-green-100 text-green-800',
      stopped: 'bg-gray-100 text-gray-800',
      error: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={cn(variants[status], "text-xs px-2 py-0.5")}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-3">
      {/* Select All Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={allSelected || someSelected}
            onCheckedChange={(checked) => onSelectAll(!!checked)}
            data-testid="select-all-mobile"
          />
          <span className="text-sm font-medium text-gray-700">
            {selectedBots.size > 0 ? `${selectedBots.size} selected` : 'Select all'}
          </span>
        </div>
      </div>

      {/* Bot Cards */}
      <div className="space-y-3">
        {bots.map((bot) => (
          <div
            key={bot.id}
            className="bg-white border rounded-lg p-4 space-y-3"
            data-testid={`mobile-bot-card-${bot.id}`}
          >
            {/* Header Row */}
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <Checkbox
                  checked={selectedBots.has(bot.id)}
                  onCheckedChange={(checked) => onSelectBot(bot.id, !!checked)}
                  className="mt-1"
                  data-testid={`select-bot-${bot.id}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <h3 className="font-medium text-gray-900 truncate">{bot.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{bot.strategy}</p>
                </div>
              </div>
              
              {/* Status and Actions */}
              <div className="flex items-center space-x-2">
                {getStatusBadge(bot.status)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      data-testid={`mobile-bot-actions-${bot.id}`}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onStartBot(bot.id)}
                      disabled={bot.status === 'running'}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStopBot(bot.id)}
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
                      onClick={() => onDeleteBot(bot.id)}
                      className="text-red-600"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Trading Info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Exchange</p>
                <p className="font-medium">{bot.exchange}</p>
                <p className="text-xs text-gray-500">{bot.pair}</p>
              </div>
              <div>
                <p className="text-gray-500">24h P&L</p>
                <div className={cn(
                  "font-medium flex items-center space-x-1",
                  bot.pnl24h > 0 ? 'text-green-600' : bot.pnl24h < 0 ? 'text-red-600' : 'text-gray-600'
                )}>
                  {bot.pnl24h > 0 ? <TrendingUp className="h-3 w-3" /> : 
                   bot.pnl24h < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                  <span>{bot.pnl24h > 0 ? '+' : ''}${bot.pnl24h.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
              <span>Uptime: {bot.uptime}</span>
              <span>Last trade: {bot.lastTrade}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="h-9"
          >
            Previous
          </Button>
          <span className="text-sm font-medium">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="h-9"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}