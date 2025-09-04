import React, { useState, useEffect, useRef } from 'react';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import logoSvg from '@/assets/logo.svg';
import { useAuth } from '@/contexts/AuthContext';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { useDemoMode } from '@/contexts/DemoContext';
import { useRBAC } from '@/lib/rbac';
import { ApprovalsDrawer } from '@/components/Approvals/ApprovalsDrawer';
import HealthStatus from '@/components/HealthStatus';
import NotificationButton from './NotificationButton';
import { TenantSwitcher } from '@/components/TenantSwitcher';
import { OrganizationSwitcher } from '@/components/Scope/OrganizationSwitcher';
import { PortfolioSwitcher } from '@/components/Scope/PortfolioSwitcher';
import { ModeSwitcher } from '@/components/Scope/ModeSwitcher';
import { useScope } from '@/contexts/ScopeContext';
import {
  Bell,
  User,
  AlertTriangle,
  HelpCircle,
  LogOut,
  Shield,
  Key,
  Building2,
  UserCheck,
  ShieldCheck,
  Gavel,
  Check,
  X,
  Search,
  Copy,
  CheckCircle,
  Activity,
  Bot,
  Target,
  BarChart3,
  FileText,
  ChevronsRight,
  Menu,
} from 'lucide-react';

interface HeaderNewProps {
  onKillSwitch?: () => void;
}

export default function HeaderNew({ onKillSwitch, onMobileMenuToggle }: HeaderNewProps & { onMobileMenuToggle?: () => void }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { environment, setEnvironment } = useEnvironment();
  const { isDemoMode } = useDemoMode();
  const rbac = useRBAC();
  const { isRugiraStaff, scopeReady } = useScope();
  const currentTenant = user?.current_tenant || 'rugira-main';
  const isAdmin = rbac.can && rbac.can('view_admin');
  
  // State
  const [approvalsOpen, setApprovalsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [killSwitchHolding, setKillSwitchHolding] = useState(false);
  const [killSwitchProgress, setKillSwitchProgress] = useState(0);
  const [killSwitchConfirmOpen, setKillSwitchConfirmOpen] = useState(false);
  const [killSwitchInput, setKillSwitchInput] = useState('');
  const [copiedTenantId, setCopiedTenantId] = useState(false);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Mock data for pending approvals
  const pendingApprovals = rbac.can && rbac.can('approve_changes') ? 3 : 0;
  
  // Environment colors
  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'Demo':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Paper':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Live':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  
  // Environment descriptions
  const getEnvironmentDescription = (env: string) => {
    switch (env) {
      case 'Demo':
        return 'Simulated data for testing.';
      case 'Paper':
        return 'Real connections, virtual money.';
      case 'Live':
        return 'Live trading — use with caution.';
      default:
        return '';
    }
  };
  
  // Copy tenant ID
  const copyTenantId = () => {
    if (currentTenant) {
      navigator.clipboard.writeText(currentTenant);
      setCopiedTenantId(true);
      setTimeout(() => setCopiedTenantId(false), 2000);
    }
  };
  
  // Kill-switch handlers
  const startKillSwitchHold = () => {
    setKillSwitchHolding(true);
    setKillSwitchProgress(0);
    
    progressTimer.current = setInterval(() => {
      setKillSwitchProgress(prev => {
        if (prev >= 100) {
          stopKillSwitchHold();
          setKillSwitchConfirmOpen(true);
          return 100;
        }
        return prev + (100 / 15); // 1.5 seconds
      });
    }, 100);
  };
  
  const stopKillSwitchHold = () => {
    setKillSwitchHolding(false);
    setKillSwitchProgress(0);
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
  };
  
  const handleKillSwitchConfirm = () => {
    if (killSwitchInput.toUpperCase() === 'KILL') {
      // Check if maker-checker is enabled (mock for now)
      const makerCheckerEnabled = false; // TODO: Get from tenant settings when available
      
      if (makerCheckerEnabled) {
        // Open approvals drawer with pre-filled kill-switch request
        setApprovalsOpen(true);
        // TODO: Pre-fill kill-switch request
      } else {
        // Execute kill-switch
        onKillSwitch?.();
      }
      
      setKillSwitchConfirmOpen(false);
      setKillSwitchInput('');
    }
  };
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      
      // Approvals
      if (!e.metaKey && !e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        setApprovalsOpen(true);
      }
      
      // Notifications
      if (!e.metaKey && !e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        // Trigger notification dropdown
        document.querySelector<HTMLButtonElement>('[data-notification-trigger]')?.click();
      }
      
      // Help
      if (!e.metaKey && !e.ctrlKey && e.key === '?') {
        e.preventDefault();
        document.querySelector<HTMLButtonElement>('[data-help-trigger]')?.click();
      }
      
      // Tenant switcher (G then T)
      if (!e.metaKey && !e.ctrlKey && e.key === 'g') {
        const handleT = (e2: KeyboardEvent) => {
          if (e2.key === 't') {
            e2.preventDefault();
            document.querySelector<HTMLButtonElement>('[data-tenant-trigger]')?.click();
            document.removeEventListener('keydown', handleT);
          }
        };
        document.addEventListener('keydown', handleT);
        setTimeout(() => document.removeEventListener('keydown', handleT), 1000);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <>
      <TooltipProvider>
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-14 px-4">
            {/* Left cluster: Logo, Tenant, Environment */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
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
              
              {/* Logo */}
              <Link href="/overview" className="flex items-center">
                <img src={logoSvg} alt="Rugira" className="h-7 w-auto" />
              </Link>
              
              {/* Scope Controls */}
              {scopeReady && (
                <>
                  {/* Organization Switcher */}
                  <OrganizationSwitcher />
                  
                  {/* Portfolio Switcher */}
                  <PortfolioSwitcher />
                  
                  {/* Mode Switcher */}
                  <div className="ml-2">
                    <ModeSwitcher />
                  </div>
                </>
              )}
              
              {/* Environment Pill - Hidden, replaced by Mode Switcher */}
              {false && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 px-3 text-xs font-medium rounded-full border",
                      getEnvironmentColor(environment)
                    )}
                  >
                    <span>{environment}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Environment</h4>
                    
                    {/* Segmented selector */}
                    <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-md">
                      {['Demo', 'Paper', 'Live'].map((env) => (
                        <button
                          key={env}
                          onClick={() => setEnvironment(env as 'Demo' | 'Paper' | 'Live')}
                          className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded transition-colors",
                            environment === env
                              ? env === 'Live'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : env === 'Paper'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-white text-gray-900 border border-gray-200'
                              : 'text-gray-600 hover:text-gray-900'
                          )}
                        >
                          <span>{env}</span>
                        </button>
                      ))}
                    </div>
                    
                    {/* Description */}
                    <p className="text-xs text-gray-600">
                      {getEnvironmentDescription(environment)}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
              )}
            </div>
            
            {/* Right cluster: Actions */}
            <div className="flex items-center gap-2">
              {/* Approvals */}
              {rbac.can && rbac.can('approve_changes') && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 relative"
                      onClick={() => setApprovalsOpen(true)}
                    >
                      <Gavel className="h-4 w-4" />
                      {pendingApprovals > 0 && (
                        <Badge 
                          className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                          variant="destructive"
                        >
                          {pendingApprovals}
                        </Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pending approvals</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {/* Notifications */}
              <div data-notification-trigger>
                <NotificationButton />
              </div>
              
              {/* Health Status */}
              <HealthStatus />
              
              {/* Environment Badge for Rugira Staff */}
              {isRugiraStaff && (
                <Badge variant="outline" className="h-6 text-xs px-2 border-gray-300 text-gray-600">
                  Prod
                </Badge>
              )}
              
              {/* Help Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" data-help-trigger>
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    Docs
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ChevronsRight className="mr-2 h-4 w-4" />
                    Keyboard Shortcuts
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href="mailto:contact@rugira.ch" className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      Support (contact@rugira.ch)
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Avatar Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
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
                    Organization & Billing
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <div className="px-2 py-1.5">
                    <p className="text-xs text-gray-500">
                      Your access: {user?.tenant_roles?.[currentTenant]?.join(' · ') || 'User'}
                    </p>
                  </div>
                  
                  <DropdownMenuItem>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>MFA: </span>
                    <span className="ml-auto text-xs text-green-600">Enabled</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Kill-Switch (Admin only) */}
              {isAdmin && (
                <>
                  <Separator orientation="vertical" className="h-6 mx-2" />
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-3 text-xs font-medium border-red-300 text-red-700 hover:bg-red-50"
                        onMouseDown={startKillSwitchHold}
                        onMouseUp={stopKillSwitchHold}
                        onMouseLeave={stopKillSwitchHold}
                      >
                        {killSwitchHolding ? (
                          <div className="relative">
                            <svg className="h-4 w-4 -rotate-90">
                              <circle
                                cx="8"
                                cy="8"
                                r="6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray={`${killSwitchProgress * 0.377} 100`}
                                className="transition-all duration-100"
                              />
                            </svg>
                          </div>
                        ) : (
                          <>
                            <X className="h-3 w-3 mr-1" />
                            Kill-Switch
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Trigger global emergency stop</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </div>
        </header>
      </TooltipProvider>
      
      {/* Approvals Drawer */}
      {approvalsOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setApprovalsOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Pending Approvals</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setApprovalsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600">No pending approvals at this time.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Command Palette */}
      <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Quick Navigation">
            <CommandItem onSelect={() => { setLocation('/overview'); setCommandPaletteOpen(false); }}>
              <Activity className="mr-2 h-4 w-4" />
              Overview
            </CommandItem>
            <CommandItem onSelect={() => { setLocation('/bots'); setCommandPaletteOpen(false); }}>
              <Bot className="mr-2 h-4 w-4" />
              Bots
            </CommandItem>
            <CommandItem onSelect={() => { setLocation('/backtesting'); setCommandPaletteOpen(false); }}>
              <Target className="mr-2 h-4 w-4" />
              Backtesting
            </CommandItem>
            <CommandItem onSelect={() => { setLocation('/reports'); setCommandPaletteOpen(false); }}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Reports
            </CommandItem>
            <CommandItem onSelect={() => { setLocation('/compliance'); setCommandPaletteOpen(false); }}>
              <Shield className="mr-2 h-4 w-4" />
              Compliance
            </CommandItem>
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => { setApprovalsOpen(true); setCommandPaletteOpen(false); }}>
              <Gavel className="mr-2 h-4 w-4" />
              Open Approvals
            </CommandItem>
            <CommandItem onSelect={() => { copyTenantId(); setCommandPaletteOpen(false); }}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Tenant ID
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      
      {/* Kill-Switch Confirmation Dialog */}
      {killSwitchConfirmOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Confirm Kill-Switch</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              This will immediately stop all trading operations. Type <span className="font-mono font-bold">KILL</span> to confirm.
            </p>
            
            <Input
              value={killSwitchInput}
              onChange={(e) => setKillSwitchInput(e.target.value)}
              placeholder="Type KILL to confirm"
              className="mb-4"
              autoFocus
            />
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setKillSwitchConfirmOpen(false);
                  setKillSwitchInput('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                disabled={killSwitchInput.toUpperCase() !== 'KILL'}
                onClick={handleKillSwitchConfirm}
              >
                Execute Kill-Switch
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}