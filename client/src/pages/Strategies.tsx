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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    {template.riskLevel} risk
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