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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { useScope } from '@/contexts/ScopeContext';
import { CommandPalette } from '@/components/CommandPalette/CommandPalette';
import NotificationButton from './NotificationButton';
import {
  Bell,
  User,
  AlertTriangle,
  HelpCircle,
  LogOut,
  Building2,
  Key,
  ChevronRight,
  Search,
  Calendar,
  Circle,
  Menu,
  X,
  Command,
} from 'lucide-react';

interface HeaderRefactoredProps {
  onKillSwitch?: () => void;
  onMobileMenuToggle?: () => void;
}

type TimeRange = '24h' | '7d' | 'MTD' | 'YTD';
type Mode = 'Live' | 'Paper' | 'Demo';

export default function HeaderRefactored({ onKillSwitch, onMobileMenuToggle }: HeaderRefactoredProps) {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { environment, setEnvironment } = useEnvironment();
  const { organizations = [] } = useScope();
  
  // State
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [mode, setMode] = useState<Mode>(environment as Mode || 'Demo');
  const [showLiveConfirm, setShowLiveConfirm] = useState(false);
  const [liveConfirmInput, setLiveConfirmInput] = useState('');
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning' | 'error'>('healthy');
  
  // Mock organizations and portfolios if not available
  const orgs = organizations.length > 0 ? organizations : [
    { id: '1', name: 'Alpha Capital AG' },
    { id: '2', name: 'TradePro Singapore' },
  ];
  
  const ports = [
    { id: '1', name: 'Equity Desk' },
    { id: '2', name: 'Crypto Desk' },
  ];
  
  // Handle mode change
  const handleModeChange = (newMode: Mode) => {
    if (newMode === 'Live' && mode !== 'Live') {
      setShowLiveConfirm(true);
    } else {
      setMode(newMode);
      setEnvironment(newMode);
    }
  };
  
  const confirmLiveMode = () => {
    if (liveConfirmInput === 'LIVE') {
      setMode('Live');
      setEnvironment('Live');
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
  
  const getStatusColor = (status: typeof systemStatus) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-amber-500';
      case 'error':
        return 'bg-red-500';
    }
  };
  
  return (
    <>
      <TooltipProvider>
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="flex items-center h-14 px-4 gap-6">
            {/* Cluster A: Brand + Context chips */}
            <div className="flex items-center gap-2">
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
              
              {/* Logo */}
              <Link href="/overview" className="flex items-center">
                <img src={logoSvg} alt="Rugira" className="h-7 w-auto" />
              </Link>
              
              {/* Context Chips */}
              <div className="hidden sm:flex items-center">
                {/* Organization Chip */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-3 text-xs font-medium rounded-full border border-gray-200 hover:bg-gray-50"
                    >
                      {orgs[0]?.name || 'Organization'}
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Select Organization</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {orgs.map((org) => (
                      <DropdownMenuItem
                        key={org.id}
                        onClick={() => console.log('Select org:', org)}
                        className="cursor-pointer"
                      >
                        {org.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
                
                {/* Portfolio Chip */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-3 text-xs font-medium rounded-full border border-gray-200 hover:bg-gray-50"
                    >
                      {ports[0]?.name || 'Portfolio'}
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Select Portfolio</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {ports.map((port: any) => (
                      <DropdownMenuItem
                        key={port.id}
                        onClick={() => console.log('Select portfolio:', port)}
                        className="cursor-pointer"
                      >
                        {port.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
                
                {/* Mode Chip */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-7 px-3 text-xs font-medium rounded-full border",
                        getModeColor(mode)
                      )}
                    >
                      {mode}
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Select Mode</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleModeChange('Demo')}
                      className="cursor-pointer"
                    >
                      <Circle className="h-3 w-3 mr-2 text-gray-500" />
                      Demo - Simulated data
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleModeChange('Paper')}
                      className="cursor-pointer"
                    >
                      <Circle className="h-3 w-3 mr-2 text-blue-500" />
                      Paper - Real connections, virtual money
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleModeChange('Live')}
                      className="cursor-pointer text-red-600"
                    >
                      <Circle className="h-3 w-3 mr-2 text-red-500" />
                      Live - Real trading
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Cluster B: Filters */}
            <div className="hidden lg:flex items-center gap-2 flex-1">
              {/* Time Range Selector */}
              <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
                <SelectTrigger className="h-7 w-24 text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24h</SelectItem>
                  <SelectItem value="7d">7d</SelectItem>
                  <SelectItem value="MTD">MTD</SelectItem>
                  <SelectItem value="YTD">YTD</SelectItem>
                </SelectContent>
              </Select>
              
            </div>
            
            {/* Cluster C: System Status */}
            <div className="hidden lg:flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-3 text-xs font-medium rounded-full border border-gray-200"
                  >
                    <Circle className={cn("h-2 w-2 mr-2", getStatusColor(systemStatus))} fill="currentColor" />
                    System {systemStatus === 'healthy' ? 'OK' : systemStatus}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">System Health</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span>API Gateway</span>
                        <Badge variant="outline" className="text-green-600">Healthy</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Database</span>
                        <Badge variant="outline" className="text-green-600">Healthy</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Trading Engine</span>
                        <Badge variant="outline" className="text-green-600">Running</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>WebSocket</span>
                        <Badge variant="outline" className="text-green-600">Connected</Badge>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Cluster D: User */}
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
              
              {/* Help */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setLocation('/help')}
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Help</p>
                </TooltipContent>
              </Tooltip>
              
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
                  <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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