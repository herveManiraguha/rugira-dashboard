import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  TrendingDown, 
  Bot, 
  CheckCircle, 
  Clock,
  DollarSign,
  Activity,
  AlertTriangle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface KPI {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  comparison: string;
  icon: string;
  type: 'currency' | 'percentage' | 'number' | 'time';
}

interface ActivityItem {
  id: string;
  type: 'online' | 'warning' | 'error';
  message: string;
  details: string;
  pnl: number;
  timestamp: string;
}

export default function Overview() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Fetch KPIs
  const { data: kpis, isLoading: kpisLoading } = useQuery<KPI[]>({
    queryKey: ['/api/kpis'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch activities
  const { data: activities, isLoading: activitiesLoading } = useQuery<ActivityItem[]>({
    queryKey: ['/api/activities'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch performance data for charts
  const { data: performanceData, isLoading: performanceLoading } = useQuery({
    queryKey: ['/api/performance'],
    refetchInterval: 30000,
  });

  // Setup SSE for real-time updates
  useEffect(() => {
    const eventSource = new EventSource('/api/stream');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'heartbeat' || data.type === 'update') {
        setLastUpdated(new Date());
      }
    };

    eventSource.onerror = () => {
      console.log('SSE connection lost, falling back to polling');
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const formatValue = (value: string | number, type: KPI['type']) => {
    switch (type) {
      case 'currency':
        return typeof value === 'number' ? 
          `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
          value;
      case 'percentage':
        return typeof value === 'number' ? `${value}%` : value;
      case 'time':
        return typeof value === 'number' ? `${value}ms` : value;
      default:
        return value;
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'chart-line':
        return <TrendingUp className="h-5 w-5" />;
      case 'robot':
        return <Bot className="h-5 w-5" />;
      case 'check-circle':
        return <CheckCircle className="h-5 w-5" />;
      case 'clock':
        return <Clock className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'online':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'warning':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-600">Trading performance and system status</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()} UTC
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpisLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          kpis?.map((kpi) => (
            <Card key={kpi.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-gray-600">
                    {getIcon(kpi.icon)}
                  </div>
                  {kpi.change && (
                    <Badge variant={kpi.change > 0 ? "default" : "destructive"} className="text-xs">
                      {kpi.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {Math.abs(kpi.change)}%
                    </Badge>
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{kpi.label}</h3>
                <p className="text-2xl font-bold text-gray-900">{formatValue(kpi.value, kpi.type)}</p>
                <div className="mt-2 text-xs text-gray-500">{kpi.comparison}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Equity Curve</CardTitle>
          </CardHeader>
          <CardContent>
            {performanceLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData?.equity || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Portfolio Value']}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#E10600" 
                      fill="#E10600" 
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily P&L</CardTitle>
          </CardHeader>
          <CardContent>
            {performanceLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData?.pnl || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [
                        `$${Number(value).toLocaleString()}`, 
                        'Daily P&L'
                      ]}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#E10600" 
                      strokeWidth={2}
                      dot={(props) => {
                        const { cx, cy, payload } = props;
                        const color = payload.value >= 0 ? '#10B981' : '#EF4444';
                        return <circle cx={cx} cy={cy} r={3} fill={color} />;
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trading Volume</CardTitle>
          </CardHeader>
          <CardContent>
            {performanceLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData?.trades || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hour" 
                      tickFormatter={(value) => `${value}:00`}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} trades`, 'Volume']}
                      labelFormatter={(value) => `Hour ${value}:00`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#1B7A46" 
                      strokeWidth={2}
                      dot={{ fill: '#1B7A46', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Live Trading Activity
            </CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-48 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities?.length ? (
            <div className="space-y-0 divide-y">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(activity.type)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.details}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      activity.pnl > 0 ? 'text-green-600' : activity.pnl < 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {activity.pnl > 0 ? '+' : ''}${activity.pnl.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <div className="text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No recent activity</p>
                <p className="text-sm text-gray-400">Trading activity will appear here in real-time</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}