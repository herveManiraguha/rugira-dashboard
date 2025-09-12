import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Users, 
  CreditCard, 
  Package,
  Calendar,
  TrendingUp,
  Check,
  X,
  Download,
  Plus,
  Mail,
  Shield,
  AlertCircle,
  ChevronRight,
  Zap,
  Database,
  Activity,
  Globe
} from 'lucide-react';

export default function Organization() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock organization data
  const organization = {
    name: 'Bahnhofstrasse Family Office',
    id: 'ORG-2024-001',
    plan: 'Professional',
    seats: { used: 7, total: 10 },
    storage: { used: 45, total: 100 }, // GB
    apiCalls: { used: 850000, total: 1000000 },
    billing: {
      nextPayment: '2025-10-01',
      amount: 2499,
      currency: 'CHF',
      paymentMethod: '**** 4242',
    },
  };
  
  // Mock team members
  const teamMembers = [
    { id: 1, name: 'Hans Müller', email: 'hans.mueller@rugira.ch', role: 'Admin', status: 'active', lastActive: '5 min ago' },
    { id: 2, name: 'Emma Schmidt', email: 'emma.schmidt@rugira.ch', role: 'Trader', status: 'active', lastActive: '1 hour ago' },
    { id: 3, name: 'Lars Jensen', email: 'lars.jensen@rugira.ch', role: 'Analyst', status: 'active', lastActive: '2 hours ago' },
    { id: 4, name: 'Sofia Andersson', email: 'sofia.andersson@rugira.ch', role: 'Compliance', status: 'active', lastActive: '1 day ago' },
    { id: 5, name: 'Marco Rossi', email: 'marco.rossi@rugira.ch', role: 'Viewer', status: 'inactive', lastActive: '3 days ago' },
  ];
  
  // Mock billing history
  const billingHistory = [
    { id: 1, date: '2025-09-01', amount: 2499, status: 'paid', invoice: 'INV-2025-09' },
    { id: 2, date: '2025-08-01', amount: 2499, status: 'paid', invoice: 'INV-2025-08' },
    { id: 3, date: '2025-07-01', amount: 2499, status: 'paid', invoice: 'INV-2025-07' },
    { id: 4, date: '2025-06-01', amount: 2499, status: 'paid', invoice: 'INV-2025-06' },
    { id: 5, date: '2025-05-01', amount: 1999, status: 'paid', invoice: 'INV-2025-05' },
  ];
  
  const features = [
    { name: 'Unlimited Bots', included: true },
    { name: 'Advanced Analytics', included: true },
    { name: 'API Access', included: true },
    { name: 'Priority Support', included: true },
    { name: 'Custom Integrations', included: true },
    { name: 'Audit Logs', included: true },
    { name: 'SSO Integration', included: false, addon: true },
    { name: 'Dedicated Account Manager', included: false, addon: true },
  ];
  
  const handleUpgrade = () => {
    toast({
      title: "Upgrade Plan",
      description: "Please contact sales@rugira.ch for enterprise plans",
    });
  };
  
  const handleInviteMember = () => {
    toast({
      title: "Invite Sent",
      description: "An invitation has been sent to the new team member",
    });
  };
  
  const downloadInvoice = (invoiceId: string) => {
    toast({
      title: "Downloading Invoice",
      description: `Downloading ${invoiceId}.pdf`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization & Billing</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your organization settings and subscription</p>
        </div>
        <Button onClick={handleUpgrade}>
          <Zap className="h-4 w-4 mr-2" />
          Upgrade Plan
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Organization Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-[#E10600] flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>{organization.name}</CardTitle>
                    <p className="text-sm text-gray-500">Organization ID: {organization.id}</p>
                  </div>
                </div>
                <Badge variant="default" className="text-sm">
                  {organization.plan} Plan
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Team Members */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Team Members</span>
                    <Users className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold">
                    {organization.seats.used}/{organization.seats.total}
                  </div>
                  <Progress value={(organization.seats.used / organization.seats.total) * 100} className="h-2" />
                </div>
                
                {/* Storage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Storage Used</span>
                    <Database className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold">
                    {organization.storage.used} GB
                  </div>
                  <Progress value={(organization.storage.used / organization.storage.total) * 100} className="h-2" />
                </div>
                
                {/* API Calls */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">API Calls (Monthly)</span>
                    <Activity className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold">
                    {(organization.apiCalls.used / 1000).toFixed(0)}K
                  </div>
                  <Progress value={(organization.apiCalls.used / organization.apiCalls.total) * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Current Plan Features */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Features</CardTitle>
              <CardDescription>Your current plan includes the following features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map(feature => (
                  <div key={feature.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300" />
                      )}
                      <span className={feature.included ? '' : 'text-gray-400'}>
                        {feature.name}
                      </span>
                    </div>
                    {feature.addon && (
                      <Badge variant="outline" className="text-xs">
                        Add-on
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage your team and their access levels</CardDescription>
                </div>
                <Button onClick={handleInviteMember}>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={member.role === 'Admin' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                      <div className="text-right">
                        <Badge 
                          variant={member.status === 'active' ? 'outline' : 'secondary'}
                          className={member.status === 'active' ? 'border-green-500 text-green-700' : ''}
                        >
                          {member.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{member.lastActive}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          {/* Next Payment */}
          <Card>
            <CardHeader>
              <CardTitle>Next Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">CHF {organization.billing.amount}</p>
                  <p className="text-sm text-gray-500">Due on {organization.billing.nextPayment}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Visa {organization.billing.paymentMethod}</span>
                  </div>
                  <Button variant="link" className="text-xs p-0 h-auto mt-1">
                    Update payment method
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your recent invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {billingHistory.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                    <div className="flex items-center gap-4">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium">{item.date}</p>
                        <p className="text-sm text-gray-500">{item.invoice}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">CHF {item.amount}</span>
                      <Badge variant="outline" className="border-green-500 text-green-700">
                        {item.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadInvoice(item.invoice)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Single Sign-On (SSO)</p>
                    <p className="text-sm text-gray-500">Enable SSO for your organization</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Custom Domain</p>
                    <p className="text-sm text-gray-500">Use your own domain for the dashboard</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Setup
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Configure organization-wide email settings</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <p className="font-medium">Delete Organization</p>
                  <p className="text-sm text-gray-600">Permanently delete your organization and all data</p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Organization
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}