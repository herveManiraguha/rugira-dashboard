import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Users, 
  Database, 
  Shield, 
  Key,
  Plus,
  Trash2,
  Edit,
  RotateCcw,
  Download,
  Upload,
  Edit2,
  UserX,
  UserCheck,
  TrendingUp,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'trader' | 'viewer';
  status: 'active' | 'suspended' | 'inactive';
  lastLogin: string;
  createdAt: string;
  country: string;
  totalTrades: number;
  totalVolume: string;
  subscription: 'Free' | 'Professional' | 'Enterprise';
}

interface SystemConfig {
  key: string;
  value: string;
  description: string;
  category: 'security' | 'trading' | 'system' | 'api';
}

export default function Admin() {
  const generateMockUsers = (): User[] => {
    const userData = [
      { username: 'hmueller', name: 'Hans Mueller', email: 'hans.mueller@rugira.ch', role: 'admin' as const, country: 'Switzerland', subscription: 'Enterprise' as const, totalTrades: 15847, totalVolume: '$2.4M' },
      { username: 'echen', name: 'Emma Chen', email: 'emma.chen@tradepro.com', role: 'trader' as const, country: 'Singapore', subscription: 'Professional' as const, totalTrades: 8924, totalVolume: '$1.2M' },
      { username: 'mrossi', name: 'Marco Rossi', email: 'marco.rossi@cryptofund.it', role: 'trader' as const, country: 'Italy', subscription: 'Professional' as const, totalTrades: 6743, totalVolume: '$890K' },
      { username: 'sjohnson', name: 'Sarah Johnson', email: 'sarah.j@quanthedge.com', role: 'trader' as const, country: 'United Kingdom', subscription: 'Professional' as const, totalTrades: 12456, totalVolume: '$1.8M' },
      { username: 'apetrov', name: 'Alex Petrov', email: 'alex.petrov@binarytech.ru', role: 'trader' as const, country: 'Russia', subscription: 'Professional' as const, totalTrades: 3421, totalVolume: '$345K' },
      { username: 'landerson', name: 'Lisa Anderson', email: 'lisa.anderson@tradewise.ca', role: 'viewer' as const, country: 'Canada', subscription: 'Free' as const, totalTrades: 1567, totalVolume: '$89K' },
      { username: 'htanaka', name: 'Hiroshi Tanaka', email: 'h.tanaka@cryptoasia.jp', role: 'trader' as const, country: 'Japan', subscription: 'Professional' as const, totalTrades: 9876, totalVolume: '$1.5M' },
      { username: 'pdubois', name: 'Pierre Dubois', email: 'pierre.dubois@tradeparis.fr', role: 'trader' as const, country: 'France', subscription: 'Professional' as const, totalTrades: 4532, totalVolume: '$567K' },
      { username: 'akowalski', name: 'Anna Kowalski', email: 'anna.k@cryptopoland.pl', role: 'viewer' as const, country: 'Poland', subscription: 'Free' as const, totalTrades: 892, totalVolume: '$34K' },
      { username: 'crodriguez', name: 'Carlos Rodriguez', email: 'carlos.r@trademexico.mx', role: 'trader' as const, country: 'Mexico', subscription: 'Free' as const, totalTrades: 2134, totalVolume: '$156K' },
      { username: 'ilarsson', name: 'Ingrid Larsson', email: 'ingrid.larsson@nordicfunds.se', role: 'trader' as const, country: 'Sweden', subscription: 'Professional' as const, totalTrades: 7234, totalVolume: '$923K' },
      { username: 'moconnor', name: 'Michael O\'Connor', email: 'michael.oconnor@irishcrypto.ie', role: 'trader' as const, country: 'Ireland', subscription: 'Professional' as const, totalTrades: 3876, totalVolume: '$445K' },
      { username: 'frashid', name: 'Fatima Al-Rashid', email: 'fatima.rashid@gulftrading.ae', role: 'trader' as const, country: 'UAE', subscription: 'Enterprise' as const, totalTrades: 11234, totalVolume: '$1.9M' },
      { username: 'dkim', name: 'David Kim', email: 'david.kim@koreafintech.kr', role: 'trader' as const, country: 'South Korea', subscription: 'Professional' as const, totalTrades: 5432, totalVolume: '$678K' },
      { username: 'evolkov', name: 'Elena Volkov', email: 'elena.volkov@baltictrade.ee', role: 'viewer' as const, country: 'Estonia', subscription: 'Free' as const, totalTrades: 234, totalVolume: '$12K' },
      { username: 'jsilva', name: 'João Silva', email: 'joao.silva@brasilcrypto.br', role: 'trader' as const, country: 'Brazil', subscription: 'Professional' as const, totalTrades: 4567, totalVolume: '$523K' },
      { username: 'rpatel', name: 'Raj Patel', email: 'raj.patel@mumbaitrading.in', role: 'trader' as const, country: 'India', subscription: 'Professional' as const, totalTrades: 8765, totalVolume: '$987K' },
      { username: 'smitchell', name: 'Sophie Mitchell', email: 'sophie.mitchell@aussiefunds.au', role: 'trader' as const, country: 'Australia', subscription: 'Professional' as const, totalTrades: 3241, totalVolume: '$387K' },
      { username: 'ahassan', name: 'Ahmed Hassan', email: 'ahmed.hassan@egypttrade.eg', role: 'viewer' as const, country: 'Egypt', subscription: 'Free' as const, totalTrades: 1456, totalVolume: '$67K' },
      { username: 'kweber', name: 'Klaus Weber', email: 'klaus.weber@germanfunds.de', role: 'trader' as const, country: 'Germany', subscription: 'Enterprise' as const, totalTrades: 9432, totalVolume: '$1.3M' }
    ];

    return userData.map((user, index) => {
      const hoursAgo = Math.floor(Math.random() * 168); // Up to 7 days ago
      const daysAgo = Math.floor(Math.random() * 365) + 30; // 30-395 days ago
      const statusOptions: ('active' | 'suspended' | 'inactive')[] = ['active', 'active', 'active', 'active', 'suspended', 'inactive'];
      const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      
      return {
        id: (index + 1).toString(),
        ...user,
        status: index === 0 ? 'active' : randomStatus, // Ensure admin is always active
        lastLogin: new Date(Date.now() - (hoursAgo * 3600000)).toISOString(),
        createdAt: new Date(Date.now() - (daysAgo * 24 * 3600000)).toISOString()
      };
    });
  };

  const [users] = useState<User[]>(generateMockUsers());

  const [systemConfigs] = useState<SystemConfig[]>([
    {
      key: 'MAX_POSITION_SIZE',
      value: '50000',
      description: 'Maximum position size per bot (USD)',
      category: 'trading'
    },
    {
      key: 'SESSION_TIMEOUT',
      value: '3600',
      description: 'User session timeout (seconds)',
      category: 'security'
    },
    {
      key: 'API_RATE_LIMIT',
      value: '1000',
      description: 'API requests per minute limit',
      category: 'api'
    },
    {
      key: 'LOG_RETENTION_DAYS',
      value: '90',
      description: 'Number of days to retain system logs',
      category: 'system'
    }
  ]);

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const { toast } = useToast();

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'admin': return <Badge variant="destructive">Admin</Badge>;
      case 'trader': return <Badge className="bg-blue-100 text-blue-800">Trader</Badge>;
      case 'viewer': return <Badge variant="secondary">Viewer</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspended': return <Badge variant="destructive">Suspended</Badge>;
      case 'inactive': return <Badge variant="secondary">Inactive</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getSubscriptionBadge = (subscription: User['subscription']) => {
    switch (subscription) {
      case 'Enterprise': return <Badge className="bg-brand-red text-white">Enterprise</Badge>;
      case 'Professional': return <Badge className="bg-brand-green text-white">Professional</Badge>;
      case 'Free': return <Badge variant="outline">Free</Badge>;
    }
  };

  const getCategoryBadge = (category: SystemConfig['category']) => {
    const colors = {
      security: 'bg-red-100 text-red-800',
      trading: 'bg-green-100 text-green-800',
      system: 'bg-blue-100 text-blue-800',
      api: 'bg-purple-100 text-purple-800'
    };
    return <Badge className={colors[category]}>{category}</Badge>;
  };

  const AddUserForm = () => {
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      role: 'trader',
      sendWelcome: true
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      toast({ title: "User management will be implemented with backend API" });
      setIsAddUserModalOpen(false);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            placeholder="Enter username"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter email address"
            required
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
            className="w-full p-2 border rounded-md"
          >
            <option value="viewer">Viewer</option>
            <option value="trader">Trader</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.sendWelcome}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendWelcome: checked }))}
          />
          <Label>Send welcome email</Label>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => setIsAddUserModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Add User</Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
        <p className="text-gray-600">Manage users, system configuration, and security settings</p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="system">System Config</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-6">
          {/* User Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <UserCheck className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Total Volume</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(users.reduce((acc, user) => {
                        const volume = parseFloat(user.totalVolume.replace(/[$KM,]/g, ''));
                        const multiplier = user.totalVolume.includes('M') ? 1000000 : user.totalVolume.includes('K') ? 1000 : 1;
                        return acc + (volume * multiplier);
                      }, 0) / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Total Trades</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.reduce((acc, user) => acc + user.totalTrades, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">User Management</h2>
            <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-user">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <AddUserForm />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Total Trades</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-brand-red to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{getSubscriptionBadge(user.subscription)}</TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-900">{user.country}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{user.totalTrades.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">{user.totalVolume}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" data-testid="button-edit-user">
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" data-testid="button-suspend-user">
                            <UserX className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" data-testid="button-delete-user">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Setting</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemConfigs.map((config) => (
                    <TableRow key={config.key}>
                      <TableCell className="font-medium font-mono text-sm">{config.key}</TableCell>
                      <TableCell>{getCategoryBadge(config.category)}</TableCell>
                      <TableCell className="font-mono text-sm">{config.value}</TableCell>
                      <TableCell className="text-sm text-gray-600">{config.description}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Require 2FA for all admin accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Whitelisting</Label>
                    <p className="text-sm text-gray-500">Restrict access by IP address</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Session Monitoring</Label>
                    <p className="text-sm text-gray-500">Log all user sessions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  API Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>API Rate Limiting</Label>
                    <p className="text-sm text-gray-500">Current: 1000 req/min</p>
                  </div>
                  <Button size="sm" variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>API Key Rotation</Label>
                    <p className="text-sm text-gray-500">Last rotated: 30 days ago</p>
                  </div>
                  <Button size="sm" variant="outline">Rotate Now</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Database Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Database Backup</Label>
                    <p className="text-sm text-gray-500">Last backup: 2 hours ago</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    Backup Now
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Index Optimization</Label>
                    <p className="text-sm text-gray-500">Optimize database indexes</p>
                  </div>
                  <Button size="sm" variant="outline">Optimize</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>System Maintenance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Log Cleanup</Label>
                    <p className="text-sm text-gray-500">Remove logs older than 90 days</p>
                  </div>
                  <Button size="sm" variant="outline">Clean Logs</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cache Clear</Label>
                    <p className="text-sm text-gray-500">Clear application cache</p>
                  </div>
                  <Button size="sm" variant="outline">Clear Cache</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}