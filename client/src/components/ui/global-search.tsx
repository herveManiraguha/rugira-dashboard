import React, { useState, useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Search, Bot, Settings, Users, BarChart3, Shield, HelpCircle } from 'lucide-react';
import { useLocation } from 'wouter';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  href: string;
  group: string;
  icon: React.ReactNode;
}

const searchItems: SearchItem[] = [
  {
    id: 'overview',
    title: 'Overview',
    description: 'Dashboard and key metrics',
    href: '/',
    group: 'Pages',
    icon: <BarChart3 className="h-4 w-4" />
  },
  {
    id: 'trading',
    title: 'Trading',
    description: 'Manage automated strategies',
    href: '/bots',
    group: 'Pages',
    icon: <Bot className="h-4 w-4" />
  },
  {
    id: 'strategies',
    title: 'Strategies',
    description: 'Configure trading strategies',
    href: '/strategies',
    group: 'Pages',
    icon: <Settings className="h-4 w-4" />
  },
  {
    id: 'exchanges',
    title: 'Exchanges',
    description: 'Connect and manage exchanges',
    href: '/exchanges',
    group: 'Pages',
    icon: <Settings className="h-4 w-4" />
  },
  {
    id: 'compliance',
    title: 'Compliance',
    description: 'Alerts and audit trail',
    href: '/compliance',
    group: 'Pages',
    icon: <Shield className="h-4 w-4" />
  },
  {
    id: 'reports',
    title: 'Reports',
    description: 'Performance and analytics',
    href: '/reports',
    group: 'Pages',
    icon: <BarChart3 className="h-4 w-4" />
  },
  {
    id: 'admin',
    title: 'Admin',
    description: 'System administration',
    href: '/admin',
    group: 'Pages',
    icon: <Users className="h-4 w-4" />
  },
  {
    id: 'help',
    title: 'Help',
    description: 'Documentation and support',
    href: '/help',
    group: 'Pages',
    icon: <HelpCircle className="h-4 w-4" />
  }
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (href: string) => {
    setLocation(href);
    setOpen(false);
  };

  return (
    <>
      <div
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={() => setOpen(true)}
        data-testid="global-search-trigger"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages and help articles..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {searchItems
              .filter(item => item.group === 'Pages')
              .map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.title}
                  onSelect={() => handleSelect(item.href)}
                  data-testid={`search-item-${item.id}`}
                >
                  {item.icon}
                  <div className="ml-2">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
