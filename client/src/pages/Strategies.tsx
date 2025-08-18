import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  Settings, 
  Play, 
  Square, 
  Edit, 
  Copy, 
  Trash,
  Plus,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StrategyData {
  id: string;
  name: string;
  type: 'grid' | 'arbitrage' | 'momentum' | 'mean-reversion';
  status: 'active' | 'inactive' | 'testing';
  performance: {
    winRate: number;
    avgReturn: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: string;
  lastUpdated: string;
  description: string;
  activeBots: number;
}

const mockStrategies: StrategyData[] = [
  {
    id: '1',
    name: 'Conservative Grid',
    type: 'grid',
    status: 'active',
    performance: {
      winRate: 78.5,
      avgReturn: 2.4,
      maxDrawdown: -5.2,
      sharpeRatio: 1.8
    },
    riskLevel: 'low',
    timeframe: '15m - 1h',
    lastUpdated: '2024-01-15',
    description: 'Low-risk grid trading strategy with tight ranges for stable returns',
    activeBots: 3
  },
  {
    id: '2',
    name: 'Cross-Exchange Arbitrage',
    type: 'arbitrage',
    status: 'active',
    performance: {
      winRate: 92.1,
      avgReturn: 0.8,
      maxDrawdown: -1.1,
      sharpeRatio: 3.2
    },
    riskLevel: 'low',
    timeframe: '1m - 5m',
    lastUpdated: '2024-01-14',
    description: 'Exploit price differences between major exchanges',
    activeBots: 2
  },
  {
    id: '3',
    name: 'Momentum Breakout',
    type: 'momentum',
    status: 'testing',
    performance: {
      winRate: 65.3,
      avgReturn: 4.7,
      maxDrawdown: -12.8,
      sharpeRatio: 1.4
    },
    riskLevel: 'high',
    timeframe: '4h - 1d',
    lastUpdated: '2024-01-13',
    description: 'Aggressive momentum-based strategy for trending markets',
    activeBots: 1
  },
  {
    id: '4',
    name: 'Mean Reversion Pro',
    type: 'mean-reversion',
    status: 'inactive',
    performance: {
      winRate: 71.2,
      avgReturn: 3.1,
      maxDrawdown: -8.5,
      sharpeRatio: 1.6
    },
    riskLevel: 'medium',
    timeframe: '1h - 4h',
    lastUpdated: '2024-01-10',
    description: 'Statistical mean reversion with dynamic thresholds',
    activeBots: 0
  }
];

export default function Strategies() {
  const [strategies] = useState(mockStrategies);

  const handleActivateStrategy = (strategyId: string) => {
    console.log('Activating strategy:', strategyId);
  };

  const handleDeactivateStrategy = (strategyId: string) => {
    console.log('Deactivating strategy:', strategyId);
  };

  const handleDeleteStrategy = (strategyId: string) => {
    console.log('Deleting strategy:', strategyId);
  };

  const getTypeIcon = (type: StrategyData['type']) => {
    switch (type) {
      case 'grid': return <Settings className="h-4 w-4" />;
      case 'arbitrage': return <BarChart3 className="h-4 w-4" />;
      case 'momentum': return <TrendingUp className="h-4 w-4" />;
      case 'mean-reversion': return <AlertCircle className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getRiskBadge = (risk: StrategyData['riskLevel']) => {
    const variants = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[risk]}>
        {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
      </Badge>
    );
  };

  const getStatusBadge = (status: StrategyData['status']) => {
    const variants = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      testing: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    return (
      <Badge className={variants[status] || variants.inactive}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Trading Strategies"
        description="Configure and manage your automated trading strategies"
        actions={
          <Button data-testid="create-strategy">
            <Plus className="h-4 w-4 mr-2" />
            Create Strategy
          </Button>
        }
      />

      <main id="main-content">
        {strategies.length === 0 ? (
          <EmptyState
            icon={<Settings className="h-12 w-12" />}
            title="No strategies found"
            description="Create your first trading strategy to start automated trading with optimized algorithms."
            action={{
              label: "Create Your First Strategy",
              onClick: () => console.log('Create strategy')
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {strategies.map((strategy) => (
              <Card key={strategy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(strategy.type)}
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" data-testid={`strategy-actions-${strategy.id}`}>
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Strategy
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {strategy.status === 'active' ? (
                          <DropdownMenuItem onClick={() => handleDeactivateStrategy(strategy.id)}>
                            <Square className="h-4 w-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleActivateStrategy(strategy.id)}>
                            <Play className="h-4 w-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <ConfirmationDialog
                          trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          }
                          title="Delete Strategy"
                          description={`Are you sure you want to delete "${strategy.name}"? This action cannot be undone and will stop all associated bots.`}
                          confirmText="Delete Strategy"
                          requiresTyping="DELETE"
                          onConfirm={() => handleDeleteStrategy(strategy.id)}
                          variant="destructive"
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {getStatusBadge(strategy.status)}
                    {getRiskBadge(strategy.riskLevel)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{strategy.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Win Rate</span>
                      <p className="font-semibold text-green-600">{strategy.performance.winRate}%</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Avg Return</span>
                      <p className="font-semibold">{strategy.performance.avgReturn}%</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Max Drawdown</span>
                      <p className="font-semibold text-red-600">{strategy.performance.maxDrawdown}%</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Sharpe Ratio</span>
                      <p className="font-semibold">{strategy.performance.sharpeRatio}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                    <span>{strategy.timeframe}</span>
                    <span>{strategy.activeBots} active bot{strategy.activeBots !== 1 ? 's' : ''}</span>
                  </div>

                  <div className="text-xs text-gray-400">
                    Last updated: {new Date(strategy.lastUpdated).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}