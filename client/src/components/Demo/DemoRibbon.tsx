import React from 'react';
import { useDemoMode } from '../../contexts/DemoContext';
import { AlertTriangle, Eye } from 'lucide-react';

export default function DemoRibbon() {
  const { isDemoMode, isReadOnly } = useDemoMode();

  if (!isDemoMode) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 text-center text-sm font-medium shadow-sm">
      <div className="flex items-center justify-center space-x-2">
        {isReadOnly ? (
          <>
            <Eye className="w-4 h-4" />
            <span>Read-only demo link — no account required</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4" />
            <span>Simulated Data — Demo Mode Active</span>
          </>
        )}
      </div>
    </div>
  );
}