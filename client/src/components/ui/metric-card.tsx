import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: {
    value: number;
    label?: string;
    isPositive?: boolean;
  };
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
  loading?: boolean;
  className?: string;
}

export function MetricCard({
  label,
  value,
  delta,
  icon,
  trend,
  size = 'md',
  variant = 'default',
  loading = false,
  className
}: MetricCardProps) {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const textSizes = {
    sm: { value: 'text-lg', label: 'text-xs' },
    md: { value: 'text-2xl', label: 'text-sm' },
    lg: { value: 'text-3xl', label: 'text-base' }
  };

  const getTrendIcon = () => {
    if (delta) {
      if (delta.value > 0) return <TrendingUp className="h-3 w-3" />;
      if (delta.value < 0) return <TrendingDown className="h-3 w-3" />;
      return <Minus className="h-3 w-3" />;
    }
    
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3" />;
      case 'down': return <TrendingDown className="h-3 w-3" />;
      default: return null;
    }
  };

  const getTrendColor = () => {
    if (delta) {
      if (delta.isPositive === undefined) {
        return delta.value >= 0 ? 'status-positive' : 'status-negative';
      }
      return delta.isPositive ? 'status-positive' : 'status-negative';
    }
    
    switch (trend) {
      case 'up': return 'status-positive';
      case 'down': return 'status-negative';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <Card className={cn(className)}>
        <CardContent className={sizeClasses[size]}>
          <div className="space-y-2">
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-8 w-32" />
            <div className="skeleton h-3 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className={sizeClasses[size]}>
        {variant === 'compact' ? (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className={cn("text-gray-600 font-medium", textSizes[size].label)}>
                {label}
              </p>
              <p className={cn("font-bold text-foreground tabular-nums", textSizes[size].value)}>
                {value}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-1">
              {icon && <div className="text-gray-400">{icon}</div>}
              {(delta || trend) && (
                <div className={cn("flex items-center space-x-1 text-xs", getTrendColor())}>
                  {getTrendIcon()}
                  {delta && (
                    <span className="tabular-nums">
                      {delta.value > 0 ? '+' : ''}{delta.value.toFixed(1)}%
                      {delta.label && ` ${delta.label}`}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className={cn("text-gray-600 font-medium", textSizes[size].label)}>
                {label}
              </p>
              {icon && <div className="text-gray-400">{icon}</div>}
            </div>
            <p className={cn("font-bold text-foreground tabular-nums", textSizes[size].value)}>
              {value}
            </p>
            {(delta || trend) && (
              <div className={cn("flex items-center space-x-1 text-sm", getTrendColor())}>
                {getTrendIcon()}
                {delta && (
                  <span className="tabular-nums">
                    {delta.value > 0 ? '+' : ''}{delta.value.toFixed(1)}%
                    {delta.label && ` ${delta.label}`}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MetricGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 space-grid-md",
      className
    )}>
      {children}
    </div>
  );
}