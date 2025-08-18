import React from 'react';
import { AlertTriangle, Ban, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useKillSwitch } from '@/hooks/useKillSwitch';
import { cn } from '@/lib/utils';

interface KillSwitchBannerProps {
  className?: string;
}

export default function KillSwitchBanner({ className }: KillSwitchBannerProps) {
  const { killSwitchState } = useKillSwitch();

  if (!killSwitchState?.active) {
    return null;
  }

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const scopeColor = killSwitchState.scope === 'global' ? 'red' : 'orange';
  const profileText = killSwitchState.profile === 'hard' ? 'Hard Halt (orders cancelled)' : 'Soft Halt (new orders blocked)';

  return (
    <div className={cn(
      "border-l-4 p-3 sm:p-4 mb-4 sm:mb-6 rounded-r-lg",
      killSwitchState.scope === 'global' 
        ? "bg-red-50 border-red-400" 
        : "bg-orange-50 border-orange-400",
      className
    )}>
      <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-3">
        <div className="flex-shrink-0">
          {killSwitchState.scope === 'global' ? (
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
          ) : (
            <Ban className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col space-y-2 sm:space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
              <div className="space-y-1">
                <h3 className={cn(
                  "text-base sm:text-lg font-semibold",
                  killSwitchState.scope === 'global' ? "text-red-800" : "text-orange-800"
                )}>
                  Trading Halted - {killSwitchState.scope === 'global' ? 'ALL TENANTS' : 'Current Tenant'}
                </h3>
              
                <div className="space-y-1 text-sm">
                  <p className={cn(
                    "font-medium",
                    killSwitchState.scope === 'global' ? "text-red-700" : "text-orange-700"
                  )}>
                    {profileText} • Activated by {killSwitchState.by}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span className={cn(
                        killSwitchState.scope === 'global' ? "text-red-600" : "text-orange-600"
                      )}>
                        {formatTime(killSwitchState.at)}
                      </span>
                    </div>
                  </div>
                  
                  {killSwitchState.reason && (
                    <p className={cn(
                      "text-xs mt-2 font-medium",
                      killSwitchState.scope === 'global' ? "text-red-700" : "text-orange-700"
                    )}>
                      Reason: {killSwitchState.reason}
                    </p>
                  )}
                </div>
              </div>
            
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "text-xs border-2 w-full sm:w-auto",
                    killSwitchState.scope === 'global' 
                      ? "border-red-300 text-red-700 hover:bg-red-50" 
                      : "border-orange-300 text-orange-700 hover:bg-orange-50"
                  )}
                  onClick={() => window.open('/help/kill-switch', '_blank')}
                  data-testid="button-kill-switch-help"
                >
                  Help
                </Button>
              </div>
            </div>
          </div>
          
          {killSwitchState.filters && (
            <div className="mt-2 text-xs">
              {killSwitchState.filters.exchanges && (
                <p className={cn(
                  killSwitchState.scope === 'global' ? "text-red-600" : "text-orange-600"
                )}>
                  Exchanges: {killSwitchState.filters.exchanges.join(', ')}
                </p>
              )}
              {killSwitchState.filters.tags && (
                <p className={cn(
                  killSwitchState.scope === 'global' ? "text-red-600" : "text-orange-600"
                )}>
                  Tags: {killSwitchState.filters.tags.join(', ')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}