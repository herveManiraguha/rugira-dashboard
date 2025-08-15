import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TimeRangeSelector, type TimeRange } from '@/components/ui/time-range-selector';
import { Download, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

interface DataPoint {
  timestamp: string;
  value: number;
  [key: string]: any;
}

interface ChartEvent {
  timestamp: string;
  type: 'start' | 'stop' | 'alert' | 'trade';
  label: string;
  color?: string;
}

interface EnhancedChartProps {
  title: string;
  data: DataPoint[];
  dataKeys: Array<{
    key: string;
    label: string;
    color: string;
  }>;
  events?: ChartEvent[];
  description?: string;
  allowExport?: boolean;
  timeRange?: TimeRange;
  onTimeRangeChange?: (range: any) => void;
  formatValue?: (value: number) => string;
  className?: string;
  loading?: boolean;
}

export function EnhancedChart({
  title,
  data,
  dataKeys,
  events = [],
  description,
  allowExport = true,
  timeRange = '24h',
  onTimeRangeChange,
  formatValue = (value) => value.toFixed(2),
  className,
  loading = false
}: EnhancedChartProps) {
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());

  const handleLegendClick = (dataKey: string) => {
    const newHidden = new Set(hiddenKeys);
    if (newHidden.has(dataKey)) {
      newHidden.delete(dataKey);
    } else {
      newHidden.add(dataKey);
    }
    setHiddenKeys(newHidden);
  };

  const handleExport = () => {
    // Export as CSV
    const headers = ['timestamp', ...dataKeys.map(k => k.key)];
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => row[header] || '').join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${timeRange}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">
            {new Date(label).toLocaleString()}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatValue(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="p-grid-md">
          <div className="flex items-center justify-between">
            <div className="skeleton h-6 w-32" />
            <div className="skeleton h-8 w-24" />
          </div>
        </CardHeader>
        <CardContent className="p-grid-md">
          <div className="h-64 skeleton rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="p-grid-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onTimeRangeChange && (
              <TimeRangeSelector
                value={timeRange}
                onChange={onTimeRangeChange}
              />
            )}
            {allowExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                data-testid="chart-export-button"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-grid-md">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={formatValue}
                stroke="#6b7280"
                fontSize={12}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend 
                onClick={(e: any) => e.dataKey && handleLegendClick(e.dataKey)}
                wrapperStyle={{ cursor: 'pointer' }}
              />
              
              {/* Event annotations */}
              {events.map((event, index) => (
                <ReferenceLine
                  key={index}
                  x={event.timestamp}
                  stroke={event.color || '#ff6b6b'}
                  strokeDasharray="2 2"
                  label={{ value: event.label, position: 'top' }}
                />
              ))}
              
              {/* Data lines */}
              {dataKeys.map((dataKey) => (
                <Line
                  key={dataKey.key}
                  type="monotone"
                  dataKey={dataKey.key}
                  stroke={dataKey.color}
                  strokeWidth={2}
                  dot={false}
                  hide={hiddenKeys.has(dataKey.key)}
                  name={dataKey.label}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend with toggle functionality */}
        <div className="flex flex-wrap gap-2 mt-4">
          {dataKeys.map((dataKey) => (
            <button
              key={dataKey.key}
              className={cn(
                "flex items-center gap-2 px-2 py-1 rounded text-sm transition-opacity",
                hiddenKeys.has(dataKey.key) ? "opacity-50" : "opacity-100"
              )}
              onClick={() => handleLegendClick(dataKey.key)}
              data-testid={`legend-${dataKey.key}`}
            >
              <div 
                className="w-3 h-3 rounded" 
                style={{ backgroundColor: dataKey.color }}
              />
              {dataKey.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}