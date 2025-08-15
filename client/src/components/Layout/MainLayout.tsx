import React, { useState } from 'react';
import { Route, Switch, useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import logoSvg from "@/assets/logo.svg";
import { useAuth } from '@/contexts/MockAuthContext';
import DemoRibbon from '@/components/Demo/DemoRibbon';
import Footer from '@/components/Layout/Footer';
import StatusBadge from '@/components/Layout/StatusBadge';
import AWSStatusIndicator from '@/components/Layout/AWSStatusIndicator';
import NotificationButton from '@/components/Layout/NotificationButton';
import EnvironmentChip from '@/components/Layout/EnvironmentChip';
import { useEnvironment } from '@/hooks/useEnvironment';
import { 
  Bell, 
  User, 
  AlertTriangle, 
  ChevronDown,
  ChevronRight,
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

  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import KillSwitchButton from '@/components/KillSwitch/KillSwitchButton';
import KillSwitchBanner from '@/components/KillSwitch/KillSwitchBanner';

interface MainLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Overview', href: '/overview', icon: Activity },
  { name: 'Bots', href: '/bots', icon: Bot },
  { name: 'Strategies', href: '/strategies', icon: Target },
  { name: 'Exchanges', href: '/exchanges', icon: Building2 },
  { name: 'Compliance', href: '/compliance', icon: Shield },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Backtesting', href: '/backtesting', icon: TrendingUp },
  { name: 'Monitoring', href: '/monitoring', icon: Monitor },
  { name: 'Admin', href: '/admin', icon: Shield },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isKillSwitchEnabled, setIsKillSwitchEnabled] = useState(false);
  const { environment, switchEnvironment, isLive } = useEnvironment();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleKillSwitch = () => {
    // TODO: Implement kill switch functionality when backend supports it
    console.log('Kill switch activated');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoRibbon />
      
      {/* Live Environment Top Border */}
      {isLive && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-red-400 z-[60]" />
      )}

      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="xl:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Fixed Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between w-full">
          {/* Left side - Mobile Menu Button, Logo and tenant switcher */}
          <div className="flex items-center space-x-3 md:space-x-6">
            {/* Mobile/Tablet Menu Button - visible up to lg screens */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              data-testid="button-mobile-menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src={logoSvg} alt="Rugira" className="w-8 h-8" />
              </div>
              <span className="text-lg md:text-xl font-semibold text-gray-900">Rugira</span>
            </div>
            
            {/* Tenant Switcher (placeholder) - hidden on small screens */}
            <div className="hidden sm:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2 md:ml-4">
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
          </div>

          {/* Right side - Environment, status, notifications, kill switch */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Environment Chip */}
            <EnvironmentChip 
              environment={environment}
              onEnvironmentChange={switchEnvironment}
            />

            {/* AWS Status Indicator */}
            <AWSStatusIndicator />

            {/* Notifications */}
            <NotificationButton />

            {/* Kill Switch */}
            <KillSwitchButton />
          </div>
        </div>
      </header>

      <div className="flex pt-20">
        {/* Fixed Left Sidebar */}
        <nav className={`fixed left-0 top-20 w-64 bg-white border-r border-gray-200 h-[calc(100vh-5rem)] overflow-y-auto z-40 flex flex-col transform transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'
        }`}>
          {/* Fixed Close button for mobile/tablet */}
          <div className="xl:hidden sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-end">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              data-testid="button-close-menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6 flex-1">
            
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
          
          {/* User Profile at bottom of sidebar */}
          <div className="p-4 border-t border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-between group hover:bg-gray-50" data-testid="button-user-menu">
                  <div className="flex items-center overflow-hidden">
                    <User className="h-4 w-4 mr-3 flex-shrink-0" />
                    <div className="text-left overflow-hidden">
                      <div className="text-sm font-medium truncate">
                        {user?.profile?.name || user?.profile?.email || 'User'}
                      </div>
                      {user?.profile?.email && user?.profile?.name && (
                        <div className="text-xs text-gray-500 truncate">
                          {user.profile.email}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="right" className="w-48 ml-2">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="w-full cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout}
                  className="text-red-600 focus:text-red-600"
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 xl:ml-64 p-4 md:p-6 min-h-screen bg-gray-50 flex flex-col">
          <div className="max-w-full flex-1">
            {/* Kill Switch Banner */}
            <KillSwitchBanner />
            
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}