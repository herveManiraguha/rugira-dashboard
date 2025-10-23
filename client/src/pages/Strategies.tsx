import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StandardPageLayout } from '@/components/ui/standard-page-layout';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  Settings, 
  Play, 
  Edit, 
  Copy, 
  BarChart3,
  TrendingUp,
  Sparkles,
  Layers,
  Grid3X3,
  DollarSign,
  ArrowRightLeft,
  Zap,
  Activity,
  ScissorsLineDashed,
  GitBranchPlus,
  Crosshair,
  GitCompare,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockStrategies, type MockStrategy, type StrategyMarketCondition, type StrategyRiskLevel } from '@shared/mockData';

export default function Strategies() {
  const strategies = mockStrategies;

  const handleActivateStrategy = (strategyId: string) => {
    console.log('Activating strategy:', strategyId);
  };

  const handleDeactivateStrategy = (strategyId: string) => {
    console.log('Deactivating strategy:', strategyId);
  };

  const handleDeleteStrategy = (strategyId: string) => {
    console.log('Deleting strategy:', strategyId);
  };

  const getTypeIcon = (strategy: MockStrategy) => {
    if (strategy.tags.includes('Overlay')) {
      return <Layers className="h-5 w-5" />;
    }

    if (strategy.tags.includes('AI')) {
      return <Sparkles className="h-5 w-5" />;
    }

    switch (strategy.type) {
      case 'grid': return <Grid3X3 className="h-5 w-5" />;
      case 'arbitrage': return <ArrowRightLeft className="h-5 w-5" />;
      case 'momentum': return <Zap className="h-5 w-5" />;
      case 'mean-reversion': return <Activity className="h-5 w-5" />;
      case 'scalping': return <ScissorsLineDashed className="h-5 w-5" />;
      case 'swing': return <GitBranchPlus className="h-5 w-5" />;
      case 'dca': return <DollarSign className="h-5 w-5" />;
      case 'breakout': return <Crosshair className="h-5 w-5" />;
      case 'pairs': return <GitCompare className="h-5 w-5" />;
      case 'trend-following': return <TrendingUp className="h-5 w-5" />;
      default: return <BarChart3 className="h-5 w-5" />;
    }
  };

  const getRiskBadge = (risk: StrategyRiskLevel, label?: string) => {
    const variants = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <Badge className={variants[risk]}>
        {label ?? `${risk.charAt(0).toUpperCase() + risk.slice(1)} Risk`}
      </Badge>
    );
  };

  const getComplexityBadge = (complexity: MockStrategy['complexity']) => {
    const variants = {
      beginner: 'bg-blue-100 text-blue-800 border-blue-200',
      intermediate: 'bg-purple-100 text-purple-800 border-purple-200',
      advanced: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    
    return (
      <Badge className={variants[complexity]}>
        {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: MockStrategy['status']) => {
    const variants = {
      available: 'bg-gray-100 text-gray-800 border-gray-200',
      popular: 'bg-green-100 text-green-800 border-green-200',
      advanced: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    
    return (
      <Badge className={variants[status] || variants.available}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getMarketConditionBadge = (condition: StrategyMarketCondition) => {
    const variants = {
      trending: 'bg-blue-100 text-blue-800 border-blue-200',
      ranging: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      volatile: 'bg-red-100 text-red-800 border-red-200',
      any: 'bg-green-100 text-green-800 border-green-200'
    };
    
    return (
      <Badge className={variants[condition]}>
        {condition.charAt(0).toUpperCase() + condition.slice(1)}
      </Badge>
    );
  };

  const renderTagBadges = (strategy: MockStrategy) => {
    if (!strategy.tags.length) {
      return null;
    }

    return (
      <div className="flex items-center gap-2 flex-wrap">
        {strategy.tags.map((tag) => (
          <Badge
            key={`${strategy.id}-${tag}`}
            className={
              tag === 'AI'
                ? 'bg-purple-100 text-purple-800 border-purple-200'
                : tag === 'Overlay'
                  ? 'bg-slate-100 text-slate-800 border-slate-200'
                  : 'bg-gray-100 text-gray-800 border-gray-200'
            }
          >
            {tag}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <StandardPageLayout
      title="Crypto Trading Strategies"
      subtitle="Comprehensive collection of proven crypto trading strategies for automated trading"
    >
      <div className="space-y-6">
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
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gray-50 text-gray-600">
                        {getTypeIcon(strategy)}
                      </div>
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" data-testid={`strategy-actions-${strategy.id}`}>
                          <MoreVertical className="h-4 w-4" />
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
                        <DropdownMenuItem onClick={() => handleActivateStrategy(strategy.id)}>
                          <Play className="h-4 w-4 mr-2" />
                          Use Strategy
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    {getStatusBadge(strategy.status)}
                    {getRiskBadge(strategy.risk, strategy.riskLabel)}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {getComplexityBadge(strategy.complexity)}
                    {strategy.marketConditions.map((condition) => (
                      <React.Fragment key={`${strategy.id}-${condition}`}>
                        {getMarketConditionBadge(condition)}
                      </React.Fragment>
                    ))}
                  </div>

                  {renderTagBadges(strategy)}
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{strategy.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-green-700 mb-1">✓ Advantages</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {strategy.advantages.map((pro, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-red-700 mb-1">⚠ Considerations</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {strategy.considerations.map((con, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-sm">
                      <span className="text-gray-500 font-medium">Best for: </span>
                      <span className="text-gray-900">{strategy.bestFor}</span>
                    </div>
                    <div className="text-sm mt-1">
                      <span className="text-gray-500 font-medium">Timeframe: </span>
                      <span className="text-gray-900">{strategy.timeframe}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </StandardPageLayout>
  );
}
