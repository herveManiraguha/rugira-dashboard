import React, { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  Cloud, 
  Activity, 
  Database, 
  Server,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Cpu,
  HardDrive,
  MemoryStick,
  Zap
} from 'lucide-react';

interface HealthData {
  status: string;
  timestamp: string;
  uptime: number;
  version: string;
  infrastructure?: {
    region: string;
    ecs?: {
      running_tasks: number;
      desired_tasks: number;
      status: string;
    };
    database?: {
      status: string;
      connections: {
        current: number;
        max: number;
        utilization: string;
      };
      performance: {
        cpu_utilization: string;
        memory_utilization: string;
      };
    };
    load_balancer?: {
      target_health: {
        healthy: number;
        unhealthy: number;
      };
      metrics: {
        response_time_ms: number;
        error_rate: string;
      };
    };
    cache?: {
      status: string;
      metrics: {
        utilization: string;
        hit_rate: string;
      };
    };
    monitoring?: {
      alarms: {
        ok: number;
        alarm: number;
      };
    };
  };
  trading_engine?: {
    status: string;
    active_bots: number;
    success_rate: string;
  };
  exchanges?: {
    connected: number;
    total: number;
  };
  system?: {
    cpu: {
      usage_percent: number;
    };
    memory: {
      usage_percent: number;
    };
    disk: {
      usage_percent: number;
    };
  };
  issues?: string[];
}

export default function HealthStatus() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date>(new Date());

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealthData(data);
      setLastFetch(new Date());
    } catch (error) {
      console.error('Failed to fetch health status:', error);
      setHealthData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'operational':
      case 'available':
      case 'running':
      case 'ok':
        return 'text-green-500';
      case 'degraded':
      case 'warning':
        return 'text-amber-500';
      case 'unhealthy':
      case 'error':
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'operational':
      case 'available':
      case 'running':
      case 'ok':
        return <CheckCircle className="h-4 w-4" />;
      case 'degraded':
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'unhealthy':
      case 'error':
      case 'down':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <RefreshCw className="h-4 w-4 animate-spin" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Checking system status...</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const overallStatus = healthData?.status || 'unknown';
  const statusColor = getStatusColor(overallStatus);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 relative"
              onClick={() => setDetailsOpen(true)}
            >
              <Cloud className={cn("h-4 w-4", statusColor)} />
              {healthData?.issues && healthData.issues.length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="font-semibold">AWS Status: {overallStatus}</p>
              {healthData?.infrastructure?.region && (
                <p className="text-xs">Region: {healthData.infrastructure.region}</p>
              )}
              {healthData?.uptime && (
                <p className="text-xs">Uptime: {formatUptime(healthData.uptime)}</p>
              )}
              <p className="text-xs text-gray-400">Click for details</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>System Health Status</span>
              <div className="flex items-center gap-2">
                <Badge variant={overallStatus === 'healthy' ? 'default' : 'destructive'}>
                  {overallStatus.toUpperCase()}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    fetchHealth();
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>
              Last updated: {lastFetch.toLocaleTimeString()} | Version: {healthData?.version || 'N/A'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Issues Alert */}
            {healthData?.issues && healthData.issues.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900">Active Issues</p>
                    <ul className="mt-1 space-y-1">
                      {healthData.issues.map((issue, idx) => (
                        <li key={idx} className="text-sm text-amber-700">• {issue}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Infrastructure Status */}
            {healthData?.infrastructure && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  AWS Infrastructure
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* ECS Status */}
                  {healthData.infrastructure.ecs && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">ECS Tasks</span>
                        <span className={cn("text-sm flex items-center gap-1", 
                          getStatusColor(healthData.infrastructure.ecs.status))}>
                          {getStatusIcon(healthData.infrastructure.ecs.status)}
                          {healthData.infrastructure.ecs.running_tasks}/{healthData.infrastructure.ecs.desired_tasks}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Database Status */}
                  {healthData.infrastructure.database && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Database</span>
                        <span className={cn("text-sm flex items-center gap-1",
                          getStatusColor(healthData.infrastructure.database.status))}>
                          {getStatusIcon(healthData.infrastructure.database.status)}
                          {healthData.infrastructure.database.status}
                        </span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Connections:</span>
                          <span>{healthData.infrastructure.database.connections.current}/{healthData.infrastructure.database.connections.max}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CPU:</span>
                          <span>{healthData.infrastructure.database.performance.cpu_utilization}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Load Balancer */}
                  {healthData.infrastructure.load_balancer && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Load Balancer</span>
                        <span className={cn("text-sm flex items-center gap-1",
                          healthData.infrastructure.load_balancer.target_health.unhealthy > 0 ? 'text-amber-500' : 'text-green-500')}>
                          {healthData.infrastructure.load_balancer.target_health.unhealthy > 0 ? 
                            <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          {healthData.infrastructure.load_balancer.target_health.healthy} healthy
                        </span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Response Time:</span>
                          <span>{healthData.infrastructure.load_balancer.metrics.response_time_ms}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Error Rate:</span>
                          <span>{healthData.infrastructure.load_balancer.metrics.error_rate}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cache */}
                  {healthData.infrastructure.cache && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Redis Cache</span>
                        <span className={cn("text-sm flex items-center gap-1",
                          getStatusColor(healthData.infrastructure.cache.status))}>
                          {getStatusIcon(healthData.infrastructure.cache.status)}
                          {healthData.infrastructure.cache.status}
                        </span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Hit Rate:</span>
                          <span>{healthData.infrastructure.cache.metrics.hit_rate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Memory:</span>
                          <span>{healthData.infrastructure.cache.metrics.utilization}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* System Resources */}
            {healthData?.system && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  System Resources
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">CPU Usage</span>
                      <span className="text-sm font-medium">{healthData.system.cpu.usage_percent}%</span>
                    </div>
                    <Progress value={healthData.system.cpu.usage_percent} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Memory Usage</span>
                      <span className="text-sm font-medium">{healthData.system.memory.usage_percent}%</span>
                    </div>
                    <Progress value={healthData.system.memory.usage_percent} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Disk Usage</span>
                      <span className="text-sm font-medium">{healthData.system.disk.usage_percent}%</span>
                    </div>
                    <Progress value={healthData.system.disk.usage_percent} className="h-2" />
                  </div>
                </div>
              </Card>
            )}

            {/* Trading Engine Status */}
            {healthData?.trading_engine && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Trading Engine
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={cn("font-medium flex items-center gap-1",
                      getStatusColor(healthData.trading_engine.status))}>
                      {getStatusIcon(healthData.trading_engine.status)}
                      {healthData.trading_engine.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Bots</p>
                    <p className="font-medium">{healthData.trading_engine.active_bots}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Success Rate</p>
                    <p className="font-medium">{healthData.trading_engine.success_rate}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Exchange Connections */}
            {healthData?.exchanges && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Exchange Connections
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Connected Exchanges</span>
                  <span className="font-medium">
                    {healthData.exchanges.connected}/{healthData.exchanges.total}
                  </span>
                </div>
              </Card>
            )}

            {/* CloudWatch Alarms */}
            {healthData?.infrastructure?.monitoring && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Monitoring
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">CloudWatch Alarms</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600">
                      {healthData.infrastructure.monitoring.alarms.ok} OK
                    </Badge>
                    {healthData.infrastructure.monitoring.alarms.alarm > 0 && (
                      <Badge variant="destructive">
                        {healthData.infrastructure.monitoring.alarms.alarm} Active
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}