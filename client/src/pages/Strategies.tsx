import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Settings, 
  Copy, 
  Play,
  FileText,
  Zap,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  category: 'arbitrage' | 'trend_following' | 'mean_reversion' | 'momentum';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  defaultParams: Record<string, any>;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: string;
  timeframe: string;
}

const strategyTemplates: StrategyTemplate[] = [
  {
    id: 'arbitrage',
    name: 'Cross-Exchange Arbitrage',
    description: 'Profits from price differences between exchanges by buying low on one exchange and selling high on another',
    category: 'arbitrage',
    complexity: 'intermediate',
    defaultParams: {
      minSpreadPercent: 0.5,
      maxPositionSize: 10000,
      slippageTolerance: 0.1,
      executionDelayMs: 100
    },
    riskLevel: 'low',
    expectedReturn: '5-15% annually',
    timeframe: 'seconds to minutes'
  },
  {
    id: 'moving_average',
    name: 'Moving Average Crossover',
    description: 'Generates buy/sell signals when short-term moving average crosses above/below long-term moving average',
    category: 'trend_following',
    complexity: 'beginner',
    defaultParams: {
      shortPeriod: 10,
      longPeriod: 30,
      rsiThreshold: 70,
      stopLossPercent: 3,
      takeProfitPercent: 6
    },
    riskLevel: 'medium',
    expectedReturn: '10-25% annually',
    timeframe: 'hours to days'
  },
  {
    id: 'grid_trading',
    name: 'Grid Trading Strategy',
    description: 'Places buy and sell orders at regular intervals above and below current price to profit from market volatility',
    category: 'mean_reversion',
    complexity: 'intermediate',
    defaultParams: {
      gridSpacing: 1.0,
      numberOfGrids: 10,
      baseOrderSize: 100,
      takeProfitPercent: 1.5,
      stopLossPercent: 15
    },
    riskLevel: 'medium',
    expectedReturn: '15-30% annually',
    timeframe: 'hours to weeks'
  },
  {
    id: 'momentum_breakout',
    name: 'Momentum Breakout',
    description: 'Identifies strong price movements and enters positions in the direction of the breakout with volume confirmation',
    category: 'momentum',
    complexity: 'advanced',
    defaultParams: {
      lookbackPeriod: 20,
      volumeMultiplier: 1.5,
      breakoutThreshold: 2.0,
      stopLossPercent: 4,
      takeProfitPercent: 8
    },
    riskLevel: 'high',
    expectedReturn: '20-40% annually',
    timeframe: 'minutes to hours'
  },
  {
    id: 'mean_reversion',
    name: 'Mean Reversion Scalping',
    description: 'Exploits temporary price deviations from statistical mean, buying oversold and selling overbought conditions',
    category: 'mean_reversion',
    complexity: 'advanced',
    defaultParams: {
      rsiPeriod: 14,
      oversoldLevel: 30,
      overboughtLevel: 70,
      bolllingerPeriod: 20,
      standardDeviations: 2
    },
    riskLevel: 'medium',
    expectedReturn: '12-28% annually',
    timeframe: 'minutes to hours'
  },
  {
    id: 'dca_strategy',
    name: 'Dollar Cost Averaging',
    description: 'Systematically invests fixed amounts at regular intervals to reduce impact of volatility over time',
    category: 'trend_following',
    complexity: 'beginner',
    defaultParams: {
      investmentAmount: 500,
      frequency: 'weekly',
      trendFilter: true,
      smaThreshold: 50,
      maxDrawdown: 20
    },
    riskLevel: 'low',
    expectedReturn: '8-18% annually',
    timeframe: 'weeks to months'
  },
  {
    id: 'rsi_divergence',
    name: 'RSI Divergence Trading',
    description: 'Identifies momentum divergences between price and RSI indicator to predict trend reversals',
    category: 'momentum',
    complexity: 'intermediate',
    defaultParams: {
      rsiPeriod: 14,
      divergenceLookback: 5,
      confirmationCandles: 2,
      stopLossPercent: 3.5,
      takeProfitRatio: 2.0
    },
    riskLevel: 'medium',
    expectedReturn: '15-35% annually',
    timeframe: 'hours to days'
  },
  {
    id: 'triangular_arbitrage',
    name: 'Triangular Arbitrage',
    description: 'Exploits price discrepancies between three currency pairs on the same exchange for risk-free profits',
    category: 'arbitrage',
    complexity: 'advanced',
    defaultParams: {
      minProfitPercent: 0.1,
      maxSlippage: 0.05,
      executionSpeed: 50,
      currencyPairs: ['BTC/USDT', 'ETH/BTC', 'ETH/USDT']
    },
    riskLevel: 'low',
    expectedReturn: '3-8% annually',
    timeframe: 'milliseconds to seconds'
  },
  {
    id: 'swing_trading',
    name: 'Swing Trading Strategy',
    description: 'Captures medium-term price swings using technical analysis and market structure patterns',
    category: 'trend_following',
    complexity: 'intermediate',
    defaultParams: {
      swingPeriod: 5,
      trendConfirmation: true,
      supportResistance: true,
      stopLossPercent: 5,
      takeProfitPercent: 10
    },
    riskLevel: 'medium',
    expectedReturn: '18-35% annually',
    timeframe: 'days to weeks'
  },
  {
    id: 'news_sentiment',
    name: 'News Sentiment Trading',
    description: 'Analyzes market sentiment from news and social media to predict short-term price movements',
    category: 'momentum',
    complexity: 'advanced',
    defaultParams: {
      sentimentThreshold: 0.7,
      newsSourceWeight: 1.0,
      socialMediaWeight: 0.6,
      holdingPeriod: 60,
      riskPerTrade: 2
    },
    riskLevel: 'high',
    expectedReturn: '25-50% annually',
    timeframe: 'minutes to hours'
  },
  {
    id: 'pair_trading',
    name: 'Statistical Pairs Trading',
    description: 'Trades correlated asset pairs when their price ratio deviates from historical norms',
    category: 'mean_reversion',
    complexity: 'advanced',
    defaultParams: {
      correlationPeriod: 30,
      zScoreThreshold: 2.0,
      cointegrationTest: true,
      hedgeRatio: 1.0,
      maxHoldingDays: 14
    },
    riskLevel: 'medium',
    expectedReturn: '10-22% annually',
    timeframe: 'days to weeks'
  },
  {
    id: 'scalping',
    name: 'High-Frequency Scalping',
    description: 'Executes numerous small trades to profit from tiny price movements with minimal market exposure',
    category: 'momentum',
    complexity: 'advanced',
    defaultParams: {
      tickSize: 0.01,
      profitTarget: 0.1,
      maxHoldTime: 30,
      spreadFilter: 0.02,
      volumeThreshold: 1000
    },
    riskLevel: 'high',
    expectedReturn: '30-60% annually',
    timeframe: 'seconds to minutes'
  }
];

export default function Strategies() {
  const [selectedTemplate, setSelectedTemplate] = useState<StrategyTemplate | null>(null);
  const { toast } = useToast();

  const getCategoryIcon = (category: StrategyTemplate['category']) => {
    switch (category) {
      case 'arbitrage': return <Target className="h-5 w-5" />;
      case 'trend_following': return <TrendingUp className="h-5 w-5" />;
      case 'mean_reversion': return <BarChart3 className="h-5 w-5" />;
      case 'momentum': return <Zap className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const getComplexityColor = (complexity: StrategyTemplate['complexity']) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: StrategyTemplate['riskLevel']) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Strategy Templates</h1>
        <p className="text-gray-600">Choose and customize trading strategies for your bots</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {strategyTemplates.map((template) => (
          <Card key={template.id} className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(template.category)}
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </div>
                <div className="flex space-x-2">
                  <Badge className={getComplexityColor(template.complexity)}>
                    {template.complexity}
                  </Badge>
                  <Badge variant="outline" className={getRiskColor(template.riskLevel)}>
                    {template.riskLevel}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">{template.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Expected Return:</span>
                  <p className="text-gray-600">{template.expectedReturn}</p>
                </div>
                <div>
                  <span className="font-medium">Timeframe:</span>
                  <p className="text-gray-600">{template.timeframe}</p>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button size="sm" onClick={() => toast({ title: "Strategy configuration coming soon" })}>
                  <Settings className="h-4 w-4 mr-1" />
                  Configure
                </Button>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-1" />
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}