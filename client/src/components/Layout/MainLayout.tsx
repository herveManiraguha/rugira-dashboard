import React, { useState } from 'react';
import { Route, Switch, useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  User, 
  AlertTriangle, 
  ChevronDown,
  Activity,
  Bot,
  Target,
  Building2,
  Shield,
  BarChart3,
  TrendingUp,
  Monitor,
  Settings,
  HelpCircle,
  Power,
  Wifi,
  WifiOff
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Overview', href: '/', icon: Activity },
  { name: 'Bots', href: '/bots', icon: Bot },
  { name: 'Strategies', href: '/strategies', icon: Target },
  { name: 'Exchanges', href: '/exchanges', icon: Building2 },
  { name: 'Compliance', href: '/compliance', icon: Shield },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Backtesting', href: '/backtesting', icon: TrendingUp },
  { name: 'Monitoring', href: '/monitoring', icon: Monitor },
  { name: 'Admin', href: '/admin', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

export function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  const [isKillSwitchEnabled, setIsKillSwitchEnabled] = useState(false);
  const [apiStatus, setApiStatus] = useState<'ok' | 'degraded' | 'error'>('ok');
  const [environment, setEnvironment] = useState<'Live' | 'Paper'>('Paper');

  const handleKillSwitch = () => {
    // TODO: Implement kill switch functionality when backend supports it
    console.log('Kill switch activated');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left side - Logo and tenant switcher */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Rugira</span>
            </div>
            
            {/* Tenant Switcher (placeholder) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-4">
                  Default Tenant
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Default Tenant</DropdownMenuItem>
                <DropdownMenuItem disabled>Switch Tenant (Pro)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right side - Environment, notifications, user menu, kill switch */}
          <div className="flex items-center space-x-4">
            {/* Environment Badge */}
            <Badge 
              variant={environment === 'Live' ? 'destructive' : 'secondary'}
              className="font-medium"
            >
              {environment}
            </Badge>

            {/* API Status Indicator */}
            <div className="flex items-center space-x-1">
              {apiStatus === 'ok' ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-xs text-gray-500">
                {apiStatus === 'ok' ? 'OK' : 'Degraded'}
              </span>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Admin
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Switch to {environment === 'Live' ? 'Paper' : 'Live'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Kill Switch */}
            <Button
              variant="destructive"
              size="sm"
              disabled={!isKillSwitchEnabled}
              onClick={handleKillSwitch}
              className="font-medium"
            >
              <Power className="h-4 w-4 mr-2" />
              Kill Switch
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-20">
        {/* Fixed Left Sidebar */}
        <nav className="fixed left-0 top-20 w-64 bg-white border-r border-gray-200 h-[calc(100vh-5rem)] overflow-y-auto z-40">
          <div className="p-6">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href || 
                  (item.href !== '/' && location.startsWith(item.href));
                
                return (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <span
                        className={cn(
                          'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer group',
                          isActive
                            ? 'bg-red-600 text-white shadow-sm'
                            : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                        )}
                      >
                        <Icon className={cn(
                          "mr-3 h-5 w-5 flex-shrink-0",
                          isActive ? "text-white" : "text-gray-400 group-hover:text-red-500"
                        )} />
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 min-h-screen bg-gray-50">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}