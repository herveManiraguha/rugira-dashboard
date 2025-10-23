import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ChevronRight, 
  ChevronLeft, 
  Target, 
  TrendingUp, 
  Shield,
  AlertTriangle,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockStrategies, type MockStrategy } from '@shared/mockData';

interface BotWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: (bot: any) => void;
}

export function BotWizard({ open, onClose, onComplete }: BotWizardProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [botData, setBotData] = useState({
    name: '',
    strategy: '',
    market: '',
    venue: '',
    stopLoss: '2',
    takeProfit: '5',
    dailyLossLimit: '1000',
    maxPositionSize: '10000',
    killSwitchEnabled: true,
    mode: 'Paper' as 'Paper' | 'Live'
  });

  const strategies = mockStrategies;
  const strategyOptions = strategies.map(strategy => ({
    slug: strategy.slug,
    label: strategy.name,
    risk: strategy.risk,
    riskLabel: strategy.riskLabel,
    tags: strategy.tags,
    overlay: strategy.overlay ?? false,
    description: strategy.description
  }));

  const markets = [
    'BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'MATIC/USDT'
  ];

  const venues = [
    'Binance', 'Coinbase', 'Kraken', 'BX Digital'
  ];

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!botData.strategy;
      case 2:
        return !!botData.market && !!botData.venue && !!botData.name;
      case 3:
        const sl = parseFloat(botData.stopLoss);
        const tp = parseFloat(botData.takeProfit);
        const dll = parseFloat(botData.dailyLossLimit);
        return sl > 0 && sl <= 10 && tp > 0 && tp <= 20 && dll > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleComplete = () => {
    if (!validateStep(3)) {
      toast({
        title: "Validation Error",
        description: "Please ensure all risk parameters are within safe limits.",
        variant: "destructive"
      });
      return;
    }

    const newBot = {
      ...botData,
      id: `BOT-${Date.now()}`,
      status: 'Running',
      createdAt: new Date()
    };

    onComplete(newBot);
    toast({
      title: "Bot Created",
      description: `${newBot.name} has been created and started in Paper mode.`,
    });
    onClose();
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <Target className="w-4 h-4" />;
      case 2:
        return <TrendingUp className="w-4 h-4" />;
      case 3:
        return <Shield className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Trading Bot</DialogTitle>
          <DialogDescription>
            Configure your bot in 3 simple steps. Starting in Paper mode for safety.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full
                ${currentStep >= step 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'}
              `}>
                {currentStep > step ? (
                  <Check className="w-4 h-4" />
                ) : (
                  getStepIcon(step)
                )}
              </div>
              {step < 3 && (
                <div className={`w-24 h-1 mx-2 ${
                  currentStep > step ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-4 min-h-[300px]">
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label>Select Strategy</Label>
                <Select 
                  value={botData.strategy} 
                  onValueChange={(value) => setBotData(prev => ({ ...prev, strategy: value }))}
                >
                  <SelectTrigger data-testid="select-strategy">
                    <SelectValue placeholder="Choose a trading strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    {strategyOptions.map(strategy => (
                      <SelectItem key={strategy.slug} value={strategy.slug}>
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">
                              {strategy.label}
                              {strategy.overlay && <span className="ml-2 text-xs uppercase text-muted-foreground tracking-wide">(Overlay)</span>}
                            </span>
                            <Badge 
                              variant={
                                strategy.risk === 'low' ? 'default' :
                                strategy.risk === 'medium' ? 'secondary' : 'destructive'
                              }
                            >
                              {strategy.riskLabel ?? `${strategy.risk.charAt(0).toUpperCase() + strategy.risk.slice(1)} Risk`}
                            </Badge>
                          </div>
                          {strategy.tags.includes('AI') && (
                            <span className="text-xs text-purple-600 font-medium">AI-Powered</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {botData.strategy && (
                <Alert>
                  <AlertDescription>
                    {strategies.find(strategy => strategy.slug === botData.strategy)?.description ?? 'Strategy details are unavailable.'}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="bot-name">Bot Name</Label>
                <Input
                  id="bot-name"
                  value={botData.name}
                  onChange={(e) => setBotData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., BTCUSD-MM-01"
                  data-testid="input-bot-name"
                />
              </div>

              <div className="space-y-2">
                <Label>Market</Label>
                <Select 
                  value={botData.market} 
                  onValueChange={(value) => setBotData(prev => ({ ...prev, market: value }))}
                >
                  <SelectTrigger data-testid="select-market">
                    <SelectValue placeholder="Select trading pair" />
                  </SelectTrigger>
                  <SelectContent>
                    {markets.map(market => (
                      <SelectItem key={market} value={market}>
                        {market}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Venue</Label>
                <Select 
                  value={botData.venue} 
                  onValueChange={(value) => setBotData(prev => ({ ...prev, venue: value }))}
                >
                  <SelectTrigger data-testid="select-venue">
                    <SelectValue placeholder="Select trading venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map(venue => (
                      <SelectItem key={venue} value={venue}>
                        {venue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription>
                  Risk parameters are enforced for safety. Bot will start in Paper mode.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stop-loss">Stop Loss (%)</Label>
                  <Input
                    id="stop-loss"
                    type="number"
                    value={botData.stopLoss}
                    onChange={(e) => setBotData(prev => ({ ...prev, stopLoss: e.target.value }))}
                    min="0.5"
                    max="10"
                    step="0.5"
                    data-testid="input-stop-loss"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="take-profit">Take Profit (%)</Label>
                  <Input
                    id="take-profit"
                    type="number"
                    value={botData.takeProfit}
                    onChange={(e) => setBotData(prev => ({ ...prev, takeProfit: e.target.value }))}
                    min="1"
                    max="20"
                    step="0.5"
                    data-testid="input-take-profit"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="daily-loss">Daily Loss Limit ($)</Label>
                <Input
                  id="daily-loss"
                  type="number"
                  value={botData.dailyLossLimit}
                  onChange={(e) => setBotData(prev => ({ ...prev, dailyLossLimit: e.target.value }))}
                  min="100"
                  max="10000"
                  step="100"
                  data-testid="input-daily-loss"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Kill Switch Enabled</span>
                </div>
                <Badge variant="default">Default On</Badge>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onClose : handleBack}
          >
            {currentStep === 1 ? 'Cancel' : (
              <>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </>
            )}
          </Button>
          
          {currentStep < 3 ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Check className="w-4 h-4 mr-1" />
              Start in Paper Mode
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
