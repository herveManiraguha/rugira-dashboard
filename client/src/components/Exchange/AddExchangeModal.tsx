import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExchangeIcon } from '@/components/ui/exchange-icon';
import { 
  Plus, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Shield,
  Key,
  Link,
  AlertTriangle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExchangeInfo {
  name: string;
  displayName: string;
  logo: string;
  description: string;
  features: string[];
  requiresPassphrase: boolean;
  supportsSandbox: boolean;
  apiDocsUrl: string;
}

const supportedExchanges: ExchangeInfo[] = [
  {
    name: 'binance',
    displayName: 'Binance',
    logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/binance-logo-icon.svg',
    description: 'World\'s largest cryptocurrency exchange by trading volume',
    features: ['Spot Trading', 'Futures', 'Margin', 'Options', 'P2P', 'Staking'],
    requiresPassphrase: false,
    supportsSandbox: true,
    apiDocsUrl: 'https://binance-docs.github.io/apidocs/'
  },
  {
    name: 'coinbase',
    displayName: 'Coinbase Advanced',
    logo: 'https://altcoinsbox.com/wp-content/uploads/2023/01/coinbase-logo.svg',
    description: 'Leading US-based cryptocurrency exchange with advanced trading features',
    features: ['Spot Trading', 'Institutional', 'Advanced Trading', 'API Access'],
    requiresPassphrase: true,
    supportsSandbox: true,
    apiDocsUrl: 'https://docs.cloud.coinbase.com/'
  },
  {
    name: 'kraken',
    displayName: 'Kraken',
    logo: 'https://altcoinsbox.com/wp-content/uploads/2023/01/kraken-logo.svg',
    description: 'Established European exchange with comprehensive trading features',
    features: ['Spot Trading', 'Futures', 'Margin', 'Staking', 'DeFi'],
    requiresPassphrase: false,
    supportsSandbox: true,
    apiDocsUrl: 'https://docs.kraken.com/rest/'
  },
  {
    name: 'bybit',
    displayName: 'Bybit',
    logo: 'https://altcoinsbox.com/wp-content/uploads/2023/01/bybit-logo.svg',
    description: 'Popular derivatives exchange with spot and futures trading',
    features: ['Spot Trading', 'Futures', 'Options', 'Copy Trading', 'NFT'],
    requiresPassphrase: false,
    supportsSandbox: true,
    apiDocsUrl: 'https://bybit-exchange.github.io/docs/'
  },
  {
    name: 'okx',
    displayName: 'OKX',
    logo: 'https://altcoinsbox.com/wp-content/uploads/2023/01/okx-logo.svg',
    description: 'Comprehensive crypto exchange with DeFi and Web3 features',
    features: ['Spot Trading', 'Futures', 'Options', 'DeFi', 'Web3 Wallet'],
    requiresPassphrase: true,
    supportsSandbox: true,
    apiDocsUrl: 'https://www.okx.com/docs-v5/en/'
  },
  {
    name: 'kucoin',
    displayName: 'KuCoin',
    logo: 'https://altcoinsbox.com/wp-content/uploads/2023/01/kucoin-logo.svg',
    description: 'Global exchange known for altcoin variety and trading bots',
    features: ['Spot Trading', 'Futures', 'Margin', 'Pool-X', 'Trading Bots'],
    requiresPassphrase: true,
    supportsSandbox: true,
    apiDocsUrl: 'https://docs.kucoin.com/'
  }
];

interface AddExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExchangeConnectionData) => Promise<void>;
}

interface ExchangeConnectionData {
  exchange: string;
  accountAlias: string;
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  sandboxMode: boolean;
  permissions: string[];
}

export default function AddExchangeModal({ isOpen, onClose, onSubmit }: AddExchangeModalProps) {
  const [selectedExchange, setSelectedExchange] = useState<string>('');
  const [accountAlias, setAccountAlias] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [apiSecret, setApiSecret] = useState<string>('');
  const [passphrase, setPassphrase] = useState<string>('');
  const [sandboxMode, setSandboxMode] = useState<boolean>(true);
  const [showApiSecret, setShowApiSecret] = useState<boolean>(false);
  const [showPassphrase, setShowPassphrase] = useState<boolean>(false);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [connectionTestResult, setConnectionTestResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedExchangeInfo = supportedExchanges.find(ex => ex.name === selectedExchange);

  const resetForm = () => {
    setSelectedExchange('');
    setAccountAlias('');
    setApiKey('');
    setApiSecret('');
    setPassphrase('');
    setSandboxMode(true);
    setShowApiSecret(false);
    setShowPassphrase(false);
    setConnectionTestResult('idle');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTestConnection = async () => {
    if (!selectedExchange || !apiKey || !apiSecret) return;
    
    setIsTestingConnection(true);
    setConnectionTestResult('idle');
    
    try {
      // Simulate API connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful connection (in real app, this would be an actual API call)
      setConnectionTestResult('success');
    } catch (error) {
      setConnectionTestResult('error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedExchange || !apiKey || !apiSecret || !accountAlias) return;

    setIsSubmitting(true);
    try {
      const data: ExchangeConnectionData = {
        exchange: selectedExchange,
        accountAlias,
        apiKey,
        apiSecret,
        passphrase: selectedExchangeInfo?.requiresPassphrase ? passphrase : undefined,
        sandboxMode,
        permissions: ['read', 'trade'] // Default permissions
      };

      await onSubmit(data);
      handleClose();
    } catch (error) {
      console.error('Error adding exchange:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = selectedExchange && apiKey && apiSecret && accountAlias &&
    (!selectedExchangeInfo?.requiresPassphrase || passphrase);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Exchange Connection</span>
          </DialogTitle>
          <DialogDescription>
            Connect a new cryptocurrency exchange to enable automated trading. Your API credentials are encrypted and stored securely.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="exchange" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="exchange">Choose Exchange</TabsTrigger>
            <TabsTrigger value="credentials" disabled={!selectedExchange}>API Credentials</TabsTrigger>
            <TabsTrigger value="settings" disabled={!selectedExchange}>Settings</TabsTrigger>
          </TabsList>

          {/* Exchange Selection */}
          <TabsContent value="exchange" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportedExchanges.map((exchange) => (
                <Card 
                  key={exchange.name}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedExchange === exchange.name ? "ring-2 ring-blue-500 bg-blue-50" : ""
                  )}
                  onClick={() => setSelectedExchange(exchange.name)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <ExchangeIcon name={exchange.displayName} logo={exchange.logo} size="md" />
                      <div className="flex-1">
                        <CardTitle className="text-lg">{exchange.displayName}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{exchange.description}</p>
                      </div>
                      {selectedExchange === exchange.name && (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1">
                      {exchange.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {exchange.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{exchange.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* API Credentials */}
          <TabsContent value="credentials" className="space-y-6">
            {selectedExchangeInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900">Getting Your API Keys</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Visit your {selectedExchangeInfo.displayName} account settings to create API keys. 
                      Ensure you enable "Spot Trading" permissions for the bot to function properly.
                    </p>
                    <a 
                      href={selectedExchangeInfo.apiDocsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Link className="w-4 h-4 mr-1" />
                      View API Documentation
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="account-alias">Account Alias</Label>
                  <Input
                    id="account-alias"
                    placeholder="e.g., Main Trading Account"
                    value={accountAlias}
                    onChange={(e) => setAccountAlias(e.target.value)}
                    data-testid="input-account-alias"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    A friendly name to identify this connection
                  </p>
                </div>

                <div>
                  <Label htmlFor="api-key" className="flex items-center space-x-2">
                    <Key className="w-4 h-4" />
                    <span>API Key</span>
                  </Label>
                  <Input
                    id="api-key"
                    placeholder="Enter your API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    data-testid="input-api-key"
                  />
                </div>

                <div>
                  <Label htmlFor="api-secret" className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>API Secret</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="api-secret"
                      type={showApiSecret ? "text" : "password"}
                      placeholder="Enter your API secret"
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                      className="pr-10"
                      data-testid="input-api-secret"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowApiSecret(!showApiSecret)}
                    >
                      {showApiSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {selectedExchangeInfo?.requiresPassphrase && (
                  <div>
                    <Label htmlFor="passphrase">Passphrase</Label>
                    <div className="relative">
                      <Input
                        id="passphrase"
                        type={showPassphrase ? "text" : "password"}
                        placeholder="Enter your passphrase"
                        value={passphrase}
                        onChange={(e) => setPassphrase(e.target.value)}
                        className="pr-10"
                        data-testid="input-passphrase"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassphrase(!showPassphrase)}
                      >
                        {showPassphrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Connection Test */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Test Connection</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={handleTestConnection}
                      disabled={!apiKey || !apiSecret || isTestingConnection}
                      className="w-full"
                      data-testid="button-test-connection"
                    >
                      {isTestingConnection ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Testing Connection...
                        </>
                      ) : (
                        'Test API Connection'
                      )}
                    </Button>

                    {connectionTestResult === 'success' && (
                      <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Connection successful!</span>
                      </div>
                    )}

                    {connectionTestResult === 'error' && (
                      <div className="flex items-start space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium">Connection failed</p>
                          <p>Please check your API credentials and permissions</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Security Notice */}
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Security Best Practices</p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Never share your API keys</li>
                          <li>Use IP restrictions when possible</li>
                          <li>Enable only required permissions</li>
                          <li>Regularly rotate your keys</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Environment Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Sandbox Mode</Label>
                        <p className="text-xs text-gray-500">
                          Use testnet environment for safe testing
                        </p>
                      </div>
                      <Switch
                        checked={sandboxMode}
                        onCheckedChange={setSandboxMode}
                        data-testid="switch-sandbox-mode"
                      />
                    </div>
                    {!sandboxMode && (
                      <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">Live trading mode enabled</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Permissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Read Account Data</span>
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Execute Trades</span>
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Withdraw Funds</span>
                        <Badge className="bg-red-100 text-red-800">Disabled</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Your credentials are encrypted and stored securely</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              data-testid="button-add-exchange"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding Exchange...
                </>
              ) : (
                'Add Exchange'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}