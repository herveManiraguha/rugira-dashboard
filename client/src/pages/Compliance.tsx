import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Shield, CheckCircle, Download, Search, Filter } from "lucide-react";

interface ComplianceAlert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  reason: string;
  impactedBot: string;
  venue?: string;
  timestamp: string;
  status: 'open' | 'acknowledged' | 'resolved';
  details: string;
}

interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  details: string;
  timestamp: string;
  category: 'login' | 'config' | 'order' | 'alert';
}

export default function Compliance() {
  // Generate comprehensive compliance alerts
  const generateComplianceAlerts = (): ComplianceAlert[] => {
    const alertTypes = [
      { reason: 'Daily loss limit exceeded (blocked pre-trade)', severity: 'high' as const, details: 'Bot exceeded maximum daily loss threshold of 5%', venue: 'BX Digital (via InCore)' },
      { reason: 'Position size limit approached', severity: 'low' as const, details: 'Bot approaching 90% of maximum position size', venue: 'BX Digital (via InCore)' },
      { reason: 'KYT risk detected', severity: 'medium' as const, details: 'Transaction flagged by compliance screening' },
      { reason: 'Unusual trading pattern detected', severity: 'high' as const, details: 'Abnormal volume spike detected in trading behavior' },
      { reason: 'AML screening triggered', severity: 'high' as const, details: 'Counterparty address flagged in sanctions database' },
      { reason: 'Regulatory reporting required', severity: 'medium' as const, details: 'Large transaction requires regulatory filing' },
      { reason: 'Market manipulation risk', severity: 'high' as const, details: 'Trading pattern may appear as market manipulation' },
      { reason: 'Concentration risk alert', severity: 'medium' as const, details: 'Single asset exposure exceeds 25% portfolio limit' },
      { reason: 'Liquidity risk warning', severity: 'low' as const, details: 'Trading in low liquidity market conditions' },
      { reason: 'Cross-border compliance', severity: 'medium' as const, details: 'Trading across jurisdictions requires additional compliance' },
      { reason: 'Stop-loss failure', severity: 'high' as const, details: 'Automated stop-loss mechanism failed to execute' },
      { reason: 'API rate limit breach', severity: 'low' as const, details: 'Exchange API rate limits exceeded for sustained period' },
      { reason: 'Slippage threshold exceeded', severity: 'medium' as const, details: 'Trade execution slippage exceeded 2% threshold' },
      { reason: 'Wash trading detected', severity: 'high' as const, details: 'Potential wash trading activity identified' },
      { reason: 'Position correlation risk', severity: 'medium' as const, details: 'High correlation between positions increases risk exposure' }
    ];

    const bots = [
      'Alpha Arbitrage Bot', 'Beta Grid Trading', 'Gamma Momentum Scanner', 'Delta Mean Reversion',
      'Epsilon Scalping Engine', 'Zeta Swing Trader', 'Eta High Frequency', 'Theta Cross Exchange',
      'Iota Volume Scanner', 'Kappa Trend Follower', 'Lambda Range Trader', 'Mu Breakout Hunter'
    ];

    const statuses: ComplianceAlert['status'][] = ['open', 'acknowledged', 'resolved'];

    return alertTypes.map((alert, index) => {
      const hoursAgo = Math.floor(Math.random() * 168); // Up to 7 days ago
      const botIndex = index % bots.length;
      const statusIndex = index % statuses.length;

      return {
        id: (index + 1).toString(),
        severity: alert.severity,
        reason: alert.reason,
        impactedBot: bots[botIndex],
        venue: alert.venue,
        timestamp: new Date(Date.now() - (hoursAgo * 3600000)).toISOString(),
        status: statuses[statusIndex === 0 && index < 2 ? 2 : statusIndex],
        details: alert.details
      };
    });
  };

  // Generate comprehensive audit logs
  const generateAuditLogs = (): AuditLogEntry[] => {
    const actions = [
      { action: 'Bot started', category: 'config' as const, details: 'manually started' },
      { action: 'User login', category: 'login' as const, details: 'Successful login from IP' },
      { action: 'Bot stopped', category: 'config' as const, details: 'Emergency stop triggered' },
      { action: 'Risk parameters updated', category: 'config' as const, details: 'Maximum position size changed from 10% to 8%' },
      { action: 'Large order executed', category: 'order' as const, details: 'Order size: $25,000 BTC-USDT' },
      { action: 'Compliance alert triggered', category: 'alert' as const, details: 'KYT screening flagged transaction' },
      { action: 'API key rotated', category: 'config' as const, details: 'Binance API credentials updated' },
      { action: 'User logout', category: 'login' as const, details: 'Session terminated' },
      { action: 'Strategy parameters modified', category: 'config' as const, details: 'Grid spacing updated to 1.5%' },
      { action: 'Alert acknowledged', category: 'alert' as const, details: 'Medium severity compliance alert reviewed' },
      { action: 'Export generated', category: 'config' as const, details: 'Compliance report exported to PDF' },
      { action: 'Failed login attempt', category: 'login' as const, details: 'Invalid credentials from IP 45.33.21.96' },
      { action: 'Position closed', category: 'order' as const, details: 'Automatic position closure due to stop-loss' },
      { action: 'Exchange connected', category: 'config' as const, details: 'Kraken API connection established' },
      { action: 'Threshold breach', category: 'alert' as const, details: 'Daily loss limit of 5% exceeded' },
      { action: 'Backup created', category: 'config' as const, details: 'Configuration backup saved to secure storage' },
      { action: 'User permissions changed', category: 'config' as const, details: 'Trading permissions granted to user trader@rugira.ch' },
      { action: 'Alert resolved', category: 'alert' as const, details: 'High severity AML alert cleared after review' },
      { action: 'Market data reconnected', category: 'config' as const, details: 'WebSocket connection to price feed restored' },
      { action: 'Compliance scan completed', category: 'alert' as const, details: 'Scheduled weekly compliance check passed' }
    ];

    const users = ['admin', 'trader@rugira.ch', 'system', 'compliance@rugira.ch', 'risk@rugira.ch'];
    const ips = ['192.168.1.100', '10.0.1.50', '203.0.113.45', '198.51.100.30', '45.33.21.96'];

    return actions.map((actionData, index) => {
      const hoursAgo = Math.floor(Math.random() * 72); // Up to 3 days ago
      const userIndex = index % users.length;
      const ipIndex = index % ips.length;
      
      let details = actionData.details;
      if (actionData.category === 'login' && actionData.details.includes('IP')) {
        details = `${actionData.details} ${ips[ipIndex]}`;
      }

      return {
        id: (index + 1).toString(),
        action: actionData.action,
        user: users[userIndex],
        details,
        timestamp: new Date(Date.now() - (hoursAgo * 3600000)).toISOString(),
        category: actionData.category
      };
    });
  };

  const [alerts] = useState<ComplianceAlert[]>(generateComplianceAlerts());
  const [auditLogs] = useState<AuditLogEntry[]>(generateAuditLogs());

  const getSeverityBadge = (severity: ComplianceAlert['severity']) => {
    switch (severity) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low': return <Badge variant="secondary">Low</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: ComplianceAlert['status']) => {
    switch (status) {
      case 'open': return <Badge variant="destructive">Open</Badge>;
      case 'acknowledged': return <Badge className="bg-yellow-100 text-yellow-800">Acknowledged</Badge>;
      case 'resolved': return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getCategoryBadge = (category: AuditLogEntry['category']) => {
    const colors = {
      login: 'bg-blue-100 text-blue-800',
      config: 'bg-purple-100 text-purple-800',
      order: 'bg-green-100 text-green-800',
      alert: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[category]}>{category}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Compliance Monitoring</h1>
        <p className="text-gray-600">Monitor compliance alerts and audit trail</p>
      </div>

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList>
          <TabsTrigger value="alerts">Alerts Inbox</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Compliance Alerts
                </CardTitle>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Severity</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Impacted Bot</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                      <TableCell className="font-medium">{alert.reason}</TableCell>
                      <TableCell>{alert.impactedBot}</TableCell>
                      <TableCell>{alert.venue || '-'}</TableCell>
                      <TableCell>{getStatusBadge(alert.status)}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(alert.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          {alert.status === 'open' && (
                            <Button size="sm" variant="outline">
                              Acknowledge
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Audit Log
                </CardTitle>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search logs..." className="pl-9 w-64" />
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{getCategoryBadge(log.category)}</TableCell>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.details}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}