import React, { useState, useEffect } from 'react';
import { Route, Switch, useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import logoSvg from "@/assets/logo.svg";
import { useAuth } from '@/contexts/AuthContext';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import DemoRibbon from '@/components/Demo/DemoRibbon';
import Footer from '@/components/Layout/Footer';
import HeaderNew from '@/components/Layout/HeaderNew';
import { LiveModeBanner } from '@/components/Scope/LiveModeBanner';
import { 
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
  Menu,
  X,
  User,
  ChevronRight
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
import { cn } from '@/lib/utils';
import KillSwitchBanner from '@/components/KillSwitch/KillSwitchBanner';
import AIAssistantFloat from '@/components/AI/AIAssistantFloat';

interface MainLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Overview', href: '/overview', icon: Activity, group: null },
  { name: 'Venues', href: '/venues', icon: Building2, group: 'Build' },
  { name: 'Strategies', href: '/strategies', icon: Target, group: 'Build' },
  { name: 'Backtesting', href: '/backtesting', icon: TrendingUp, group: 'Build' },
  { name: 'Bots', href: '/bots', icon: Bot, group: 'Run' },
  { name: 'Monitoring', href: '/monitoring', icon: Monitor, group: 'Run' },
  { name: 'Reports', href: '/reports', icon: BarChart3, group: 'Govern' },
  { name: 'Compliance', href: '/compliance', icon: Shield, group: 'Govern' },
  { name: 'Admin', href: '/admin', icon: Settings, group: 'System' },
];

export default function MainLayoutNew({ children }: MainLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [isKillSwitchEnabled, setIsKillSwitchEnabled] = useState(false);
  const { isLive } = useEnvironment();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  // Group navigation items
  const groupedNavigation = navigation.reduce((acc, item) => {
    const group = item.group || 'Main';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, typeof navigation>);

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
      
      {/* New Header */}
      <HeaderNew onKillSwitch={handleKillSwitch} onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      
      {/* Live Mode Banner */}
      <LiveModeBanner />
      
      {/* Kill Switch Banner */}
      {isKillSwitchEnabled && (
        <KillSwitchBanner />
      )}
      
      <div className="flex h-full pt-14">
        {/* Desktop Sidebar - lg screens and above */}
        <aside 
          className={cn(
            "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 transition-all duration-300 z-30",
            sidebarCollapsed ? "lg:w-16" : "lg:w-64",
            "lg:pt-14"
          )}
        >
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Collapse toggle for desktop */}
            <div className="flex items-center justify-end p-2 border-b">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 h-8 w-8"
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <ChevronRight className={cn(
                  "h-4 w-4 transition-transform",
                  !sidebarCollapsed && "rotate-180"
                )} />
              </Button>
            </div>
            
            <nav className="flex-1 px-2 py-4 space-y-1">
              {Object.entries(groupedNavigation).map(([group, items]) => (
                <div key={group} className="mb-4">
                  {group !== 'Main' && !sidebarCollapsed && (
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {group}
                    </h3>
                  )}
                  {items.map((item) => {
                    const isActive = location === item.href;
                    return (
                      <Link key={item.name} href={item.href}>
                        <a
                          className={cn(
                            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                            isActive
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                            sidebarCollapsed && "justify-center"
                          )}
                          title={sidebarCollapsed ? item.name : undefined}
                        >
                          <item.icon className={cn(
                            "flex-shrink-0 h-5 w-5",
                            !sidebarCollapsed && "mr-3"
                          )} />
                          {!sidebarCollapsed && item.name}
                        </a>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
            
            {/* Help icon in lower right corner */}
            {!sidebarCollapsed && (
              <div className="border-t p-4">
                <Link href="/help">
                  <a className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Help
                  </a>
                </Link>
              </div>
            )}
            
            {/* Help icon when collapsed */}
            {sidebarCollapsed && (
              <div className="border-t p-2">
                <Link href="/help">
                  <a className="flex justify-center items-center p-2 text-gray-600 hover:text-gray-900" title="Help">
                    <HelpCircle className="h-5 w-5" />
                  </a>
                </Link>
              </div>
            )}

          </div>
        </aside>
        
        {/* Mobile/Tablet Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between px-4 py-4 border-b">
                <div className="flex items-center space-x-2">
                  <img src={logoSvg} alt="Rugira" className="h-8 w-8" />
                  <span className="text-lg font-semibold">Rugira</span>
                </div>
                <SheetClose asChild>
                  <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </SheetClose>
              </div>
              
              <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
                {Object.entries(groupedNavigation).map(([group, items]) => (
                  <div key={group} className="mb-4">
                    {group !== 'Main' && (
                      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {group}
                      </h3>
                    )}
                    {items.map((item) => {
                      const isActive = location === item.href;
                      return (
                        <Link key={item.name} href={item.href}>
                          <a
                            className={cn(
                              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                              isActive
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
                            {item.name}
                          </a>
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
          "flex-1 transition-all duration-300",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}>
          <div className="p-4 lg:p-6 xl:p-8">
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