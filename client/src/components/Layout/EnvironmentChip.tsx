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
import { ChevronDown, TestTube, FileText, DollarSign, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EnvironmentChip() {
  const { environment, setEnvironment } = useEnvironment();
  const [showLiveWarning, setShowLiveWarning] = useState(false);
  const [showDemoToLiveWarning, setShowDemoToLiveWarning] = useState(false);

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
    setEnvironment('Live');
    setShowLiveWarning(false);
    setShowDemoToLiveWarning(false);
  };

  const getEnvironmentConfig = () => {
    switch (environment) {
      case 'Demo':
        return {
          label: 'Demo',
          icon: TestTube,
          className: 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300',
          description: 'Simulated data for testing'
        };
      case 'Paper':
        return {
          label: 'Paper',
          icon: FileText,
          className: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300',
          description: 'Real connections, virtual money'
        };
      case 'Live':
        return {
          label: 'Live',
          icon: DollarSign,
          className: 'bg-red-100 text-red-700 hover:bg-red-200 border-red-300',
          description: 'Real money trading'
        };
      default:
        return {
          label: 'Demo',
          icon: TestTube,
          className: 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300',
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
    <AlertDialog open={showDemoToLiveWarning} onOpenChange={setShowDemoToLiveWarning}>
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
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => {
              setEnvironment('Paper');
              setShowDemoToLiveWarning(false);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Switch to Paper Trading
          </AlertDialogAction>
          <AlertDialogAction 
            onClick={confirmLiveMode}
            className="bg-red-600 hover:bg-red-700"
          >
            Continue to Live
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Standard Live Mode Warning Dialog */}
    <AlertDialog open={showLiveWarning} onOpenChange={setShowLiveWarning}>
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
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmLiveMode}
            className="bg-red-600 hover:bg-red-700"
          >
            I Understand, Switch to Live
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}