import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

export default function StatusBadge() {
  return (
    <a
      href="https://status.rugira.ch"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center"
      data-testid="link-status-badge"
    >
      <Badge 
        variant="outline" 
        className="text-green-700 border-green-200 bg-green-50 hover:bg-green-100 transition-colors cursor-pointer"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
        Status
        <ExternalLink className="w-3 h-3 ml-1" />
      </Badge>
    </a>
  );
}