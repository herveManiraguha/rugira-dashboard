import React from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, TestTube, FileText, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EnvironmentChip() {
  const { environment, setEnvironment } = useEnvironment();

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
          onClick={() => setEnvironment('Demo')}
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
          onClick={() => setEnvironment('Paper')}
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
          onClick={() => setEnvironment('Live')}
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
  );
}