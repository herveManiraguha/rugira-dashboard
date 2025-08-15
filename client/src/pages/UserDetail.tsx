import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  TrendingUp,
  Activity,
  DollarSign,
  Clock,
  Edit,
  Save,
  X,
  UserX,
  UserCheck,
  RotateCcw,
  Key,
  AlertTriangle
} from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'trader' | 'viewer';
  status: 'active' | 'suspended' | 'inactive';
  lastLogin: string;
  createdAt: string;
  country: string;
  phone: string;
  totalTrades: number;
  totalVolume: string;
  subscription: 'Free' | 'Professional' | 'Enterprise';
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  apiAccess: boolean;
  lastIpAddress: string;
  accountBalance: string;
  profitLoss: string;
  winRate: number;
}

interface Trade {
  id: string;
  pair: string;
  type: 'buy' | 'sell';
  amount: string;
  price: string;
  total: string;
  status: 'completed' | 'pending' | 'cancelled';
  timestamp: string;
  profit?: string;
}

export default function UserDetail() {
  const [, params] = useRoute('/admin/user/:id');
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data - in real app would fetch from API using params.id
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: params?.id || '1',
    username: 'hmueller',
    name: 'Hans Mueller',
    email: 'hans.mueller@rugira.ch',
    role: 'admin',
    status: 'active',
    lastLogin: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
    country: 'Switzerland',
    phone: '+41 79 123 4567',
    totalTrades: 15847,
    totalVolume: '$2.4M',
    subscription: 'Enterprise',
    twoFactorEnabled: true,
    emailNotifications: true,
    apiAccess: true,
    lastIpAddress: '185.23.45.67',
    accountBalance: '$45,230.50',
    profitLoss: '+$12,450.30',
    winRate: 73.2
  });

  const [recentTrades] = useState<Trade[]>([
    {
      id: '1',
      pair: 'BTC/USD',
      type: 'buy',
      amount: '0.5',
      price: '$42,150',
      total: '$21,075',
      status: 'completed',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      profit: '+$1,250'
    },
    {
      id: '2',
      pair: 'ETH/USD',
      type: 'sell',
      amount: '2.0',
      price: '$2,450',
      total: '$4,900',
      status: 'completed',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      profit: '+$320'
    },
    {
      id: '3',
      pair: 'ADA/USD',
      type: 'buy',
      amount: '1000',
      price: '$0.45',
      total: '$450',
      status: 'pending',
      timestamp: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: '4',
      pair: 'DOT/USD',
      type: 'sell',
      amount: '50',
      price: '$12.30',
      total: '$615',
      status: 'cancelled',
      timestamp: new Date(Date.now() - 5400000).toISOString()
    }
  ]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <Badge variant="destructive">Admin</Badge>;
      case 'trader': return <Badge className="bg-blue-100 text-blue-800">Trader</Badge>;
      case 'viewer': return <Badge variant="secondary">Viewer</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspended': return <Badge variant="destructive">Suspended</Badge>;
      case 'inactive': return <Badge variant="secondary">Inactive</Badge>;
    }
  };

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case 'Enterprise': return <Badge className="bg-brand-red text-white">Enterprise</Badge>;
      case 'Professional': return <Badge className="bg-brand-green text-white">Professional</Badge>;
      case 'Free': return <Badge variant="outline">Free</Badge>;
    }
  };

  const getTradeStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'cancelled': return <Badge variant="secondary">Cancelled</Badge>;
    }
  };

  const handleSave = () => {
    toast({
      title: "User Updated",
      description: "User profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleSuspendUser = () => {
    toast({
      title: "User Suspended",
      description: `${userProfile.name} has been suspended.`,
    });
  };

  const handleResetPassword = () => {
    toast({
      title: "Password Reset",
      description: "Password reset email sent to user.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-red to-red-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{userProfile.name}</h1>
              <p className="text-gray-600">@{userProfile.username} • {userProfile.email}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {userProfile.status === 'active' ? (
            <Button variant="outline" onClick={handleSuspendUser} data-testid="button-suspend-user">
              <UserX className="h-4 w-4 mr-2" />
              Suspend User
            </Button>
          ) : (
            <Button variant="outline" data-testid="button-activate-user">
              <UserCheck className="h-4 w-4 mr-2" />
              Activate User
            </Button>
          )}
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} data-testid="button-edit-profile">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Account Balance</p>
                <p className="text-2xl font-bold text-gray-900">{userProfile.accountBalance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Profit/Loss</p>
                <p className="text-2xl font-bold text-green-600">{userProfile.profitLoss}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Trades</p>
                <p className="text-2xl font-bold text-gray-900">{userProfile.totalTrades.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900">{userProfile.winRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
          <TabsTrigger value="trading">Trading History</TabsTrigger>
          <TabsTrigger value="security">Security & Access</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userProfile.name.split(' ')[0]}
                      disabled={!isEditing}
                      data-testid="input-first-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userProfile.name.split(' ')[1]}
                      disabled={!isEditing}
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      value={userProfile.email}
                      disabled={!isEditing}
                      className="pl-10"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={userProfile.phone}
                      disabled={!isEditing}
                      className="pl-10"
                      data-testid="input-phone"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="country"
                      value={userProfile.country}
                      disabled={!isEditing}
                      className="pl-10"
                      data-testid="input-country"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Role</span>
                  {getRoleBadge(userProfile.role)}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  {getStatusBadge(userProfile.status)}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Subscription</span>
                  {getSubscriptionBadge(userProfile.subscription)}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium">
                      {new Date(userProfile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Login</span>
                    <span className="font-medium">
                      {new Date(userProfile.lastLogin).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last IP Address</span>
                    <span className="font-mono text-xs">{userProfile.lastIpAddress}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Volume</span>
                    <span className="font-medium text-green-600">{userProfile.totalVolume}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={handleResetPassword}
                    data-testid="button-reset-password"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    data-testid="button-force-logout"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Force Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trading Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pair</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Profit/Loss</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTrades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell className="font-medium">{trade.pair}</TableCell>
                        <TableCell>
                          <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                            {trade.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{trade.amount}</TableCell>
                        <TableCell>{trade.price}</TableCell>
                        <TableCell className="font-medium">{trade.total}</TableCell>
                        <TableCell>{getTradeStatusBadge(trade.status)}</TableCell>
                        <TableCell>
                          {trade.profit ? (
                            <span className={trade.profit.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                              {trade.profit}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(trade.timestamp).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                    <p className="text-xs text-gray-500">Enhanced account security</p>
                  </div>
                  <Switch
                    checked={userProfile.twoFactorEnabled}
                    disabled={!isEditing}
                    data-testid="switch-2fa"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Email Notifications</Label>
                    <p className="text-xs text-gray-500">Trading alerts and updates</p>
                  </div>
                  <Switch
                    checked={userProfile.emailNotifications}
                    disabled={!isEditing}
                    data-testid="switch-email-notifications"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">API Access</Label>
                    <p className="text-xs text-gray-500">Allow third-party integrations</p>
                  </div>
                  <Switch
                    checked={userProfile.apiAccess}
                    disabled={!isEditing}
                    data-testid="switch-api-access"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                  Security Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    Last login from new device: iPhone (iOS 17) from Zurich, Switzerland
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">2 hours ago</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    Password changed successfully
                  </p>
                  <p className="text-xs text-green-600 mt-1">3 days ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Activity Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">User logged in</p>
                    <p className="text-xs text-gray-500">IP: {userProfile.lastIpAddress}</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Completed trade: BTC/USD</p>
                    <p className="text-xs text-gray-500">Amount: 0.5 BTC</p>
                  </div>
                  <span className="text-xs text-gray-500">3 hours ago</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Profile updated</p>
                    <p className="text-xs text-gray-500">Phone number changed</p>
                  </div>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Password reset requested</p>
                    <p className="text-xs text-gray-500">Email verification sent</p>
                  </div>
                  <span className="text-xs text-gray-500">3 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}