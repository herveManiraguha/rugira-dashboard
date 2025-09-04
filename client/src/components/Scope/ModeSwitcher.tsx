import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Activity, TestTube, PlayCircle } from 'lucide-react';
import { useScope } from '@/contexts/ScopeContext';
import { TradingEnvironment } from '@/contexts/EnvironmentContext';
import { cn } from '@/lib/utils';

export function ModeSwitcher() {
  const { organization, portfolio, mode, setMode, getLiveSwitchSummary } = useScope();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState<TradingEnvironment | null>(null);

  const handleModeClick = (newMode: TradingEnvironment) => {
    if (newMode === 'Live' && mode !== 'Live') {
      // Show confirmation for Live mode
      setPendingMode(newMode);
      setConfirmDialogOpen(true);
    } else {
      // Switch instantly for Paper and Demo
      setMode(newMode, false);
    }
  };

  const handleConfirmLive = async () => {
    if (pendingMode === 'Live') {
      const success = await setMode('Live', false);
      if (success) {
        console.log('Audit: Live mode activated with confirmation');
      }
    }
    setConfirmDialogOpen(false);
    setPendingMode(null);
  };

  const handleCancel = () => {
    setConfirmDialogOpen(false);
    setPendingMode(null);
  };

  const summary = getLiveSwitchSummary();
  const canEnableLive = portfolio?.hasLiveEnabled && organization;

  return (
    <>
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
        <Button
          size="sm"
          variant={mode === 'Live' ? 'default' : 'ghost'}
          className={cn(
            "h-7 px-2 sm:px-3 rounded-md text-xs font-medium transition-all",
            mode === 'Live' 
              ? "bg-green-600 text-white hover:bg-green-700 shadow-sm" 
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
          )}
          onClick={() => handleModeClick('Live')}
          disabled={!canEnableLive}
          data-testid="mode-live"
        >
          <PlayCircle className="h-3.5 w-3.5 sm:mr-1" />
          <span className="hidden sm:inline">Live</span>
        </Button>
        
        <Button
          size="sm"
          variant={mode === 'Paper' ? 'default' : 'ghost'}
          className={cn(
            "h-7 px-2 sm:px-3 rounded-md text-xs font-medium transition-all mx-0.5",
            mode === 'Paper' 
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm" 
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
          )}
          onClick={() => handleModeClick('Paper')}
          data-testid="mode-paper"
        >
          <Activity className="h-3.5 w-3.5 sm:mr-1" />
          <span className="hidden sm:inline">Paper</span>
        </Button>
        
        <Button
          size="sm"
          variant={mode === 'Demo' ? 'default' : 'ghost'}
          className={cn(
            "h-7 px-2 sm:px-3 rounded-md text-xs font-medium transition-all",
            mode === 'Demo' 
              ? "bg-gray-600 text-white hover:bg-gray-700 shadow-sm" 
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
          )}
          onClick={() => handleModeClick('Demo')}
          data-testid="mode-demo"
        >
          <TestTube className="h-3.5 w-3.5 sm:mr-1" />
          <span className="hidden sm:inline">Demo</span>
        </Button>
      </div>

      {/* Live Mode Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Switch to Live trading?
            </DialogTitle>
            <DialogDescription className="pt-3 space-y-3">
              <p>
                You're switching to Live in <strong>{organization?.name}</strong> / <strong>{portfolio?.name}</strong>.
                Ensure pre‑trade limits and venue keys are configured.
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Venues connected:</span>
                  <span className="font-medium">{summary.venues.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pre-trade limits:</span>
                  <span className="font-medium">{summary.limits}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Risk shields:</span>
                  <Badge variant={summary.riskShields ? 'success' : 'secondary'} className="h-5">
                    <Shield className="h-3 w-3 mr-1" />
                    {summary.riskShields ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleConfirmLive}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}