import React, { useState } from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, TestTube, FileText, DollarSign, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EnvironmentChip() {
  const { environment, setEnvironment } = useEnvironment();
  const [showLiveWarning, setShowLiveWarning] = useState(false);
  const [showDemoToLiveWarning, setShowDemoToLiveWarning] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  const handleEnvironmentChange = (newEnvironment: 'Demo' | 'Paper' | 'Live') => {
    if (newEnvironment === 'Live' && environment === 'Demo') {
      // Show special warning when going from Demo to Live
      setShowDemoToLiveWarning(true);
    } else if (newEnvironment === 'Live' && environment !== 'Live') {
      // Show standard warning for Live mode
      setShowLiveWarning(true);
    } else {
      // Direct switch for Demo and Paper modes
      setEnvironment(newEnvironment);
    }
  };

  const confirmLiveMode = () => {
    if (confirmationText.toUpperCase() === 'LIVE') {
      setEnvironment('Live');
      setShowLiveWarning(false);
      setShowDemoToLiveWarning(false);
      setConfirmationText('');
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setConfirmationText('');
      setShowLiveWarning(false);
      setShowDemoToLiveWarning(false);
    }
  };

  const isConfirmationValid = confirmationText.toUpperCase() === 'LIVE';

  const getEnvironmentConfig = () => {
    switch (environment) {
      case 'Demo':
        return {
          label: 'Demo',
          icon: TestTube,
          className: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300', // Neutral for demo
          description: 'Simulated data for testing'
        };
      case 'Paper':
        return {
          label: 'Paper',
          icon: FileText,
          className: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200', // Lighter blue
          description: 'Real connections, virtual money'
        };
      case 'Live':
        return {
          label: 'Live',
          icon: DollarSign,
          className: 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200', // Lighter red
          description: 'Real money trading'
        };
      default:
        return {
          label: 'Demo',
          icon: TestTube,
          className: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300',
          description: 'Simulated data for testing'
        };
    }
  };

  const config = getEnvironmentConfig();
  const Icon = config.icon;

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
            config.className
          )}
          data-testid="button-environment-selector"
        >
          <Icon className="h-3.5 w-3.5" />
          <span>{config.label}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => handleEnvironmentChange('Demo')}
          className={cn(
            "flex items-start gap-3 cursor-pointer",
            environment === 'Demo' && "bg-accent"
          )}
          data-testid="menu-item-demo"
        >
          <TestTube className="h-4 w-4 mt-0.5 text-purple-600" />
          <div className="flex-1">
            <div className="font-medium">Demo Mode</div>
            <div className="text-xs text-muted-foreground">
              Simulated data for testing
            </div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleEnvironmentChange('Paper')}
          className={cn(
            "flex items-start gap-3 cursor-pointer",
            environment === 'Paper' && "bg-accent"
          )}
          data-testid="menu-item-paper"
        >
          <FileText className="h-4 w-4 mt-0.5 text-blue-600" />
          <div className="flex-1">
            <div className="font-medium">Paper Trading</div>
            <div className="text-xs text-muted-foreground">
              Real connections, virtual money
            </div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleEnvironmentChange('Live')}
          className={cn(
            "flex items-start gap-3 cursor-pointer",
            environment === 'Live' && "bg-accent"
          )}
          data-testid="menu-item-live"
        >
          <DollarSign className="h-4 w-4 mt-0.5 text-red-600" />
          <div className="flex-1">
            <div className="font-medium">Live Trading</div>
            <div className="text-xs text-muted-foreground">
              Real money trading - Use with caution
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    {/* Demo to Live Warning Dialog */}
    <AlertDialog open={showDemoToLiveWarning} onOpenChange={handleDialogClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Skip Paper Trading?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              You are switching directly from <strong>Demo Mode</strong> to <strong>Live Trading</strong>.
            </p>
            <p className="text-orange-600 font-medium">
              We strongly recommend testing your strategies in Paper Trading mode first.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-900">Paper Trading allows you to:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-blue-800 mt-2">
                <li>Test with real market connections</li>
                <li>Validate your strategies without risk</li>
                <li>Practice with virtual money</li>
                <li>Ensure everything works before risking real funds</li>
              </ul>
            </div>
            <p className="font-medium">
              Do you want to switch to Paper Trading first, or continue to Live Trading?
            </p>
            
            {/* Confirmation Input for Live Mode */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <Label htmlFor="live-confirmation" className="text-sm font-medium text-red-900">
                To continue to Live Trading, type "LIVE" below:
              </Label>
              <Input
                id="live-confirmation"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Type LIVE to confirm"
                className="mt-2 border-red-300 focus:border-red-500"
                data-testid="input-live-confirmation"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => {
              setEnvironment('Paper');
              setShowDemoToLiveWarning(false);
              setConfirmationText('');
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Switch to Paper Trading
          </AlertDialogAction>
          <AlertDialogAction 
            onClick={confirmLiveMode}
            disabled={!isConfirmationValid}
            className={cn(
              "bg-red-600 hover:bg-red-700",
              !isConfirmationValid && "opacity-50 cursor-not-allowed"
            )}
          >
            Continue to Live
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Standard Live Mode Warning Dialog */}
    <AlertDialog open={showLiveWarning} onOpenChange={handleDialogClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Switch to Live Trading Mode?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              You are about to switch to <strong>Live Trading Mode</strong>. This means:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li className="text-red-600 font-medium">Real money will be at risk</li>
              <li>All trades will be executed on live markets</li>
              <li>Trading fees and commissions will apply</li>
              <li>Losses are permanent and cannot be reversed</li>
            </ul>
            <p className="font-medium">
              Please confirm that you understand the risks and want to proceed with live trading.
            </p>
            
            {/* Confirmation Input */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <Label htmlFor="live-confirmation-standard" className="text-sm font-medium text-red-900">
                To confirm, type "LIVE" below:
              </Label>
              <Input
                id="live-confirmation-standard"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Type LIVE to confirm"
                className="mt-2 border-red-300 focus:border-red-500"
                data-testid="input-live-confirmation-standard"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmLiveMode}
            disabled={!isConfirmationValid}
            className={cn(
              "bg-red-600 hover:bg-red-700",
              !isConfirmationValid && "opacity-50 cursor-not-allowed"
            )}
          >
            I Understand, Switch to Live
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}