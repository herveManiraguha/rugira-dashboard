import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function TenantModeBadge() {
  const { currentTenant, user } = useAuth();

  if (!user || !currentTenant) return null;

  const getTenantName = () => {
    const tenants = {
      'rugira-prod': 'Rugira Prod',
      'rugira-test': 'Rugira Test',
      'client-alpha': 'Client Alpha'
    };
    return tenants[currentTenant] || currentTenant;
  };

  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <Building2 className="w-3 h-3" />
      {getTenantName()}
    </Badge>
  );
}