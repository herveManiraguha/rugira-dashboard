import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import logoSvg from '@/assets/logo.svg';
import { useAuth } from '@/contexts/AuthContext';
import { useEnvironment, TradingEnvironment } from '@/contexts/EnvironmentContext';
import { useScope } from '@/contexts/ScopeContext';
import { CommandPalette } from '@/components/CommandPalette/CommandPalette';
import NotificationButton from './NotificationButton';
import {
  User,
  AlertTriangle,
  HelpCircle,
  LogOut,
  Building2,
  Key,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Search,
  Circle,
  Menu,
  MoreHorizontal,
} from 'lucide-react';

interface HeaderRefactoredProps {
  onKillSwitch?: () => void;
  onMobileMenuToggle?: () => void;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

type Mode = 'Live' | 'Paper' | 'Demo';

export default function HeaderRefactored({ onKillSwitch, onMobileMenuToggle, sidebarCollapsed = false, onSidebarToggle }: HeaderRefactoredProps) {
  const [, setLocation] = useLocation();
  const { user, logout, currentTenant, switchTenant } = useAuth();
  const { environment, setEnvironment } = useEnvironment();
  const { 
    organizations = [], 
    organization,
    tenant,
    portfolio,
    mode: scopeMode,
    setOrganization,
    setTenant,
    setPortfolio,
    setMode: setScopeMode
  } = useScope();
  
  // State
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [showLiveConfirm, setShowLiveConfirm] = useState(false);
  const [liveConfirmInput, setLiveConfirmInput] = useState('');
  
  // Get current data from hierarchy
  const currentTenants = organization?.tenants || [];
  const currentPortfolios = tenant?.portfolios || [];
  const currentModes = portfolio?.modes || [];
  
  // Handle mode change
  const handleModeChange = (newMode: any) => {
    if (newMode.name === 'Live' && scopeMode?.name !== 'Live') {
      setShowLiveConfirm(true);
    } else {
      setScopeMode(newMode);
      setEnvironment(newMode.name as TradingEnvironment);
    }
  };
  
  const confirmLiveMode = () => {
    if (liveConfirmInput === 'LIVE') {
      const liveMode = portfolio?.modes?.find((m: any) => m.name === 'Live');
      if (liveMode) {
        setScopeMode(liveMode);
        setEnvironment('Live');
      }
      setShowLiveConfirm(false);
      setLiveConfirmInput('');
    }
  };
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const getModeColor = (m: Mode) => {
    switch (m) {
      case 'Live':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Paper':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Demo':
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  
  
  return (
    <>
      <TooltipProvider>
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="flex items-center h-14">
            {/* Logo section aligned with sidebar width */}
            <div 
              className={cn(
                "flex items-center justify-between transition-all duration-150",
                sidebarCollapsed ? "lg:w-16" : "lg:w-64"
              )}
              style={{
                borderRight: '1px solid var(--sidebar-divider)'
              }}
            >
              <Link href="/overview" className="flex items-center px-4 gap-2">
                <img src={logoSvg} alt="Rugira" className="h-7 w-auto" />
                {!sidebarCollapsed && (
                  <span className="hidden lg:block text-lg font-semibold" style={{ color: 'var(--brand-red)' }}>Rugira</span>
                )}
              </Link>
            </div>
            
            {/* Sidebar collapse button - right of separator */}
            <div className="hidden lg:flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSidebarToggle}
                    className="ml-2 p-2 h-8 w-8 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-red"
                    aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  >
                    {sidebarCollapsed ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                </TooltipContent>
              </Tooltip>
            </div>
            
            {/* Main header content */}
            <div className="flex items-center flex-1 px-4 gap-6">
              {/* Context chips */}
              <div className="flex items-center gap-3">
                {/* Mobile Menu */}
                {onMobileMenuToggle && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMobileMenuToggle}
                    className="lg:hidden p-2 h-8 w-8"
                    aria-label="Toggle navigation menu"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                )}
                
                {/* Breadcrumb Navigation */}
                <nav className="hidden sm:flex items-center" aria-label="Breadcrumb">
                  {/* Organization Chip */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-xs font-medium bg-gray-50/50 border border-gray-200/50 hover:bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-red rounded-md cursor-pointer"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <span className="max-w-[140px] truncate">
                          {organization?.name || 'Organization'}
                        </span>
                        <ChevronDown className="h-3 w-3 ml-1.5 opacity-60" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Select Organization</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {organizations.map((org) => (
                        <DropdownMenuItem
                          key={org.id}
                          onClick={() => {
                            setOrganization(org);
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{org.name}</span>
                            {organization?.id === org.id && (
                              <Badge variant="outline" className="text-xs">Active</Badge>
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <span className="mx-2 text-gray-400 text-xs select-none" aria-hidden="true">›</span>
                  
                  {/* Tenant Chip */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-xs font-medium bg-gray-50/50 border border-gray-200/50 hover:bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-red rounded-md cursor-pointer"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <span className="max-w-[140px] truncate">
                          {tenant?.name || 'Tenant'}
                        </span>
                        <ChevronDown className="h-3 w-3 ml-1.5 opacity-60" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Switch Tenant</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {currentTenants.map((t: any) => (
                        <DropdownMenuItem
                          key={t.id}
                          onClick={() => {
                            setTenant(t);
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{t.name}</span>
                              {t.type === 'Test' && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                                  Test
                                </span>
                              )}
                              {t.type === 'Active' && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                                  Active
                                </span>
                              )}
                            </div>
                            {tenant?.id === t.id && (
                              <Badge variant="outline" className="text-xs">Active</Badge>
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setLocation('/tenants')}>
                        <Building2 className="h-3 w-3 mr-2" />
                        Manage Tenants
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <span className="mx-2 text-gray-400 text-xs select-none" aria-hidden="true">›</span>
                  
                  {/* Desk Chip */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-xs font-medium bg-gray-50/50 border border-gray-200/50 hover:bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-red rounded-md cursor-pointer"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <span className="max-w-[140px] truncate">
                              {portfolio?.name || 'Desk'}
                            </span>
                            <ChevronDown className="h-3 w-3 ml-1.5 opacity-60" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {portfolio?.name || 'Desk'}
                        </TooltipContent>
                      </Tooltip>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Select Desk</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {currentPortfolios.map((p: any) => (
                        <DropdownMenuItem
                          key={p.id}
                          onClick={() => {
                            setPortfolio(p);
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{p.name}</span>
                            {portfolio?.id === p.id && (
                              <Badge variant="outline" className="text-xs">Active</Badge>
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </nav>
                
                {/* Environment Badge - positioned to the right of breadcrumbs */}
                <div className="hidden sm:block ml-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 px-2.5 text-xs font-medium rounded border transition-colors",
                          scopeMode?.name === 'Live' 
                            ? "bg-red-50/50 text-red-700 border-red-200/50 hover:bg-red-100/50" 
                            : scopeMode?.name === 'Paper' 
                            ? "bg-blue-50/50 text-blue-700 border-blue-200/50 hover:bg-blue-100/50"
                            : "bg-gray-50/50 text-gray-700 border-gray-200/50 hover:bg-gray-100/50"
                        )}
                        aria-label={`Current environment: ${scopeMode?.name}`}
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {scopeMode?.name || 'Mode'}
                        <ChevronDown className="h-2.5 w-2.5 ml-1 opacity-60" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                      <DropdownMenuLabel>Select Environment</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {currentModes.map((m: any) => (
                        <DropdownMenuItem
                          key={m.id}
                          onClick={() => m.enabled && handleModeChange(m)}
                          className={cn(
                            "cursor-pointer",
                            !m.enabled && "opacity-50 cursor-not-allowed",
                            m.name === 'Live' && "text-red-600"
                          )}
                          disabled={!m.enabled}
                        >
                          <Circle className={cn(
                            "h-3 w-3 mr-2",
                            m.name === 'Demo' && "text-gray-500",
                            m.name === 'Paper' && "text-blue-500",
                            m.name === 'Live' && "text-red-500"
                          )} />
                          <div>
                            <div className="font-medium">{m.name}</div>
                            <div className="text-xs text-gray-500">{m.description}</div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            
            {/* Spacer */}
            <div className="flex-1"></div>
            
            {/* User Actions */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Omni-search */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCommandPaletteOpen(true)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search <kbd className="ml-1 px-1 py-0.5 text-xs bg-gray-200 rounded">⌘K</kbd></p>
                </TooltipContent>
              </Tooltip>
              
              {/* Notifications */}
              <NotificationButton />
              
              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation('/profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/api-keys')} className="cursor-pointer">
                    <Key className="mr-2 h-4 w-4" />
                    API Keys
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/organization')} className="cursor-pointer">
                    <Building2 className="mr-2 h-4 w-4" />
                    Organization
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation('/help')} className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          </div>
        </header>
      </TooltipProvider>
      
      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
      
      {/* Live Mode Confirmation Dialog */}
      <Dialog open={showLiveConfirm} onOpenChange={setShowLiveConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Live Mode
            </DialogTitle>
            <DialogDescription>
              You are about to switch to Live mode. This will enable real trading with real money.
              Type <span className="font-mono font-bold">LIVE</span> to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Input
              value={liveConfirmInput}
              onChange={(e) => setLiveConfirmInput(e.target.value)}
              placeholder="Type LIVE to confirm"
              className="uppercase"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowLiveConfirm(false);
                setLiveConfirmInput('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={liveConfirmInput !== 'LIVE'}
              onClick={confirmLiveMode}
            >
              Switch to Live
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}