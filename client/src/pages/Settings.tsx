import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { authStore } from '@/lib/authStore';
import {
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Database,
  Key,
  AlertTriangle,
  Save,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  HardDrive
} from 'lucide-react';

export default function Settings() {
  const { toast } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Profile settings state
  const [profileSettings, setProfileSettings] = useState({
    name: 'John Trader',
    email: 'trader@rugira.ch',
    timezone: 'UTC',
    language: 'en',
    twoFactorEnabled: true
  });

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '30',
    ipWhitelist: '',
    apiKeysRotation: 'monthly',
    loginAlerts: true
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    tradeAlerts: true,
    errorAlerts: true,
    dailyReports: true,
    weeklyReports: false
  });

  // Trading settings state
  const [tradingSettings, setTradingSettings] = useState({
    defaultRiskLevel: 'medium',
    maxPositionSize: '10',
    emergencyStopLoss: '5',
    paperTradingMode: true,
    autoRebalance: false
  });

  // API settings state
  const [apiSettings, setApiSettings] = useState({
    binanceKey: '**********************',
    coinbaseKey: '**********************',
    krakenKey: '**********************',
    rateLimitBuffer: '20'
  });

  const handleSaveSettings = (category: string) => {
    toast({
      title: "Settings saved",
      description: `${category} settings have been updated successfully.`
    });
  };

  const handleResetSettings = (category: string) => {
    toast({
      title: "Settings reset",
      description: `${category} settings have been reset to defaults.`
    });
  };

  const handleExportSettings = () => {
    const settings = {
      profile: profileSettings,
      security: securitySettings,
      notifications: notificationSettings,
      trading: tradingSettings,
      api: apiSettings
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'rugira-settings.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Settings exported",
      description: "Your settings have been downloaded as a JSON file."
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm md:text-base text-gray-600">Manage your account and trading preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="profile" className="text-xs md:text-sm">
            <User className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs md:text-sm">
            <Shield className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs md:text-sm">
            <Bell className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="trading" className="text-xs md:text-sm">
            <Palette className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Trading</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="text-xs md:text-sm">
            <Key className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="text-xs md:text-sm">
            <HardDrive className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileSettings.name}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, name: e.target.value }))}
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileSettings.email}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, email: e.target.value }))}
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={profileSettings.timezone}
                    onValueChange={(value) => setProfileSettings(prev => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger data-testid="select-timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Zurich">Zurich</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={profileSettings.language}
                    onValueChange={(value) => setProfileSettings(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger data-testid="select-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="it">Italiano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <div className="flex items-center gap-2">
                  {profileSettings.twoFactorEnabled && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Enabled
                    </Badge>
                  )}
                  <Switch
                    checked={profileSettings.twoFactorEnabled}
                    onCheckedChange={(checked) => setProfileSettings(prev => ({ ...prev, twoFactorEnabled: checked }))}
                    data-testid="switch-2fa"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleSaveSettings('Profile')} data-testid="button-save-profile">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => handleResetSettings('Profile')}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                    data-testid="input-session-timeout"
                  />
                </div>
                <div>
                  <Label htmlFor="apiRotation">API Keys Rotation</Label>
                  <Select
                    value={securitySettings.apiKeysRotation}
                    onValueChange={(value) => setSecuritySettings(prev => ({ ...prev, apiKeysRotation: value }))}
                  >
                    <SelectTrigger data-testid="select-api-rotation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="ipWhitelist">IP Whitelist (one per line)</Label>
                <Textarea
                  id="ipWhitelist"
                  placeholder="192.168.1.1&#10;203.0.113.0/24"
                  value={securitySettings.ipWhitelist}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, ipWhitelist: e.target.value }))}
                  className="min-h-[100px]"
                  data-testid="textarea-ip-whitelist"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Login Alerts</Label>
                  <p className="text-sm text-gray-500">Receive notifications for new login attempts</p>
                </div>
                <Switch
                  checked={securitySettings.loginAlerts}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, loginAlerts: checked }))}
                  data-testid="switch-login-alerts"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleSaveSettings('Security')} data-testid="button-save-security">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => handleResetSettings('Security')}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Email Alerts</Label>
                    <p className="text-sm text-gray-500">Receive important notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailAlerts}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailAlerts: checked }))}
                    data-testid="switch-email-alerts"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">SMS Alerts</Label>
                    <p className="text-sm text-gray-500">Receive critical alerts via SMS</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsAlerts}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, smsAlerts: checked }))}
                    data-testid="switch-sms-alerts"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Browser push notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                    data-testid="switch-push-notifications"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Trade Alerts</Label>
                    <p className="text-sm text-gray-500">Notifications for trade executions</p>
                  </div>
                  <Switch
                    checked={notificationSettings.tradeAlerts}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, tradeAlerts: checked }))}
                    data-testid="switch-trade-alerts"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Error Alerts</Label>
                    <p className="text-sm text-gray-500">Notifications for system errors</p>
                  </div>
                  <Switch
                    checked={notificationSettings.errorAlerts}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, errorAlerts: checked }))}
                    data-testid="switch-error-alerts"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Daily Reports</Label>
                    <p className="text-sm text-gray-500">Daily trading summary emails</p>
                  </div>
                  <Switch
                    checked={notificationSettings.dailyReports}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, dailyReports: checked }))}
                    data-testid="switch-daily-reports"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Weekly Reports</Label>
                    <p className="text-sm text-gray-500">Weekly performance summary</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))}
                    data-testid="switch-weekly-reports"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleSaveSettings('Notifications')} data-testid="button-save-notifications">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => handleResetSettings('Notifications')}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trading Settings */}
        <TabsContent value="trading" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Trading Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="riskLevel">Default Risk Level</Label>
                  <Select
                    value={tradingSettings.defaultRiskLevel}
                    onValueChange={(value) => setTradingSettings(prev => ({ ...prev, defaultRiskLevel: value }))}
                  >
                    <SelectTrigger data-testid="select-risk-level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maxPosition">Max Position Size (%)</Label>
                  <Input
                    id="maxPosition"
                    type="number"
                    value={tradingSettings.maxPositionSize}
                    onChange={(e) => setTradingSettings(prev => ({ ...prev, maxPositionSize: e.target.value }))}
                    min="1"
                    max="100"
                    data-testid="input-max-position"
                  />
                </div>
                <div>
                  <Label htmlFor="stopLoss">Emergency Stop Loss (%)</Label>
                  <Input
                    id="stopLoss"
                    type="number"
                    value={tradingSettings.emergencyStopLoss}
                    onChange={(e) => setTradingSettings(prev => ({ ...prev, emergencyStopLoss: e.target.value }))}
                    min="0.1"
                    max="50"
                    step="0.1"
                    data-testid="input-stop-loss"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Paper Trading Mode</Label>
                    <p className="text-sm text-gray-500">Trade with virtual money for testing</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {tradingSettings.paperTradingMode && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Paper Mode
                      </Badge>
                    )}
                    <Switch
                      checked={tradingSettings.paperTradingMode}
                      onCheckedChange={(checked) => setTradingSettings(prev => ({ ...prev, paperTradingMode: checked }))}
                      data-testid="switch-paper-trading"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Auto Rebalancing</Label>
                    <p className="text-sm text-gray-500">Automatically rebalance portfolio</p>
                  </div>
                  <Switch
                    checked={tradingSettings.autoRebalance}
                    onCheckedChange={(checked) => setTradingSettings(prev => ({ ...prev, autoRebalance: checked }))}
                    data-testid="switch-auto-rebalance"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleSaveSettings('Trading')} data-testid="button-save-trading">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => handleResetSettings('Trading')}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys & Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Security Notice</h4>
                    <p className="text-sm text-yellow-700">
                      Keep your API keys secure. Never share them with others or store them in unsecured locations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="binanceKey">Binance API Key</Label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        id="binanceKey"
                        type={showApiKey ? "text" : "password"}
                        value={apiSettings.binanceKey}
                        onChange={(e) => setApiSettings(prev => ({ ...prev, binanceKey: e.target.value }))}
                        data-testid="input-binance-key"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKey(!showApiKey)}
                      data-testid="button-toggle-api-visibility"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="icon" data-testid="button-test-binance">
                      Test
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="coinbaseKey">Coinbase API Key</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        id="coinbaseKey"
                        type={showApiKey ? "text" : "password"}
                        value={apiSettings.coinbaseKey}
                        onChange={(e) => setApiSettings(prev => ({ ...prev, coinbaseKey: e.target.value }))}
                        data-testid="input-coinbase-key"
                      />
                    </div>
                    <Button variant="outline" size="icon" data-testid="button-test-coinbase">
                      Test
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="krakenKey">Kraken API Key</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        id="krakenKey"
                        type={showApiKey ? "text" : "password"}
                        value={apiSettings.krakenKey}
                        onChange={(e) => setApiSettings(prev => ({ ...prev, krakenKey: e.target.value }))}
                        data-testid="input-kraken-key"
                      />
                    </div>
                    <Button variant="outline" size="icon" data-testid="button-test-kraken">
                      Test
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="rateLimit">Rate Limit Buffer (%)</Label>
                  <Input
                    id="rateLimit"
                    type="number"
                    value={apiSettings.rateLimitBuffer}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, rateLimitBuffer: e.target.value }))}
                    min="0"
                    max="50"
                    data-testid="input-rate-limit"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Buffer to prevent hitting API rate limits
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleSaveSettings('API')} data-testid="button-save-api">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => handleResetSettings('API')}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Keys
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management Settings */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900">Local Cache Management</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Clear all locally stored data including cache, temporary files, and browser storage.
                      This is safe to run and will not affect your account data.
                    </p>
                    <div className="mt-4 space-y-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          authStore.clearAllStorage();
                          toast({
                            title: "Cache Cleared",
                            description: "All local storage, session storage, and IndexedDB have been cleared successfully."
                          });
                        }}
                        data-testid="button-clear-cache"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Local Cache
                      </Button>
                      <p className="text-xs text-gray-500">
                        Note: You may need to log in again after clearing cache.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-amber-900">Data Export</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Export your trading data, strategies, and settings for backup or analysis.
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Trading Data
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Upload className="h-5 w-5 text-gray-600 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Data Import</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Import previously exported data or settings.
                    </p>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" disabled>
                        <Upload className="h-4 w-4 mr-2" />
                        Import Data (Coming Soon)
                      </Button>
                    </div>
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