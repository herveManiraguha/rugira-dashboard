import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useScope } from '@/contexts/ScopeContext';

export function LiveModeBanner() {
  const { mode, organization, portfolio } = useScope();

  if (mode !== 'Live') {
    return null;
  }

  return (
    <div className="flex items-center justify-center bg-red-50 border-b border-red-200 px-4 py-1.5">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-600 text-white rounded-full text-xs font-medium">
          <AlertTriangle className="h-3 w-3" />
          <span>LIVE</span>
        </div>
        <span className="text-sm text-red-900">
          {organization?.name} / {portfolio?.name}
        </span>
      </div>
    </div>
  );
}