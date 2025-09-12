import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react';

interface IncidentBannerProps {
  className?: string;
}

interface Incident {
  id: string;
  title: string;
  severity: 'degraded' | 'major' | 'critical';
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  message: string;
  affectedServices: string[];
  updatedAt: string;
  statusPageUrl?: string;
}

export default function IncidentBanner({ className }: IncidentBannerProps) {
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  // Mock function to fetch current incidents - in real app this would call an API
  const fetchActiveIncident = (): Incident | null => {
    // Simulate checking for incidents based on system health
    const hasIncident = Math.random() < 0.3; // 30% chance for demo purposes
    
    if (!hasIncident) return null;

    return {
      id: 'inc-2025-001',
      title: 'Intermittent API Response Delays',
      severity: 'degraded',
      status: 'monitoring',
      message: 'We are experiencing intermittent delays in API responses across some trading venues. Order processing may be slower than usual.',
      affectedServices: ['Trading API', 'Market Data', 'Venue Connections'],
      updatedAt: new Date().toISOString(),
      statusPageUrl: '/status'
    };
  };

  // Check for incidents on mount and periodically
  useEffect(() => {
    const checkIncidents = () => {
      const incident = fetchActiveIncident();
      setActiveIncident(incident);
      
      // Auto-dismiss if incident is resolved
      if (incident?.status === 'resolved') {
        setTimeout(() => {
          setActiveIncident(null);
          setIsDismissed(false);
        }, 3000);
      }
    };

    checkIncidents();
    
    // Check every 30 seconds for incident updates
    const interval = setInterval(checkIncidents, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Don't show if dismissed or no incident
  if (!activeIncident || isDismissed) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'degraded':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'major':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'investigating':
        return 'bg-red-100 text-red-700';
      case 'identified':
        return 'bg-orange-100 text-orange-700';
      case 'monitoring':
        return 'bg-blue-100 text-blue-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div 
      className={cn(
        "border-b transition-all duration-300 ease-in-out relative z-50",
        getSeverityColor(activeIncident.severity),
        className
      )}
      data-testid="incident-banner"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">
                {activeIncident.title}
              </span>
              <Badge 
                variant="outline" 
                className={cn("text-xs", getStatusBadgeColor(activeIncident.status))}
              >
                {activeIncident.status.charAt(0).toUpperCase() + activeIncident.status.slice(1)}
              </Badge>
            </div>
            
            <p className="text-xs opacity-90">
              {activeIncident.message}
            </p>
            
            {activeIncident.affectedServices.length > 0 && (
              <div className="mt-1 flex items-center gap-1 text-xs opacity-75">
                <span>Affected:</span>
                <span>{activeIncident.affectedServices.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {activeIncident.statusPageUrl && (
            <Link href={activeIncident.statusPageUrl}>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs hover:bg-white/50"
                data-testid="button-status-page"
              >
                Status Page
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="h-7 w-7 p-0 hover:bg-white/50"
            aria-label="Dismiss incident banner"
            data-testid="button-dismiss-incident"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}