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
  const [alerts] = useState<ComplianceAlert[]>([
    {
      id: '1',
      severity: 'medium',
      reason: 'KYT risk detected',
      impactedBot: 'Alpha Arbitrage Bot',
      timestamp: new Date().toISOString(),
      status: 'open',
      details: 'Transaction flagged by compliance screening'
    },
    {
      id: '2',
      severity: 'low',
      reason: 'Position size limit approached',
      impactedBot: 'Beta Grid Trading',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'acknowledged',
      details: 'Bot approaching 90% of maximum position size'
    }
  ]);

  const [auditLogs] = useState<AuditLogEntry[]>([
    {
      id: '1',
      action: 'Bot started',
      user: 'admin',
      details: 'Alpha Arbitrage Bot manually started',
      timestamp: new Date().toISOString(),
      category: 'config'
    },
    {
      id: '2',
      action: 'User login',
      user: 'admin',
      details: 'Successful login from IP 192.168.1.100',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      category: 'login'
    }
  ]);

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