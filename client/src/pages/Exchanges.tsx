import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Building2, CheckCircle, AlertTriangle, RotateCcw, Trash2, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExchangeConnection {
  id: string;
  name: string;
  alias: string;
  permissions: string;
  status: 'connected' | 'disconnected' | 'error';
  environment: 'live' | 'paper';
  lastVerified: string;
  apiKeyMasked: string;
}

export default function Exchanges() {
  const [connections, setConnections] = useState<ExchangeConnection[]>([
    {
      id: '1',
      name: 'Binance',
      alias: 'Main Trading Account',
      permissions: 'Trade-only',
      status: 'connected',
      environment: 'paper',
      lastVerified: new Date().toISOString(),
      apiKeyMasked: 'abc...123'
    },
    {
      id: '2',
      name: 'Coinbase Pro',
      alias: 'Secondary Account',
      permissions: 'Trade-only',
      status: 'error',
      environment: 'paper',
      lastVerified: new Date(Date.now() - 86400000).toISOString(),
      apiKeyMasked: 'def...456'
    }
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: ExchangeConnection['status']) => {
    switch (status) {
      case 'connected': return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'disconnected': return <Badge variant="secondary">Disconnected</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const AddConnectionForm = () => {
    const [formData, setFormData] = useState({
      exchange: '',
      alias: '',
      apiKey: '',
      apiSecret: '',
      environment: 'paper'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      toast({ title: "Exchange connection will be implemented with backend API" });
      setIsAddModalOpen(false);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="exchange">Exchange</Label>
          <Input
            id="exchange"
            value={formData.exchange}
            onChange={(e) => setFormData(prev => ({ ...prev, exchange: e.target.value }))}
            placeholder="e.g., Binance"
            required
          />
        </div>
        <div>
          <Label htmlFor="alias">Account Alias</Label>
          <Input
            id="alias"
            value={formData.alias}
            onChange={(e) => setFormData(prev => ({ ...prev, alias: e.target.value }))}
            placeholder="e.g., Main Trading Account"
            required
          />
        </div>
        <div>
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            type="password"
            value={formData.apiKey}
            onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
            placeholder="Enter API key"
            required
          />
          <p className="text-xs text-yellow-600 mt-1">⚠️ Ensure API key has trade-only permissions</p>
        </div>
        <div>
          <Label htmlFor="apiSecret">API Secret</Label>
          <Input
            id="apiSecret"
            type="password"
            value={formData.apiSecret}
            onChange={(e) => setFormData(prev => ({ ...prev, apiSecret: e.target.value }))}
            placeholder="Enter API secret"
            required
          />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
            Cancel
          </Button>
          <Button type="button" variant="outline">
            <TestTube className="h-4 w-4 mr-2" />
            Test Connection
          </Button>
          <Button type="submit">Add Connection</Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exchange Connections</h1>
          <p className="text-gray-600">Manage your exchange API connections and credentials</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Connection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Exchange Connection</DialogTitle>
            </DialogHeader>
            <AddConnectionForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exchange</TableHead>
                <TableHead>Account Alias</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Verified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connections.map((connection) => (
                <TableRow key={connection.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4" />
                      <span>{connection.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{connection.alias}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-700 border-green-200">
                      {connection.permissions}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={connection.environment === 'live' ? 'destructive' : 'secondary'}>
                      {connection.environment}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(connection.status)}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(connection.lastVerified).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast({ title: "Connection test functionality coming soon" })}
                      >
                        <TestTube className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast({ title: "Key rotation functionality coming soon" })}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast({ title: "Connection removal functionality coming soon" })}
                      >
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
    </div>
  );
}