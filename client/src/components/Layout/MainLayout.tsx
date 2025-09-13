import React, { useState, useEffect } from 'react';
import { Route, Switch, useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import logoSvg from "@/assets/logo.svg";
import { useAuth } from '@/contexts/AuthContext';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import DemoRibbon from '@/components/Demo/DemoRibbon';
import Footer from '@/components/Layout/Footer';
import HeaderRefactored from '@/components/Layout/HeaderRefactored';
import { LiveModeBanner } from '@/components/Scope/LiveModeBanner';
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
  Star,
  Network
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import KillSwitchBanner from '@/components/KillSwitch/KillSwitchBanner';
import IncidentBanner from '@/components/Layout/IncidentBanner';
import AIAssistantFloat from '@/components/AI/AIAssistantFloat';

interface MainLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Overview', href: '/overview', icon: Activity, group: null, description: 'Dashboard overview' },
  { name: 'Venues', href: '/venues', icon: Building2, group: 'Build', description: 'Exchange connections' },
  { name: 'Strategies', href: '/strategies', icon: Beaker, group: 'Build', description: 'Trading strategies' },
  { name: 'Backtesting', href: '/backtesting', icon: History, group: 'Build', description: 'Test strategies' },
  { name: 'Bots', href: '/bots', icon: Bot, group: 'Run', description: 'Trading bots' },
  { name: 'Monitoring', href: '/monitoring', icon: MonitorDot, group: 'Run', description: 'System monitoring' },
  { name: 'Analytics', href: '/reports', icon: BarChart, group: 'Govern', description: 'Reports & analytics' },
  { name: 'Compliance', href: '/compliance', icon: ShieldCheck, group: 'Govern', description: 'Compliance tracking' },
  { name: 'Tenants', href: '/tenants', icon: Network, group: 'System', description: 'Tenant management', requiresAdmin: true },
  { name: 'Admin', href: '/admin', icon: Settings, group: 'System', description: 'Administration' },
  { name: 'Help', href: '/help', icon: LifeBuoy, group: 'System', description: 'Help & support' },
];

export default function MainLayoutNew({ children }: MainLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, currentTenant } = useAuth();
  const [isKillSwitchEnabled, setIsKillSwitchEnabled] = useState(false);
  const { isLive } = useEnvironment();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Auto-collapse sidebar below 1280px (xl breakpoint)
  useEffect(() => {
    const handleResize = () => {
      setSidebarCollapsed(window.innerWidth < 1280);
    };
    
    // Set initial state
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Handle escape key for mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [mobileMenuOpen]);

  const handleKillSwitch = () => {
    setIsKillSwitchEnabled(true);
    console.log('Kill switch activated');
    // TODO: Implement actual kill switch functionality when backend supports it
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
    const group = item.group || 'Main';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, typeof filteredNavigation>);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sidebar background band that extends through entire viewport */}
      <div 
        className={cn(
          "hidden lg:block lg:fixed transition-all duration-[160ms] ease-out z-20",
          sidebarCollapsed ? "lg:w-[76px]" : "lg:w-[240px]"
        )}
        style={{
          backgroundColor: 'var(--sidebar-surface)',
          borderRight: '1px solid var(--sidebar-divider)',
          top: '0',
          bottom: '0',
          left: '0',
          height: '100vh'
        }}
      />
      
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
      
      {/* Refactored Header */}
      <HeaderRefactored 
        onKillSwitch={handleKillSwitch} 
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Incident Banner */}
      <IncidentBanner 
        className={cn(
          "transition-all duration-[160ms] ease-out",
          sidebarCollapsed ? "lg:ml-[76px]" : "lg:ml-[240px]"
        )}
      />
      
      {/* Live Mode Banner */}
      <LiveModeBanner />
      
      {/* Kill Switch Banner */}
      {isKillSwitchEnabled && (
        <KillSwitchBanner />
      )}
      
      <div className="flex flex-1">
        
        {/* Desktop Sidebar - lg screens and above */}
        <aside 
          className={cn(
            "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-[160ms] ease-out z-30",
            sidebarCollapsed ? "lg:w-[76px]" : "lg:w-[240px]",
            "lg:pt-14"
          )}
        >
          <div className="flex-1 flex flex-col overflow-y-auto">
            
            <TooltipProvider>
              <nav className="flex-1 px-2 py-3 space-y-0.5">
                {Object.entries(groupedNavigation).map(([group, items]) => (
                  <div key={group} className="mb-3">
                    {group !== 'Main' && !sidebarCollapsed && (
                      <h3 className="px-4 h-8 flex items-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        {group}
                      </h3>
                    )}
                    {items.map((item) => {
                      const isActive = location === item.href;
                      const ItemIcon = item.icon;
                      const linkContent = (
                        <Link key={item.name} href={item.href}>
                          <div
                            className={cn(
                              "nav-item flex items-center h-[44px] text-sm transition-all cursor-pointer rounded-lg",
                              sidebarCollapsed ? "justify-center px-2" : "px-4",
                              isActive && "active"
                            )}
                          >
                            <ItemIcon className={cn(
                              "flex-shrink-0 h-[22px] w-[22px]",
                              !sidebarCollapsed && "mr-3"
                            )} strokeWidth={isActive ? 2 : 1.5} />
                            {!sidebarCollapsed && (
                              <span className="truncate">{item.name}</span>
                            )}
                          </div>
                        </Link>
                      );
                      
                      if (sidebarCollapsed) {
                        return (
                          <Tooltip key={item.name}>
                            <TooltipTrigger asChild>
                              {linkContent}
                            </TooltipTrigger>
                            <TooltipContent side="right" className="ml-2">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.description}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      }
                      
                      return linkContent;
                    })}
                  </div>
                ))}
              </nav>
            </TooltipProvider>
            
            {/* Help section moved to navigation - remove standalone help */}

          </div>
        </aside>
        
        {/* Mobile/Tablet Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-[240px] p-0" style={{ backgroundColor: 'var(--sidebar-surface)' }}>
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                Navigate through the Rugira trading dashboard
              </SheetDescription>
            </SheetHeader>
            <div className="flex h-full flex-col">
              <div className="flex items-center px-4 py-4 border-b">
                <div className="flex items-center space-x-2">
                  <img src={logoSvg} alt="Rugira" className="h-8 w-8" />
                  <span className="text-lg font-semibold">Rugira</span>
                </div>
              </div>
              
              <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
                {Object.entries(groupedNavigation).map(([group, items]) => (
                  <div key={group} className="mb-3">
                    {group !== 'Main' && (
                      <h3 className="px-4 h-8 flex items-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        {group}
                      </h3>
                    )}
                    {items.map((item) => {
                      const isActive = location === item.href;
                      const ItemIcon = item.icon;
                      return (
                        <Link key={item.name} href={item.href}>
                          <div
                            className={cn(
                              "nav-item flex items-center h-[44px] px-4 text-sm transition-all cursor-pointer rounded-lg",
                              isActive && "active"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <ItemIcon className="mr-3 flex-shrink-0 h-[22px] w-[22px]" strokeWidth={isActive ? 2 : 1.5} />
                            <span className="truncate">{item.name}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
              

            </div>
          </SheetContent>
        </Sheet>
        
        {/* Main content area */}
        <main className={cn(
          "flex-1 flex flex-col transition-all duration-[160ms] ease-out pt-14",
          sidebarCollapsed ? "lg:ml-[76px]" : "lg:ml-[240px]"
        )}>
          <div className="flex-1 px-4 py-2 lg:px-6 lg:py-3 xl:px-8">
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