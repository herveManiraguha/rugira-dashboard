import React from 'react';
import { cn } from '@/lib/utils';

interface LiveIndicatorProps {
  isConnected: boolean;
  className?: string;
}

export function LiveIndicator({ isConnected, className }: LiveIndicatorProps) {
  return (
    <div className={cn("live-indicator text-sm", className)}>
      {isConnected ? (
        <>
          <div className="live-dot" />
          <span className="text-green-600 font-medium">Live</span>
        </>
      ) : (
        <>
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <span className="text-orange-600 font-medium">Reconnecting...</span>
        </>
      )}
    </div>
  );
}