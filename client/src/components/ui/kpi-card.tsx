import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  delta?: {
    value: number;
    period: string; // e.g., "vs yesterday", "vs last week"
    isPositive?: boolean;
  };
  icon?: React.ReactNode;
  formatter?: (value: string | number) => string;
  className?: string;
  loading?: boolean;
}

export function KPICard({ 
  title, 
  value, 
  delta, 
  icon, 
  formatter = (v) => String(v),
  className,
  loading = false
}: KPICardProps) {
  const formatDelta = (deltaValue: number) => {
    const sign = deltaValue >= 0 ? '+' : '';
    return `${sign}${deltaValue.toFixed(1)}%`;
  };

  const getDeltaIcon = () => {
    if (!delta) return null;
    
    if (delta.value > 0) {
      return <TrendingUp className="h-3 w-3" />;
    } else if (delta.value < 0) {
      return <TrendingDown className="h-3 w-3" />;
    } else {
      return <Minus className="h-3 w-3" />;
    }
  };

  const getDeltaColor = () => {
    if (!delta) return '';
    
    if (delta.isPositive === undefined) {
      // Default behavior: positive is green, negative is red
      return delta.value >= 0 ? 'status-positive' : 'status-negative';
    } else {
      // Explicit positive/negative indicator (for cases where lower is better)
      return delta.isPositive ? 'status-positive' : 'status-negative';
    }
  };

  if (loading) {
    return (
      <Card className={cn("p-grid-md", className)}>
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="skeleton h-4 w-20 mb-2" />
              <div className="skeleton h-8 w-32 mb-1" />
              <div className="skeleton h-3 w-24" />
            </div>
            {icon && (
              <div className="skeleton h-8 w-8 rounded" />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("p-4 sm:p-6 hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600 mb-2" data-testid="kpi-title">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums mb-2 truncate" data-testid="kpi-value">
              {formatter(value)}
            </p>
            {delta && (
              <div className={cn(
                "flex items-center gap-1 text-sm",
                getDeltaColor()
              )} data-testid="kpi-delta">
                {getDeltaIcon()}
                <span className="tabular-nums truncate">
                  {formatDelta(delta.value)} {delta.period}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className="text-gray-400 flex-shrink-0 ml-3" data-testid="kpi-icon">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function KPICardGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6",
      className
    )}>
      {children}
    </div>
  );
}