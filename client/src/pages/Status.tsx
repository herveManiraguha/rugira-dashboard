import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  Server,
  Wifi,
  Database,
  Zap,
} from 'lucide-react';

interface ServiceStatus {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
  description: string;
  icon: React.ElementType;
  uptime: string;
  responseTime?: string;
  lastChecked: string;
}

interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  startedAt: string;
  updates: {
    timestamp: string;
    message: string;
    status: string;
  }[];
}

interface SystemMetrics {
  overallStatus: 'operational' | 'degraded' | 'major_outage';
  overallUptime: string;
  incidentCount24h: number;
  avgResponseTime: string;
}

export default function Status() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Mock data - in real app this would fetch from monitoring/logging APIs
  const fetchStatusData = async () => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock services status
    const mockServices: ServiceStatus[] = [
      {
        id: 'api-gateway',
        name: 'API Gateway',
        status: 'operational',
        description: 'Main API endpoints and authentication',
        icon: Server,
        uptime: '99.98%',
        responseTime: '45ms',
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'trading-engine',
        name: 'Trading Engine',
        status: 'operational',
        description: 'Order processing and execution',
        icon: Zap,
        uptime: '99.95%',
        responseTime: '12ms',
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'market-data',
        name: 'Market Data Feed',
        status: 'degraded',
        description: 'Real-time market data and pricing',
        icon: Activity,
        uptime: '99.89%',
        responseTime: '180ms',
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'database',
        name: 'Database Cluster',
        status: 'operational',
        description: 'Primary and replica databases',
        icon: Database,
        uptime: '99.99%',
        responseTime: '8ms',
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'websocket',
        name: 'WebSocket Connections',
        status: 'operational',
        description: 'Real-time notifications and updates',
        icon: Wifi,
        uptime: '99.92%',
        lastChecked: new Date().toISOString(),
      },
    ];

    // Mock incidents
    const mockIncidents: Incident[] = [
      {
        id: 'inc-2025-001',
        title: 'Intermittent API Response Delays',
        status: 'monitoring',
        severity: 'minor',
        startedAt: '2025-09-12T16:30:00Z',
        updates: [
          {
            timestamp: '2025-09-12T17:15:00Z',
            message: 'We have implemented a fix and are monitoring the situation. Response times are returning to normal.',
            status: 'monitoring'
          },
          {
            timestamp: '2025-09-12T16:45:00Z',
            message: 'We have identified the cause as a database query optimization issue and are deploying a fix.',
            status: 'identified'
          },
          {
            timestamp: '2025-09-12T16:30:00Z',
            message: 'We are investigating reports of increased API response times across some endpoints.',
            status: 'investigating'
          }
        ]
      }
    ];

    // Mock overall metrics
    const mockMetrics: SystemMetrics = {
      overallStatus: 'degraded',
      overallUptime: '99.94%',
      incidentCount24h: 1,
      avgResponseTime: '65ms'
    };

    setServices(mockServices);
    setIncidents(mockIncidents);
    setMetrics(mockMetrics);
    setIsLoading(false);
    setLastRefresh(new Date());
  };

  useEffect(() => {
    fetchStatusData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatusData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-amber-600 bg-amber-100';
      case 'partial_outage':
        return 'text-orange-600 bg-orange-100';
      case 'major_outage':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'partial_outage':
      case 'major_outage':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor':
        return 'text-amber-600 bg-amber-100';
      case 'major':
        return 'text-orange-600 bg-orange-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-3" data-testid="status-page">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Status</h1>
          <p className="text-gray-600 mt-1">
            Real-time status of all Rugira trading systems and services
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStatusData}
            disabled={isLoading}
            data-testid="button-refresh-status"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      {metrics && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(metrics.overallStatus)}
                  Overall Status
                </CardTitle>
                <CardDescription>
                  All systems {metrics.overallStatus === 'operational' ? 'operational' : 'experiencing issues'}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(metrics.overallStatus)}>
                {metrics.overallStatus.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{metrics.overallUptime}</div>
                <div className="text-sm text-gray-500">Uptime (30 days)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{metrics.avgResponseTime}</div>
                <div className="text-sm text-gray-500">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{metrics.incidentCount24h}</div>
                <div className="text-sm text-gray-500">Incidents (24h)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
          <CardDescription>
            Individual status of all trading platform services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={service.id}>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {service.responseTime && (
                        <div className="text-sm text-gray-500">
                          {service.responseTime}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        {service.uptime}
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  {index < services.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Incidents */}
      {incidents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Active Incidents
            </CardTitle>
            <CardDescription>
              Current incidents affecting system performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {incidents.map((incident) => (
                <div key={incident.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{incident.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <Badge variant="outline">
                        {incident.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {incident.updates.map((update, index) => (
                      <div key={index} className="flex gap-3 text-sm">
                        <div className="text-gray-500 font-mono">
                          {new Date(update.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="flex-1">{update.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historical Uptime */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Uptime</CardTitle>
          <CardDescription>
            Service availability over the past 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-500 mb-4">
              Each bar represents one day. Green = 100% uptime, Yellow = 99-99.9%, Red = &lt;99%
            </div>
            
            {/* Simple uptime visualization */}
            <div className="grid grid-cols-30 gap-1">
              {Array.from({ length: 30 }, (_, i) => {
                const uptime = 99.5 + Math.random() * 0.5; // Mock uptime between 99.5-100%
                const color = uptime >= 99.9 ? 'bg-green-500' : uptime >= 99 ? 'bg-amber-500' : 'bg-red-500';
                return (
                  <div
                    key={i}
                    className={cn("h-8 rounded-sm", color)}
                    title={`Day ${30 - i}: ${uptime.toFixed(2)}% uptime`}
                  />
                );
              })}
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}