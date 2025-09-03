import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Building2, Users, Eye } from 'lucide-react';

export function TenantSwitcher() {
  const { user, currentTenant, tenantRoles, switchTenant, isDemoMode } = useAuth();
  
  if (!user || !user.tenant_roles || Object.keys(user.tenant_roles).length <= 1) {
    return null;
  }

  const tenants = Object.keys(user.tenant_roles);
  const currentTenantRoles = tenantRoles;

  const getRoleIcon = (roles: string[]) => {
    if (roles.includes('admin')) return <Users className="w-3 h-3" />;
    if (roles.includes('trader')) return <Building2 className="w-3 h-3" />;
    return <Eye className="w-3 h-3" />;
  };

  const getRoleColor = (roles: string[]) => {
    if (roles.includes('admin')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (roles.includes('trader')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const getDisplayName = (tenantId: string) => {
    const names: { [key: string]: string } = {
      'rugira-prod': 'Rugira Production',
      'rugira-test': 'Rugira Test',
      'client-alpha': 'Client Alpha'
    };
    return names[tenantId] || tenantId;
  };

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-3 text-xs"
            data-testid="tenant-switcher"
          >
            <Building2 className="w-3 h-3 mr-2" />
            {currentTenant ? getDisplayName(currentTenant) : 'Select Tenant'}
            <ChevronDown className="w-3 h-3 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>
            Switch Tenant
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {tenants.map((tenantId) => {
            const roles = user.tenant_roles?.[tenantId] || [];
            const isActive = currentTenant === tenantId;
            
            return (
              <DropdownMenuItem
                key={tenantId}
                onClick={() => switchTenant(tenantId)}
                className={`flex items-center justify-between cursor-pointer ${
                  isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                data-testid={`tenant-option-${tenantId}`}
              >
                <div className="flex items-center space-x-2">
                  {getRoleIcon(roles)}
                  <span className="text-sm">{getDisplayName(tenantId)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {roles.map((role) => (
                    <Badge
                      key={role}
                      variant="secondary"
                      className={`text-xs px-1.5 py-0.5 ${getRoleColor(roles)}`}
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Current roles display */}
      {currentTenantRoles.length > 0 && (
        <div className="flex items-center space-x-1">
          {currentTenantRoles.map((role) => (
            <Badge
              key={role}
              variant="secondary"
              className={`text-xs px-2 py-1 ${getRoleColor(currentTenantRoles)}`}
              data-testid={`current-role-${role}`}
            >
              {getRoleIcon(currentTenantRoles)}
              <span className="ml-1">{role}</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}