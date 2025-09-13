import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  Plus,
  Trash2,
  Shield,
  AlertCircle,
  Check,
  RefreshCw,
  Calendar,
  Activity
} from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  secret: string;
  permissions: string[];
  created: string;
  lastUsed: string;
  status: 'active' | 'inactive' | 'expired';
  requests: number;
}

export default function ApiKeys() {
  const { toast } = useToast();
  
  // Mock API keys data
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production Trading Bot',
      key: 'pk_live_Xk9J2mN4pQ7rS8tU1vW3yZ5a',
      secret: 'sk_live_************************7890',
      permissions: ['trading', 'read:positions', 'write:orders'],
      created: '2024-01-15',
      lastUsed: '2025-09-03 15:30',
      status: 'active',
      requests: 145823,
    },
    {
      id: '2',
      name: 'Development Testing',
      key: 'pk_test_Bk7H3lM5nP9qR2sT4vW6xY8z',
      secret: 'sk_test_************************abcd',
      permissions: ['read:positions', 'read:orders'],
      created: '2024-03-20',
      lastUsed: '2025-09-02 10:15',
      status: 'active',
      requests: 8542,
    },
    {
      id: '3',
      name: 'Analytics Dashboard',
      key: 'pk_live_Dk5F1jK3lM7nP9qR2sT4vW6x',
      secret: 'sk_live_************************efgh',
      permissions: ['read:positions', 'read:analytics'],
      created: '2024-02-10',
      lastUsed: '2025-08-28 14:20',
      status: 'inactive',
      requests: 32156,
    },
  ]);
  
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  
  const availablePermissions = [
    { value: 'trading', label: 'Trading Operations', description: 'Execute trades and manage orders' },
    { value: 'read:positions', label: 'Read Positions', description: 'View position data' },
    { value: 'write:orders', label: 'Write Orders', description: 'Create and modify orders' },
    { value: 'read:orders', label: 'Read Orders', description: 'View order history' },
    { value: 'read:analytics', label: 'Read Analytics', description: 'Access analytics data' },
    { value: 'webhooks', label: 'Webhooks', description: 'Manage webhook endpoints' },
  ];
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${type} copied to clipboard`,
    });
  };
  
  const toggleSecretVisibility = (keyId: string) => {
    setShowSecrets(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };
  
  const createNewKey = () => {
    if (!newKeyName || selectedPermissions.length === 0) {
      toast({
        title: "Error",
        description: "Please provide a name and select permissions",
        variant: "destructive",
      });
      return;
    }
    
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `pk_live_${Math.random().toString(36).substring(2, 15)}`,
      secret: `sk_live_${Math.random().toString(36).substring(2, 35)}`,
      permissions: selectedPermissions,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      status: 'active',
      requests: 0,
    };
    
    setApiKeys([...apiKeys, newKey]);
    setIsCreating(false);
    setNewKeyName('');
    setSelectedPermissions([]);
    
    toast({
      title: "API Key Created",
      description: "Your new API key has been created successfully",
    });
  };
  
  const deleteKey = (keyId: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== keyId));
    setKeyToDelete(null);
    
    toast({
      title: "API Key Deleted",
      description: "The API key has been permanently deleted",
    });
  };
  
  const regenerateKey = (keyId: string) => {
    setApiKeys(apiKeys.map(key => {
      if (key.id === keyId) {
        return {
          ...key,
          secret: `sk_live_${Math.random().toString(36).substring(2, 35)}`,
        };
      }
      return key;
    }));
    
    toast({
      title: "Secret Regenerated",
      description: "A new secret has been generated for this API key",
    });
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your API keys for programmatic access</p>
        </div>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Create a new API key with specific permissions for your application
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., Production Trading Bot"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availablePermissions.map(perm => (
                    <label
                      key={perm.value}
                      className="flex items-start gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={selectedPermissions.includes(perm.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPermissions([...selectedPermissions, perm.value]);
                          } else {
                            setSelectedPermissions(selectedPermissions.filter(p => p !== perm.value));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{perm.label}</p>
                        <p className="text-xs text-gray-500">{perm.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={createNewKey}>
                Create Key
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Security Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-amber-900">Security Notice</p>
          <p className="text-amber-700 mt-1">
            Never share your API keys or secrets. Keep them secure and rotate them regularly.
            API keys provide full access to your account within their permission scope.
          </p>
        </div>
      </div>
      
      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map(apiKey => (
          <Card key={apiKey.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{apiKey.name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    Created {apiKey.created}
                    {apiKey.lastUsed !== 'Never' && (
                      <>
                        <span className="mx-1">•</span>
                        <Activity className="h-3 w-3" />
                        Last used {apiKey.lastUsed}
                      </>
                    )}
                  </div>
                </div>
                <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>
                  {apiKey.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* API Key */}
              <div className="space-y-2">
                <Label className="text-xs">API Key</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={apiKey.key}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(apiKey.key, 'API Key')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Secret */}
              <div className="space-y-2">
                <Label className="text-xs">Secret Key</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type={showSecrets[apiKey.id] ? 'text' : 'password'}
                    value={showSecrets[apiKey.id] ? apiKey.secret : apiKey.secret.replace(/./g, '*')}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSecretVisibility(apiKey.id)}
                  >
                    {showSecrets[apiKey.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(apiKey.secret, 'Secret Key')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Permissions */}
              <div className="space-y-2">
                <Label className="text-xs">Permissions</Label>
                <div className="flex flex-wrap gap-2">
                  {apiKey.permissions.map(perm => (
                    <Badge key={perm} variant="outline" className="text-xs">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Statistics */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-sm text-gray-500">
                  {apiKey.requests.toLocaleString()} requests made
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => regenerateKey(apiKey.id)}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Regenerate
                  </Button>
                  
                  <Dialog open={keyToDelete === apiKey.id} onOpenChange={(open) => !open && setKeyToDelete(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setKeyToDelete(apiKey.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete API Key</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete "{apiKey.name}"? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setKeyToDelete(null)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={() => deleteKey(apiKey.id)}>
                          Delete Key
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Usage Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>API Usage Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Rate Limits</p>
              <p>API requests are limited to 1000 requests per minute per key</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Best Practices</p>
              <p>Use environment variables to store keys, never commit them to version control</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <RefreshCw className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Key Rotation</p>
              <p>Rotate your API keys every 90 days for enhanced security</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}