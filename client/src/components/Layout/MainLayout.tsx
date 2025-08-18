import React, { useState, useEffect } from 'react';
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
  Menu,
  X,
  MoreHorizontal,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOverflowOpen, setMobileOverflowOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileOverflowOpen(false);
  }, [location]);

  // Handle escape key for mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setMobileOverflowOpen(false);
      }
    };

    if (mobileMenuOpen || mobileOverflowOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [mobileMenuOpen, mobileOverflowOpen]);

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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between w-full px-4 py-3 lg:px-6 lg:py-4">
          {/* Left side - Mobile Menu Button, Logo and tenant switcher */}
          <div className="flex items-center space-x-3 lg:space-x-6">
            {/* Mobile/Tablet Menu Button - visible up to lg screens */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 h-9 w-9"
              aria-label="Toggle navigation menu"
              data-testid="button-mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src={logoSvg} alt="Rugira" className="w-8 h-8" />
              </div>
              <span className="text-lg lg:text-xl font-semibold text-gray-900 hidden sm:block">Rugira</span>
            </div>
            
            {/* Tenant Switcher - hidden on small screens */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2 lg:ml-4">
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

          {/* Right side - Responsive layout */}
          <div className="flex items-center space-x-2">
            {/* Desktop - show all controls */}
            <div className="hidden lg:flex items-center space-x-4">
              <EnvironmentChip 
                environment={environment}
                onEnvironmentChange={switchEnvironment}
              />
              <AWSStatusIndicator />
              <NotificationButton />
              <KillSwitchButton />
            </div>

            {/* Medium screens - Environment chip + overflow menu */}
            <div className="hidden md:flex lg:hidden items-center space-x-2">
              <EnvironmentChip 
                environment={environment}
                onEnvironmentChange={switchEnvironment}
              />
              <Sheet open={mobileOverflowOpen} onOpenChange={setMobileOverflowOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" aria-label="More options">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Dashboard Controls</SheetTitle>
                    <SheetDescription>Access additional dashboard features</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <AWSStatusIndicator />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Notifications</label>
                      <NotificationButton />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Emergency Controls</label>
                      <KillSwitchButton />
                    </div>
                    {user && (
                      <div className="pt-4 border-t">
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                          <div className="w-8 h-8 bg-[#E10600] rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.profile.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user.profile.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={logout}
                          className="w-full mt-3"
                          data-testid="button-logout"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Small screens - hamburger for overflow */}
            <div className="md:hidden">
              <Sheet open={mobileOverflowOpen} onOpenChange={setMobileOverflowOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" aria-label="Menu">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Dashboard</SheetTitle>
                    <SheetDescription>Access dashboard features and controls</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Environment</label>
                      <EnvironmentChip 
                        environment={environment}
                        onEnvironmentChange={switchEnvironment}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <AWSStatusIndicator />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Notifications</label>
                      <NotificationButton />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Emergency Controls</label>
                      <KillSwitchButton />
                    </div>
                    {user && (
                      <div className="pt-4 border-t">
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                          <div className="w-8 h-8 bg-[#E10600] rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.profile.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user.profile.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={logout}
                          className="w-full mt-3"
                          data-testid="button-logout"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16 lg:pt-20">
        {/* Sidebar for mobile and desktop */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-80 p-0 lg:hidden">
            <div className="flex flex-col h-full">
              <SheetHeader className="p-6 border-b">
                <SheetTitle className="flex items-center space-x-3">
                  <img src={logoSvg} alt="Rugira" className="w-8 h-8" />
                  <span>Navigation</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex-1 p-6">
                <ul className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.href || 
                      (item.href !== '/' && location.startsWith(item.href));
                    
                    return (
                      <li key={item.name}>
                        <Link href={item.href}>
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start text-left h-11",
                              isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            )}
                            data-testid={`nav-${item.name.toLowerCase()}`}
                          >
                            <Icon className="mr-3 h-5 w-5" />
                            {item.name}
                          </Button>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <nav className={cn(
          "hidden lg:flex fixed left-0 top-16 lg:top-20 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] overflow-y-auto z-40 flex-col transition-all duration-200",
          sidebarCollapsed ? "w-16" : "w-64"
        )}>
          {!sidebarCollapsed && (
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">NAVIGATION</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(true)}
                className="h-6 w-6 p-0"
                aria-label="Collapse sidebar"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {sidebarCollapsed && (
            <div className="p-2 border-b border-gray-200 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(false)}
                className="h-8 w-8 p-0"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
              </Button>
            </div>
          )}

          <div className="flex-1 p-3">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href || 
                  (item.href !== '/' && location.startsWith(item.href));
                
                return (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start text-left",
                          sidebarCollapsed ? "h-10 w-10 p-0" : "h-10",
                          isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )}
                        data-testid={`nav-${item.name.toLowerCase()}`}
                        title={sidebarCollapsed ? item.name : undefined}
                      >
                        <Icon className={cn("h-5 w-5", !sidebarCollapsed && "mr-3")} />
                        {!sidebarCollapsed && item.name}
                      </Button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* User Profile Section */}
          {user && !sidebarCollapsed && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left p-3 h-auto"
                    data-testid="button-user-menu"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#E10600] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.profile.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.profile.email}
                        </p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} data-testid="menu-logout">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {user && sidebarCollapsed && (
            <div className="p-2 border-t border-gray-200">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-10 h-10 p-0"
                    data-testid="button-user-menu-collapsed"
                    title={user.profile.name}
                  >
                    <div className="w-6 h-6 bg-[#E10600] rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} data-testid="menu-logout">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className={cn(
          "flex-1 p-4 lg:p-6 min-h-screen bg-gray-50 flex flex-col transition-all duration-200",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}>
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