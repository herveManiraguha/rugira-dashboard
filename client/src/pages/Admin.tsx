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
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'trader' | 'viewer';
  status: 'active' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

interface SystemConfig {
  key: string;
  value: string;
  description: string;
  category: 'security' | 'trading' | 'system' | 'api';
}

export default function Admin() {
  const [users] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      email: 'admin@rugira.ch',
      role: 'admin',
      status: 'active',
      lastLogin: new Date().toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
    },
    {
      id: '2',
      username: 'trader1',
      email: 'trader@rugira.ch',
      role: 'trader',
      status: 'active',
      lastLogin: new Date(Date.now() - 3600000).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
    }
  ]);

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
      default: return <Badge variant="secondary">Unknown</Badge>;
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">User Accounts</h2>
            <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
              <DialogTrigger asChild>
                <Button>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(user.lastLogin).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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