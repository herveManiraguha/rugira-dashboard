import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'kpi' | 'chart';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer';
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'shimmer',
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    kpi: 'h-24 rounded-xl',
    chart: 'h-64 rounded-xl',
  };

  const animationStyles = {
    pulse: 'animate-pulse bg-gray-200',
    shimmer: 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={{
        width: width || '100%',
        height: height || undefined,
      }}
      {...props}
    />
  );
}

export function KPISkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-card p-6">
      <Skeleton variant="text" className="mb-2 h-3 w-24" />
      <Skeleton variant="text" className="mb-1 h-8 w-32" />
      <Skeleton variant="text" className="h-3 w-20" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton variant="text" className="h-5 w-32" />
        <Skeleton variant="rectangular" className="h-8 w-24" />
      </div>
      <Skeleton variant="chart" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-card">
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="text" className="h-4 w-24" />
          ))}
        </div>
      </div>
      <div className="p-4">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="mb-3 flex gap-4">
            {[...Array(4)].map((_, j) => (
              <Skeleton key={j} variant="text" className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}