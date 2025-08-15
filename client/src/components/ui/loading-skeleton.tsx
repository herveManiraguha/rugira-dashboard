import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
}

export function Skeleton({ 
  className, 
  width = '100%', 
  height = '20px', 
  variant = 'rectangular' 
}: SkeletonProps) {
  const baseClasses = "skeleton bg-gray-200 animate-pulse";
  
  const variantClasses = {
    text: "h-4 rounded",
    rectangular: "rounded",
    circular: "rounded-full"
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
      data-testid="skeleton"
    />
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="h-64 border rounded-lg p-6 flex items-end justify-between">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton
          key={i}
          width={20}
          height={Math.random() * 180 + 20}
          className="bg-gray-300"
        />
      ))}
    </div>
  );
}