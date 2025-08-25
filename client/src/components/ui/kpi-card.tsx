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
  sparklineData?: number[];
}

export function KPICard({ 
  title, 
  value, 
  delta, 
  icon, 
  formatter = (v) => String(v),
  className,
  loading = false,
  sparklineData
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

  // Generate SVG sparkline path
  const generateSparklinePath = (data: number[]) => {
    if (!data || data.length < 2) return '';
    
    const width = 120;
    const height = 40;
    const padding = 2;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((val, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = padding + ((max - val) / range) * (height - padding * 2);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <Card className={cn("relative overflow-hidden group hover:shadow-md transition-all duration-160", className)}>
      {/* Sparkline background */}
      {sparklineData && sparklineData.length > 1 && (
        <div className="absolute inset-0 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity">
          <svg 
            className="absolute right-0 top-1/2 -translate-y-1/2" 
            width="120" 
            height="40"
            viewBox="0 0 120 40"
            preserveAspectRatio="none"
          >
            <path
              d={generateSparklinePath(sparklineData)}
              fill="none"
              stroke={delta && delta.value >= 0 ? '#1B7A46' : '#E10600'}
              strokeWidth="2"
              opacity="0.5"
            />
          </svg>
        </div>
      )}
      
      <CardContent className="p-5 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5" data-testid="kpi-title">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl font-semibold text-gray-900 tabular-nums mb-1.5 truncate" data-testid="kpi-value">
              {formatter(value)}
            </p>
            {delta && (
              <div className={cn(
                "flex items-center gap-1 text-xs",
                getDeltaColor()
              )} data-testid="kpi-delta">
                {getDeltaIcon()}
                <span className="tabular-nums font-medium">
                  {formatDelta(delta.value)}
                </span>
                <span className="text-gray-500 font-normal">
                  {delta.period}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className="text-gray-300 flex-shrink-0 ml-3 opacity-50" data-testid="kpi-icon">
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