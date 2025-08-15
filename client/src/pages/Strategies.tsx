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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
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

  const openDetailsModal = (template: StrategyTemplate) => {
    setSelectedTemplate(template);
    setShowDetailsModal(true);
  };

  const StrategyDetailsModal = ({ strategy }: { strategy: StrategyTemplate }) => {
    // Generate mock performance data
    const generatePerformanceData = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.map(month => ({
        month,
        return: (Math.random() * 10 - 2).toFixed(2) // -2% to 8% random returns
      }));
    };

    return (
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            {getCategoryIcon(strategy.category)}
            <span>{strategy.name}</span>
            <div className="flex space-x-2">
              <Badge className={getComplexityColor(strategy.complexity)}>
                {strategy.complexity}
              </Badge>
              <Badge variant="outline" className={getRiskColor(strategy.riskLevel)}>
                {strategy.riskLevel}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Strategy Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Category:</span>
                    <span className="capitalize">{strategy.category.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Complexity:</span>
                    <Badge className={getComplexityColor(strategy.complexity)}>
                      {strategy.complexity}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Risk Level:</span>
                    <Badge variant="outline" className={getRiskColor(strategy.riskLevel)}>
                      {strategy.riskLevel}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Timeframe:</span>
                    <span>{strategy.timeframe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Expected Return:</span>
                    <span className="text-green-600 font-medium">{strategy.expectedReturn}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Market Conditions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Best Conditions:</span>
                    <span className="text-green-600">Trending Markets</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Min Capital:</span>
                    <span>$1,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Max Drawdown:</span>
                    <span className="text-red-600">-15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Win Rate:</span>
                    <span>{strategy.riskLevel === 'high' ? '45-60%' : strategy.riskLevel === 'medium' ? '60-75%' : '70-85%'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Strategy Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{strategy.description}</p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Key Features:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Automated signal generation and execution</li>
                    <li>• Built-in risk management and position sizing</li>
                    <li>• Real-time performance monitoring</li>
                    <li>• Backtesting capabilities with historical data</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parameters" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Default Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(strategy.defaultParams).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                      <span className="font-mono text-sm">{typeof value === 'number' ? value : String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Parameter Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-green-500 bg-green-50">
                    <h5 className="font-medium text-green-900">Conservative Settings</h5>
                    <p className="text-sm text-green-800">Lower risk parameters for steady, consistent returns</p>
                  </div>
                  <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                    <h5 className="font-medium text-yellow-900">Balanced Settings</h5>
                    <p className="text-sm text-yellow-800">Default parameters offer good risk/reward balance</p>
                  </div>
                  <div className="p-3 border-l-4 border-red-500 bg-red-50">
                    <h5 className="font-medium text-red-900">Aggressive Settings</h5>
                    <p className="text-sm text-red-800">Higher risk parameters for maximum returns</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Return</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">+{strategy.expectedReturn.split('-')[1] || '25%'}</p>
                  <p className="text-sm text-gray-500">Last 12 months</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sharpe Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">{strategy.riskLevel === 'low' ? '1.8' : strategy.riskLevel === 'medium' ? '1.4' : '1.1'}</p>
                  <p className="text-sm text-gray-500">Risk-adjusted return</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Max Drawdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">-{strategy.riskLevel === 'low' ? '8%' : strategy.riskLevel === 'medium' ? '15%' : '25%'}</p>
                  <p className="text-sm text-gray-500">Worst decline</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Monthly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-2">
                  {generatePerformanceData().map((data, index) => (
                    <div key={index} className="text-center p-2 border rounded">
                      <div className="text-xs text-gray-500">{data.month}</div>
                      <div className={`text-sm font-medium ${parseFloat(data.return) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(data.return) >= 0 ? '+' : ''}{data.return}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Volatility:</span>
                    <span className={strategy.riskLevel === 'high' ? 'text-red-600' : strategy.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'}>
                      {strategy.riskLevel === 'low' ? '12%' : strategy.riskLevel === 'medium' ? '18%' : '28%'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Beta:</span>
                    <span>{strategy.riskLevel === 'low' ? '0.7' : strategy.riskLevel === 'medium' ? '1.0' : '1.3'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Value at Risk (95%):</span>
                    <span className="text-red-600">-{strategy.riskLevel === 'low' ? '3%' : strategy.riskLevel === 'medium' ? '5%' : '8%'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Risk Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Stop Loss:</span>
                    <span>-5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Position Limit:</span>
                    <span>10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Loss Limit:</span>
                    <span>-2%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="implementation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Implementation Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-blue-600">1</span>
                    </div>
                    <div>
                      <h5 className="font-medium">Strategy Configuration</h5>
                      <p className="text-sm text-gray-600">Set parameters, risk limits, and trading pairs</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-blue-600">2</span>
                    </div>
                    <div>
                      <h5 className="font-medium">Backtesting</h5>
                      <p className="text-sm text-gray-600">Test strategy performance with historical data</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-blue-600">3</span>
                    </div>
                    <div>
                      <h5 className="font-medium">Paper Trading</h5>
                      <p className="text-sm text-gray-600">Run strategy in simulation mode to verify performance</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-blue-600">4</span>
                    </div>
                    <div>
                      <h5 className="font-medium">Live Trading</h5>
                      <p className="text-sm text-gray-600">Deploy strategy with real funds and monitor performance</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Technical Requirements</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• API access to supported exchanges</li>
                      <li>• Minimum $1,000 capital</li>
                      <li>• Stable internet connection</li>
                      <li>• 24/7 server uptime</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Supported Exchanges</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Binance</li>
                      <li>• Coinbase Pro</li>
                      <li>• Kraken</li>
                      <li>• Bybit</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    );
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
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => openDetailsModal(template)}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Strategy Details Modal */}
      {selectedTemplate && (
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <StrategyDetailsModal strategy={selectedTemplate} />
        </Dialog>
      )}
    </div>
  );
}