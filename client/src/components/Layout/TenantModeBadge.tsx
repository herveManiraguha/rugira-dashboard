import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Building2, TestTube, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEnvironment } from '@/contexts/EnvironmentContext';

export function TenantModeBadge() {
  const { currentTenant, user } = useAuth();
  const { environment } = useEnvironment();

  if (!user || !currentTenant) return null;

  const getTenantName = () => {
    const tenants = {
      'rugira-prod': 'Rugira Prod',
      'rugira-test': 'Rugira Test',
      'client-alpha': 'Client Alpha'
    };
    return tenants[currentTenant] || currentTenant;
  };

  const getModeIcon = () => {
    switch (environment) {
      case 'Paper':
        return <TestTube className="w-3 h-3" />;
      case 'Live':
        return <Activity className="w-3 h-3" />;
      default:
        return <TestTube className="w-3 h-3" />;
    }
  };

  const getModeColor = () => {
    return environment === 'Live' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-blue-100 text-blue-700 border-blue-200';
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="flex items-center gap-1">
        <Building2 className="w-3 h-3" />
        {getTenantName()}
      </Badge>
      <Badge variant="outline" className={`flex items-center gap-1 ${getModeColor()}`}>
        {getModeIcon()}
        {environment}
      </Badge>
    </div>
  );
}