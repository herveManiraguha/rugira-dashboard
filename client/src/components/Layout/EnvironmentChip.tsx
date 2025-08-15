import React, { useState, useEffect } from 'react';
import { Check, Lock, Settings, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useDemoMode } from '@/contexts/DemoContext';

export type Environment = 'Paper' | 'Live';

interface EnvironmentChipProps {
  environment: Environment;
  onEnvironmentChange: (env: Environment) => void;
  className?: string;
}

export default function EnvironmentChip({ 
  environment, 
  onEnvironmentChange, 
  className 
}: EnvironmentChipProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isDemoMode } = useDemoMode();

  // Pulse animation state for Live mode
  const [shouldPulse, setShouldPulse] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (environment === 'Live' && !prefersReducedMotion) {
      const interval = setInterval(() => {
        setShouldPulse(true);
        setTimeout(() => setShouldPulse(false), 300);
      }, 3500);

      return () => clearInterval(interval);
    }
  }, [environment]);

  const handleEnvironmentSelect = (newEnv: Environment) => {
    setIsMenuOpen(false);
    
    if (newEnv === environment) return;
    
    if (newEnv === 'Live') {
      if (isDemoMode) {
        toast({
          title: "Not available in demo",
          description: "Live trading is disabled in demo mode.",
          variant: "destructive"
        });
        return;
      }
      
      setIsConfirmOpen(true);
      setConfirmText('');
    } else {
      onEnvironmentChange(newEnv);
      toast({
        title: "Switched to Paper Trading",
        description: "Orders will be simulated only.",
      });
    }
  };

  const handleConfirmLive = async () => {
    if (confirmText !== 'LIVE') return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onEnvironmentChange('Live');
      setIsConfirmOpen(false);
      setConfirmText('');
      
      toast({
        title: "Switched to Live • Kill Switch ready",
        description: "Real orders will now be placed on exchanges.",
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Failed to switch to Live",
        description: "Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getChipStyle = () => {
    if (environment === 'Live') {
      return "bg-red-50 border-red-200 text-red-800 hover:bg-red-100";
    }
    return "bg-sky-50 border-sky-200 text-slate-700 hover:bg-sky-100";
  };

  const getDotStyle = () => {
    const baseStyle = "w-2 h-2 rounded-full flex-shrink-0 transition-all duration-200";
    
    if (environment === 'Live') {
      return cn(
        baseStyle,
        "bg-red-500",
        shouldPulse && "animate-pulse scale-110"
      );
    }
    return cn(baseStyle, "bg-sky-500");
  };

  const getTooltipText = () => {
    if (isDemoMode && environment === 'Paper') {
      return "Demo mode - orders are simulated";
    }
    
    if (environment === 'Live') {
      return "Real environment. Orders are sent to real exchanges.";
    }
    return "Simulated environment. Orders are NOT sent to real exchanges.";
  };

  const getLabel = () => {
    if (environment === 'Live') {
      return "LIVE (Real)";
    }
    return "Paper (Simulated)";
  };

  return (
    <>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 px-3 rounded-full border transition-all duration-200 font-medium text-xs",
              "focus:ring-2 focus:ring-offset-1",
              getChipStyle(),
              className
            )}
            title={getTooltipText()}
            data-testid="environment-chip"
            disabled={isDemoMode && environment === 'Paper'}
          >
            <div className="flex items-center space-x-2">
              <div className={getDotStyle()} />
              <span className="tabular-nums">{getLabel()}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            onClick={() => handleEnvironmentSelect('Paper')}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-sky-500" />
              <span>Paper (Simulated)</span>
            </div>
            {environment === 'Paper' && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => handleEnvironmentSelect('Live')}
            className="flex items-center justify-between"
            disabled={isDemoMode}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>Live (Real)</span>
              {isDemoMode ? null : <Lock className="h-3 w-3 ml-1 text-gray-400" />}
            </div>
            {environment === 'Live' && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Manage environments…</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Live Environment Confirmation Modal */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>Switch to Live (Real funds)</span>
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-2">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  <span>Real orders will be placed on exchanges</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  <span>Check your account balances and API keys</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  <span>Kill Switch is available at any time</span>
                </div>
              </div>
              
              <div className="pt-2">
                <Label htmlFor="confirm-input" className="text-sm font-medium">
                  Type <span className="font-mono font-bold">LIVE</span> to confirm:
                </Label>
                <Input
                  id="confirm-input"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="LIVE"
                  className="mt-1 font-mono"
                  autoComplete="off"
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0">
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              className="flex items-center space-x-1"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Learn more</span>
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmLive}
                disabled={confirmText !== 'LIVE' || isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? "Switching..." : "Switch to Live"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}