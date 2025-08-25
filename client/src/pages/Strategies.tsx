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
  CheckCircle,
  Grid3X3,
  DollarSign,
  ArrowRightLeft,
  Zap,
  Activity,
  ScissorsLineDashed,
  GitBranchPlus,
  Crosshair,
  GitCompare,
  TrendingDown,
  MoreVertical
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
  type: 'grid' | 'arbitrage' | 'momentum' | 'mean-reversion' | 'scalping' | 'swing' | 'dca' | 'breakout' | 'pairs' | 'trend-following';
  status: 'available' | 'popular' | 'advanced';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  marketCondition: 'trending' | 'ranging' | 'volatile' | 'any';
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: string;
  description: string;
  pros: string[];
  cons: string[];
  bestFor: string;
}

const cryptoTradingStrategies: StrategyData[] = [
  {
    id: '1',
    name: 'Grid Trading',
    type: 'grid',
    status: 'popular',
    complexity: 'beginner',
    marketCondition: 'ranging',
    riskLevel: 'low',
    timeframe: '15m - 1h',
    description: 'Places buy and sell orders at regular intervals above and below current price',
    pros: ['Works well in sideways markets', 'Consistent profits', 'Automatic profit taking'],
    cons: ['Vulnerable to strong trends', 'Requires ranging markets'],
    bestFor: 'Stable coins and low-volatility periods'
  },
  {
    id: '2',
    name: 'DCA (Dollar Cost Averaging)',
    type: 'dca',
    status: 'popular',
    complexity: 'beginner',
    marketCondition: 'any',
    riskLevel: 'low',
    timeframe: '1d - 1w',
    description: 'Invests fixed amount at regular intervals regardless of price',
    pros: ['Reduces average cost', 'Simple to implement', 'Reduces timing risk'],
    cons: ['No profit in sideways markets', 'Requires long-term commitment'],
    bestFor: 'Long-term investors and volatile markets'
  },
  {
    id: '3',
    name: 'Arbitrage Trading',
    type: 'arbitrage',
    status: 'advanced',
    complexity: 'advanced',
    marketCondition: 'any',
    riskLevel: 'low',
    timeframe: '1s - 5m',
    description: 'Exploits price differences between different exchanges or trading pairs',
    pros: ['Low risk', 'Market neutral', 'Quick profits'],
    cons: ['Requires high capital', 'Opportunities are rare', 'Complex execution'],
    bestFor: 'High-frequency traders with substantial capital'
  },
  {
    id: '4',
    name: 'Momentum Trading',
    type: 'momentum',
    status: 'popular',
    complexity: 'intermediate',
    marketCondition: 'trending',
    riskLevel: 'high',
    timeframe: '15m - 4h',
    description: 'Follows price trends and momentum indicators to enter positions',
    pros: ['High profit potential', 'Captures strong moves', 'Clear signals'],
    cons: ['High risk', 'Frequent false signals', 'Requires discipline'],
    bestFor: 'Trending markets and news-driven movements'
  },
  {
    id: '5',
    name: 'Mean Reversion',
    type: 'mean-reversion',
    status: 'available',
    complexity: 'intermediate',
    marketCondition: 'ranging',
    riskLevel: 'medium',
    timeframe: '1h - 1d',
    description: 'Trades based on the assumption that prices return to their historical average',
    pros: ['Works in range-bound markets', 'Statistical edge', 'Clear entry/exit'],
    cons: ['Fails in trending markets', 'Complex calculations'],
    bestFor: 'Established cryptocurrencies with predictable patterns'
  },
  {
    id: '6',
    name: 'Scalping',
    type: 'scalping',
    status: 'advanced',
    complexity: 'advanced',
    marketCondition: 'volatile',
    riskLevel: 'high',
    timeframe: '1m - 15m',
    description: 'Makes numerous small profits from tiny price movements throughout the day',
    pros: ['Many opportunities', 'Quick profits', 'Limited exposure'],
    cons: ['High transaction costs', 'Requires constant monitoring', 'Stressful'],
    bestFor: 'Experienced traders with low-latency connections'
  },
  {
    id: '7',
    name: 'Swing Trading',
    type: 'swing',
    status: 'popular',
    complexity: 'intermediate',
    marketCondition: 'trending',
    riskLevel: 'medium',
    timeframe: '4h - 1w',
    description: 'Captures price swings over several days to weeks using technical analysis',
    pros: ['Less time intensive', 'Good risk-reward', 'Flexible timing'],
    cons: ['Overnight risk', 'Requires patience', 'Market gaps'],
    bestFor: 'Part-time traders and medium-term opportunities'
  },
  {
    id: '8',
    name: 'Breakout Trading',
    type: 'breakout',
    status: 'available',
    complexity: 'intermediate',
    marketCondition: 'volatile',
    riskLevel: 'high',
    timeframe: '15m - 4h',
    description: 'Enters trades when price breaks through significant support or resistance levels',
    pros: ['Catches big moves early', 'Clear entry signals', 'High profit potential'],
    cons: ['Many false breakouts', 'Requires quick execution', 'High risk'],
    bestFor: 'Volatile crypto markets and key technical levels'
  },
  {
    id: '9',
    name: 'Pairs Trading',
    type: 'pairs',
    status: 'advanced',
    complexity: 'advanced',
    marketCondition: 'any',
    riskLevel: 'medium',
    timeframe: '1h - 1d',
    description: 'Trades correlation between two related cryptocurrencies',
    pros: ['Market neutral', 'Statistical advantage', 'Reduced market risk'],
    cons: ['Complex analysis', 'Correlations can break', 'Limited pairs'],
    bestFor: 'Sophisticated traders with strong analytical skills'
  },
  {
    id: '10',
    name: 'Trend Following',
    type: 'trend-following',
    status: 'popular',
    complexity: 'beginner',
    marketCondition: 'trending',
    riskLevel: 'medium',
    timeframe: '1d - 1w',
    description: 'Follows established trends using moving averages and trend indicators',
    pros: ['Simple concept', 'Catches big moves', 'Clear rules'],
    cons: ['Late entries', 'Whipsaws in choppy markets', 'Requires trending markets'],
    bestFor: 'Long-term trending cryptocurrencies like Bitcoin and Ethereum'
  }
];

export default function Strategies() {
  const [strategies] = useState(cryptoTradingStrategies);

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

  const getRiskBadge = (risk: StrategyData['riskLevel']) => {
    const variants = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <Badge className={variants[risk]}>
        {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
      </Badge>
    );
  };

  const getComplexityBadge = (complexity: StrategyData['complexity']) => {
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

  const getStatusBadge = (status: StrategyData['status']) => {
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

  const getMarketConditionBadge = (condition: StrategyData['marketCondition']) => {
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

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Crypto Trading Strategies"
        description="Comprehensive collection of proven crypto trading strategies for automated trading"
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
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gray-50 text-gray-600">
                        {getTypeIcon(strategy.type)}
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
                    {getRiskBadge(strategy.riskLevel)}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {getComplexityBadge(strategy.complexity)}
                    {getMarketConditionBadge(strategy.marketCondition)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{strategy.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-green-700 mb-1">✓ Advantages</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {strategy.pros.map((pro, index) => (
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
                        {strategy.cons.map((con, index) => (
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
      </main>
    </div>
  );
}