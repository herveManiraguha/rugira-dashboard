import React, { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  Users,
  Key,
  Shield,
  FileCheck,
  Download,
  CreditCard,
  Bot,
  Activity,
  Globe,
  Power,
  Edit,
  Save,
  X,
  Plus,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

export default function TenantDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, currentTenant } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showApiKey, setShowApiKey] = useState<string | null>(null);

  // Mock tenant data
  const tenant = {
    id: id,
    name: id === 'rugira-prod' ? 'Bahnhofstrasse Production' : id === 'rugira-test' ? 'Bahnhofstrasse Test' : 'Client Alpha',
    status: 'active',
    legalEntity: id === 'client-alpha' ? 'Alpha Capital Partners' : 'Bahnhofstrasse Family Office AG',
    region: id === 'client-alpha' ? 'EU' : 'CH',
    created: '2024-01-15',
    planType: id === 'client-alpha' ? 'Enterprise' : 'Professional',
    branding: {
      primaryColor: '#E10600',
      logo: null
    },
    usage: {
      bots: 12,
      maxBots: 50,
      portfolios: 5,
      maxPortfolios: 10,
      apiCalls: 850000,
      maxApiCalls: 1000000,
      storage: 2.5,
      maxStorage: 10
    }
  };

  // Mock users data
  const users = [
    { id: 1, name: 'Hans Müller', email: 'hans.mueller@rugira.ch', role: 'Admin', status: 'active', lastActive: '2 min ago' },
    { id: 2, name: 'Clara Fischer', email: 'clara.fischer@rugira.ch', role: 'Approver', status: 'active', lastActive: '15 min ago' },
    { id: 3, name: 'Martin Keller', email: 'martin.keller@rugira.ch', role: 'Trader', status: 'active', lastActive: '1 hour ago' },
    { id: 4, name: 'Lin Zhang', email: 'lin.zhang@rugira.ch', role: 'Trader', status: 'active', lastActive: '2 hours ago' },
    { id: 5, name: 'Emma Sanchez', email: 'emma.sanchez@rugira.ch', role: 'Viewer', status: 'inactive', lastActive: '3 days ago' }
  ];

  // Mock venues data
  const venues = [
    { id: 1, name: 'Binance', type: 'CEX', status: 'connected', lastHeartbeat: '30s ago', apiKeys: 2 },
    { id: 2, name: 'Coinbase', type: 'CEX', status: 'connected', lastHeartbeat: '45s ago', apiKeys: 1 },
    { id: 3, name: 'BX Digital', type: 'Tokenized', status: 'connected', lastHeartbeat: '1m ago', apiKeys: 1 },
    { id: 4, name: 'Kraken', type: 'CEX', status: 'disconnected', lastHeartbeat: '5m ago', apiKeys: 1 }
  ];

  // Mock policies data
  const policies = [
    { id: 1, name: 'Daily Drawdown Limit', baseline: '3%', override: '5%', status: 'overridden' },
    { id: 2, name: 'Position Size Limit', baseline: 'CHF 100k', override: null, status: 'baseline' },
    { id: 3, name: 'Max Leverage', baseline: '3x', override: '5x', status: 'overridden' },
    { id: 4, name: 'Trading Hours', baseline: '24/7', override: null, status: 'baseline' }
  ];

  // Mock approvals data
  const approvals = [
    { id: 1, type: 'Risk Override', requestor: 'Martin Keller', time: '2 hours ago', status: 'pending' },
    { id: 2, type: 'New API Key', requestor: 'Lin Zhang', time: '1 day ago', status: 'approved' },
    { id: 3, type: 'Policy Change', requestor: 'Clara Fischer', time: '2 days ago', status: 'rejected' }
  ];

  // Mock audit logs
  const auditLogs = [
    { id: 1, action: 'Bot Started', user: 'Hans Müller', time: '2025-01-20 14:23', details: 'Started bot ALGO-01' },
    { id: 2, action: 'API Key Added', user: 'Clara Fischer', time: '2025-01-20 12:15', details: 'Added Binance API key' },
    { id: 3, action: 'Policy Override', user: 'Martin Keller', time: '2025-01-19 16:45', details: 'Override DD limit to 5%' }
  ];

  const handleSave = () => {
    toast({
      title: "Changes Saved",
      description: "Tenant configuration has been updated",
    });
    setIsEditing(false);
  };

  const handleKillSwitch = () => {
    toast({
      title: "Kill Switch Activated",
      description: "All bots have been stopped",
      variant: "destructive"
    });
  };

  const handleExportAudit = () => {
    toast({
      title: "Export Started",
      description: "Generating audit report...",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">{status}</Badge>;
      case 'inactive':
      case 'disconnected':
      case 'rejected':
        return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getUsagePercentage = (used: number, max: number) => {
    return Math.round((used / max) * 100);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/tenants')}
            >
              ← Back to Tenants
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{tenant.name}</h1>
              <p className="text-gray-600">{tenant.legalEntity}</p>
            </div>
            {getStatusBadge(tenant.status)}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportAudit}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Audit
            </Button>
            <Button
              variant="outline"
              className="text-orange-600 border-orange-600 hover:bg-orange-50"
              onClick={handleKillSwitch}
            >
              <Power className="h-4 w-4 mr-2" />
              Kill Switch
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="venues">Venues & API Keys</TabsTrigger>
          <TabsTrigger value="policies">Policies & Risk</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="audit">Audit & Exports</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Portfolios</p>
                    <p className="text-2xl font-bold">5</p>
                  </div>
                  <Activity className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Bots</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <Bot className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Venues</p>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Policy Coverage</p>
                    <p className="text-2xl font-bold">95%</p>
                  </div>
                  <Shield className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Alerts</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Configuration</CardTitle>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tenant Name</Label>
                  <Input 
                    value={tenant.name} 
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Legal Entity</Label>
                  <Input 
                    value={tenant.legalEntity} 
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Region</Label>
                  <Select value={tenant.region} disabled={!isEditing}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CH">Switzerland</SelectItem>
                      <SelectItem value="EU">European Union</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="APAC">Asia Pacific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Plan Type</Label>
                  <Select value={tenant.planType} disabled={!isEditing}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Starter">Starter</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Bots</span>
                  <span>{tenant.usage.bots} / {tenant.usage.maxBots}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#E10600] h-2 rounded-full"
                    style={{ width: `${getUsagePercentage(tenant.usage.bots, tenant.usage.maxBots)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Portfolios</span>
                  <span>{tenant.usage.portfolios} / {tenant.usage.maxPortfolios}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#E10600] h-2 rounded-full"
                    style={{ width: `${getUsagePercentage(tenant.usage.portfolios, tenant.usage.maxPortfolios)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>API Calls (Monthly)</span>
                  <span>{(tenant.usage.apiCalls / 1000).toFixed(0)}k / {(tenant.usage.maxApiCalls / 1000).toFixed(0)}k</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#E10600] h-2 rounded-full"
                    style={{ width: `${getUsagePercentage(tenant.usage.apiCalls, tenant.usage.maxApiCalls)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Storage</span>
                  <span>{tenant.usage.storage} GB / {tenant.usage.maxStorage} GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#E10600] h-2 rounded-full"
                    style={{ width: `${getUsagePercentage(tenant.usage.storage, tenant.usage.maxStorage)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users & Roles Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select value={user.role}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Trader">Trader</SelectItem>
                            <SelectItem value="Approver">Approver</SelectItem>
                            <SelectItem value="Viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Remove</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Venues & API Keys Tab */}
        <TabsContent value="venues" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Connected Venues</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Venue
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Venue</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Heartbeat</TableHead>
                    <TableHead>API Keys</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {venues.map((venue) => (
                    <TableRow key={venue.id}>
                      <TableCell className="font-medium">{venue.name}</TableCell>
                      <TableCell>{venue.type}</TableCell>
                      <TableCell>{getStatusBadge(venue.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {venue.lastHeartbeat}
                        </div>
                      </TableCell>
                      <TableCell>{venue.apiKeys}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Policies & Risk Tab */}
        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Policies</CardTitle>
              <CardDescription>
                Baseline policies with tenant-specific overrides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy</TableHead>
                    <TableHead>Baseline</TableHead>
                    <TableHead>Override</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="font-medium">{policy.name}</TableCell>
                      <TableCell>{policy.baseline}</TableCell>
                      <TableCell>
                        {policy.override || <span className="text-gray-400">—</span>}
                      </TableCell>
                      <TableCell>
                        {policy.status === 'overridden' ? (
                          <Badge className="bg-orange-100 text-orange-700">Overridden</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-700">Baseline</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Requestor</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvals.map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell className="font-medium">{approval.type}</TableCell>
                      <TableCell>{approval.requestor}</TableCell>
                      <TableCell>{approval.time}</TableCell>
                      <TableCell>{getStatusBadge(approval.status)}</TableCell>
                      <TableCell className="text-right">
                        {approval.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">Reject</Button>
                            <Button size="sm">Approve</Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit & Exports Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Audit Logs</CardTitle>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Evidence Bundle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.time}</TableCell>
                      <TableCell>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Plan</Label>
                  <p className="text-lg font-semibold mt-1">{tenant.planType}</p>
                </div>
                <div>
                  <Label>Billing Cycle</Label>
                  <p className="text-lg font-semibold mt-1">Monthly</p>
                </div>
                <div>
                  <Label>Next Payment</Label>
                  <p className="text-lg font-semibold mt-1">Oct 1, 2025</p>
                </div>
                <div>
                  <Label>Amount</Label>
                  <p className="text-lg font-semibold mt-1">CHF 2,499</p>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Usage Counters</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Active Bots</span>
                    <span>{tenant.usage.bots} / {tenant.usage.maxBots}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Portfolios</span>
                    <span>{tenant.usage.portfolios} / {tenant.usage.maxPortfolios}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly API Calls</span>
                    <span>{(tenant.usage.apiCalls / 1000).toFixed(0)}k / {(tenant.usage.maxApiCalls / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage</span>
                    <span>{tenant.usage.storage} GB / {tenant.usage.maxStorage} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Exports</span>
                    <span>12 / Unlimited</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}