import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Check, ChevronDown, Activity } from 'lucide-react';
import { useScope, Portfolio } from '@/contexts/ScopeContext';
import { cn } from '@/lib/utils';

export function PortfolioSwitcher() {
  const [open, setOpen] = useState(false);
  const { organization, portfolio, setPortfolio } = useScope();

  const portfolios = organization?.portfolios || [];

  const handleSelect = (selectedPortfolio: Portfolio) => {
    setPortfolio(selectedPortfolio);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 justify-start font-normal"
          disabled={!organization}
          data-testid="portfolio-switcher-trigger"
        >
          <Briefcase className="h-4 w-4 mr-1.5 text-gray-500" />
          <span className="text-sm">{portfolio?.name || 'Select Portfolio'}</span>
          <ChevronDown className="h-3 w-3 ml-1 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-64" align="start">
        <Command>
          <div className="px-3 py-2 border-b">
            <h4 className="font-medium text-sm">Switch Portfolio</h4>
            {organization && (
              <p className="text-xs text-gray-500 mt-0.5">{organization.name}</p>
            )}
          </div>
          <CommandList className="max-h-64">
            <CommandEmpty>No portfolios available.</CommandEmpty>
            <CommandGroup>
              {portfolios.map((p) => (
                <CommandItem
                  key={p.id}
                  value={p.name}
                  onSelect={() => handleSelect(p)}
                  className={cn(
                    "flex items-center justify-between py-2",
                    portfolio?.id === p.id && "bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  <span className="flex-1">{p.name}</span>
                  {portfolio?.id === p.id && (
                    <Check className="h-4 w-4 text-green-600 ml-2" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}