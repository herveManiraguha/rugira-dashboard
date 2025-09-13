import React, { useState, useMemo } from "react";
import { AlertDetailsModal } from "@/components/Compliance/AlertDetailsModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertTriangle, Shield, CheckCircle, Download, Search, Filter, FileText, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { StandardPageLayout } from "@/components/ui/standard-page-layout";

interface ComplianceAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  impactedBot: string;
  venue?: string;
  timestamp: string;
  status: 'open' | 'acknowledged' | 'resolved';
  details?: string;
  triggeredBy?: string;
  riskScore?: number;
  recommendations?: string[];
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
  const [selectedAlert, setSelectedAlert] = useState<ComplianceAlert | null>(null);
  const [showAlertDetails, setShowAlertDetails] = useState(false);
  const [auditLogSearchTerm, setAuditLogSearchTerm] = useState('');
  const [alertsSearchTerm, setAlertsSearchTerm] = useState('');
  const [alertsSortColumn, setAlertsSortColumn] = useState<string | null>(null);
  const [alertsSortDirection, setAlertsSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [auditSortColumn, setAuditSortColumn] = useState<string | null>(null);
  const [auditSortDirection, setAuditSortDirection] = useState<'asc' | 'desc' | null>(null);
  
  // Generate comprehensive compliance alerts
  const generateComplianceAlerts = (): ComplianceAlert[] => {
    const alertTypes = [
      { 
        reason: 'Daily loss limit exceeded (blocked pre-trade)', 
        severity: 'high' as const, 
        details: 'Bot exceeded maximum daily loss threshold of 5%', 
        venue: 'BX Digital (via InCore)',
        triggeredBy: 'Risk Monitor',
        riskScore: 85,
        recommendations: ['Reduce position sizes', 'Review daily loss limits', 'Check market volatility']
      },
      { 
        reason: 'Position size limit approached', 
        severity: 'low' as const, 
        details: 'Bot approaching 90% of maximum position size', 
        venue: 'BX Digital (via InCore)',
        triggeredBy: 'Position Monitor',
        riskScore: 45
      },
      { 
        reason: 'KYT risk detected', 
        severity: 'medium' as const, 
        details: 'Transaction flagged by compliance screening',
        triggeredBy: 'KYT Engine',
        riskScore: 72,
        recommendations: ['Review counterparty details', 'Perform enhanced due diligence']
      },
      { 
        reason: 'Unusual trading pattern detected', 
        severity: 'high' as const, 
        details: 'Abnormal volume spike detected in trading behavior',
        triggeredBy: 'Pattern Detection',
        riskScore: 78,
        recommendations: ['Review bot configuration', 'Check for market anomalies', 'Verify bot logic']
      },
      { 
        reason: 'AML screening triggered', 
        severity: 'critical' as const, 
        details: 'Counterparty address flagged in sanctions database',
        triggeredBy: 'AML System',
        riskScore: 95,
        recommendations: ['Stop all trading with this counterparty', 'File SAR if required', 'Escalate to compliance team']
      },
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
      { action: 'Large order executed', category: 'order' as const, details: 'Order size: CHF 25,000 BTC-USDT' },
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

  // Handle sorting for alerts table
  const handleAlertsSort = (column: string) => {
    if (alertsSortColumn === column) {
      if (alertsSortDirection === 'asc') {
        setAlertsSortDirection('desc');
      } else if (alertsSortDirection === 'desc') {
        setAlertsSortDirection(null);
        setAlertsSortColumn(null);
      } else {
        setAlertsSortDirection('asc');
      }
    } else {
      setAlertsSortColumn(column);
      setAlertsSortDirection('asc');
    }
  };

  // Handle sorting for audit log table
  const handleAuditSort = (column: string) => {
    if (auditSortColumn === column) {
      if (auditSortDirection === 'asc') {
        setAuditSortDirection('desc');
      } else if (auditSortDirection === 'desc') {
        setAuditSortDirection(null);
        setAuditSortColumn(null);
      } else {
        setAuditSortDirection('asc');
      }
    } else {
      setAuditSortColumn(column);
      setAuditSortDirection('asc');
    }
  };

  // Get sort icon for alerts columns
  const getAlertsSortIcon = (column: string) => {
    if (alertsSortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    if (alertsSortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4" />;
    }
    if (alertsSortDirection === 'desc') {
      return <ArrowDown className="h-4 w-4" />;
    }
    return <ArrowUpDown className="h-4 w-4 opacity-50" />;
  };

  // Get sort icon for audit columns
  const getAuditSortIcon = (column: string) => {
    if (auditSortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    if (auditSortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4" />;
    }
    if (auditSortDirection === 'desc') {
      return <ArrowDown className="h-4 w-4" />;
    }
    return <ArrowUpDown className="h-4 w-4 opacity-50" />;
  };

  // Filter and sort alerts
  const filteredAlerts = useMemo(() => {
    let filtered = [...alerts];
    
    // Apply search filter
    if (alertsSearchTerm) {
      const searchLower = alertsSearchTerm.toLowerCase();
      filtered = filtered.filter(alert => 
        alert.reason.toLowerCase().includes(searchLower) ||
        alert.impactedBot.toLowerCase().includes(searchLower) ||
        (alert.venue && alert.venue.toLowerCase().includes(searchLower)) ||
        alert.severity.toLowerCase().includes(searchLower) ||
        alert.status.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (alertsSortColumn && alertsSortDirection) {
      filtered.sort((a, b) => {
        let aValue: any = '';
        let bValue: any = '';
        
        switch (alertsSortColumn) {
          case 'id':
            aValue = parseInt(a.id);
            bValue = parseInt(b.id);
            break;
          case 'severity':
            const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            aValue = severityOrder[a.severity];
            bValue = severityOrder[b.severity];
            break;
          case 'reason':
            aValue = a.reason;
            bValue = b.reason;
            break;
          case 'impactedBot':
            aValue = a.impactedBot;
            bValue = b.impactedBot;
            break;
          case 'venue':
            aValue = a.venue || '';
            bValue = b.venue || '';
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'timestamp':
            aValue = new Date(a.timestamp).getTime();
            bValue = new Date(b.timestamp).getTime();
            break;
        }
        
        if (aValue < bValue) return alertsSortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return alertsSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [alerts, alertsSearchTerm, alertsSortColumn, alertsSortDirection]);

  // Filter and sort audit logs
  const filteredAuditLogs = useMemo(() => {
    let filtered = [...auditLogs];
    
    // Apply search filter
    if (auditLogSearchTerm) {
      const searchLower = auditLogSearchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchLower) ||
        log.user.toLowerCase().includes(searchLower) ||
        log.details.toLowerCase().includes(searchLower) ||
        log.category.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (auditSortColumn && auditSortDirection) {
      filtered.sort((a, b) => {
        let aValue: any = '';
        let bValue: any = '';
        
        switch (auditSortColumn) {
          case 'id':
            aValue = parseInt(a.id);
            bValue = parseInt(b.id);
            break;
          case 'category':
            aValue = a.category;
            bValue = b.category;
            break;
          case 'action':
            aValue = a.action;
            bValue = b.action;
            break;
          case 'user':
            aValue = a.user;
            bValue = b.user;
            break;
          case 'details':
            aValue = a.details;
            bValue = b.details;
            break;
          case 'timestamp':
            aValue = new Date(a.timestamp).getTime();
            bValue = new Date(b.timestamp).getTime();
            break;
        }
        
        if (aValue < bValue) return auditSortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return auditSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [auditLogs, auditLogSearchTerm, auditSortColumn, auditSortDirection]);

  // Export functions
  const exportAlertsToCSV = () => {
    const headers = ['ID', 'Severity', 'Reason', 'Impacted Bot', 'Venue', 'Status', 'Timestamp'];
    const csvContent = [
      headers.join(','),
      ...alerts.map(alert => [
        alert.id,
        alert.severity,
        `"${alert.reason}"`,
        `"${alert.impactedBot}"`,
        alert.venue || '-',
        alert.status,
        alert.timestamp
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `compliance-alerts-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAuditLogsToCSV = () => {
    const headers = ['ID', 'Category', 'Action', 'User', 'Details', 'Timestamp'];
    const csvContent = [
      headers.join(','),
      ...auditLogs.map(log => [
        log.id,
        log.category,
        `"${log.action}"`,
        log.user,
        `"${log.details}"`,
        log.timestamp
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAlertsToPDF = () => {
    // Create a simple HTML table for PDF generation
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Compliance Alerts Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #1f2937; margin: 0; }
          .header .subtitle { color: #6b7280; margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #d1d5db; padding: 12px; text-align: left; }
          th { background-color: #f9fafb; font-weight: bold; }
          .severity-critical { color: #dc2626; font-weight: bold; }
          .severity-high { color: #ea580c; font-weight: bold; }
          .severity-medium { color: #d97706; font-weight: bold; }
          .severity-low { color: #65a30d; font-weight: bold; }
          .status-open { color: #dc2626; }
          .status-acknowledged { color: #d97706; }
          .status-resolved { color: #16a34a; }
          .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Compliance Alerts Report</h1>
          <div class="subtitle">Generated on ${new Date().toLocaleDateString()}</div>
          <div class="subtitle">Total Alerts: ${alerts.length}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Severity</th>
              <th>Reason</th>
              <th>Impacted Bot</th>
              <th>Venue</th>
              <th>Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${alerts.map(alert => `
              <tr>
                <td>${alert.id}</td>
                <td class="severity-${alert.severity}">${alert.severity.toUpperCase()}</td>
                <td>${alert.reason}</td>
                <td>${alert.impactedBot}</td>
                <td>${alert.venue || '-'}</td>
                <td class="status-${alert.status}">${alert.status.toUpperCase()}</td>
                <td>${new Date(alert.timestamp).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Rugira Trading Dashboard - Compliance Report</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `compliance-alerts-report-${new Date().toISOString().split('T')[0]}.html`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSeverityBadge = (severity: ComplianceAlert['severity']) => {
    switch (severity) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
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
    <StandardPageLayout
      title="Compliance Monitoring"
      subtitle="Monitor compliance alerts and audit trail"
    >

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-2">
          <TabsTrigger value="alerts" className="text-xs sm:text-sm">Alerts Inbox</TabsTrigger>
          <TabsTrigger value="audit" className="text-xs sm:text-sm">Audit Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <AlertTriangle className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                  Compliance Alerts
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="relative flex-1 sm:max-w-64">
                    <Search className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search alerts..." 
                      className="pl-9 h-9"
                      value={alertsSearchTerm}
                      onChange={(e) => setAlertsSearchTerm(e.target.value)}
                      data-testid="search-alerts"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Filter className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Filter</span>
                    </Button>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline" data-testid="export-alerts">
                        <Download className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Export</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={exportAlertsToCSV}>
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={exportAlertsToPDF}>
                        <FileText className="h-4 w-4 mr-2" />
                        Export Report (HTML)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Mobile Card View */}
              <div className="block sm:hidden space-y-3 p-4">
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className="border">
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        {getSeverityBadge(alert.severity)}
                        {getStatusBadge(alert.status)}
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{alert.reason}</div>
                        <div className="text-xs text-gray-500">
                          <div>Bot: {alert.impactedBot}</div>
                          {alert.venue && <div>Venue: {alert.venue}</div>}
                          <div>{new Date(alert.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-xs"
                          onClick={() => {
                            setSelectedAlert(alert);
                            setShowAlertDetails(true);
                          }}
                        >
                          View Details
                        </Button>
                        {alert.status === 'open' && (
                          <Button size="sm" variant="outline" className="flex-1 text-xs">
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Desktop Table View */}
              <Table className="hidden sm:table">
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleAlertsSort('severity')}
                    >
                      <div className="flex items-center gap-1">
                        Severity
                        {getAlertsSortIcon('severity')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleAlertsSort('reason')}
                    >
                      <div className="flex items-center gap-1">
                        Reason
                        {getAlertsSortIcon('reason')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleAlertsSort('impactedBot')}
                    >
                      <div className="flex items-center gap-1">
                        Impacted Bot
                        {getAlertsSortIcon('impactedBot')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleAlertsSort('venue')}
                    >
                      <div className="flex items-center gap-1">
                        Venue
                        {getAlertsSortIcon('venue')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleAlertsSort('status')}
                    >
                      <div className="flex items-center gap-1">
                        Status
                        {getAlertsSortIcon('status')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleAlertsSort('timestamp')}
                    >
                      <div className="flex items-center gap-1">
                        Timestamp
                        {getAlertsSortIcon('timestamp')}
                      </div>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
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
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedAlert(alert);
                              setShowAlertDetails(true);
                            }}
                          >
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Shield className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                  Audit Log
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search logs..." 
                      className="pl-9 w-full sm:w-64 h-9"
                      value={auditLogSearchTerm}
                      onChange={(e) => setAuditLogSearchTerm(e.target.value)}
                      data-testid="search-audit-logs"
                    />
                  </div>
                  <Button size="sm" variant="outline" onClick={exportAuditLogsToCSV} data-testid="export-audit-logs">
                    <Download className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Export CSV</span>
                    <span className="sm:hidden">Export</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Mobile Card View */}
              <div className="block sm:hidden space-y-3 p-4">
                {filteredAuditLogs.map((log) => (
                  <Card key={log.id} className="border">
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        {getCategoryBadge(log.category)}
                        <div className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString([], {dateStyle: 'short', timeStyle: 'short'})}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{log.action}</div>
                        <div className="text-xs text-gray-600">
                          <div>User: {log.user}</div>
                          <div className="mt-1">{log.details}</div>
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
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleAuditSort('category')}
                    >
                      <div className="flex items-center gap-1">
                        Category
                        {getAuditSortIcon('category')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleAuditSort('action')}
                    >
                      <div className="flex items-center gap-1">
                        Action
                        {getAuditSortIcon('action')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleAuditSort('user')}
                    >
                      <div className="flex items-center gap-1">
                        User
                        {getAuditSortIcon('user')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleAuditSort('details')}
                    >
                      <div className="flex items-center gap-1">
                        Details
                        {getAuditSortIcon('details')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleAuditSort('timestamp')}
                    >
                      <div className="flex items-center gap-1">
                        Timestamp
                        {getAuditSortIcon('timestamp')}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAuditLogs.map((log) => (
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
      
      {/* Alert Details Modal */}
      <AlertDetailsModal
        alert={selectedAlert}
        isOpen={showAlertDetails}
        onClose={() => {
          setShowAlertDetails(false);
          setSelectedAlert(null);
        }}
        onAcknowledge={() => {
          if (selectedAlert) {
            console.log('Acknowledging alert:', selectedAlert.id);
            setShowAlertDetails(false);
          }
        }}
        onResolve={() => {
          if (selectedAlert) {
            console.log('Resolving alert:', selectedAlert.id);
            setShowAlertDetails(false);
          }
        }}
      />
    </StandardPageLayout>
  );
}