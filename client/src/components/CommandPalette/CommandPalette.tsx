import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'wouter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Activity,
  Building2,
  Beaker,
  History,
  Bot,
  MonitorDot,
  BarChart,
  ShieldCheck,
  Settings,
  LifeBuoy,
  Search,
  ArrowRight,
  Command,
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: 'screen' | 'bot' | 'strategy' | 'org' | 'portfolio';
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  action?: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bots?: Array<{ id: string; name: string }>;
  strategies?: Array<{ id: string; name: string }>;
  organizations?: Array<{ id: string; name: string }>;
  portfolios?: Array<{ id: string; name: string }>;
  isDemoMode?: boolean;
}

export function CommandPalette({
  open,
  onOpenChange,
  bots = [],
  strategies = [],
  organizations = [],
  portfolios = [],
  isDemoMode = false,
}: CommandPaletteProps) {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const screenItems = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [
      { id: 'overview', title: 'Overview', category: 'screen', icon: Activity, href: '/overview', keywords: ['dashboard', 'home'] },
      { id: 'venues', title: 'Venues', category: 'screen', icon: Building2, href: '/venues', keywords: ['exchanges', 'connections'] },
      { id: 'strategies', title: 'Strategies', category: 'screen', icon: Beaker, href: '/strategies', keywords: ['trading', 'algorithms'] },
      { id: 'backtesting', title: 'Backtesting', category: 'screen', icon: History, href: '/backtesting', keywords: ['test', 'simulation'] },
      { id: 'trading', title: 'Trading', category: 'screen', icon: Bot, href: '/bots', keywords: ['trading', 'automations', 'bots'] },
    ];

    if (isDemoMode) {
      items.push({
        id: 'console',
        title: 'Console (Pilot-Assist)',
        category: 'screen',
        icon: Command,
        href: '/console',
        keywords: ['console', 'pilot', 'trade ticket', 'demo'],
      });
    }

    items.push(
      { id: 'monitoring', title: 'Monitoring', category: 'screen', icon: MonitorDot, href: '/monitoring', keywords: ['alerts', 'status'] },
      { id: 'analytics', title: 'Analytics', category: 'screen', icon: BarChart, href: '/reports', keywords: ['reports', 'analysis'] },
      { id: 'compliance', title: 'Compliance', category: 'screen', icon: ShieldCheck, href: '/compliance', keywords: ['audit', 'regulations'] },
      { id: 'admin', title: 'Admin', category: 'screen', icon: Settings, href: '/admin', keywords: ['settings', 'configuration'] },
      { id: 'help', title: 'Help', category: 'screen', icon: LifeBuoy, href: '/help', keywords: ['support', 'documentation'] },
    );

    return items;
  }, [isDemoMode]);

  // Combine all items
  const allItems = useMemo(() => {
    const items: CommandItem[] = [...screenItems];

    // Add bots
    bots.forEach(bot => {
      items.push({
        id: `bot-${bot.id}`,
        title: bot.name,
        category: 'bot',
        icon: Bot,
        href: `/bots?id=${bot.id}`,
      });
    });

    // Add strategies
    strategies.forEach(strategy => {
      items.push({
        id: `strategy-${strategy.id}`,
        title: strategy.name,
        category: 'strategy',
        icon: Beaker,
        href: `/strategies?id=${strategy.id}`,
      });
    });

    // Add organizations
    organizations.forEach(org => {
      items.push({
        id: `org-${org.id}`,
        title: org.name,
        category: 'org',
        action: () => {
          // Switch organization context
          console.log('Switching to org:', org.name);
        },
      });
    });

    // Add portfolios
    portfolios.forEach(portfolio => {
      items.push({
        id: `portfolio-${portfolio.id}`,
        title: portfolio.name,
        category: 'portfolio',
        action: () => {
          // Switch portfolio context
          console.log('Switching to portfolio:', portfolio.name);
        },
      });
    });

    return items;
  }, [bots, strategies, organizations, portfolios]);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!search) return allItems.slice(0, 10); // Show first 10 items when no search

    const searchLower = search.toLowerCase();
    return allItems.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(searchLower);
      const keywordMatch = item.keywords?.some(k => k.toLowerCase().includes(searchLower));
      const categoryMatch = item.category.toLowerCase().includes(searchLower);
      return titleMatch || keywordMatch || categoryMatch;
    }).slice(0, 10); // Limit to 10 results
  }, [search, allItems]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        break;
      case 'Enter':
        e.preventDefault();
        const selectedItem = filteredItems[selectedIndex];
        if (selectedItem) {
          if (selectedItem.href) {
            setLocation(selectedItem.href);
            onOpenChange(false);
          } else if (selectedItem.action) {
            selectedItem.action();
            onOpenChange(false);
          }
        }
        break;
      case 'Escape':
        onOpenChange(false);
        break;
    }
  }, [filteredItems, selectedIndex, setLocation, onOpenChange]);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [open]);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'screen': return 'Screens';
      case 'bot': return 'Trading';
      case 'strategy': return 'Strategies';
      case 'org': return 'Organizations';
      case 'portfolio': return 'Portfolios';
      default: return category;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Command Palette</DialogTitle>
          <DialogDescription>
            Search for screens, bots, strategies, and more
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center px-4 border-b">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <Input
            placeholder="Search screens, bots, strategies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus:ring-0 focus-visible:ring-0 text-base py-4 px-0"
            autoFocus
          />
        </div>
        
        <div className="max-h-96 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No results found for "{search}"
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.href) {
                        setLocation(item.href);
                        onOpenChange(false);
                      } else if (item.action) {
                        item.action();
                        onOpenChange(false);
                      }
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-colors",
                      "hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                      isSelected && "bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="w-5 h-5 text-gray-400" />}
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500">{getCategoryLabel(item.category)}</div>
                      </div>
                    </div>
                    {isSelected && <ArrowRight className="w-4 h-4 text-gray-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">↵</kbd>
              Open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">Esc</kbd>
              Close
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
