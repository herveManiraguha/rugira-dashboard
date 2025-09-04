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
  CommandSeparator,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Check, ChevronDown, Pin, Clock } from 'lucide-react';
import { useScope, Organization } from '@/contexts/ScopeContext';
import { cn } from '@/lib/utils';

export function OrganizationSwitcher() {
  const [open, setOpen] = useState(false);
  const { organization, organizations, setOrganization, isRugiraStaff } = useScope();
  const [hoveredOrg, setHoveredOrg] = useState<string | null>(null);

  const pinnedOrgs = organizations.filter(o => o.isPinned);
  const recentOrgs = organizations.filter(o => o.isRecent && !o.isPinned);
  const otherOrgs = organizations.filter(o => !o.isPinned && !o.isRecent);

  const handleSelect = (org: Organization) => {
    setOrganization(org);
    setOpen(false);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'trader':
        return 'default';
      case 'compliance':
        return 'secondary';
      case 'viewer':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 justify-start font-normal"
          data-testid="org-switcher-trigger"
        >
          <Building2 className="h-4 w-4 mr-1.5 text-gray-500" />
          <span className="text-sm">{organization?.name || 'Select Organization'}</span>
          <ChevronDown className="h-3 w-3 ml-1 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-80" align="start">
        <Command>
          <div className="px-3 py-2 border-b">
            <h4 className="font-medium text-sm">Switch Organization</h4>
          </div>
          <CommandInput placeholder="Search organizations…" className="h-9" />
          <CommandList className="max-h-96">
            <CommandEmpty>No organizations found.</CommandEmpty>
            
            {pinnedOrgs.length > 0 && (
              <>
                <CommandGroup heading="Pinned">
                  {pinnedOrgs.map((org) => (
                    <CommandItem
                      key={org.id}
                      value={org.name}
                      onSelect={() => handleSelect(org)}
                      onMouseEnter={() => setHoveredOrg(org.id)}
                      onMouseLeave={() => setHoveredOrg(null)}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Pin className="h-3 w-3 text-gray-400" />
                        <span className="flex-1">{org.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {org.roles.map((role) => (
                          <Badge 
                            key={role} 
                            variant={getRoleBadgeVariant(role) as any}
                            className="h-5 text-xs px-1.5"
                          >
                            {role}
                          </Badge>
                        ))}
                        {organization?.id === org.id && (
                          <Check className="h-4 w-4 text-green-600 ml-1" />
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {recentOrgs.length > 0 && (
              <>
                <CommandGroup heading="Recent">
                  {recentOrgs.map((org) => (
                    <CommandItem
                      key={org.id}
                      value={org.name}
                      onSelect={() => handleSelect(org)}
                      onMouseEnter={() => setHoveredOrg(org.id)}
                      onMouseLeave={() => setHoveredOrg(null)}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="flex-1">{org.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {org.roles.map((role) => (
                          <Badge 
                            key={role} 
                            variant={getRoleBadgeVariant(role) as any}
                            className="h-5 text-xs px-1.5"
                          >
                            {role}
                          </Badge>
                        ))}
                        {organization?.id === org.id && (
                          <Check className="h-4 w-4 text-green-600 ml-1" />
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {otherOrgs.length > 0 && (
              <CommandGroup heading="All organizations">
                {otherOrgs.map((org) => (
                  <CommandItem
                    key={org.id}
                    value={org.name}
                    onSelect={() => handleSelect(org)}
                    onMouseEnter={() => setHoveredOrg(org.id)}
                    onMouseLeave={() => setHoveredOrg(null)}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="flex-1">{org.name}</span>
                    <div className="flex items-center gap-1">
                      {org.roles.map((role) => (
                        <Badge 
                          key={role} 
                          variant={getRoleBadgeVariant(role) as any}
                          className="h-5 text-xs px-1.5"
                        >
                          {role}
                        </Badge>
                      ))}
                      {organization?.id === org.id && (
                        <Check className="h-4 w-4 text-green-600 ml-1" />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
          
          {/* Portfolio hover pane for Rugira staff */}
          {isRugiraStaff && hoveredOrg && (
            <div className="absolute right-full top-0 w-48 bg-white border rounded-lg shadow-lg ml-1 p-2">
              <div className="text-xs font-medium text-gray-500 mb-1">Portfolios</div>
              {organizations.find(o => o.id === hoveredOrg)?.portfolios?.map(p => (
                <div 
                  key={p.id} 
                  className="px-2 py-1 text-sm hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => {
                    const org = organizations.find(o => o.id === hoveredOrg);
                    if (org) {
                      handleSelect(org);
                      // TODO: Also set portfolio
                    }
                  }}
                >
                  {p.name}
                  {p.hasLiveEnabled && (
                    <Badge variant="outline" className="ml-1 h-4 text-xs">live</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}