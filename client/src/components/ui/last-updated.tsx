import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LastUpdatedProps {
  timestamp: Date;
  className?: string;
  showIcon?: boolean;
}

export function LastUpdated({ timestamp, className, showIcon = true }: LastUpdatedProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short'
    }).format(date);
  };

  return (
    <div className={cn(
      "flex items-center gap-1 text-sm text-gray-500",
      className
    )}>
      {showIcon && <Clock className="h-3 w-3" />}
      <span>Last updated: {formatTime(timestamp)}</span>
    </div>
  );
}