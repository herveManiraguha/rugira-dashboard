import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { StandardPageLayout } from '@/components/ui/standard-page-layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Building2,
  Plus,
  Search,
  MoreHorizontal,
  Download,
  Power,
  Trash2,
  ExternalLink,
  Users,
  Bot,
  Building,
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
  Shield,
  Activity
} from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'suspended';
  portfolios: number;
  activeBots: number;
  connectedVenues: number;
  lastActivity: string;
  pendingApprovals: number;
  region: string;
  legalEntity?: string;
  created: string;
  planType: string;
  usage: {
    bots: number;
    maxBots: number;
    portfolios: number;
    maxPortfolios: number;
    apiCalls: number;
    maxApiCalls: number;
  };
}

export default function Tenants() {
  const [, setLocation] = useLocation();
  const { user, currentTenant, switchTenant } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [killSwitchDialogOpen, setKillSwitchDialogOpen] = useState(false);

  // Check if user is Organization Admin
  const isOrgAdmin = user?.tenant_roles?.[currentTenant || 'rugira-prod']?.includes('admin');

  // Mock tenant data
  const tenants: Tenant[] = [
    {
      id: 'rugira-prod',
      name: 'Bahnhofstrasse Production',
      status: 'active',
      portfolios: 5,
      activeBots: 12,
      connectedVenues: 8,
      lastActivity: '2 min ago',
      pendingApprovals: 3,
      region: 'CH',
      legalEntity: 'Bahnhofstrasse Family Office AG',
      created: '2024-01-15',
      planType: 'Professional',
      usage: {
        bots: 12,
        maxBots: 50,
        portfolios: 5,
        maxPortfolios: 10,
        apiCalls: 850000,
        maxApiCalls: 1000000
      }
    },
    {
      id: 'rugira-test',
      name: 'Bahnhofstrasse Test',
      status: 'active',
      portfolios: 2,
      activeBots: 4,
      connectedVenues: 3,
      lastActivity: '15 min ago',
      pendingApprovals: 0,
      region: 'CH',
      created: '2024-01-15',
      planType: 'Professional',
      usage: {
        bots: 4,
        maxBots: 50,
        portfolios: 2,
        maxPortfolios: 10,
        apiCalls: 125000,
        maxApiCalls: 1000000
      }
    },
    {
      id: 'client-alpha',
      name: 'Client Alpha',
      status: 'active',
      portfolios: 3,
      activeBots: 8,
      connectedVenues: 5,
      lastActivity: '1 hour ago',
      pendingApprovals: 1,
      region: 'EU',
      legalEntity: 'Alpha Capital Partners',
      created: '2024-03-20',
      planType: 'Enterprise',
      usage: {
        bots: 8,
        maxBots: 100,
        portfolios: 3,
        maxPortfolios: 20,
        apiCalls: 450000,
        maxApiCalls: 5000000
      }
    }
  ];

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.legalEntity?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTenant = () => {
    setLocation('/tenants/new');
  };

  const handleSwitchToTenant = (tenantId: string) => {
    switchTenant(tenantId);
    toast({
      title: "Tenant Switched",
      description: `Switched to ${tenants.find(t => t.id === tenantId)?.name}`,
    });
  };

  const handleOpenTenant = (tenantId: string) => {
    setLocation(`/tenants/${tenantId}`);
  };

  const handleKillSwitch = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setKillSwitchDialogOpen(true);
  };

  const confirmKillSwitch = () => {
    if (selectedTenant) {
      toast({
        title: "Kill Switch Activated",
        description: `All bots for ${selectedTenant.name} have been stopped`,
        variant: "destructive"
      });
    }
    setKillSwitchDialogOpen(false);
    setSelectedTenant(null);
  };

  const handleExportAudit = (tenant: Tenant) => {
    toast({
      title: "Export Started",
      description: `Generating audit report for ${tenant.name}...`,
    });
  };

  const handleDeleteTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTenant) {
      toast({
        title: "Tenant Deleted",
        description: `${selectedTenant.name} has been deleted`,
        variant: "destructive"
      });
    }
    setDeleteDialogOpen(false);
    setSelectedTenant(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-700">Suspended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getRegionBadge = (region: string) => {
    return (
      <div className="flex items-center gap-1">
        <Globe className="h-3 w-3" />
        <span>{region}</span>
      </div>
    );
  };

  if (!isOrgAdmin) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-gray-600 text-center max-w-md">
              Only Organization Administrators can access tenant management. 
              Please contact your administrator for access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <StandardPageLayout
      title="Tenants"
      subtitle="Manage organization tenants and their configurations"
      actionButton={{
        label: "Create Tenant",
        onClick: handleCreateTenant,
        icon: <Plus className="h-4 w-4" />
      }}
    >

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tenants</p>
                  <p className="text-2xl font-bold">{tenants.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Bots</p>
                  <p className="text-2xl font-bold">
                    {tenants.reduce((sum, t) => sum + t.activeBots, 0)}
                  </p>
                </div>
                <Bot className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Portfolios</p>
                  <p className="text-2xl font-bold">
                    {tenants.reduce((sum, t) => sum + t.portfolios, 0)}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold">
                    {tenants.reduce((sum, t) => sum + t.pendingApprovals, 0)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="search"
          placeholder="Search tenants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tenants Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Portfolios</TableHead>
                <TableHead className="text-center">Active Bots</TableHead>
                <TableHead className="text-center">Connected Venues</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="text-center">Pending Approvals</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{tenant.name}</div>
                      {tenant.legalEntity && (
                        <div className="text-sm text-gray-500">{tenant.legalEntity}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                  <TableCell className="text-center">{tenant.portfolios}</TableCell>
                  <TableCell className="text-center">{tenant.activeBots}</TableCell>
                  <TableCell className="text-center">{tenant.connectedVenues}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-3 w-3" />
                      {tenant.lastActivity}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {tenant.pendingApprovals > 0 ? (
                      <Badge variant="outline" className="bg-yellow-50">
                        {tenant.pendingApprovals}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>{getRegionBadge(tenant.region)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleSwitchToTenant(tenant.id)}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Switch to Tenant
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenTenant(tenant.id)}>
                          <Building2 className="h-4 w-4 mr-2" />
                          Open Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleExportAudit(tenant)}>
                          <Download className="h-4 w-4 mr-2" />
                          Export Audit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleKillSwitch(tenant)}
                          className="text-orange-600"
                        >
                          <Power className="h-4 w-4 mr-2" />
                          Kill Switch
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteTenant(tenant)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tenant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedTenant?.name}"? This action cannot be undone.
              All associated data, bots, and configurations will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Tenant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Kill Switch Confirmation Dialog */}
      <AlertDialog open={killSwitchDialogOpen} onOpenChange={setKillSwitchDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate Kill Switch</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately stop all {selectedTenant?.activeBots} active bots for "{selectedTenant?.name}".
              Bots can be restarted manually after the kill switch is deactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmKillSwitch}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Activate Kill Switch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </StandardPageLayout>
  );
}