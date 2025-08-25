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
import AIAssistantFloat from '@/components/AI/AIAssistantFloat';

interface MainLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Overview', href: '/overview', icon: Activity, group: null },
  { name: 'Exchanges', href: '/exchanges', icon: Building2, group: 'Build' },
  { name: 'Strategies', href: '/strategies', icon: Target, group: 'Build' },
  { name: 'Backtesting', href: '/backtesting', icon: TrendingUp, group: 'Build' },
  { name: 'Bots', href: '/bots', icon: Bot, group: 'Run' },
  { name: 'Monitoring', href: '/monitoring', icon: Monitor, group: 'Run' },
  { name: 'Reports', href: '/reports', icon: BarChart3, group: 'Govern' },
  { name: 'Compliance', href: '/compliance', icon: Shield, group: 'Govern' },
  { name: 'Admin', href: '/admin', icon: Settings, group: 'System' },
  { name: 'Help', href: '/help', icon: HelpCircle, group: 'System' },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const [location, setLocation] = useLocation();
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

            {/* Small screens - overflow menu for controls */}
            <div className="md:hidden">
              <Sheet open={mobileOverflowOpen} onOpenChange={setMobileOverflowOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-10 w-10 p-0"
                    aria-label="More controls"
                    data-testid="button-mobile-overflow"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-[85vw] max-w-sm overflow-y-auto"
                  aria-describedby={undefined}
                >
                  <SheetHeader className="pb-4">
                    <SheetTitle className="text-left">Dashboard Controls</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-900">Environment</label>
                      <EnvironmentChip 
                        environment={environment}
                        onEnvironmentChange={switchEnvironment}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-900">System Status</label>
                      <AWSStatusIndicator />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-900">Notifications</label>
                      <div className="w-full">
                        <NotificationButton />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-900">Emergency Controls</label>
                      <KillSwitchButton className="w-full h-12" />
                    </div>

                    {user && (
                      <div className="pt-4 border-t">
                        <div className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 mb-4">
                          <div className="w-12 h-12 bg-[#E10600] rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-medium text-gray-900 truncate">
                              {user.profile.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {user.profile.email}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Link to="/profile">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start h-12 text-base"
                              onClick={() => setMobileOverflowOpen(false)}
                            >
                              <User className="mr-4 h-5 w-5" />
                              Profile
                            </Button>
                          </Link>
                          <Link to="/settings">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start h-12 text-base"
                              onClick={() => setMobileOverflowOpen(false)}
                            >
                              <Settings className="mr-4 h-5 w-5" />
                              Settings
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setMobileOverflowOpen(false);
                              logout();
                            }}
                            className="w-full justify-start h-12 text-base text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            data-testid="button-mobile-overflow-logout"
                          >
                            <LogOut className="mr-4 h-5 w-5" />
                            Sign Out
                          </Button>
                        </div>
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
        {/* Mobile Navigation Drawer */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent 
            side="left" 
            className="w-[85vw] max-w-sm p-0 lg:hidden overflow-y-auto"
            aria-describedby={undefined}
          >
            <div className="flex flex-col h-full">
              <SheetHeader className="p-4 sm:p-6 border-b bg-white sticky top-0 z-10">
                <SheetTitle className="flex items-center space-x-3 text-left">
                  <img src={logoSvg} alt="Rugira" className="w-8 h-8" />
                  <div>
                    <span className="text-lg font-semibold">Navigation</span>
                    <p className="text-sm text-gray-500 font-normal">Trading Dashboard</p>
                  </div>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Tenant Switcher */}
              <div className="p-4 sm:p-6 pb-4 border-b border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Tenant</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between h-12 text-base"
                      data-testid="button-mobile-tenant-switcher"
                    >
                      Default Tenant
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem>Default Tenant</DropdownMenuItem>
                    <DropdownMenuItem disabled>Switch Tenant (Pro)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <nav className="flex-1 p-4 sm:p-6">
                <ul className="space-y-2">
                  {navigation.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = location === item.href || 
                      (item.href !== '/' && location.startsWith(item.href));
                    
                    // Check if we need to show a group header
                    const showGroupHeader = item.group && 
                      (index === 0 || navigation[index - 1].group !== item.group);
                    
                    return (
                      <div key={item.name}>
                        {showGroupHeader && (
                          <li className="pt-4 first:pt-0">
                            <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              {item.group}
                            </div>
                          </li>
                        )}
                        <li>
                          <Link href={item.href}>
                            <Button
                              variant={isActive ? "secondary" : "ghost"}
                              className={cn(
                                "w-full justify-start text-left h-12 text-base font-medium",
                                isActive ? "bg-red-50 text-red-700 border-l-4 border-red-500" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                              )}
                              data-testid={`nav-mobile-${item.name.toLowerCase()}`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Icon className="mr-4 h-5 w-5 flex-shrink-0" />
                              <span className="truncate">{item.name}</span>
                            </Button>
                          </Link>
                        </li>
                      </div>
                    );
                  })}
                </ul>
              </nav>

              {/* Mobile Controls Section */}
              <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Quick Controls</h3>
                <div className="space-y-3">
                  <EnvironmentChip 
                    environment={environment}
                    onEnvironmentChange={switchEnvironment}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between">
                    <AWSStatusIndicator />
                    <div className="flex items-center space-x-2">
                      <NotificationButton />
                      <KillSwitchButton />
                    </div>
                  </div>
                </div>

                {/* Mobile User Profile */}
                {user && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-[#E10600] rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-gray-900 truncate">
                          {user.profile.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.profile.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Link to="/profile">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start h-12 text-base"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="mr-4 h-5 w-5" />
                          Profile
                        </Button>
                      </Link>
                      <Link to="/settings">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start h-12 text-base"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="mr-4 h-5 w-5" />
                          Settings
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logout();
                        }}
                        className="w-full justify-start h-12 text-base text-red-600 hover:text-red-700 hover:bg-red-50"
                        data-testid="button-mobile-logout"
                      >
                        <LogOut className="mr-4 h-5 w-5" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                )}
              </div>
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
              {navigation.map((item, index) => {
                const Icon = item.icon;
                const isActive = location === item.href || 
                  (item.href !== '/' && location.startsWith(item.href));
                
                // Check if we need to show a group header
                const showGroupHeader = item.group && 
                  (index === 0 || navigation[index - 1].group !== item.group);
                
                return (
                  <div key={item.name}>
                    {showGroupHeader && !sidebarCollapsed && (
                      <li className="pt-4 first:pt-0">
                        <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {item.group}
                        </div>
                      </li>
                    )}
                    <li>
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
                  </div>
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
                  <DropdownMenuItem onClick={() => setLocation('/profile')} data-testid="menu-profile">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/settings')} data-testid="menu-settings">
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
                  <DropdownMenuItem onClick={() => setLocation('/profile')} data-testid="menu-profile-collapsed">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/settings')} data-testid="menu-settings-collapsed">
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

      {/* AI Assistant Float */}
      <AIAssistantFloat />
    </div>
  );
}