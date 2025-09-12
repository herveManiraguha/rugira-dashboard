import React, { useState, useEffect } from 'react';
import { Route, Switch, useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import logoSvg from "@/assets/logo.svg";
import { useAuth } from '@/contexts/AuthContext';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { useScope } from '@/contexts/ScopeContext';
import DemoRibbon from '@/components/Demo/DemoRibbon';
import Footer from '@/components/Layout/Footer';
import { LiveModeBanner } from '@/components/Scope/LiveModeBanner';
import NotificationButton from './NotificationButton';
import { 
  Activity,
  Bot,
  Beaker,
  Building2,
  ShieldCheck,
  BarChart,
  History,
  MonitorDot,
  Settings,
  LifeBuoy,
  Menu,
  X,
  User,
  ChevronRight,
  ChevronLeft,
  Network,
  LogOut,
  Search,
  Command,
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import KillSwitchBanner from '@/components/KillSwitch/KillSwitchBanner';
import AIAssistantFloat from '@/components/AI/AIAssistantFloat';
import { CommandPalette } from '@/components/CommandPalette/CommandPalette';

interface MainLayoutIntegratedProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Overview', href: '/overview', icon: Activity, group: 'OVERVIEW', description: 'Dashboard overview' },
  { name: 'Venues', href: '/venues', icon: Building2, group: 'BUILD', description: 'Exchange connections' },
  { name: 'Strategies', href: '/strategies', icon: Beaker, group: 'BUILD', description: 'Trading strategies' },
  { name: 'Backtesting', href: '/backtesting', icon: History, group: 'BUILD', description: 'Test strategies' },
  { name: 'Bots', href: '/bots', icon: Bot, group: 'RUN', description: 'Trading bots' },
  { name: 'Monitoring', href: '/monitoring', icon: MonitorDot, group: 'RUN', description: 'System monitoring' },
  { name: 'Analytics', href: '/reports', icon: BarChart, group: 'GOVERN', description: 'Reports & analytics' },
  { name: 'Compliance', href: '/compliance', icon: ShieldCheck, group: 'GOVERN', description: 'Compliance tracking' },
  { name: 'Tenants', href: '/tenants', icon: Network, group: 'SYSTEM', description: 'Tenant management', requiresAdmin: true },
  { name: 'Admin', href: '/admin', icon: Settings, group: 'SYSTEM', description: 'Administration' },
  { name: 'Help', href: '/help', icon: LifeBuoy, group: 'SYSTEM', description: 'Help & support' },
];

export default function MainLayoutIntegrated({ children }: MainLayoutIntegratedProps) {
  const [location, setLocation] = useLocation();
  const { user, logout, currentTenant, switchTenant } = useAuth();
  const { environment, setEnvironment } = useEnvironment();
  const { organizations = [] } = useScope();
  const [isKillSwitchEnabled, setIsKillSwitchEnabled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Get current page info
  const currentPage = navigation.find(item => item.href === location);
  
  // Get tenants from user data
  const availableTenants = user?.tenant_roles ? Object.keys(user.tenant_roles) : [];
  const currentTenantName = availableTenants.find(t => t === currentTenant) || 'Production';
  
  // Get organization and portfolio names
  const currentOrg = organizations.find(o => o.id === '1')?.name || 'Rugira AG';
  const currentPortfolio = 'Equity Desk'; // In a real app, get from proper context
  
  const handleKillSwitch = () => {
    setIsKillSwitchEnabled(true);
    console.log('Kill switch activated');
  };

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  // Check if user is Organization Admin
  const isOrgAdmin = user?.tenant_roles?.[currentTenant || 'rugira-prod']?.includes('admin');

  // Filter navigation items based on permissions
  const filteredNavigation = navigation.filter(item => {
    if (item.requiresAdmin && !isOrgAdmin) {
      return false;
    }
    return true;
  });

  // Group navigation items
  const groupedNavigation = filteredNavigation.reduce((acc, item) => {
    const group = item.group || 'MAIN';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, typeof filteredNavigation>);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        setSidebarOpen(!sidebarOpen);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you'd persist this and apply theme classes
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DemoRibbon />
      
      {/* Live Environment Top Border */}
      {environment === 'Live' && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-red-400 z-[60]" />
      )}

      {/* Integrated Header with Sidebar Toggle */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex h-16 items-center px-4">
          {/* Left Section: Logo + Sidebar Toggle */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-gray-100"
            >
              {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            
            <Link href="/overview" className="flex items-center gap-2">
              <img src={logoSvg} alt="Rugira" className="h-8 w-8" />
              <span className="font-semibold text-lg hidden sm:inline">Rugira</span>
            </Link>
          </div>

          {/* Center Section: Breadcrumb Navigation */}
          <div className="flex-1 flex items-center px-6">
            <nav className="flex items-center text-sm text-gray-600">
              <span className="hover:text-gray-900 cursor-pointer">{currentOrg}</span>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="hover:text-gray-900 cursor-pointer">{currentTenantName}</span>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="hover:text-gray-900 cursor-pointer">{currentPortfolio}</span>
              {currentPage && (
                <>
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                  <span className="text-gray-900 font-medium">{currentPage.name}</span>
                </>
              )}
            </nav>
          </div>

          {/* Right Section: Search, User Menu, etc. */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <Button
              variant="outline"
              className="hidden md:flex items-center gap-2 text-gray-600"
              onClick={() => setCommandPaletteOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Search</span>
              <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            {/* Notifications */}
            <NotificationButton />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name || 'Hans Müller'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'hans.mueller@rugira.ch'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Live Mode Banner */}
      <LiveModeBanner />
      
      {/* Kill Switch Banner */}
      {isKillSwitchEnabled && <KillSwitchBanner />}

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-16 bottom-0 z-30 flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
            sidebarOpen ? "w-64" : "w-0 overflow-hidden"
          )}
        >
          {/* Tenant Selector */}
          <div className="p-4 border-b border-gray-200">
            <Select value={currentTenant || 'rugira-prod'} onValueChange={switchTenant}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tenant" />
              </SelectTrigger>
              <SelectContent>
                {availableTenants.map(tenant => (
                  <SelectItem key={tenant} value={tenant}>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        tenant === currentTenant ? "bg-green-500" : "bg-gray-300"
                      )} />
                      {tenant.replace('rugira-', '').toUpperCase()}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {Object.entries(groupedNavigation).map(([group, items]) => (
              <div key={group} className="mb-6">
                <h3 className="mb-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {group}
                </h3>
                <div className="space-y-1">
                  {items.map((item) => {
                    const isActive = location === item.href;
                    const Icon = item.icon;
                    return (
                      <Link key={item.name} href={item.href}>
                        <div
                          className={cn(
                            "nav-item flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all cursor-pointer",
                            isActive && "active"
                          )}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm text-gray-600">Theme</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="h-8 px-2"
              >
                {darkMode ? (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </>
                )}
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-0"
        )}>
          <div className="p-6">
            {children}
          </div>
          <Footer />
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      
      {/* AI Assistant Float */}
      <AIAssistantFloat />
    </div>
  );
}