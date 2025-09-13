import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Activity, 
  Server, 
  Wifi, 
  Database, 
  AlertCircle,
  CheckCircle,
  Clock,
  Cpu,
  HardDrive,
  RefreshCw
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  lastCheck: string;
  responseTime: number;
}

export default function Monitoring() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Generate real-time system metrics data
  const generateSystemMetrics = () => {
    const now = new Date();
    const data = [];
    
    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000); // Every minute for last 30 minutes
      data.push({
        time: time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        cpu: Math.max(5, Math.min(95, 23 + (Math.random() - 0.5) * 10)),
        memory: Math.max(50, Math.min(85, 67 + (Math.random() - 0.5) * 8)),
        network: Math.max(50, Math.min(200, 125 + (Math.random() - 0.5) * 40)),
        diskIO: Math.max(10, Math.min(150, 45 + (Math.random() - 0.5) * 20))
      });
    }
    return data;
  };

  const systemMetricsData = generateSystemMetrics();
  const [systemMetrics] = useState<SystemMetric[]>([
    { name: 'CPU Usage', value: 23, unit: '%', status: 'healthy', trend: 'stable' },
    { name: 'Memory Usage', value: 67, unit: '%', status: 'warning', trend: 'up' },
    { name: 'Disk Usage', value: 45, unit: '%', status: 'healthy', trend: 'stable' },
    { name: 'Network I/O', value: 125, unit: 'MB/s', status: 'healthy', trend: 'stable' },
    { name: 'Active Connections', value: 342, unit: '', status: 'healthy', trend: 'stable' },
    { name: 'Queue Depth', value: 12, unit: 'items', status: 'healthy', trend: 'down' }
  ]);

  const [services] = useState<ServiceStatus[]>([
    {
      name: 'Trading Engine',
      status: 'online',
      uptime: '99.98%',
      lastCheck: '2 seconds ago',
      responseTime: 45
    },
    {
      name: 'Market Data Feed',
      status: 'online',
      uptime: '99.95%',
      lastCheck: '1 second ago',
      responseTime: 12
    },
    {
      name: 'Order Management',
      status: 'online',
      uptime: '100%',
      lastCheck: '3 seconds ago',
      responseTime: 67
    },
    {
      name: 'Risk Monitor',
      status: 'degraded',
      uptime: '98.2%',
      lastCheck: '10 seconds ago',
      responseTime: 234
    },
    {
      name: 'Database Cluster',
      status: 'online',
      uptime: '99.99%',
      lastCheck: '1 second ago',
      responseTime: 8
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getMetricIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'cpu usage': return <Cpu className="h-4 w-4" />;
      case 'memory usage': return <Server className="h-4 w-4" />;
      case 'disk usage': return <HardDrive className="h-4 w-4" />;
      case 'network i/o': return <Wifi className="h-4 w-4" />;
      case 'active connections': return <Activity className="h-4 w-4" />;
      case 'queue depth': return <Database className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online': return 'text-green-600';
      case 'warning':
      case 'degraded': return 'text-yellow-600';
      case 'critical':
      case 'offline': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
      case 'degraded': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
      case 'offline': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return <Badge className="bg-green-100 text-green-800">Online</Badge>;
      case 'degraded': return <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>;
      case 'offline': return <Badge variant="destructive">Offline</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Monitoring</h1>
          <p className="text-sm sm:text-base text-gray-600">Real-time system health and performance metrics</p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="text-xs sm:text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'})}
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:flex">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">System Overview</TabsTrigger>
          <TabsTrigger value="services" className="text-xs sm:text-sm">Service Status</TabsTrigger>
          <TabsTrigger value="alerts" className="text-xs sm:text-sm">Active Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* System Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {systemMetrics.map((metric) => (
              <Card key={metric.name}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2">
                      {getMetricIcon(metric.name)}
                      <h3 className="text-xs sm:text-sm font-medium text-gray-700">{metric.name}</h3>
                    </div>
                    {getStatusIcon(metric.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-end space-x-2">
                      <span className="text-xl sm:text-2xl font-bold">{metric.value}</span>
                      <span className="text-xs sm:text-sm text-gray-500 mb-1">{metric.unit}</span>
                    </div>
                    
                    {metric.name.includes('Usage') && (
                      <Progress 
                        value={metric.value} 
                        className="h-2"
                        style={{
                          backgroundColor: metric.status === 'critical' ? '#fecaca' : 
                                         metric.status === 'warning' ? '#fef3c7' : '#dcfce7'
                        }}
                      />
                    )}
                    
                    <div className={`text-xs ${getStatusColor(metric.status)}`}>
                      {metric.status === 'healthy' ? 'Normal' : 
                       metric.status === 'warning' ? 'Above normal' : 'Critical level'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>CPU & Memory Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={systemMetricsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time"
                        fontSize={12}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        formatter={(value: any, name) => [
                          `${Number(value).toFixed(1)}%`,
                          name === 'cpu' ? 'CPU Usage' : 'Memory Usage'
                        ]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="cpu" 
                        stroke="#1b7a46" 
                        strokeWidth={2}
                        dot={false}
                        name="cpu"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="memory" 
                        stroke="#e10600" 
                        strokeWidth={2}
                        dot={false}
                        name="memory"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Network & Disk I/O</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={systemMetricsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time"
                        fontSize={12}
                      />
                      <YAxis 
                        tickFormatter={(value) => `${value} MB/s`}
                      />
                      <Tooltip 
                        formatter={(value: any, name) => [
                          `${Number(value).toFixed(1)} MB/s`,
                          name === 'network' ? 'Network I/O' : 'Disk I/O'
                        ]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="network" 
                        stackId="1"
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.3}
                        name="network"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="diskIO" 
                        stackId="2"
                        stroke="#f59e0b" 
                        fill="#f59e0b" 
                        fillOpacity={0.3}
                        name="diskIO"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Server className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                Service Health Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Mobile Card View */}
              <div className="block sm:hidden space-y-3 p-4">
                {services.map((service) => (
                  <Card key={service.name} className="border">
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(service.status)}
                          <span className="font-medium text-sm">{service.name}</span>
                        </div>
                        {getStatusBadge(service.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>
                          <span className="text-gray-500">Uptime:</span> {service.uptime}
                        </div>
                        <div>
                          <span className="text-gray-500">Response:</span>
                          <span className={service.responseTime > 200 ? ' text-yellow-600' : ' text-green-600'}>
                            {' '}{service.responseTime}ms
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Last Check:</span> {service.lastCheck}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Desktop Table View */}
              <Table className="hidden sm:table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Last Check</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.name}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(service.status)}
                          <span>{service.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(service.status)}</TableCell>
                      <TableCell>{service.uptime}</TableCell>
                      <TableCell>
                        <span className={service.responseTime > 200 ? 'text-yellow-600' : 'text-green-600'}>
                          {service.responseTime}ms
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{service.lastCheck}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-lg">
                <AlertCircle className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                Active System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start p-3 sm:p-4 border-l-4 border-yellow-400 bg-yellow-50 rounded">
                  <AlertCircle className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h4 className="font-medium text-sm sm:text-base text-yellow-800">Memory Usage Warning</h4>
                    <p className="text-xs sm:text-sm text-yellow-700">
                      System memory usage is at 67% and trending upward. Consider scaling resources.
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">Triggered 5 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 sm:p-4 border-l-4 border-yellow-400 bg-yellow-50 rounded">
                  <AlertCircle className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h4 className="font-medium text-sm sm:text-base text-yellow-800">Service Degradation</h4>
                    <p className="text-xs sm:text-sm text-yellow-700">
                      Risk Monitor service is experiencing degraded performance (234ms response time).
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">Triggered 12 minutes ago</p>
                  </div>
                </div>
                
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>All other systems operating normally</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}